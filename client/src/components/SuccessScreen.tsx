interface SuccessScreenProps {
  totalPoints: number;
  clipsCount: number;
  totalDuration: number;
  onStartNew: () => void;
  onShare: () => void;
}

export default function SuccessScreen({ 
  totalPoints, 
  clipsCount, 
  totalDuration, 
  onStartNew, 
  onShare 
}: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-green-400 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-white rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-white rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white">
        <div className="animate-bounce-in mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
            <span className="text-4xl">🏆</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Challenge Complete!</h1>
          <p className="text-lg opacity-90 mb-8 max-w-sm">Thanks for sharing your awesome room! Your RoomReel is now live and helping other students.</p>
        </div>
        
        {/* Final Stats */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 w-full max-w-sm">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold" data-testid="text-final-stats-points">{totalPoints}</div>
              <div className="text-sm opacity-90">Points Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold" data-testid="text-final-stats-clips">{clipsCount}</div>
              <div className="text-sm opacity-90">Clips Recorded</div>
            </div>
            <div>
              <div className="text-2xl font-bold" data-testid="text-final-stats-duration">{totalDuration}s</div>
              <div className="text-sm opacity-90">Total Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1</div>
              <div className="text-sm opacity-90">Reward Won</div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={onShare}
            data-testid="button-share-video"
            className="w-full bg-white text-accent py-3 px-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            📤 Share Your RoomReel
          </button>
          <button 
            onClick={onStartNew}
            data-testid="button-new-challenge"
            className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-2xl font-semibold border-2 border-white/30 hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
          >
            🎬 Try Another Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
