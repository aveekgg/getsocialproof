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

type RecordingState = 'idle' | 'ready-to-lock' | 'countdown' | 'recording';

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
  // Simplified - no complex analysis needed
  
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

  // Show sketch overlay when ready to lock
  useEffect(() => {
    if (recordingState === 'ready-to-lock') {
      setShowSketchOverlay(true);
    } else {
      setShowSketchOverlay(false);
    }
  }, [recordingState]);

  const handleStartRecording = () => {
    if (recordingState === 'idle') {
      setRecordingState('ready-to-lock');
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
    setRecordingState('countdown');
    // Celebration animation will be handled by countdown overlay
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

      {/* Ready to Lock Overlay */}
      {recordingState === 'ready-to-lock' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 backdrop-blur-sm rounded-3xl p-6 text-white text-center shadow-2xl animate-bounce-in max-w-sm">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="text-xl font-bold mb-2">Frame Your Shot!</h3>
            <p className="text-sm opacity-90 mb-4">Get the perfect angle and lock when ready</p>
            <button
              onClick={handleLockShot}
              className="bg-white text-green-600 py-3 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-3"
            >
              🔒 Lock This Shot!
            </button>
            <div className="text-xs opacity-75">
              Take your time to get the perfect angle
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-8">
        <div className="flex items-center justify-center space-x-8">
          {/* Single Record Button */}
          {recordingState === 'idle' && (
            <button 
              onClick={handleStartRecording}
              data-testid="button-start-recording"
              className="bg-red-500 hover:bg-red-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🎬 Start Recording
            </button>
          )}
          
          {recordingState === 'recording' && (
            <button 
              onClick={handleStopRecording}
              data-testid="button-stop-recording"
              className="bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg animate-pulse"
            >
              ⏹️ Stop Recording
            </button>
          )}
          
          {(recordingState === 'ready-to-lock' || recordingState === 'countdown') && (
            <div className="text-white text-center">
              <div className="text-sm opacity-75">Recording will start after countdown</div>
            </div>
          )}
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
      
      {/* Celebration + Countdown Overlay */}
      {recordingState === 'countdown' && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-blue-500/90 flex items-center justify-center z-30">
          <div className="text-white text-center animate-bounce-in">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <h3 className="text-2xl font-bold mb-3 animate-pulse">Great Work!</h3>
            <p className="text-base opacity-90 mb-4">Perfect shot locked! Recording starts in...</p>
            <div className="text-8xl font-bold mb-4 animate-bounce text-yellow-300" data-testid="text-countdown">
              {countdown}
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
