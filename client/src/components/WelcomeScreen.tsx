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
      
      <div className="relative z-10 flex flex-col min-h-screen px-4 text-center text-white">
        {/* Header section - optimize for mobile */}
        <div className="pt-8 pb-4">
          <div className="animate-bounce-in">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-2xl">
              <span className="text-3xl">🎬</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">RoomReel</h1>
            <p className="text-base opacity-90 mb-4 max-w-xs mx-auto">Share your real uni life, help other students, and win brilliant rewards!</p>
          </div>
        </div>
        
        {/* Enhanced Rewards Preview with animations */}
        <div className="w-full max-w-sm mb-4 animate-fade-in-up">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <span className="text-lg font-semibold animate-pulse">🎁 What's Up for Grabs?</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="bg-white/10 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.1s'}}>
                <div className="text-2xl mb-1">☕</div>
                <div className="text-xs font-medium">Costa Cards</div>
                <div className="text-[10px] opacity-75">£5-20</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl mb-1">🎵</div>
                <div className="text-xs font-medium">Spotify Premium</div>
                <div className="text-[10px] opacity-75">3 months</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.3s'}}>
                <div className="text-2xl mb-1">🍕</div>
                <div className="text-xs font-medium">Food Vouchers</div>
                <div className="text-[10px] opacity-75">Deliveroo/UberEats</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.4s'}}>
                <div className="text-2xl mb-1">💰</div>
                <div className="text-xs font-medium">PayPal Cash</div>
                <div className="text-[10px] opacity-75">£10-50</div>
              </div>
            </div>
            <div className="text-center text-xs opacity-75 animate-pulse">
              ✨ Try your luck! Random rewards every completion ✨
            </div>
          </div>
        </div>

        {/* Challenge Timeline - optimized for mobile */}
        <div className="flex-1 w-full animate-fade-in-up">
          <ChallengeTimeline 
            challenges={challenges} 
            onChallengeSelect={onChallengeSelect} 
          />
        </div>
        
        {/* Bottom stats - more compact for mobile */}
        <div className="mt-4 pb-6 flex items-center justify-center space-x-4 opacity-80">
          <div className="flex items-center space-x-1">
            <span className="text-xl">📅</span>
            <span className="text-xs">5 days</span>
          </div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="flex items-center space-x-1">
            <span className="text-xl">🎁</span>
            <span className="text-xs">Daily rewards</span>
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
