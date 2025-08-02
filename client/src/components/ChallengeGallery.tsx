import { Challenge } from "@shared/schema";

interface ChallengeGalleryProps {
  challenges: Challenge[];
  onChallengeSelect: (challengeId: string) => void;
}

export default function ChallengeGallery({ challenges, onChallengeSelect }: ChallengeGalleryProps) {
  const getDaysLeft = (challenge: Challenge) => {
    // All challenges run for 5 days from now
    return challenge.durationDays || 5;
  };

  const isAvailable = (challenge: Challenge) => {
    // All challenges are available
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-white rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-white rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative z-10 px-4 py-8 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-2xl">
            <span className="text-2xl">🎬</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Choose Your Challenge</h1>
          <p className="text-lg opacity-90">Pick a vibe and start creating!</p>
        </div>

        {/* Challenge Cards */}
        <div className="space-y-4 max-w-sm mx-auto">
          {challenges.map((challenge) => {
            const available = isAvailable(challenge);
            const daysLeft = getDaysLeft(challenge);
            
            return (
              <div
                key={challenge.id}
                className={`bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 ${
                  available 
                    ? 'cursor-pointer hover:bg-white/25 transform hover:scale-105 shadow-lg hover:shadow-xl' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => available && onChallengeSelect(challenge.id)}
              >
                {/* Challenge Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{challenge.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{challenge.tagline || challenge.description}</p>
                  </div>
                  <div className="text-3xl ml-3">🎮</div>
                </div>

                {/* Challenge Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <span>🎮</span>
                      <span>{challenge.maxPrompts || 5} Scenes</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>⏳</span>
                      <span>{daysLeft} Days Left</span>
                    </span>
                  </div>
                </div>

                {/* Points Preview */}
                <div className="bg-white/10 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Rewards</span>
                    <span className="text-lg font-bold">⭐ {challenge.pointsPerStep * (challenge.maxPrompts || 5)} pts</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    available
                      ? 'bg-white text-primary hover:bg-gray-100 shadow-lg'
                      : 'bg-white/20 text-white/70 cursor-not-allowed'
                  }`}
                  disabled={!available}
                >
                  {available ? 'Start Challenge' : 'Coming Soon'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm opacity-75">New challenges unlock daily • Complete for bigger rewards!</p>
        </div>
      </div>
    </div>
  );
}