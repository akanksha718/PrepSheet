# PrepSheet

A modern, interactive LeetCode preparation tracker with an integrated opportunities board for BTech CSE students. Organize your coding practice with a hierarchical structure and discover jobs, internships, and hackathons—all in one place.

![PrepSheet](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple?logo=vite)
![Zustand](https://img.shields.io/badge/Zustand-5.0.11-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-cyan?logo=tailwindcss)

## ✨ Features

### 📚 Question Management
- **Three-Level Hierarchy**: Organize questions with Topics → Subtopics → Questions structure
- **Inline Editing**: Edit titles directly with keyboard shortcuts (Enter to save, Escape to cancel)
- **Drag & Drop**: Reorder topics, subtopics, and questions with smooth animations
- **LeetCode Integration**: Automatically generates LeetCode problem URLs from question titles
- **Local Persistence**: All your data is saved locally in your browser

### 💼 Opportunities Board
- **Real-Time Job Listings**: Fetches remote tech jobs from Remotive API
- **Internship Opportunities**: Curated internships from top companies
- **Hackathon Calendar**: Stay updated on upcoming coding competitions
- **Advanced Filtering**: Filter by type (all/internship/job/hackathon) and search by keywords
- **Direct Apply**: One-click application links to external platforms

### 🎨 User Experience
- **Light & Dark Theme**: Toggle between themes for comfortable viewing
- **Fully Responsive**: Mobile-first design that works on all devices
- **Clean UI**: Modern design with smooth transitions and hover effects
- **Keyboard Navigation**: Full keyboard support for efficient workflow

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PrepSheet
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library with Hooks
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework

### State Management
- **Zustand 5.0.11** - Lightweight state management with localStorage persistence

### Drag & Drop
- **@dnd-kit/core 6.3.1** - Modern drag-and-drop toolkit
- **@dnd-kit/sortable 10.0.0** - Sortable preset for list reordering
- **@dnd-kit/utilities 3.2.2** - Utility functions for transforms

### UI Components
- **lucide-react 0.563.0** - Beautiful icon library
- **nanoid 5.1.6** - Unique ID generator

### External APIs
- **Remotive API** - Remote job listings for software developers

## 📁 Project Structure

```
PrepSheet/
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.jsx           # Top navigation bar
│   │   │   ├── QuestionCard.jsx     # Topic card with drag handle
│   │   │   ├── Questions.jsx        # Main question list view
│   │   │   └── ProgressPanel.jsx    # Opportunities board
│   │   ├── context/         # React Context
│   │   │   └── Theme.jsx            # Theme provider (light/dark)
│   │   ├── pages/           # Page components
│   │   │   └── Question.jsx         # Main page layout
│   │   ├── store/           # State management
│   │   │   └── sheetStore.jsx       # Zustand store
│   │   ├── App.jsx          # Root component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── eslint.config.js     # ESLint configuration
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Dependencies
├── README.md                # You are here!
└── todo.md                  # Development tasks
```

## 🎯 Usage Guide

### Managing Topics
1. **Add Topic**: Click "Add New Topic" button
2. **Edit Topic**: Double-click on topic title or click edit icon
3. **Delete Topic**: Click delete icon (⚠️ deletes all subtopics/questions)
4. **Reorder Topics**: Drag topics using the grip handle

### Managing Subtopics & Questions
1. **Expand Topic**: Click on a topic card to view subtopics
2. **Add Subtopic**: Click "Add New Subtopic" inside a topic
3. **Add Question**: Enter question number and title, then click "Add Question"
4. **Edit/Delete**: Use inline controls for each item
5. **Reorder**: Drag and drop subtopics or questions to rearrange

### Using Opportunities Board
1. **Browse**: Scroll through job/internship/hackathon listings
2. **Filter**: Click filter buttons (All, Internship, Job, Hackathon)
3. **Search**: Use search bar to find specific opportunities
4. **Apply**: Click "Apply Now" to open the application page
5. **Refresh**: Click refresh button to fetch latest opportunities

### Keyboard Shortcuts
- **Enter** - Save inline edit
- **Escape** - Cancel inline edit
- **Space** - Activate drag handle (accessibility)

## 🔧 Configuration

### Theme Customization
Edit [src/context/Theme.jsx](frontend/src/context/Theme.jsx) to customize theme colors and behavior.

### Adding More APIs
Edit [src/components/ProgressPanel.jsx](frontend/src/components/ProgressPanel.jsx) `fetchOpportunities()` function to integrate additional job/internship APIs.

### Storage Key
The app uses localStorage with key `"prep-sheet-storage"`. Change this in [src/store/sheetStore.jsx](frontend/src/store/sheetStore.jsx) if needed.

## 🌐 API Integration

### Remotive API
- **Endpoint**: `https://remotive.com/api/remote-jobs?category=software-dev&limit=20`
- **Rate Limit**: No authentication required, reasonable rate limits
- **Data**: Remote software development jobs with descriptions, company info, and apply links

### Adding Custom APIs
```javascript
// In ProgressPanel.jsx
const fetchCustomAPI = async () => {
  const response = await fetch('YOUR_API_URL');
  const data = await response.json();
  return data.map(item => ({
    id: item.id,
    title: item.title,
    company: item.company,
    type: 'job', // or 'internship', 'hackathon'
    location: item.location,
    description: item.description,
    url: item.url,
    date: item.date,
    tags: item.tags
  }));
};
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (single column, stacked layout)
- **Tablet**: 640px - 1024px (optimized spacing)
- **Desktop**: > 1024px (two-column grid layout)

