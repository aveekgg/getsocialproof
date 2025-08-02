interface NavbarProps {
  user: { username: string; email: string } | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🎬</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">RoomReel</h1>
            <p className="text-xs text-gray-500">Student Stories</p>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-gray-800">@{user.username}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>

          {/* User Avatar */}
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="border-2 border-gray-300 text-gray-600 hover:bg-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}