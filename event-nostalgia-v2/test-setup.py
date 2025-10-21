#!/usr/bin/env python3
"""
Event Nostalgia v2 - Local Testing Script
This script helps you test the project setup and structure.
"""

import os
import json
import subprocess
import sys
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists and report status"""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path}")
        return False

def check_directory_structure():
    """Check if all required directories and files exist"""
    print("🔍 Checking Project Structure...")
    print("=" * 50)
    
    base_path = "/Users/logannitzsche/Documents/GitHub/Event-Nostalgia/event-nostalgia-v2"
    
    required_files = [
        ("package.json", "Package configuration"),
        ("vite.config.js", "Vite configuration"),
        ("tailwind.config.js", "Tailwind CSS config"),
        ("index.html", "Main HTML file"),
        ("src/main.jsx", "React entry point"),
        ("src/App.jsx", "Main App component"),
        ("src/index.css", "Global styles"),
        ("database-setup.sql", "Database schema"),
        (".env.example", "Environment template"),
        ("README.md", "Documentation"),
        (".github/workflows/deploy.yml", "GitHub Actions"),
    ]
    
    required_dirs = [
        ("src/components", "UI Components"),
        ("src/pages", "Page Components"), 
        ("src/services", "API Services"),
        ("src/contexts", "React Contexts"),
    ]
    
    all_good = True
    
    for file_path, description in required_files:
        full_path = os.path.join(base_path, file_path)
        if not check_file_exists(full_path, description):
            all_good = False
    
    print("\n📁 Checking Directories...")
    for dir_path, description in required_dirs:
        full_path = os.path.join(base_path, dir_path)
        if not check_file_exists(full_path, description):
            all_good = False
    
    return all_good

def check_package_json():
    """Verify package.json has correct dependencies"""
    print("\n📦 Checking Package Dependencies...")
    print("=" * 50)
    
    package_path = "/Users/logannitzsche/Documents/GitHub/Event-Nostalgia/event-nostalgia-v2/package.json"
    
    try:
        with open(package_path, 'r') as f:
            package_data = json.load(f)
        
        required_deps = [
            "react", "react-dom", "react-router-dom",
            "@supabase/supabase-js", "lucide-react", 
            "date-fns", "react-hot-toast"
        ]
        
        required_dev_deps = [
            "@vitejs/plugin-react", "tailwindcss", 
            "autoprefixer", "postcss", "vite"
        ]
        
        deps = package_data.get("dependencies", {})
        dev_deps = package_data.get("devDependencies", {})
        
        print("Dependencies:")
        for dep in required_deps:
            if dep in deps:
                print(f"✅ {dep}: {deps[dep]}")
            else:
                print(f"❌ Missing: {dep}")
        
        print("\nDev Dependencies:")
        for dep in required_dev_deps:
            if dep in dev_deps:
                print(f"✅ {dep}: {dev_deps[dep]}")
            else:
                print(f"❌ Missing: {dep}")
        
        return True
    except Exception as e:
        print(f"❌ Error reading package.json: {e}")
        return False

def check_component_structure():
    """Check if all React components exist"""
    print("\n⚛️  Checking React Components...")
    print("=" * 50)
    
    base_path = "/Users/logannitzsche/Documents/GitHub/Event-Nostalgia/event-nostalgia-v2/src"
    
    components = [
        "components/EventCard.jsx",
        "components/SearchBar.jsx", 
        "components/Navbar.jsx",
        "components/LoadingSpinner.jsx",
        "components/SnakeGame.jsx",
    ]
    
    pages = [
        "pages/HomePage.jsx",
        "pages/LoginPage.jsx",
        "pages/SignUpPage.jsx", 
        "pages/DashboardPage.jsx",
        "pages/SearchPage.jsx",
        "pages/AdminPage.jsx",
        "pages/ProfilePage.jsx",
    ]
    
    services = [
        "services/supabase.js",
        "services/eventApi.js",
    ]
    
    contexts = [
        "contexts/AuthContext.jsx",
    ]
    
    all_components = [
        ("Components", components),
        ("Pages", pages),
        ("Services", services), 
        ("Contexts", contexts)
    ]
    
    all_good = True
    
    for category, items in all_components:
        print(f"\n{category}:")
        for item in items:
            full_path = os.path.join(base_path, item)
            if not check_file_exists(full_path, os.path.basename(item)):
                all_good = False
    
    return all_good

def show_testing_instructions():
    """Show instructions for testing the application"""
    print("\n🧪 Testing Instructions")
    print("=" * 50)
    
    print("""
To test Event Nostalgia v2, you have several options:

1. 📱 LOCAL TESTING (Recommended):
   
   # Fix Node.js version issue first:
   brew uninstall node
   brew install node@18
   
   # Then install and run:
   cd event-nostalgia-v2
   npm install
   npm run dev
   
   # Visit: http://localhost:5173

2. 🔧 ENVIRONMENT SETUP:
   
   # Copy environment template:
   cp .env.example .env
   
   # Edit .env with your credentials:
   # - Get Supabase keys from: https://app.supabase.com
   # - Get Ticketmaster API from: https://developer.ticketmaster.com
   
3. 🗄️  DATABASE SETUP:
   
   # In Supabase SQL Editor, run:
   # - Copy entire database-setup.sql contents
   # - Paste and execute in Supabase dashboard
   
4. 🎯 TESTING FEATURES:
   
   Without API keys (Demo Mode):
   ✅ User interface and navigation  
   ✅ Mock event search
   ✅ UI components and styling
   ✅ Snake game easter egg
   ❌ Real event data
   ❌ User authentication
   
   With API keys (Full Mode):
   ✅ Everything above PLUS:
   ✅ Real Ticketmaster event search
   ✅ User registration/login
   ✅ Personal event collection
   ✅ Admin dashboard (if admin user)

5. 🚀 DEPLOYMENT TESTING:
   
   # Deploy to GitHub Pages:
   # 1. Fork repository
   # 2. Enable GitHub Pages
   # 3. Add secrets to repository
   # 4. Push to main branch
   
   # Or deploy manually:
   npm run build
   npm run deploy

6. 📱 MOBILE TESTING:
   
   # Test responsive design:
   # - Chrome DevTools mobile view
   # - Actual mobile devices
   # - Different screen sizes
""")

def show_troubleshooting():
    """Show common troubleshooting steps"""
    print("\n🛠️  Troubleshooting")
    print("=" * 50)
    
    print("""
Common Issues & Solutions:

1. Node.js Version Issues:
   # Install Node.js 18 (LTS):
   brew uninstall node
   brew install node@18
   # Or use nvm:
   nvm install 18
   nvm use 18

2. Permission Errors:
   # Clear npm cache:
   npm cache clean --force
   # Use npx instead:
   npx vite

3. Port Already in Use:
   # Kill process on port 5173:
   lsof -ti:5173 | xargs kill -9
   # Or use different port:
   npm run dev -- --port 3000

4. Environment Variables Not Loading:
   # Check .env file location (project root)
   # Ensure variables start with VITE_
   # Restart dev server after changes

5. Database Connection Issues:
   # Verify Supabase URL and key
   # Check RLS policies are enabled
   # Ensure database schema is created

6. API Rate Limits:
   # Ticketmaster: 5,000 requests/day
   # Use demo mode for development
   # Cache responses when possible

7. Build/Deploy Issues:
   # Check GitHub Actions logs
   # Verify repository secrets
   # Ensure base path in vite.config.js matches repo name
""")

def main():
    """Main testing function"""
    print("🎉 Event Nostalgia v2 - Testing Suite")
    print("=" * 50)
    
    # Run all checks
    structure_ok = check_directory_structure()
    package_ok = check_package_json() 
    components_ok = check_component_structure()
    
    print("\n📊 Test Summary")
    print("=" * 50)
    
    if structure_ok and package_ok and components_ok:
        print("✅ All tests passed! Project structure is correct.")
        print("🚀 Ready to run: npm install && npm run dev")
    else:
        print("❌ Some tests failed. Check the output above.")
    
    show_testing_instructions()
    show_troubleshooting()

if __name__ == "__main__":
    main()