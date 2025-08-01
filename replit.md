# Overview

RoomReel Challenge is a mobile-first React web application that allows students to record guided video content about their housing experience. The app gamifies content creation through step-by-step challenges, rewarding users with points and prizes for completing video recording tasks. Students can select from predefined challenges (like room tours or day-in-life documentation), record multiple short video clips following prompts, and receive randomized rewards upon completion.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Component-based SPA using modern React patterns with hooks and context
- **Vite Build System**: Fast development server with hot module replacement and optimized production builds
- **Wouter Router**: Lightweight client-side routing for single-page navigation
- **Tailwind CSS + shadcn/ui**: Utility-first styling with a comprehensive component library for consistent UI
- **TanStack Query**: Server state management for API calls, caching, and background updates

## Component Structure
- **Screen-based Architecture**: Main screens (Welcome, Setup, Camera, Review, Reward, Success) handle different phases of the challenge flow
- **Specialized Components**: CameraInterface manages WebRTC video recording, RewardWheel handles gamification
- **Custom Hooks**: useCamera for WebRTC access, useMediaRecorder for video capture, and standard UI hooks for interactions

## State Management
- **Local State**: React useState for component-level state (current step, recording status, clips)
- **Server State**: TanStack Query for API data fetching and caching
- **No Global State**: Simple prop drilling and context for shared data

## Mobile-First Design
- **WebRTC Integration**: Native browser camera access with fallback support for various devices
- **Responsive UI**: Mobile-optimized interface with touch-friendly controls and animations
- **Progressive Enhancement**: Graceful degradation for devices with limited camera capabilities

## Backend Architecture
- **Express.js Server**: RESTful API with middleware for logging, error handling, and request processing
- **In-Memory Storage**: MemStorage class simulates database operations for challenges, submissions, and rewards
- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions for future database integration
- **File Structure**: Clean separation between server routes, storage layer, and business logic

## API Design
- **REST Endpoints**: Standard CRUD operations for challenges (`/api/challenges`), submissions (`/api/submissions`)
- **JSON Communication**: All data exchange via JSON with proper error handling and status codes
- **Session Management**: Prepared for user authentication with session storage configuration

## Data Models
- **Challenges**: Structured as multi-step processes with defined prompts, durations, and point values
- **Video Clips**: Metadata tracking for recorded segments without actual video storage
- **Rewards System**: Randomized prize generation with different reward types (gift cards, subscriptions, cash)
- **User Submissions**: Links user attempts to completed challenges with point tracking

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, React DOM, and development tools
- **Vite**: Build tool with plugins for React, error overlays, and Replit integration
- **Wouter**: Lightweight routing library for client-side navigation

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Radix UI**: Headless component primitives for accessibility and interaction patterns
- **shadcn/ui**: Pre-built component library built on Radix UI primitives
- **Lucide React**: Icon library for consistent iconography

## Backend Infrastructure
- **Express.js**: Web application framework for Node.js
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support
- **Neon Database**: Serverless PostgreSQL database service via `@neondatabase/serverless`

## Development and Build Tools
- **TypeScript**: Static type checking with strict configuration
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution engine for development server
- **Various Build Plugins**: PostCSS, Autoprefixer, and Replit-specific development tools

## Media and Recording
- **Native WebRTC**: Browser-based camera and microphone access
- **MediaRecorder API**: Built-in browser video recording capabilities
- **No External Video Processing**: Relies on browser capabilities for media handling

## Form and Data Handling
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema validation
- **TanStack Query**: Server state management and caching layer
- **Date-fns**: Date manipulation and formatting utilities