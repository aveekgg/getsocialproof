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

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {confettiElements}
      </div>
      
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 animate-bounce-in">🎉 Congratulations!</h1>
          <p className="text-lg opacity-90 mb-8">Your RoomReel has been submitted! Time for your reward...</p>
        </div>
        
        {/* Spinning Wheel */}
        <div className="relative mb-8">
          <div 
            className="w-80 h-80 rounded-full relative overflow-hidden shadow-2xl transition-transform duration-[3s] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Wheel Sections */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[
                { color: 'from-red-500 to-red-600', clipPath: 'polygon(50% 50%, 50% 0%, 75% 25%)' },
                { color: 'from-blue-500 to-blue-600', clipPath: 'polygon(50% 50%, 75% 25%, 100% 50%)' },
                { color: 'from-green-500 to-green-600', clipPath: 'polygon(50% 50%, 100% 50%, 75% 75%)' },
                { color: 'from-yellow-500 to-yellow-600', clipPath: 'polygon(50% 50%, 75% 75%, 50% 100%)' },
                { color: 'from-purple-500 to-purple-600', clipPath: 'polygon(50% 50%, 50% 100%, 25% 75%)' },
                { color: 'from-pink-500 to-pink-600', clipPath: 'polygon(50% 50%, 25% 75%, 0% 50%)' },
                { color: 'from-indigo-500 to-indigo-600', clipPath: 'polygon(50% 50%, 0% 50%, 25% 25%)' },
                { color: 'from-orange-500 to-orange-600', clipPath: 'polygon(50% 50%, 25% 25%, 50% 0%)' }
              ].map((section, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 bg-gradient-to-br ${section.color}`}
                  style={{ clipPath: section.clipPath }}
                ></div>
              ))}
            </div>
            
            {/* Wheel Labels */}
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              {[
                { emoji: '☕', style: { top: '10%', left: '50%', transform: 'translateX(-50%)' } },
                { emoji: '🎵', style: { top: '25%', right: '15%' } },
                { emoji: '🍕', style: { bottom: '25%', right: '15%' } },
                { emoji: '🎬', style: { bottom: '10%', left: '50%', transform: 'translateX(-50%)' } },
                { emoji: '🛍️', style: { bottom: '25%', left: '15%' } },
                { emoji: '📚', style: { top: '25%', left: '15%' } },
                { emoji: '💰', style: { top: '50%', left: '10%' } },
                { emoji: '🎁', style: { top: '50%', right: '10%' } }
              ].map((label, index) => (
                <div key={index} className="absolute" style={label.style}>
                  {label.emoji}
                </div>
              ))}
            </div>
            
            {/* Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
          </div>
        </div>
        
        {!showResult ? (
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            data-testid="button-spin-wheel"
            className="bg-white text-secondary py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow disabled:opacity-50 disabled:transform-none"
          >
            {isSpinning ? '🎯 SPINNING...' : '🎯 SPIN THE WHEEL!'}
          </button>
        ) : (
          /* Reward Result */
          <div className="mt-8 p-6 bg-white/20 backdrop-blur-sm rounded-2xl animate-bounce-in max-w-sm">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold mb-2">You Won!</h3>
            <div className="text-lg font-semibold mb-2" data-testid="text-reward-value">
              {reward?.rewardValue || '£3 Costa Coffee'}
            </div>
            <p className="text-sm opacity-90 mb-4">Your reward code will be sent to your email!</p>
            <button 
              onClick={onFinish}
              data-testid="button-claim-reward"
              className="bg-white text-secondary py-2 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Awesome! 🙌
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
