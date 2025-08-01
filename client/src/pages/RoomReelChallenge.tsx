import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChallengeSetup from "@/components/ChallengeSetup";
import CameraInterface from "@/components/CameraInterface";
import RecordingComplete from "@/components/RecordingComplete";
import FinalReview from "@/components/FinalReview";
import RewardWheel from "@/components/RewardWheel";
import SuccessScreen from "@/components/SuccessScreen";
import type { Challenge, VideoClip } from "@shared/schema";

type Screen = 'welcome' | 'setup' | 'camera' | 'complete' | 'review' | 'reward' | 'success';

export default function RoomReelChallenge() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
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
      setCurrentScreen('setup');
    }
  };

  const handleStartChallenge = () => {
    setCurrentStep(0);
    setCurrentScreen('camera');
  };

  const handleClipComplete = (clip: VideoClip) => {
    const newClips = [...completedClips, clip];
    setCompletedClips(newClips);
    setTotalPoints(prev => prev + (selectedChallenge?.pointsPerStep || 25));
    setCurrentScreen('complete');
  };

  const handleContinueRecording = () => {
    const nextStep = currentStep + 1;
    if (nextStep < (selectedChallenge?.steps.length || 0)) {
      setCurrentStep(nextStep);
      setCurrentScreen('camera');
    } else {
      setCurrentScreen('review');
    }
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
    setCurrentScreen('welcome');
    setSelectedChallenge(null);
    setCurrentStep(0);
    setCompletedClips([]);
    setTotalPoints(0);
    setSubmissionId(null);
  };

  // Prevent body scroll on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const commonProps = {
    onBack: () => {
      if (currentScreen === 'setup') setCurrentScreen('welcome');
      else if (currentScreen === 'camera') setCurrentScreen('setup');
    }
  };

  switch (currentScreen) {
    case 'welcome':
      return (
        <WelcomeScreen
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
          currentStep={currentStep}
          totalSteps={selectedChallenge?.steps.length || 0}
          onClipComplete={handleClipComplete}
          {...commonProps}
        />
      );
    
    case 'complete':
      return (
        <RecordingComplete
          challenge={selectedChallenge!}
          currentStep={currentStep}
          totalSteps={selectedChallenge?.steps.length || 0}
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
      return <WelcomeScreen challenges={challenges} onChallengeSelect={handleChallengeSelect} />;
  }
}
