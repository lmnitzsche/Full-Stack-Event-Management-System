# Event Nostalgia v2 🎉

> **Modern Event Tracking with Real API Integration**

A completely rebuilt Event Nostalgia application using modern web technologies. Track and rate events you've attended with real data from the Ticketmaster Discovery API.

![Event Nostalgia Screenshot](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Event+Nostalgia+v2)

## ✨ Features

- 🔍 **Real Event Search** - Search thousands of real events via Ticketmaster API
- 📅 **Personal Event Collection** - Track concerts, sports, theater, and festivals you've attended
- ⭐ **Rating System** - Rate your experiences from 1-10 with personal notes
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS and glassmorphism
- 🔐 **Secure Authentication** - User accounts with Supabase Auth
- 📊 **Analytics Dashboard** - View your event statistics and favorites
- 🛡️ **Admin Panel** - Full CRUD capabilities for administrators
- 🐍 **Easter Egg** - Classic Snake game (click the 'S' in the logo!)
- 📱 **Mobile Responsive** - Works perfectly on all devices

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **APIs:** Ticketmaster Discovery API
- **Deployment:** GitHub Pages + GitHub Actions
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 16+ installed
- A Supabase account (free tier available)
- A Ticketmaster Developer account (free)
- Git installed

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/lmnitzsche/Event-Nostalgia.git
cd Event-Nostalgia/event-nostalgia-v2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Supabase Project (FREE)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings > API** and copy:
   - Project URL
   - Anon/Public key

### 4. Setup Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of `database-setup.sql`
3. Click **Run** to create all tables, policies, and functions

### 5. Get Ticketmaster API Key (FREE)

1. Go to [developer.ticketmaster.com](https://developer.ticketmaster.com/)
2. Create a free account
3. Create a new app to get your API key

### 6. Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key_here
   ```

### 7. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your application!

## 🚀 Deployment to GitHub Pages (FREE)

### Automatic Deployment

1. **Fork this repository** to your GitHub account

2. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Navigate to "Pages" 
   - Select "GitHub Actions" as the source

3. **Add Repository Secrets:**
   - Go to Settings > Secrets and variables > Actions
   - Add these repository secrets:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key
     ```

4. **Deploy:**
   - Push to the `main` branch or trigger the workflow manually
   - GitHub Actions will build and deploy automatically
   - Your site will be available at `https://yourusername.github.io/Event-Nostalgia/`

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 📁 Project Structure

```
event-nostalgia-v2/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── EventCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Navbar.jsx
│   │   └── SnakeGame.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── SearchPage.jsx
│   │   └── AdminPage.jsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx
│   ├── services/           # API services
│   │   ├── supabase.js
│   │   └── eventApi.js
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── .github/workflows/      # GitHub Actions
└── database-setup.sql      # Database schema
```

## 🎯 Usage

### For Users

1. **Sign Up/Login** - Create your account
2. **Search Events** - Find real events from Ticketmaster
3. **Add Events** - Add events you've attended with ratings
4. **View Dashboard** - See your collection and statistics
5. **Sort & Filter** - Organize by rating, date, or category

### For Admins

1. **User Management** - View all users, promote/demote admins
2. **Event Management** - View and moderate all events
3. **Analytics** - See platform-wide statistics

## 🔧 Configuration

### Database Security

The app uses Supabase Row Level Security (RLS) to ensure:
- Users can only see their own events
- Admins have elevated permissions
- Secure authentication flow

### API Rate Limits

- **Ticketmaster API:** 5,000 requests/day (free tier)
- **Supabase:** 50,000 monthly active users (free tier)

### Performance

- Lazy loading for images
- Pagination for search results
- Optimized database queries
- CDN delivery via GitHub Pages

## 🛡️ Security Features

- ✅ Row Level Security (RLS) policies
- ✅ SQL injection protection
- ✅ XSS prevention
- ✅ CSRF protection via Supabase
- ✅ Environment variable protection
- ✅ Admin role verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend-as-a-service
- [Ticketmaster](https://developer.ticketmaster.com) for the event data API
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vite](https://vitejs.dev) for the lightning-fast build tool

## 📞 Support

Need help? Here are your options:

1. **Check the Issues** - Look for existing solutions
2. **Create an Issue** - Report bugs or request features
3. **Documentation** - Review this README thoroughly
4. **Community** - Ask questions in discussions

---

**Made with ❤️ by Logan Nitzsche**

[Live Demo](https://eventnostalgia.com) • [Original Version](https://github.com/lmnitzsche/Event-Nostalgia) • [LinkedIn](https://linkedin.com/in/logan-nitzsche)