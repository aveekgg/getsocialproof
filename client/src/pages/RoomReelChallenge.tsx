import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ChallengeGallery from "@/components/ChallengeGallery";
import ChallengeSetup from "@/components/ChallengeSetup";
import CameraInterface from "@/components/CameraInterface";
import RecordingComplete from "@/components/RecordingComplete";
import FinalReview from "@/components/FinalReview";
import RewardWheel from "@/components/RewardWheel";
import SuccessScreen from "@/components/SuccessScreen";
import type { Challenge, VideoClip, ChallengePrompt } from "@shared/schema";

type Screen = 'gallery' | 'setup' | 'camera' | 'complete' | 'review' | 'reward' | 'success';

export default function RoomReelChallenge() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('gallery');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedPrompts, setSelectedPrompts] = useState<ChallengePrompt[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedClips, setCompletedClips] = useState<VideoClip[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const { data: challenges = [] } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  const handleChallengeSelect = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setSelectedChallenge(challenge);
      // Use all prompts from the challenge, or fallback prompts
      const fallbackPrompts: ChallengePrompt[] = [
        { id: "favorite-corner", text: "Show your favorite corner in the room", emoji: "🏩", duration: 5 },
        { id: "study-setup", text: "What's your study setup like?", emoji: "🎧", duration: 5 },
        { id: "kitchen-tour", text: "Take us to your kitchen – what do you cook most?", emoji: "🍜", duration: 6 },
        { id: "love-most", text: "Say one thing you love most about living here", emoji: "❤️", duration: 4 },
        { id: "chill-zone", text: "Your chill-out zone", emoji: "🧘", duration: 5 }
      ];
      setSelectedPrompts(challenge.promptPool && challenge.promptPool.length > 0 ? challenge.promptPool : fallbackPrompts);
      setCurrentScreen('setup');
    }
  };

  const handleStartChallenge = () => {
    setCurrentStep(0);
    setCurrentScreen('camera');
  };

  const handleClipComplete = (clip: VideoClip) => {
    setCompletedClips([clip]); // Single video for entire challenge
    setTotalPoints((selectedChallenge?.pointsPerStep || 25) * selectedPrompts.length);
    setCurrentScreen('review'); // Skip the complete screen, go straight to review
  };

  const handleSubmitVideo = async (submissionId: string) => {
    setSubmissionId(submissionId);
    setCurrentScreen('reward');
  };

  const handleFinishChallenge = () => {
    setCurrentScreen('success');
  };

  const handleStartNewChallenge = () => {
    // Reset all state
    setCurrentScreen('gallery');
    setSelectedChallenge(null);
    setSelectedPrompts([]);
    setCurrentStep(0);
    setCompletedClips([]);
    setTotalPoints(0);
    setSubmissionId(null);
  };

  // Allow scrolling except on camera screen
  useEffect(() => {
    if (currentScreen === 'camera') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [currentScreen]);

  const commonProps = {
    onBack: () => {
      if (currentScreen === 'setup') setCurrentScreen('gallery');
      else if (currentScreen === 'camera') setCurrentScreen('setup');
    }
  };

  switch (currentScreen) {
    case 'gallery':
      return (
        <ChallengeGallery
          challenges={challenges}
          onChallengeSelect={handleChallengeSelect}
        />
      );
    
    case 'setup':
      return (
        <ChallengeSetup
          challenge={selectedChallenge!}
          onStartChallenge={handleStartChallenge}
          {...commonProps}
        />
      );
    
    case 'camera':
      return (
        <CameraInterface
          challenge={selectedChallenge!}
          selectedPrompts={selectedPrompts}
          onVideoComplete={handleClipComplete}
          {...commonProps}
        />
      );
    
    case 'complete':
      return (
        <RecordingComplete
          challenge={selectedChallenge!}
          selectedPrompts={selectedPrompts}
          currentStep={currentStep}
          totalSteps={selectedPrompts.length}
          pointsEarned={selectedChallenge?.pointsPerStep || 25}
          totalPoints={totalPoints}
          onContinue={handleContinueRecording}
          onRetake={() => setCurrentScreen('camera')}
        />
      );
    
    case 'review':
      return (
        <FinalReview
          challenge={selectedChallenge!}
          selectedPrompts={selectedPrompts}
          completedClips={completedClips}
          totalPoints={totalPoints}
          onSubmit={handleSubmitVideo}
        />
      );
    
    case 'reward':
      return (
        <RewardWheel
          submissionId={submissionId!}
          onFinish={handleFinishChallenge}
        />
      );
    
    case 'success':
      return (
        <SuccessScreen
          totalPoints={totalPoints}
          clipsCount={completedClips.length}
          totalDuration={completedClips.reduce((sum, clip) => sum + clip.duration, 0)}
          onStartNew={handleStartNewChallenge}
          onShare={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Check out my RoomReel!',
                text: 'I just created an awesome room tour video with RoomReel Challenge!',
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
        />
      );
    
    default:
      return <ChallengeGallery challenges={challenges} onChallengeSelect={handleChallengeSelect} />;
  }
}
