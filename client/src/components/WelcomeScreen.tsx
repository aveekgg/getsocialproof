import { Challenge } from "@shared/schema";
import { useState } from "react";

interface WelcomeScreenProps {
  challenges: Challenge[];
  onChallengeSelect: (challengeId: string) => void;
}

export default function WelcomeScreen({ challenges, onChallengeSelect }: WelcomeScreenProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-white rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-white rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen px-4 text-center text-white">
        {/* Header section - New improved copy */}
        <div className="pt-12 pb-6">
          <div className="animate-bounce-in">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
              <span className="text-3xl">🎬</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              🎥 Show Off Your<br />Student Life
            </h1>
            <h2 className="text-xl font-semibold mb-6 opacity-90">
              🎁 Win Perks While You're At It
            </h2>
            <p className="text-base opacity-80 mb-8 max-w-sm mx-auto leading-relaxed">
              Record 5 quick clips about your room, your vibe, and your life — and unlock exclusive rewards.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mb-8 space-y-4">
          <button 
            onClick={() => challenges.length > 0 && onChallengeSelect(challenges[0].id)}
            className="w-full max-w-sm mx-auto bg-white text-primary py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
          >
            🎬 Start Challenge
          </button>
          <button 
            onClick={() => setShowHowItWorks(true)}
            className="w-full max-w-sm mx-auto bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            💡 How It Works
          </button>
        </div>
        
        {/* Enhanced Rewards Preview with animations */}
        <div className="w-full max-w-sm mb-6 mx-auto animate-fade-in-up">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <span className="text-lg font-semibold animate-pulse">🎁 What's Up for Grabs?</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="bg-white/10 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.1s'}}>
                <div className="text-2xl mb-1">☕</div>
                <div className="text-xs font-medium">Starbucks voucher</div>
                <div className="text-[10px] opacity-75">£5-15</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl mb-1">💪</div>
                <div className="text-xs font-medium">Gym discount</div>
                <div className="text-[10px] opacity-75">Monthly pass</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.3s'}}>
                <div className="text-2xl mb-1">🌟</div>
                <div className="text-xs font-medium">"Feature Me on IG" Badge</div>
                <div className="text-[10px] opacity-75">Social fame</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.4s'}}>
                <div className="text-2xl mb-1">🍿</div>
                <div className="text-xs font-medium">Netflix for a month</div>
                <div className="text-[10px] opacity-75">Streaming time</div>
              </div>
            </div>
            <div className="text-center text-xs opacity-75 animate-pulse">
              ✨ Try your luck! Random rewards every completion ✨
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pb-8">
          <div className="text-xs opacity-60">
            Powered by RoomReel + Verified by Students
          </div>
        </div>
      </div>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 animate-bounce-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">How It Works</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Choose Your Challenge</h4>
                  <p className="text-sm text-gray-600">Pick a vibe: "Room Tour", "Day in Life", or "Crib in 5 Clips"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Follow Prompts</h4>
                  <p className="text-sm text-gray-600">We'll guide you with fun prompts. You just press record.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Earn Rewards</h4>
                  <p className="text-sm text-gray-600">Finish the challenge, spin the reward wheel, and earn perks!</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowHowItWorks(false)}
              className="w-full bg-primary text-white py-3 px-6 rounded-2xl font-semibold"
            >
              Got it, let's roll 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
