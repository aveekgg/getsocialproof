import { Challenge } from "@shared/schema";

interface RecordingCompleteProps {
  challenge: Challenge;
  currentStep: number;
  totalSteps: number;
  pointsEarned: number;
  totalPoints: number;
  onContinue: () => void;
  onRetake: () => void;
}

export default function RecordingComplete({ 
  challenge, 
  currentStep, 
  totalSteps, 
  pointsEarned, 
  totalPoints, 
  onContinue, 
  onRetake 
}: RecordingCompleteProps) {
  const isLastStep = currentStep >= totalSteps - 1;
  const nextStep = challenge.steps[currentStep + 1];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Success Animation */}
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
            <span className="text-4xl text-white">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Great job! 🎉</h2>
          <p className="text-gray-600 mb-6">You've completed your {currentStep === 0 ? 'first' : 'next'} clip</p>
          
          {/* Points Earned */}
          <div className="bg-gradient-to-r from-accent to-green-400 text-white rounded-2xl p-4 mb-6 animate-bounce-in">
            <div className="text-3xl mb-2">🎁</div>
            <div className="text-xl font-bold">+{pointsEarned} Perk Points!</div>
            <div className="text-sm opacity-90" data-testid="text-total-points">Total: {totalPoints} points</div>
          </div>
        </div>
        
        {/* Video Preview */}
        <div className="bg-gray-100 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Your Clip Preview</h3>
            <span className="text-sm text-gray-500">{challenge.steps[currentStep].duration}s</span>
          </div>
          <div className="bg-gray-300 rounded-xl h-32 flex items-center justify-center mb-3">
            <span className="text-4xl">🎬</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onRetake}
              data-testid="button-retake"
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              🔄 Retake
            </button>
            <button 
              onClick={onContinue}
              data-testid="button-keep"
              className="flex-1 bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              ✓ Keep This
            </button>
          </div>
        </div>
        
        {/* Next Step */}
        <div className="space-y-4">
          {!isLastStep && nextStep && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {nextStep.id}
                </div>
                <span className="font-semibold">Next: {nextStep.title}</span>
              </div>
              <p className="text-sm text-gray-600">{nextStep.description} {nextStep.emoji}</p>
            </div>
          )}
          
          <button 
            onClick={onContinue}
            data-testid="button-continue"
            className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {isLastStep ? 'Review Final Video →' : 'Continue Recording →'}
          </button>
        </div>
      </div>
    </div>
  );
}
