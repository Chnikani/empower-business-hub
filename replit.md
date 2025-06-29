# Business OS - All-in-One Business Management Platform

## Overview

Business OS is a comprehensive business management platform built with React, TypeScript, and Node.js. It provides a suite of integrated tools including CRM, accounting, team collaboration, creative studio with AI image generation, and more. The application features a modern, responsive design with dark/light theme support and uses Supabase for backend services.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for authentication and business management
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Edge Functions**: Supabase Functions for serverless operations

### Key Technologies
- **TypeScript**: Full type safety across frontend and backend
- **Drizzle**: Type-safe database operations with schema validation
- **Zod**: Runtime type validation and schema generation
- **shadcn/ui**: Modern, accessible UI components
- **Radix UI**: Headless UI primitives for complex components

## Key Components

### Authentication System
- Multi-tenant authentication with Supabase
- Business account selection and management
- Role-based access control (business_owner, business_manager)
- Secure session management

### Business Management
- Multi-business support for users
- Business creation and switching
- Role-based permissions within businesses

### Core Modules
1. **Dashboard**: Business metrics and analytics with charts
2. **CRM**: Customer relationship management with contact tracking
3. **Accounting**: Financial management and transaction tracking
4. **Knowledge Base**: Document management and team wiki
5. **Creative Studio**: AI-powered image generation using OpenAI DALL-E
6. **Team Chat**: Real-time messaging with group management
7. **Website Builder**: Basic website creation tools
8. **Marketing**: Campaign management (planned)
9. **E-Signatures**: Document signing workflows (planned)
10. **Retail**: E-commerce and inventory management (planned)

### Real-time Features
- Live chat messaging with typing indicators
- Real-time collaboration features
- WebSocket connections for instant updates

## Data Flow

### Authentication Flow
1. User signs up/in through Supabase Auth
2. Business context is established based on user's business associations
3. Role-based permissions determine feature access
4. Session management handles automatic token refresh

### Business Data Flow
1. All data is scoped to the current business context
2. API calls include business_id for data isolation
3. Real-time subscriptions are filtered by business membership
4. User can switch between multiple businesses

### Image Generation Flow
1. User submits prompt and style preferences
2. Request is sent to Supabase Edge Function
3. Edge Function calls OpenAI DALL-E API
4. Generated image is stored in Supabase Storage
5. Image metadata is saved to PostgreSQL
6. Image is displayed in the Creative Studio gallery

## External Dependencies

### Core Services
- **Supabase**: Authentication, database, storage, and edge functions
- **OpenAI**: DALL-E API for AI image generation
- **Neon**: Serverless PostgreSQL database hosting

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Fast TypeScript compilation for production
- **PostCSS**: CSS processing with Tailwind
- **Recharts**: Chart components for dashboard analytics

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **date-fns**: Date manipulation utilities
- **React Hook Form**: Form validation and management

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server for backend API
- TypeScript compilation in watch mode
- Database migrations via Drizzle Kit

### Production Build
1. Frontend: Vite builds optimized React bundle
2. Backend: ESBuild compiles TypeScript to ESM
3. Static files served from Express
4. Database schema pushed via Drizzle migrations

### Environment Configuration
- **Development**: Local development with remote Supabase/Neon
- **Production**: Node.js server with optimized builds
- **Database**: Managed PostgreSQL via Neon with connection pooling

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `OPENAI_API_KEY`: OpenAI API key for image generation

## Changelog
```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```