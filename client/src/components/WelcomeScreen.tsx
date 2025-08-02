import { Challenge } from "@shared/schema";
import ChallengeTimeline from "./ChallengeTimeline";

interface WelcomeScreenProps {
  challenges: Challenge[];
  onChallengeSelect: (challengeId: string) => void;
}

export default function WelcomeScreen({ challenges, onChallengeSelect }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-white rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-white rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white">
        <div className="animate-bounce-in mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
            <span className="text-4xl">🎬</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">RoomReel</h1>
          <p className="text-lg opacity-90 mb-8 max-w-sm">Share your real uni life, help other students, and win some brilliant rewards!</p>
        </div>
        
        {/* Rewards Preview */}
        <div className="w-full max-w-sm mb-6 animate-fade-in-up">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <span className="text-lg font-semibold">🎁 What's Up for Grabs?</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg mb-1">☕</div>
                <div className="text-xs">Costa Cards</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg mb-1">🎵</div>
                <div className="text-xs">Spotify Premium</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg mb-1">🍕</div>
                <div className="text-xs">Food Vouchers</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg mb-1">💰</div>
                <div className="text-xs">PayPal Cash</div>
              </div>
            </div>
            <div className="text-center mt-3 text-xs opacity-75">
              Random rewards - from daily treats to epic prizes!
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up">
          <ChallengeTimeline 
            challenges={challenges} 
            onChallengeSelect={onChallengeSelect} 
          />
        </div>
        
        <div className="mt-6 flex items-center space-x-4 opacity-80">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📅</span>
            <span className="text-sm">5 days</span>
          </div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎁</span>
            <span className="text-sm">Daily rewards</span>
          </div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⭐</span>
            <span className="text-sm">More points</span>
          </div>
        </div>
      </div>
    </div>
  );
}
