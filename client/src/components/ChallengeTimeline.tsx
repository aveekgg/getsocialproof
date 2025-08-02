import { Challenge } from "@shared/schema";

interface ChallengeTimelineProps {
  challenges: Challenge[];
  onChallengeSelect: (challengeId: string) => void;
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
    <div className="w-full max-w-sm space-y-3">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">📅 5-Day Challenge</h3>
        <p className="text-sm opacity-75">New challenges unlock daily!</p>
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
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                  unlocked 
                    ? 'bg-white/15 backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/25 transform hover:scale-105' 
                    : 'bg-white/5 border border-white/10 cursor-not-allowed opacity-60'
                }`}
                onClick={() => unlocked && onChallengeSelect(challenge.id)}
              >
                {/* Day indicator */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                  unlocked 
                    ? 'bg-white text-primary border-white' 
                    : 'bg-white/10 text-white/70 border-white/20'
                }`}>
                  {challenge.dayNumber}
                </div>
                
                {/* Challenge info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-semibold text-sm truncate ${unlocked ? 'text-white' : 'text-white/70'}`}>
                      {challenge.name}
                    </h4>
                    {unlocked && (
                      <div className="flex-shrink-0">
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                          Available
                        </span>
                      </div>
                    )}
                    {coming && (
                      <div className="flex-shrink-0">
                        <span className="text-xs bg-orange-500/80 text-white px-2 py-0.5 rounded-full">
                          {getDayLabel(challenge.dayNumber)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className={`text-xs truncate ${unlocked ? 'text-white/80' : 'text-white/50'}`}>
                    {challenge.description}
                  </p>
                  <div className={`text-xs mt-1 ${unlocked ? 'text-white/70' : 'text-white/40'}`}>
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