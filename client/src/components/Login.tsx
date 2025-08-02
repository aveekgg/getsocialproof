import { useState } from "react";

interface LoginProps {
  onLogin: (user: { username: string; email: string }) => void;
  selectedChallenge?: { name: string; tagline?: string } | null;
}

export default function Login({ onLogin, selectedChallenge }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login - in real app, this would call an API
    onLogin({
      username: formData.username || formData.email.split('@')[0],
      email: formData.email
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl text-white text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">🎬</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {selectedChallenge ? 'Ready to Start?' : 'Welcome to RoomReel'}
          </h1>
          <p className="text-white/90 text-sm">
            {selectedChallenge 
              ? `Sign in to start "${selectedChallenge.name}" challenge` 
              : 'Join the student community and start creating!'
            }
          </p>
        </div>

        <div className="p-6">
          {/* Challenge Context */}
          {selectedChallenge && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🎬</div>
                <h3 className="text-gray-800 font-bold text-lg">{selectedChallenge.name}</h3>
                {selectedChallenge.tagline && (
                  <p className="text-gray-600 text-sm">{selectedChallenge.tagline}</p>
                )}
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="mb-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-gray-600 text-sm">
                {selectedChallenge 
                  ? (isSignUp ? 'Create account to start recording' : 'Sign in to start your challenge')
                  : (isSignUp ? 'Join thousands of students sharing their stories' : 'Welcome back! Ready to create more reels?')
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Choose a username"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="your.email@university.edu"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                {isSignUp ? '🚀 Create Account' : '🎬 Start Creating'}
              </button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center mt-6">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-300"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            {/* Quick Login for Demo */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => onLogin({ username: 'demo_user', email: 'demo@student.com' })}
                className="w-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                ⚡ Quick Demo Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}