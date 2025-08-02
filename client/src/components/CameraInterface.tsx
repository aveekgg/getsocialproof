import { useState, useEffect, useRef } from "react";
import { Challenge, VideoClip } from "@shared/schema";
import { useCamera } from "@/hooks/useCamera";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { useFrameAnalysis } from "@/hooks/useFrameAnalysis";
import SketchOverlay from "./SketchOverlay";

interface CameraInterfaceProps {
  challenge: Challenge;
  currentStep: number;
  totalSteps: number;
  onClipComplete: (clip: VideoClip) => void;
  onBack: () => void;
}

type RecordingState = 'idle' | 'finding-shot' | 'good-shot-detected' | 'countdown' | 'recording';

export default function CameraInterface({ 
  challenge, 
  currentStep, 
  totalSteps, 
  onClipComplete, 
  onBack 
}: CameraInterfaceProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSketchOverlay, setShowSketchOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { stream, error: cameraError } = useCamera();
  const { startRecording, stopRecording, isRecording } = useMediaRecorder(stream);
  const { analysisResult, isAnalyzing } = useFrameAnalysis(stream, recordingState === 'finding-shot', challenge.id);
  
  const currentStepData = challenge.steps[currentStep];
  const maxDuration = currentStepData?.duration || 5;

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (recordingState === 'countdown') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setRecordingState('recording');
            startRecording();
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [recordingState, startRecording]);

  useEffect(() => {
    if (recordingState === 'recording') {
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            clearInterval(timer);
            handleStopRecording();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setRecordingTime(0);
    }
  }, [recordingState, maxDuration]);

  // Handle good shot detection
  useEffect(() => {
    if (recordingState === 'finding-shot' && analysisResult.isGoodShot) {
      setRecordingState('good-shot-detected');
      setShowSketchOverlay(true);
      
      // Auto-lock after 2 seconds if user doesn't manually lock
      const autoLockTimer = setTimeout(() => {
        setShowSketchOverlay(false);
        setRecordingState('countdown');
      }, 2000);
      
      return () => clearTimeout(autoLockTimer);
    }
  }, [recordingState, analysisResult.isGoodShot]);

  const handleStartRecording = () => {
    if (recordingState === 'idle') {
      setRecordingState('finding-shot');
    }
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      const clip: VideoClip = {
        stepId: currentStepData.id,
        duration: recordingTime,
        size: blob.size,
        timestamp: new Date().toISOString()
      };
      onClipComplete(clip);
    }
    setRecordingState('idle');
    setShowSketchOverlay(false);
  };

  const handleLockShot = () => {
    setShowSketchOverlay(false);
    setRecordingState('countdown');
  };

  if (cameraError) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-6 text-center max-w-sm">
          <div className="text-4xl mb-4">📹</div>
          <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
          <p className="text-gray-600 mb-4">Please allow camera access to record your video clips.</p>
          <button 
            onClick={() => window.location.reload()}
            data-testid="button-retry-camera"
            className="bg-primary text-white py-2 px-4 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark relative">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Camera grid overlay */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border border-white/30"></div>
        ))}
      </div>

      {/* Sketch Overlay */}
      <SketchOverlay isActive={showSketchOverlay} />
      
      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            data-testid="button-close-camera"
            className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          >
            <span className="text-xl">×</span>
          </button>
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-white text-sm font-medium">{isRecording ? 'REC' : 'READY'}</span>
          </div>
          <button className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <span className="text-xl">🔄</span>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-black/30 backdrop-blur-sm rounded-full p-1 mb-4">
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index < currentStep ? 'bg-primary' : 
                  index === currentStep ? 'bg-primary' : 'bg-white/30'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-white text-sm">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>⚡ {challenge.pointsPerStep} Points</span>
        </div>
      </div>
      
      {/* Center Overlay - Prompts */}
      {recordingState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-6 text-white text-center shadow-2xl animate-bounce-in max-w-sm">
            <div className="text-4xl mb-3">{currentStepData.emoji}</div>
            <h3 className="text-xl font-bold mb-2">{currentStepData.title}</h3>
            <p className="text-sm opacity-90 mb-4">{currentStepData.description}</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-full py-2 px-4 inline-block">
              <span className="font-semibold">{currentStepData.duration} seconds</span>
            </div>
          </div>
        </div>
      )}

      {/* Finding Shot Overlay */}
      {recordingState === 'finding-shot' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
          <div className="bg-black/70 backdrop-blur-sm rounded-3xl p-6 text-white text-center shadow-2xl animate-pulse max-w-sm">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold mb-2">Finding the Perfect Shot</h3>
            <p className="text-sm opacity-90 mb-4">Move your camera around to get the best angle...</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
            <div className="mt-3 text-xs opacity-75">
              Shot quality: {Math.round(analysisResult.confidence)}%
              {analysisResult.reasons.length > 0 && (
                <div className="mt-1 text-[10px]">
                  {analysisResult.reasons.join(" • ")}
                </div>
              )}
              {analysisResult.detectedObjects && analysisResult.detectedObjects.length > 0 && (
                <div className="mt-1 text-[10px] text-green-300">
                  📍 Spotted: {analysisResult.detectedObjects.join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Good Shot Detected Overlay */}
      {recordingState === 'good-shot-detected' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
          <div className="bg-green-600/90 backdrop-blur-sm rounded-3xl p-6 text-white text-center shadow-2xl animate-bounce-in max-w-sm">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-bold mb-2">Great Shot!</h3>
            <p className="text-sm opacity-90 mb-4">Perfect angle detected. Lock this shot?</p>
            <button
              onClick={handleLockShot}
              className="bg-white text-green-600 py-3 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🔒 Lock This Shot!
            </button>
            <div className="mt-2 text-xs opacity-75">
              Auto-locking in 2 seconds...
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-8">
        <div className="flex items-center justify-center space-x-8">
          <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl">
            📸
          </button>
          
          {/* Record Button */}
          <button 
            onClick={handleStartRecording}
            disabled={recordingState !== 'idle'}
            data-testid="button-record"
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative transition-all duration-300 ${
              recordingState === 'recording' 
                ? 'bg-red-500 animate-pulse' 
                : recordingState === 'finding-shot' || recordingState === 'good-shot-detected'
                ? 'bg-blue-500 animate-pulse'
                : 'bg-red-500 hover:bg-red-600 animate-pulse-glow'
            }`}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              {recordingState === 'finding-shot' || recordingState === 'good-shot-detected' ? (
                <div className="text-blue-500 text-2xl">🎯</div>
              ) : (
                <div className={`bg-red-500 rounded-full transition-all duration-300 ${
                  recordingState === 'recording' ? 'w-4 h-4' : 'w-6 h-6'
                }`}></div>
              )}
            </div>
          </button>
          
          <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl">
            💡
          </button>
        </div>
        
        {/* Timer Display */}
        {recordingState === 'recording' && (
          <div className="text-center mt-4">
            <div className="text-white text-lg font-bold">
              <span className="bg-red-500 px-3 py-1 rounded-full">
                0:{recordingTime.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Countdown Overlay */}
      {recordingState === 'countdown' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
          <div className="text-white text-center">
            <div className="text-8xl font-bold mb-4 animate-bounce-in" data-testid="text-countdown">
              {countdown}
            </div>
            <p className="text-xl">Get ready to record!</p>
          </div>
        </div>
      )}
    </div>
  );
}
