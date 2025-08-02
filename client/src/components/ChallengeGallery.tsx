import { Challenge } from "@/types";

interface ChallengeGalleryProps {
  challenges: Challenge[];
  onChallengeSelect: (challengeId: string) => void;
}

export default function ChallengeGallery({ challenges, onChallengeSelect }: ChallengeGalleryProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-16 text-white text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
          <span className="text-2xl">🎬</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 leading-tight max-w-md mx-auto">Turn Your Student Life into a Reel Challenge</h1>
        <p className="text-lg opacity-90 max-w-sm mx-auto">Show what it's really like living here — win perks while you're at it.</p>
      </div>

      {/* Urgency Banner */}
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-8 rounded-r-lg">
        <div className="flex items-center">
          <div className="text-red-400 text-xl mr-3">🚨</div>
          <div>
            <div className="text-red-800 font-semibold text-sm">Only 5 days left to complete your challenges!</div>
            <div className="text-red-600 text-xs">Claim exclusive rewards before time runs out</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12">
        {/* Challenge Selection */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Pick Your Challenge</h2>
            <p className="text-gray-600">Tap any challenge below to start recording</p>
          </div>
          
          <div className="space-y-6 max-w-md mx-auto">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => onChallengeSelect(challenge.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                      {challenge.name.includes('Room') ? '🛏️' : challenge.name.includes('Day') ? '🎒' : challenge.name.includes('Flatmates') ? '💬' : challenge.name.includes('Neighborhood') ? '🍜' : '🏠'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{challenge.name}</h3>
                      <p className="text-sm text-gray-600">{challenge.tagline}</p>
                    </div>
                  </div>
                  <div className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer">
                    START
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>🎮 {challenge.maxPrompts || 5} scenes</span>
                    <span>⏱️ ~2 min</span>
                  </div>
                  <div className="text-blue-600 font-semibold">
                    ⭐ {challenge.pointsPerStep * (challenge.maxPrompts || 5)} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-12 text-center border border-yellow-200">
          <div className="text-4xl mb-4">🎁</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Every reel gets a spin!</h3>
          <p className="text-gray-600 mb-6">Win perks from your favourite brands</p>
          <div className="flex justify-center space-x-3">
            <span className="border-2 border-orange-300 text-orange-600 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer">☕ Starbucks</span>
            <span className="border-2 border-blue-300 text-blue-600 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer">💪 Gym Pass</span>
            <span className="border-2 border-green-300 text-green-600 hover:bg-green-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer">🎧 Spotify</span>
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Latest Reels from Your Area</h3>
          <p className="text-sm text-gray-600 mb-4">See what other students are sharing</p>
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="aspect-square bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-2xl">🎬</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}