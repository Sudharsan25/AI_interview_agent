# AI Interview Agent

An AI-powered interview practice platform that provides realistic, voice-driven
technical interviews tailored to specific job roles, tech stacks, and experience
levels.

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Avatar, Dialog, Label, Select, Separator, Slot, Tooltip
- **Lucide React** - Icon library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **next-themes** - Dark mode support

### Backend & APIs

- **Next.js API Routes** - Serverless API endpoints
- **Better Auth** - Authentication system
- **Google Gemini AI (gemini-2.5-flash)** - Question generation via
  `@ai-sdk/google`
- **Deepgram SDK** - Real-time speech-to-text transcription
- **AWS Polly** - Text-to-speech synthesis (neural voices)
- **Vercel Analytics** - Analytics tracking

### Database & ORM

- **PostgreSQL** - Relational database (via Xata)
- **Drizzle ORM** - Type-safe SQL query builder
- **Xata** - Serverless database platform

### Development Tools

- **Drizzle Kit** - Database migrations and schema management
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development

## 📄 Pages

### Authentication Pages

- **`/sign-in`** (`app/(auth)/sign-in/page.tsx`) - User login page
- **`/sign-up`** (`app/(auth)/sign-up/page.tsx`) - User registration page

### Main Application Pages

- **`/home`** (`app/(root)/home/page.tsx`) - Dashboard showing all user
  interviews with hero section and interview cards
- **`/interview/create`** (`app/(root)/interview/create/page.tsx`) - Interview
  creation form to set up new interview sessions
- **`/interview/upcoming`** (`app/(root)/interview/upcoming/page.tsx`) - List of
  upcoming/incomplete interviews
- **`/interview-start/[id]`** (`app/(root)/interview-start/[id]/page.tsx`) -
  Dynamic interview session page where users conduct voice-based interviews

### Route Configuration

- Root route (`/`) redirects to `/home`

## 🔌 API Endpoints

### Authentication API

- **`/api/auth/[...all]`** (`app/api/auth/[...all]/route.ts`)
  - Handles all authentication requests (login, signup, logout, session
    management)
  - Uses Better Auth with catch-all route handler

### Interview APIs

- **`POST /api/interview/generate`** (`app/api/interview/generate/route.ts`)

  - Generates interview questions using Google Gemini AI
  - Creates interview record and associated questions in database
  - Accepts: role, level, type, techstack, length, jobDesc, companyDetails,
    specialization, resumeDetails
  - Returns: interviewId

- **`GET /api/interview/[id]`** (`app/api/interview/[id]/route.ts`)

  - Fetches questions for a specific interview by ID
  - Returns: Array of questions

- **`POST /api/interview/[id]/process`**
  (`app/api/interview/[id]/process/route.ts`)

  - Processes interview audio responses
  - Transcribes audio using Deepgram
  - TODO: Complete transcript-based feedback logic to be implemented (will
    include transcript storage, analysis, and comprehensive interview
    evaluation)

- **`GET /api/interview/user-interview`**
  (`app/api/interview/user-interview/route.ts`)

  - Fetches all interviews for the authenticated user
  - Returns: Array of user's interviews

- **`GET /api/interview/upcoming`** (`app/api/interview/upcoming/route.ts`)
  - Fetches upcoming/incomplete interviews for the authenticated user
  - Returns: Array of incomplete interviews

### Audio & Speech APIs

- **`GET /api/deepgram`** (`app/api/deepgram/route.ts`)

  - Returns Deepgram API key for client-side speech recognition

- **`POST /api/tts`** (`app/api/tts/route.ts`)
  - Converts text to speech using AWS Polly
  - Accepts: text
  - Returns: MP3 audio stream

## 🗄️ Database Models

### User Management

- **`user`** - User accounts

  - `id` (text, PK)
  - `name` (text, required)
  - `email` (text, required, unique)
  - `emailVerified` (boolean, default: false)
  - `image` (text, optional)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

- **`session`** - User sessions

  - `id` (text, PK)
  - `expiresAt` (timestamp, required)
  - `token` (text, required, unique)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
  - `ipAddress` (text, optional)
  - `userAgent` (text, optional)
  - `userId` (text, FK → user.id, cascade delete)

- **`account`** - OAuth/authentication accounts

  - `id` (text, PK)
  - `accountId` (text, required)
  - `providerId` (text, required)
  - `userId` (text, FK → user.id, cascade delete)
  - `accessToken` (text, optional)
  - `refreshToken` (text, optional)
  - `idToken` (text, optional)
  - `accessTokenExpiresAt` (timestamp, optional)
  - `refreshTokenExpiresAt` (timestamp, optional)
  - `scope` (text, optional)
  - `password` (text, optional)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

- **`verification`** - Email verification tokens
  - `id` (text, PK)
  - `identifier` (text, required)
  - `value` (text, required)
  - `expiresAt` (timestamp, required)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

### Interview Management

- **`interviews`** - Interview sessions

  - `id` (uuid, PK, auto-generated)
  - `userId` (text, FK → user.id, cascade delete, required)
  - `role` (text, required) - Job role (e.g., "Software Engineer")
  - `level` (text, required) - Experience level (e.g., "Senior", "Junior")
  - `type` (text, required) - Interview type preference (behavioral/technical)
  - `techstack` (text, required) - Technologies required
  - `length` (text, required) - Interview length (short: 5, mid: 8, long: 10
    questions)
  - `jobDesc` (text, required) - Job description details
  - `companyDetails` (text, optional) - Company information
  - `specialization` (text, optional) - Specialized area
  - `resumeDetails` (text, optional) - Candidate resume information
  - `completed` (boolean, default: false)
  - `createdAt` (timestamp, auto-generated)

- **`questions`** - Interview questions
  - `id` (uuid, PK, auto-generated)
  - `interviewId` (uuid, FK → interviews.id, cascade delete, required)
  - `questionText` (text, required)

### Future Implementation

- **Transcripts & Feedback** - Complete transcript-based feedback system to be
  implemented
  - Will include transcript storage, analysis, and comprehensive interview
    evaluation

## 🎯 Key Features

1. **AI-Powered Question Generation** - Uses Google Gemini to generate
   customized interview questions based on job role, level, tech stack, and job
   description

2. **Voice-Based Interviews** - Conduct interviews using voice interaction with:

   - Real-time speech recognition (Deepgram)
   - Text-to-speech for questions (AWS Polly)
   - Audio recording capabilities

3. **Customizable Interview Setup** - Configure interviews with:

   - Job role and experience level
   - Tech stack requirements
   - Interview length (5, 8, or 10 questions)
   - Behavioral vs. technical focus
   - Company details and specialization
   - Resume-based personalization

4. **Interview Management** - Track and manage interview sessions:

   - View all interviews
   - Filter upcoming/incomplete interviews
   - Mark interviews as completed

5. **Audio Transcription** - Process interview audio responses:

   - Transcribe responses with Deepgram
   - TODO: Complete transcript-based feedback system with analysis and
     evaluation (to be implemented)

6. **User Authentication** - Secure authentication system with Better Auth
   supporting:
   - Email/password authentication
   - OAuth providers (via account table)
   - Session management
   - Email verification

## 🛠️ Development

### Prerequisites

- Node.js 20+
- PostgreSQL database (via Xata or self-hosted)
- Environment variables configured (see `.env.example` if available)

### Installation

```bash
npm install
```

### Environment Variables

Required environment variables:

- `XATA_DATABASE_URL` - PostgreSQL connection string
- `DEEPGRAM_API_KEY` - Deepgram API key for speech recognition
- `AWS_ACCESS_KEY_ID` - AWS access key for Polly
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for Polly
- Better Auth configuration variables

### Running the Application

```bash
# Development mode with Turbopack
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

### Database Migrations

```bash
# Generate migrations
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push
```

## 📁 Project Structure

The project follows an enterprise Next.js 15 architecture with clear separation
of concerns:

```
ai_interview_agent/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication route group
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/                  # Protected route group
│   │   ├── home/                # Dashboard page
│   │   ├── interview/
│   │   │   ├── create/          # Interview creation
│   │   │   └── upcoming/       # Upcoming interviews
│   │   └── interview-start/[id]/ # Interview session
│   └── api/                     # API routes
│       ├── auth/
│       ├── interview/
│       ├── deepgram/
│       └── tts/
├── components/
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   ├── features/                # Feature-specific components
│   │   ├── auth/
│   │   ├── interview/
│   │   └── shared/
│   └── layouts/                 # Layout components (Navbar, ContentWrapper)
├── lib/
│   ├── api/                     # API client with error handling
│   ├── config/                  # Configuration (auth, database)
│   ├── errors.ts                # Custom error classes
│   ├── services/                # Business logic layer
│   ├── utils/                   # Utility functions
│   └── validation/              # Zod validation schemas
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
├── actions/                     # Server actions
└── constants/                   # Application constants
```

### Key Architectural Patterns

- **Service Layer**: Business logic separated from components
  (`/lib/services/*`)
- **Custom Hooks**: Reusable component logic (`/hooks/*`)
- **Server Actions**: Server-side mutations (`/actions/*`)
- **Type Safety**: Comprehensive TypeScript types (`/types/*`)
- **Error Handling**: Custom error classes with consistent API error responses
  (`/lib/errors.ts`)
- **API Client**: Centralized fetch wrapper with type safety
  (`/lib/api/client.ts`)
- **Validation**: Zod schemas for form and API validation (`/lib/validation/*`)

## 📝 Notes

- The application uses Xata as the database provider, which provides a
  serverless PostgreSQL instance
- Interview questions are generated using Google's Gemini 2.5 Flash model
- Complete transcript-based feedback logic is planned for future implementation
  (transcription currently works but feedback analysis and storage are pending)
- Heavy components (audio features) are dynamically imported for performance
  optimization
- Mobile-responsive design with touch-friendly controls (minimum 44px touch
  targets)
