import { Challenge } from "@shared/schema";
import { useState, useEffect } from "react";

interface ChallengeTimelineProps {
  challenges: Challenge[];
  onChallengeSelect: (challengeId: string) => void;
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      } else {
        setTimeLeft('Available!');
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span className="text-xs bg-yellow-500/80 text-white px-2 py-0.5 rounded-full">
      {timeLeft || 'Soon'}
    </span>
  );
}

export default function ChallengeTimeline({ challenges, onChallengeSelect }: ChallengeTimelineProps) {
  const today = new Date();
  
  const getDayLabel = (dayNumber: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + dayNumber - 1);
    
    if (dayNumber === 1) return "Today";
    if (dayNumber === 2) return "Tomorrow";
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
  };

  const isUnlocked = (challenge: Challenge) => {
    return new Date() >= new Date(challenge.unlockDate);
  };

  const isComing = (challenge: Challenge) => {
    return new Date() < new Date(challenge.unlockDate);
  };

  return (
    <div className="w-full max-w-xs mx-auto space-y-2">
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-white mb-1">📅 5-Day Challenge</h3>
        <p className="text-xs opacity-75">New challenges unlock daily!</p>
      </div>
      
      {challenges
        .sort((a, b) => a.dayNumber - b.dayNumber)
        .map((challenge, index) => {
          const unlocked = isUnlocked(challenge);
          const coming = isComing(challenge);
          
          return (
            <div key={challenge.id} className="relative">
              {/* Timeline connector */}
              {index < challenges.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-white/20"></div>
              )}
              
              <div 
                className={`flex items-center space-x-2 p-2 rounded-xl transition-all duration-300 ${
                  unlocked 
                    ? 'bg-white/15 backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/25 transform hover:scale-105' 
                    : 'bg-white/5 border border-white/10 cursor-not-allowed opacity-60'
                }`}
                onClick={() => unlocked && onChallengeSelect(challenge.id)}
              >
                {/* Day indicator */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                  unlocked 
                    ? 'bg-white text-primary border-white' 
                    : 'bg-white/10 text-white/70 border-white/20'
                }`}>
                  {challenge.dayNumber}
                </div>
                
                {/* Challenge info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-white/70'}`}>
                      {challenge.name}
                    </h4>
                    <div className="flex-shrink-0">
                      {unlocked ? (
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                          Available
                        </span>
                      ) : (
                        <CountdownTimer targetDate={challenge.unlockDate} />
                      )}
                    </div>
                  </div>
                  <p className={`text-xs ${unlocked ? 'text-white/80' : 'text-white/50'}`}>
                    {getDayLabel(challenge.dayNumber)} • {challenge.pointsPerStep} pts per step
                  </p>
                  <div className={`text-xs ${unlocked ? 'text-white/70' : 'text-white/40'}`}>
                    ⭐ {challenge.pointsPerStep * challenge.steps.length} points
                  </div>
                </div>
                
                {/* Lock/unlock indicator */}
                <div className="flex-shrink-0">
                  {unlocked ? (
                    <span className="text-lg">🎬</span>
                  ) : (
                    <span className="text-lg opacity-50">🔒</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      
      <div className="text-center mt-4 p-3 bg-white/10 rounded-xl">
        <div className="text-xs text-white/80">
          Complete challenges daily for bigger rewards! 🎁
        </div>
      </div>
    </div>
  );
}