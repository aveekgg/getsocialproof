import { useState, useEffect, useRef, useCallback } from 'react';

interface FrameAnalysisResult {
  isGoodShot: boolean;
  confidence: number;
  reasons: string[];
  detectedObjects?: string[];
}

interface ObjectDetectionPattern {
  name: string;
  colorRange: { r: [number, number], g: [number, number], b: [number, number] };
  edgePattern: number;
  brightness: [number, number];
}

export function useFrameAnalysis(videoStream: MediaStream | null, enabled: boolean = true, challengeType?: string) {
  const [analysisResult, setAnalysisResult] = useState<FrameAnalysisResult>({
    isGoodShot: false,
    confidence: 0,
    reasons: []
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const analyzeFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !videoStream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Simple heuristic analysis for "good shot" detection
    const analysis = performFrameAnalysis(pixels, canvas.width, canvas.height);
    setAnalysisResult(analysis);
  }, [videoStream]);

  // Object detection patterns for different room elements
  const objectPatterns: Record<string, ObjectDetectionPattern[]> = {
    'room-tour': [
      { name: 'bed', colorRange: { r: [200, 255], g: [200, 255], b: [200, 255] }, edgePattern: 0.3, brightness: [80, 200] },
      { name: 'pillow', colorRange: { r: [180, 255], g: [180, 255], b: [180, 255] }, edgePattern: 0.2, brightness: [100, 220] },
      { name: 'desk', colorRange: { r: [80, 160], g: [60, 140], b: [40, 120] }, edgePattern: 0.4, brightness: [60, 180] },
      { name: 'wardrobe', colorRange: { r: [40, 120], g: [40, 120], b: [40, 120] }, edgePattern: 0.5, brightness: [50, 150] }
    ],
    'study-space': [
      { name: 'books', colorRange: { r: [40, 200], g: [40, 200], b: [40, 200] }, edgePattern: 0.6, brightness: [70, 190] },
      { name: 'laptop', colorRange: { r: [30, 80], g: [30, 80], b: [30, 80] }, edgePattern: 0.4, brightness: [40, 120] },
      { name: 'desk', colorRange: { r: [80, 160], g: [60, 140], b: [40, 120] }, edgePattern: 0.4, brightness: [60, 180] },
      { name: 'papers', colorRange: { r: [220, 255], g: [220, 255], b: [220, 255] }, edgePattern: 0.3, brightness: [180, 250] }
    ],
    'social-life': [
      { name: 'people', colorRange: { r: [120, 220], g: [100, 200], b: [80, 180] }, edgePattern: 0.4, brightness: [80, 200] },
      { name: 'food', colorRange: { r: [150, 255], g: [100, 220], b: [50, 180] }, edgePattern: 0.3, brightness: [100, 220] }
    ]
  };

  const detectObjects = (pixels: Uint8ClampedArray, width: number, height: number): string[] => {
    if (!challengeType || !objectPatterns[challengeType]) return [];
    
    const patterns = objectPatterns[challengeType];
    const detectedObjects: string[] = [];
    const regionSize = Math.floor(Math.min(width, height) / 8);
    
    // Analyze different regions of the image
    for (let regionY = 0; regionY < height; regionY += regionSize) {
      for (let regionX = 0; regionX < width; regionX += regionSize) {
        const regionEndX = Math.min(regionX + regionSize, width);
        const regionEndY = Math.min(regionY + regionSize, height);
        
        for (const pattern of patterns) {
          if (detectedObjects.includes(pattern.name)) continue;
          
          let matchScore = 0;
          let pixelCount = 0;
          let edgeCount = 0;
          
          for (let y = regionY; y < regionEndY; y += 2) {
            for (let x = regionX; x < regionEndX; x += 2) {
              const i = (y * width + x) * 4;
              if (i >= pixels.length) continue;
              
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
              
              pixelCount++;
              
              // Check if pixel matches pattern
              const colorMatch = 
                r >= pattern.colorRange.r[0] && r <= pattern.colorRange.r[1] &&
                g >= pattern.colorRange.g[0] && g <= pattern.colorRange.g[1] &&
                b >= pattern.colorRange.b[0] && b <= pattern.colorRange.b[1] &&
                brightness >= pattern.brightness[0] && brightness <= pattern.brightness[1];
              
              if (colorMatch) matchScore++;
              
              // Check for edges (simplified)
              if (x < regionEndX - 2 && y < regionEndY - 2) {
                const nextI = ((y + 1) * width + (x + 1)) * 4;
                if (nextI < pixels.length) {
                  const nextBrightness = 0.299 * pixels[nextI] + 0.587 * pixels[nextI + 1] + 0.114 * pixels[nextI + 2];
                  if (Math.abs(brightness - nextBrightness) > 40) {
                    edgeCount++;
                  }
                }
              }
            }
          }
          
          const colorMatchRatio = matchScore / pixelCount;
          const edgeRatio = edgeCount / pixelCount;
          
          // Object detected if sufficient color match and edge pattern
          if (colorMatchRatio > 0.3 && edgeRatio > pattern.edgePattern * 0.5) {
            detectedObjects.push(pattern.name);
          }
        }
      }
    }
    
    return detectedObjects;
  };

  const performFrameAnalysis = (pixels: Uint8ClampedArray, width: number, height: number): FrameAnalysisResult => {
    let totalBrightness = 0;
    let edgePixels = 0;
    let colorVariance = 0;
    let centerBrightness = 0;
    const centerX = width / 2;
    const centerY = height / 2;
    const centerRadius = Math.min(width, height) / 6;
    let centerPixelCount = 0;

    // Sample every 4th pixel for performance (analyze 25% of pixels)
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Calculate brightness using proper luminance formula
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      totalBrightness += brightness;

      // Check if pixel is in center region
      const pixelIndex = i / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      if (distFromCenter <= centerRadius) {
        centerBrightness += brightness;
        centerPixelCount++;
      }

      // Edge detection - compare with pixel to the right (if exists)
      if (i + 16 < pixels.length) {
        const nextR = pixels[i + 16];
        const nextG = pixels[i + 17];
        const nextB = pixels[i + 18];
        const nextBrightness = 0.299 * nextR + 0.587 * nextG + 0.114 * nextB;
        
        if (Math.abs(brightness - nextBrightness) > 30) {
          edgePixels++;
        }
      }

      // Color variance - calculate standard deviation from gray
      const gray = brightness;
      colorVariance += Math.abs(r - gray) + Math.abs(g - gray) + Math.abs(b - gray);
    }

    const sampleCount = Math.floor(pixels.length / 16);
    const avgBrightness = totalBrightness / sampleCount;
    const avgCenterBrightness = centerPixelCount > 0 ? centerBrightness / centerPixelCount : avgBrightness;
    const edgeRatio = edgePixels / sampleCount;
    const avgColorVariance = colorVariance / sampleCount;

    // More realistic scoring for typical mobile camera conditions
    const reasons: string[] = [];
    let score = 0;

    // Lighting score (more lenient range)
    if (avgBrightness > 40 && avgBrightness < 220) {
      const lightingScore = avgBrightness > 80 && avgBrightness < 180 ? 30 : 20;
      score += lightingScore;
      reasons.push("Good lighting");
    } else if (avgBrightness <= 40) {
      score += 10; // Still give some points for very dark scenes
      reasons.push("Low light");
    } else {
      score += 5; // Very bright scenes
      reasons.push("Bright scene");
    }

    // Detail/edge score (more sensitive)
    if (edgeRatio > 0.05) {
      const detailScore = Math.min(25, edgeRatio * 500); // Scale edge ratio
      score += detailScore;
      reasons.push("Good detail");
    } else {
      score += 5; // Base points for any content
      reasons.push("Simple scene");
    }

    // Color variety score (more generous)
    if (avgColorVariance > 8) {
      const colorScore = Math.min(25, avgColorVariance / 2);
      score += colorScore;
      reasons.push("Color variety");
    } else {
      score += 10; // Monochrome scenes can still be good
      reasons.push("Minimal colors");
    }

    // Center composition bonus
    const centerDiff = Math.abs(avgCenterBrightness - avgBrightness);
    if (centerDiff > 10) {
      score += 15; // Center is notably different from average
      reasons.push("Center focus");
    } else {
      score += 5; // Even lighting is also good
      reasons.push("Even composition");
    }

    // Base stability bonus (always give some points)
    score += 15;
    reasons.push("Stable frame");

    // Object detection bonus
    const detectedObjects = detectObjects(pixels, width, height);
    if (detectedObjects.length > 0) {
      score += 15 * detectedObjects.length; // Bonus for relevant objects
      reasons.push(`Found ${detectedObjects.join(', ')}`);
    }

    // Add randomness to make it feel more dynamic (±5 points)
    const randomBonus = Math.floor(Math.random() * 11) - 5;
    score += randomBonus;

    const confidence = Math.min(Math.max(score, 0), 100);
    const isGoodShot = confidence >= 65; // Lower threshold for better UX

    return {
      isGoodShot,
      confidence,
      reasons: reasons.slice(0, 3), // Keep top 3 reasons
      detectedObjects
    };
  };

  const startAnalysis = useCallback(() => {
    if (!enabled || !videoStream) return;

    setIsAnalyzing(true);
    
    // Create hidden video element for analysis
    if (!videoRef.current) {
      videoRef.current = document.createElement('video');
      videoRef.current.autoplay = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
    }

    // Create hidden canvas for frame capture
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    videoRef.current.srcObject = videoStream;

    // Start analysis loop - more frequent for better responsiveness
    analysisIntervalRef.current = setInterval(analyzeFrame, 200); // Analyze every 200ms
  }, [enabled, videoStream, analyzeFrame]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled && videoStream) {
      startAnalysis();
    } else {
      stopAnalysis();
    }

    return () => {
      stopAnalysis();
    };
  }, [enabled, videoStream, startAnalysis, stopAnalysis]);

  return {
    analysisResult,
    isAnalyzing,
    startAnalysis,
    stopAnalysis
  };
}