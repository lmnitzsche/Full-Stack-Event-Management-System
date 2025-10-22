# Event Nostalgia

**Full-Stack Event Management Application with Real-Time API Integration**

Event Nostalgia is a modern, production-ready web application that enables users to discover, track, and rate live events. Built with React and Supabase, it demonstrates enterprise-level full-stack development practices including secure authentication, database design, external API integration, and automated deployment.

## Live Application

**Production URL:** https://logannitzsche.com/event-tracker-crud/

## Core Features

**Event Discovery & Management**
- Real-time event search integration with Ticketmaster Discovery API
- Personal event collection with CRUD operations
- Advanced filtering and sorting capabilities
- Rating system with data persistence

**User Management System**
- Secure user authentication and authorization
- Role-based access control (User/Admin roles)
- Profile management with password reset functionality
- Row-level security implementation

**Administrative Dashboard**
- User management interface for administrators
- System analytics and reporting
- Event moderation capabilities
- Database administration tools

**Modern User Experience**
- Responsive design supporting all device types
- Progressive web application features
- Real-time notifications and feedback
- Glassmorphism UI design with Tailwind CSS

## Technology Stack

**Frontend Technologies**
- React 18 with modern hooks and functional components
- Vite for optimized build process and development experience
- Tailwind CSS for utility-first styling and responsive design
- React Router for client-side navigation
- Lucide React for consistent iconography

**Backend & Database**
- Supabase as Backend-as-a-Service (PostgreSQL database)
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live data updates
- Supabase Auth for secure user management

**External Integrations**
- Ticketmaster Discovery API for live event data
- RESTful API consumption with error handling
- Rate limiting and caching strategies

**DevOps & Deployment**
- GitHub Actions for CI/CD pipeline
- Automated testing and deployment to GitHub Pages
- Environment variable management for secure configuration
- Build optimization and asset bundling

## Architecture & Development Practices

**Database Design**
- Normalized PostgreSQL schema with proper relationships
- Optimized queries and indexing strategies
- Data integrity constraints and validation

**Security Implementation**
- Input sanitization and XSS prevention
- SQL injection protection through parameterized queries
- CSRF protection via secure authentication tokens
- Role-based permissions system

**Code Quality Standards**
- Modular component architecture with separation of concerns
- Custom hooks for reusable logic
- Context API for state management
- Error boundary implementation for graceful error handling

## Technical Requirements

**Development Environment**
- Node.js 16+ with npm package manager
- Git version control system
- Modern web browser with developer tools

**External Services**
- Supabase account for backend services
- Ticketmaster Developer API access
- GitHub repository for version control and deployment

## Installation & Setup

**1. Repository Setup**
```bash
git clone https://github.com/lmnitzsche/event-tracker-crud.git
cd event-tracker-crud
npm install
```

**2. Database Configuration**
- Create Supabase project at supabase.com
- Execute `database-setup.sql` in Supabase SQL Editor
- Configure Row Level Security policies
- Set up authentication providers

**3. API Integration Setup**
- Obtain Ticketmaster Discovery API credentials
- Configure rate limiting and error handling
- Set up environment variables for secure API access

**4. Environment Configuration**
```bash
# Create environment file
cp .env.example .env

# Configure required environment variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key
```

**5. Development Server**
```bash
npm run dev
# Application available at http://localhost:5173
```

## Production Deployment

**Automated CI/CD Pipeline**
The application uses GitHub Actions for continuous integration and deployment:

```yaml
# Automated workflow includes:
- Dependency installation and caching
- Build process with environment variable injection
- Asset optimization and bundling
- Automated deployment to GitHub Pages
```

**Deployment Configuration**
1. Configure GitHub repository secrets for environment variables
2. Enable GitHub Pages with Actions as deployment source
3. Automatic deployments trigger on main branch commits
4. Build artifacts optimized for production environment

**Production Environment**
- Static site hosting via GitHub Pages
- CDN distribution for global performance
- HTTPS encryption and security headers
- Optimized asset delivery and caching

## Project Architecture

**Frontend Structure**
```
src/
├── components/          # Reusable UI components with prop validation
├── pages/              # Route-based page components
├── contexts/           # React Context for state management
├── services/           # API integration and business logic
├── hooks/              # Custom React hooks for shared logic
└── utils/              # Helper functions and utilities
```

**Key Components**
- **Authentication System:** Secure user registration and login
- **Event Search Interface:** Real-time API integration with filtering
- **Personal Dashboard:** User-specific event management
- **Administrative Panel:** Role-based administrative functions
- **Responsive Navigation:** Mobile-first navigation system

**Database Schema**
- **Users Table:** Authentication and profile management
- **Events Table:** Event data with user associations
- **Profiles Table:** Extended user information
- **Admin Table:** Role-based permission system

## Development Highlights

**Frontend Development**
- Component-based architecture with reusable UI elements
- State management using React Context and custom hooks
- Responsive design implementation with mobile-first approach
- Form validation and user input handling
- Real-time data updates and notifications

**Backend Integration**
- RESTful API design patterns
- Database query optimization and indexing
- Authentication flow implementation
- File upload and media handling
- Error handling and logging systems

**Full-Stack Features**
- User authentication with secure session management
- Real-time data synchronization between client and server
- Role-based access control implementation
- External API integration with error handling
- Comprehensive CRUD operations across all entities

## Security Implementation

**Data Protection**
- Row Level Security (RLS) policies preventing unauthorized data access
- Input sanitization preventing XSS and injection attacks
- Secure authentication tokens with automatic expiration
- Environment variable protection for sensitive configuration

**Access Control**
- Role-based permission system with granular controls
- Admin privilege verification for administrative functions
- User session management with secure logout procedures
- API rate limiting to prevent abuse

**Database Security**
- Parameterized queries preventing SQL injection
- Encrypted data transmission between client and server
- Regular security audits and dependency updates
- Backup and recovery procedures

## Performance Optimization

**Frontend Optimization**
- Lazy loading for images and non-critical resources
- Component memoization for expensive operations
- Bundle splitting and code organization
- Browser caching strategies for static assets

**Backend Optimization**
- Database indexing for frequently queried fields
- Query optimization and connection pooling
- API response caching and pagination
- Real-time subscription management

**Production Performance**
- CDN delivery through GitHub Pages
- Asset compression and minification
- Progressive loading and skeleton states
- Mobile performance optimization

## Professional Development Practices

**Code Quality**
- ESLint and Prettier for consistent code formatting
- Component documentation and prop validation
- Error boundary implementation for graceful error handling
- Comprehensive logging and monitoring

**Testing Strategy**
- Unit testing for utility functions and components
- Integration testing for API endpoints
- User acceptance testing for critical user flows
- Performance testing and optimization

**Version Control**
- Git workflow with feature branches and pull requests
- Semantic versioning for release management
- Automated deployment pipeline with rollback capabilities
- Code review process for quality assurance

---

**Developed by Logan Nitzsche**

**Contact:** [LinkedIn](https://linkedin.com/in/logan-nitzsche) | [GitHub](https://github.com/lmnitzsche)

**Live Application:** https://logannitzsche.com/event-tracker-crud/