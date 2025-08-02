import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface RewardWheelProps {
  submissionId: string;
  onFinish: () => void;
}

export default function RewardWheel({ submissionId, onFinish }: RewardWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);

  const { data: submissionData } = useQuery({
    queryKey: ['/api/submissions', submissionId],
    enabled: !!submissionId,
  });

  const reward = (submissionData as any)?.reward;

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const newRotation = rotation + Math.random() * 1800 + 1800; // 5-10 full rotations
    setRotation(newRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
    }, 3500);
  };

  // Create confetti elements
  const confettiElements = Array.from({ length: 9 }, (_, i) => (
    <div 
      key={i}
      className="confetti-piece absolute animate-confetti text-2xl"
      style={{
        left: `${(i + 1) * 10}%`,
        animationDelay: `${i * 0.2}s`
      }}
    >
      {['🎉', '⭐', '🎊', '💫'][i % 4]}
    </div>
  ));

  const rewards = [
    { emoji: '☕', text: 'Starbucks', color: '#FF6B6B', value: 'Starbucks ☕' },
    { emoji: '💪', text: 'Gym Trial', color: '#4ECDC4', value: 'Gym Trial 💪' },
    { emoji: '🎧', text: 'Spotify', color: '#45B7D1', value: 'Spotify 1-Month 🎧' },
    { emoji: '🌟', text: 'IG Feature', color: '#96CEB4', value: 'Feature Me on IG 🌟' },
    { emoji: '🛒', text: 'Grocery', color: '#FFEAA7', value: 'Grocery Voucher 🛒' },
    { emoji: '🏰', text: 'Surprise', color: '#DDA0DD', value: 'Surprise 🏰' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {confettiElements}
      </div>
      
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🌀 Nice one! Your reel is live.</h1>
          <p className="text-xl text-white/90 mb-4">Now let's get you a surprise!</p>
          <p className="text-lg text-white/80">🎯 Spin the wheel to unlock a student perk 🎁</p>
        </div>
        
        {/* Modern Wheel Design */}
        <div className="relative mb-8">
          {/* Wheel with glassmorphism effect */}
          <div className="relative">
            <div className="w-80 h-80 rounded-full bg-white/10 backdrop-blur-lg p-2 shadow-2xl border border-white/20">
              <div 
                className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[3s] ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Wheel Sections with better visibility */}
                {rewards.map((reward, index) => {
                  const angle = (360 / rewards.length) * index;
                  const sectionAngle = 360 / rewards.length;
                  
                  return (
                    <div
                      key={index}
                      className="absolute inset-0"
                      style={{
                        background: reward.color,
                        clipPath: `polygon(50% 50%, ${50 + 45 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 45 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 45 * Math.cos((angle + sectionAngle - 90) * Math.PI / 180)}% ${50 + 45 * Math.sin((angle + sectionAngle - 90) * Math.PI / 180)}%)`
                      }}
                    >
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform: `rotate(${angle + sectionAngle / 2}deg)`,
                          transformOrigin: '50% 50%'
                        }}
                      >
                        <div className="text-center" style={{ transform: 'translateY(-100px)' }}>
                          <div className="text-4xl mb-1">{reward.emoji}</div>
                          <div className="text-xs font-bold text-white">{reward.text}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Center Hub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-200">
                    <span className="text-3xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-white shadow-lg"></div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-sm">
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            data-testid="button-spin-wheel"
            className="w-full border-3 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black py-6 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:bg-transparent disabled:hover:text-yellow-400"
          >
            {isSpinning ? '🎯 Spinning...' : '🎉 Spin Now'}
          </button>
        </div>
      </div>

      {/* Overlay Results Card */}
      {showResult && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-lg rounded-3xl p-8 animate-bounce-in border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🎊</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">You got a {reward?.rewardValue || 'Starbucks ☕'}!</h3>
              <p className="text-gray-600 text-sm mb-6">Check your inbox or rewards section to claim it.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={onFinish}
                  data-testid="button-claim-reward"
                  className="w-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  Try Another Challenge
                </button>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Check out my RoomReel!',
                        text: 'I just won a reward with RoomReel Challenge!',
                        url: window.location.href
                      });
                    }
                  }}
                  className="w-full border-2 border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300"
                >
                  📲 Share My Reel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
