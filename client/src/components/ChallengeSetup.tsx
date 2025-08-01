import { Challenge } from "@shared/schema";

interface ChallengeSetupProps {
  challenge: Challenge;
  onStartChallenge: () => void;
  onBack: () => void;
}

export default function ChallengeSetup({ challenge, onStartChallenge, onBack }: ChallengeSetupProps) {
  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            data-testid="button-back"
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-semibold">{challenge.name}</h2>
          <div className="w-10 h-10"></div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <h3 className="font-semibold mb-2">📋 Your Mission:</h3>
          <p className="text-sm opacity-90">{challenge.description}</p>
        </div>
      </div>
      
      <div className="p-6 pb-safe">
        <div className="space-y-4 mb-8">
          {challenge.steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                index === 0 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step.id}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{step.emoji} {step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              <span className={`text-2xl ${index === 0 ? '' : 'opacity-30'}`}>📹</span>
            </div>
          ))}
        </div>
        
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">💡</span>
            <span className="font-semibold text-accent">Pro Tips</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Keep your phone steady</li>
            <li>• Make sure there's good lighting</li>
            <li>• Speak clearly about what you're showing</li>
            <li>• Have fun and be yourself!</li>
          </ul>
        </div>
        
        <button 
          onClick={onStartChallenge}
          data-testid="button-start-recording"
          className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
        >
          🎬 Start Recording
        </button>
      </div>
    </div>
  );
}
