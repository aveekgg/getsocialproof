import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Challenge, VideoClip } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FinalReviewProps {
  challenge: Challenge;
  completedClips: VideoClip[];
  totalPoints: number;
  onSubmit: (submissionId: string) => void;
}

export default function FinalReview({ challenge, completedClips, totalPoints, onSubmit }: FinalReviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  
  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/submissions', {
        challengeId: challenge.id,
        videoClips: completedClips,
        totalPoints: totalPoints,
        userId: null // Anonymous for now
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your RoomReel has been submitted successfully!",
      });
      onSubmit(data.submission.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit your video. Please try again.",
        variant: "destructive",
      });
    }
  });

  const totalDuration = completedClips.reduce((sum, clip) => sum + clip.duration, 0);

  const handlePlayPreview = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would play the concatenated video
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🎬 Your RoomReel</h2>
        <p className="opacity-90">Review your amazing {challenge.name.toLowerCase()}!</p>
      </div>
      
      <div className="p-6">
        {/* Video Preview */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden mb-6">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Room tour video preview" 
              className="w-full h-48 object-cover" 
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-4xl animate-pulse">▶️</div>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">{challenge.name} Final Video</span>
              <span className="text-gray-400 text-sm" data-testid="text-video-duration">{totalDuration}s</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePlayPreview}
                data-testid="button-play-preview"
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div className={`bg-primary h-2 rounded-full transition-all duration-300 ${isPlaying ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Clip Summary */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold mb-3">📋 Your Clips</h3>
          
          {challenge.steps.map((step, index) => {
            const clip = completedClips.find(c => c.stepId === step.id);
            return (
              <div key={step.id} className="flex items-center space-x-3 p-3 bg-accent/10 rounded-xl">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm">✓</div>
                <div className="flex-1">
                  <div className="font-medium">{step.emoji} {step.title}</div>
                  <div className="text-sm text-gray-600">{clip?.duration || step.duration}s</div>
                </div>
                <span className="text-accent text-sm">+{challenge.pointsPerStep}pts</span>
              </div>
            );
          })}
        </div>
        
        {/* Total Points */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-4 mb-6 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold" data-testid="text-final-points">{totalPoints} Perk Points Earned!</div>
          <div className="text-sm opacity-90">You're on fire! 🔥</div>
        </div>
        
        <button 
          onClick={() => submitMutation.mutate()}
          disabled={submitMutation.isPending}
          data-testid="button-submit-video"
          className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
        >
          {submitMutation.isPending ? '🚀 Submitting...' : '🚀 Submit My RoomReel'}
        </button>
      </div>
    </div>
  );
}
