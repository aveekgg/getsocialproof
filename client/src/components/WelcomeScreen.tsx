import { Challenge } from "@shared/schema";

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
          <h1 className="text-4xl font-bold mb-4">RoomReel Challenge</h1>
          <p className="text-lg opacity-90 mb-8 max-w-sm">Create awesome videos about your student housing experience and win amazing rewards!</p>
        </div>
        
        <div className="w-full max-w-sm space-y-4 animate-fade-in-up">
          {challenges.map((challenge, index) => (
            <button
              key={challenge.id}
              onClick={() => onChallengeSelect(challenge.id)}
              data-testid={`button-challenge-${challenge.id}`}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                index === 0 
                  ? 'bg-white text-primary' 
                  : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30'
              }`}
            >
              {challenge.id === 'room-tour' ? '🏠' : '📅'} {challenge.name}
            </button>
          ))}
        </div>
        
        <div className="mt-12 flex items-center space-x-4 opacity-80">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span className="text-sm">Quick & Fun</span>
          </div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎁</span>
            <span className="text-sm">Win Rewards</span>
          </div>
        </div>
      </div>
    </div>
  );
}
