import { useState, useEffect, useRef, useCallback } from 'react';

interface FrameAnalysisResult {
  isGoodShot: boolean;
  confidence: number;
  reasons: string[];
}

export function useFrameAnalysis(videoStream: MediaStream | null, enabled: boolean = true) {
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

  const performFrameAnalysis = (pixels: Uint8ClampedArray, width: number, height: number): FrameAnalysisResult => {
    let totalBrightness = 0;
    let edgePixels = 0;
    let colorVariance = 0;
    let centerBrightness = 0;
    const centerX = width / 2;
    const centerY = height / 2;
    const centerRadius = Math.min(width, height) / 4;

    // Analyze brightness, edges, and color distribution
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;

      // Check if pixel is in center region
      const pixelIndex = i / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      if (distFromCenter <= centerRadius) {
        centerBrightness += brightness;
      }

      // Simple edge detection (high contrast between adjacent pixels)
      if (i > 0 && Math.abs(brightness - (pixels[i - 4] + pixels[i - 3] + pixels[i - 2]) / 3) > 50) {
        edgePixels++;
      }

      // Color variance (how much colors differ)
      const avg = (r + g + b) / 3;
      colorVariance += Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg);
    }

    const avgBrightness = totalBrightness / (pixels.length / 4);
    const avgCenterBrightness = centerBrightness / (Math.PI * centerRadius ** 2);
    const edgeRatio = edgePixels / (pixels.length / 4);
    const avgColorVariance = colorVariance / (pixels.length / 4);

    // Scoring criteria for a "good shot"
    const reasons: string[] = [];
    let score = 0;

    // Good lighting (not too dark, not too bright)
    if (avgBrightness > 60 && avgBrightness < 200) {
      score += 25;
      reasons.push("Good lighting");
    } else if (avgBrightness <= 60) {
      reasons.push("Too dark");
    } else {
      reasons.push("Too bright");
    }

    // Sufficient detail/edges (indicates content in frame)
    if (edgeRatio > 0.1) {
      score += 20;
      reasons.push("Good detail");
    } else {
      reasons.push("Lacks detail");
    }

    // Color variety (not a blank wall)
    if (avgColorVariance > 15) {
      score += 20;
      reasons.push("Color variety");
    } else {
      reasons.push("Limited colors");
    }

    // Center focus (something interesting in center)
    if (avgCenterBrightness > 50 && avgCenterBrightness < 180) {
      score += 15;
      reasons.push("Center focus");
    }

    // Frame stability (would need motion detection for this - simplified)
    score += 20; // Assume stable for now
    reasons.push("Stable frame");

    const confidence = Math.min(score, 100);
    const isGoodShot = confidence >= 70;

    return {
      isGoodShot,
      confidence,
      reasons: isGoodShot ? reasons.filter(r => !r.includes("Too") && !r.includes("Lacks") && !r.includes("Limited")) : reasons
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

    // Start analysis loop
    analysisIntervalRef.current = setInterval(analyzeFrame, 500); // Analyze every 500ms
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