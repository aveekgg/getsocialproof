import { useState, useEffect, useRef } from "react";
import { Challenge, VideoClip, ChallengePrompt } from "@shared/schema";
import { useCamera } from "@/hooks/useCamera";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import SketchOverlay from "./SketchOverlay";

interface CameraInterfaceProps {
  challenge: Challenge;
  selectedPrompts: ChallengePrompt[];
  onVideoComplete: (clip: VideoClip) => void;
  onBack: () => void;
}

type RecordingState = 'idle' | 'countdown' | 'recording';

export default function CameraInterface({ 
  challenge, 
  selectedPrompts,
  onVideoComplete, 
  onBack
}: CameraInterfaceProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { stream, error: cameraError } = useCamera();
  const { startRecording, stopRecording, isRecording } = useMediaRecorder(stream);
  
  const totalDuration = selectedPrompts.reduce((sum, prompt) => sum + prompt.duration, 0);
  const currentPrompt = selectedPrompts[currentPromptIndex] || selectedPrompts[0];

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
          
          // Auto-advance to next prompt based on duration
          let cumulativeTime = 0;
          for (let i = 0; i < selectedPrompts.length; i++) {
            cumulativeTime += selectedPrompts[i].duration;
            if (newTime <= cumulativeTime && currentPromptIndex !== i) {
              setCurrentPromptIndex(i);
              break;
            }
          }
          
          // Stop recording when total duration is reached
          if (newTime >= totalDuration) {
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
  }, [recordingState, totalDuration, selectedPrompts, currentPromptIndex]);

  // Reset prompt index when starting new recording
  useEffect(() => {
    if (recordingState === 'countdown') {
      setCurrentPromptIndex(0);
    }
  }, [recordingState]);

  const handleStartRecording = () => {
    if (recordingState === 'idle') {
      setRecordingState('countdown');
    }
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      const clip: VideoClip = {
        stepId: 1, // Single video for entire challenge
        duration: recordingTime,
        size: blob.size,
        timestamp: new Date().toISOString()
      };
      onVideoComplete(clip);
    }
    setRecordingState('idle');
  };

  // Removed handleLockShot - no longer needed

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

      {/* Clean interface - no obstructive overlays */}
      
      {/* Top Overlay - Clean and Minimal */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            data-testid="button-close-camera"
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          >
            <span className="text-lg">×</span>
          </button>
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-white text-xs font-medium">{isRecording ? 'REC' : 'READY'}</span>
          </div>
          <div className="text-white text-xs bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        {/* Removed horizontal carousel */}
      </div>
      
      {/* Removed obstructive center overlay */}
      
      {/* Enhanced Prompts Section - Bigger and More Prominent */}
      {recordingState === 'idle' && (
        <div className="absolute top-20 left-0 right-0 bottom-32 z-20 px-4 flex items-center">
          <div className="w-full bg-black/60 backdrop-blur-lg rounded-3xl p-6 max-h-96 overflow-y-auto scrollbar-hide border border-white/20">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Your Recording Guide</h3>
              <p className="text-white/80 text-sm">We'll guide you through these prompts during recording</p>
            </div>
            
            <div className="space-y-4">
              {selectedPrompts.map((prompt, index) => (
                <div 
                  key={prompt.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{prompt.emoji}</span>
                        <span className="text-white font-semibold text-base">{prompt.text}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Duration: {prompt.duration} seconds</span>
                        <span className="text-primary font-semibold text-sm">+{challenge.pointsPerStep} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-white font-semibold text-lg">
                  Total Recording Time: {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-white/80 text-sm mt-1">
                  Total Points: ⭐ {challenge.pointsPerStep * selectedPrompts.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls - Clean and Simple */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-8">
        <div className="flex items-center justify-center">
          {recordingState === 'idle' && (
            <button 
              onClick={handleStartRecording}
              data-testid="button-start-recording"
              className="border-3 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🎬 Start Recording
            </button>
          )}
          
          {recordingState === 'recording' && (
            <button 
              onClick={handleStopRecording}
              data-testid="button-stop-recording"
              className="bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg animate-pulse border-3 border-red-600"
            >
              ⏹️ Stop Recording
            </button>
          )}
          
          {recordingState === 'countdown' && (
            <div className="text-white text-center">
              <div className="text-lg font-semibold">Get ready...</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Minimal Countdown - No obstructive overlay */}
      {recordingState === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="text-white text-center">
            <div className="text-8xl font-bold animate-bounce text-red-500" data-testid="text-countdown">
              {countdown}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
