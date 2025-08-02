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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {confettiElements}
      </div>
      
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🎯</span>
            </div>
            <span className="text-yellow-500 font-bold">15,45,138</span>
            <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">30</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">🌡️ Spin to Win!</h1>
          <p className="text-gray-300 text-sm">You completed your challenge — here's your reward!</p>
        </div>
        
        {/* Modern Wheel Design */}
        <div className="relative mb-8">
          {/* Wheel Stand */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gray-700 rounded-full"></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-600 rounded-full"></div>
          
          {/* Wheel Frame */}
          <div className="relative">
            <div className="w-80 h-80 rounded-full bg-gray-800 p-4 shadow-2xl">
              <div 
                className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[3s] ease-out border-4 border-gray-700"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Wheel Sections */}
                {rewards.map((reward, index) => {
                  const angle = (360 / rewards.length) * index;
                  const nextAngle = (360 / rewards.length) * (index + 1);
                  
                  return (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `conic-gradient(from ${angle}deg, ${reward.color} ${angle}deg, ${reward.color} ${nextAngle}deg, transparent ${nextAngle}deg)`,
                        clipPath: `polygon(50% 50%, ${50 + 40 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 40 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 40 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 40 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
                      }}
                    >
                      <div 
                        className="absolute text-white font-bold text-center"
                        style={{
                          transform: `rotate(${angle + (360 / rewards.length) / 2}deg) translateY(-120px)`,
                          transformOrigin: 'center'
                        }}
                      >
                        <div className="text-2xl mb-1">{reward.emoji}</div>
                        <div className="text-xs">{reward.text}</div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Center Hub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-300">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pointer */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-white shadow-lg"></div>
            </div>
          </div>
        </div>
        
        {/* Prize Info */}
        <div className="text-center mb-6">
          <div className="text-gray-400 text-sm mb-2">💡 details</div>
          <div className="text-white font-bold">spin for 💰 3,000</div>
        </div>
        
        {!showResult ? (
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            data-testid="button-spin-wheel"
            className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-600 text-black py-4 px-8 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            {isSpinning ? 'Spinning...' : 'Spin'}
          </button>
        ) : (
          /* Reward Result */
          <div className="w-full max-w-xs bg-gray-800 rounded-2xl p-6 animate-bounce-in">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">You Won!</h3>
            <div className="text-lg font-semibold text-yellow-500 mb-2" data-testid="text-reward-value">
              {reward?.rewardValue || 'Starbucks ☕'}
            </div>
            <p className="text-gray-400 text-sm mb-4">Your reward code will be sent to your email!</p>
            <button 
              onClick={onFinish}
              data-testid="button-claim-reward"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              Awesome! 🙌
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
