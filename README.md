# RoomReel Challenge

A mobile-first web application that gamifies content creation for UK university students. Students record guided video content about their housing experience through a 5-day challenge timeline system, earning randomized rewards upon completion.

## 🎯 Overview

RoomReel Challenge is essentially "TikTok meets student housing" - but with a structured, guided approach and real rewards. Students follow step-by-step prompts to create short video clips about their student accommodation, helping other students while earning amazing rewards.

## ✨ Key Features

### 📅 5-Day Challenge Timeline
- New challenges unlock daily over 5 days
- Each challenge has multiple guided steps (e.g., "Show your bed area", "Your study space")
- Points increase over time (25→40 points per step)
- Creates urgency and engagement through progressive unlocking

### 🎥 Guided Video Recording
- Step-by-step prompts with emojis for easy understanding
- Each step has a specific duration (4-6 seconds)
- Camera interface with countdown and recording controls
- Sketch overlay for positioning guidance
- WebRTC integration for native browser camera access

### 🎁 Reward System
- Randomized rewards upon challenge completion
- UK-relevant prizes: Costa Coffee cards, Spotify Premium, food vouchers, PayPal cash
- Weighted rarity system:
  - **Common (70%)**: £3 Costa Coffee, £5 Subway Voucher, £5 Amazon Credit
  - **Rare (25%)**: Spotify Premium (3 Months), £15 Domino's Voucher, Netflix (1 Month)
  - **Epic (5%)**: £50 PayPal Cash, £100 ASOS Voucher, Epic Student Bundle

### 📱 Mobile-First Design
- Touch-friendly interface optimized for phones
- Responsive design that works on all devices
- Progressive enhancement for devices with limited camera capabilities

## 🏗️ Technical Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** + **shadcn/ui** for consistent, beautiful UI
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **WebRTC** for native camera access

### Backend
- **Express.js** server with RESTful API
- **Drizzle ORM** with PostgreSQL schema (ready for database integration)
- **In-memory storage** for development (MemStorage class)
- **Zod** for runtime validation and type safety

### Data Models
- **Challenges**: Multi-step processes with prompts, durations, and point values
- **Video Clips**: Metadata tracking for recorded segments
- **Submissions**: Links user attempts to completed challenges
- **Rewards**: Weighted randomized prize generation system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RoomReelC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 📱 User Flow

1. **Welcome Screen** → View available challenges and rewards preview
2. **Challenge Setup** → Choose a challenge and see the guided steps
3. **Camera Interface** → Record each step with guided prompts and countdown
4. **Recording Complete** → Review clip and continue to next step
5. **Final Review** → Submit all completed clips
6. **Reward Wheel** → Spin for randomized rewards
7. **Success Screen** → Share results and start new challenges

## 🎯 Target Audience

UK university students aged 18-26 (undergraduate/postgraduate) who want to:
- Share authentic student life experiences
- Help other students understand housing options
- Earn rewards while creating content
- Participate in a structured, engaging challenge

## 🛠️ Development

### Project Structure
```
RoomReelC/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Route components
│   │   └── lib/          # Utilities and configurations
├── server/                # Express.js backend
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # Data storage layer
├── shared/               # Shared TypeScript types
└── package.json          # Dependencies and scripts
```

### Key Components

- **WelcomeScreen**: Landing page with challenge timeline
- **CameraInterface**: WebRTC video recording with guided prompts
- **ChallengeSetup**: Challenge selection and step overview
- **RewardWheel**: Gamified reward distribution
- **FinalReview**: Video submission and review

### API Endpoints

- `GET /api/challenges` - Fetch all available challenges
- `GET /api/challenges/:id` - Get specific challenge details
- `POST /api/submissions` - Submit completed challenge
- `GET /api/rewards/preview` - Get reward previews

## 🎨 Design Philosophy

- **Mobile-first**: Optimized for phone usage
- **Student-friendly**: British English, relatable language
- **Gamified**: Points, rewards, and timeline create engagement
- **Guided**: Structured approach makes content creation accessible
- **Authentic**: Encourages real, unscripted student experiences

## 🔮 Future Enhancements

- Video storage and cloud integration
- User authentication and profiles
- Social sharing features
- More challenge types and themes
- Advanced analytics and insights
- Community features and leaderboards

## 📄 License

MIT License - see LICENSE file for details

---

**RoomReel Challenge** - Where student life meets content creation! 🎬✨ 