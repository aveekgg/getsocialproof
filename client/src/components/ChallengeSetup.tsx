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
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">💡 Prompt Suggestions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Here are some ideas to get you started. You can record any or all of these - it's up to you!
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {(!challenge.promptPool || challenge.promptPool.length === 0) ? (
            // Fallback prompts if server data isn't loaded
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">🏩</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Show your favorite corner in the room</h4>
                  <p className="text-sm text-gray-600">5s • +{challenge.pointsPerStep} points</p>
                </div>
                <span className="text-lg">🎬</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">🎧</div>
                <div className="flex-1">
                  <h4 className="font-semibold">What's your study setup like?</h4>
                  <p className="text-sm text-gray-600">5s • +{challenge.pointsPerStep} points</p>
                </div>
                <span className="text-lg">🎬</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">🍜</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Take us to your kitchen – what do you cook most?</h4>
                  <p className="text-sm text-gray-600">6s • +{challenge.pointsPerStep} points</p>
                </div>
                <span className="text-lg">🎬</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">❤️</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Say one thing you love most about living here</h4>
                  <p className="text-sm text-gray-600">4s • +{challenge.pointsPerStep} points</p>
                </div>
                <span className="text-lg">🎬</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">🧘</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Your chill-out zone</h4>
                  <p className="text-sm text-gray-600">5s • +{challenge.pointsPerStep} points</p>
                </div>
                <span className="text-lg">🎬</span>
              </div>
            </div>
          ) : (
            challenge.promptPool.map((prompt, index) => (
              <div key={prompt.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">{prompt.emoji}</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{prompt.text}</h4>
                  <p className="text-sm text-gray-600">{prompt.duration}s • +{challenge.pointsPerStep} points</p>
                </div>
                <span className="text-lg">🎬</span>
              </div>
            ))
          )}
        </div>
        
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">💡</span>
            <span className="font-semibold text-accent">Pro Tips</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Hold your phone steady (or prop it up)</li>
            <li>• Natural lighting works best</li>
            <li>• Be yourself - authenticity wins</li>
            <li>• Don't worry about being perfect!</li>
          </ul>
        </div>
        
        <button 
          onClick={onStartChallenge}
          data-testid="button-start-recording"
          className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
        >
          🎥 Let's Start Recording
        </button>
      </div>
    </div>
  );
}
