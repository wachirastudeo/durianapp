# Durian Orchard Management - Project Map

This document outlines the structure and key components of the Durian Orchard Management application.

## 📁 Directory Structure

```text
durianapp/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and styles
│   ├── hooks/
│   │   └── useStorage.js   # Custom hook for localStorage persistence
│   ├── pages/              # Main application pages
│   │   ├── HomePage.jsx        # Dashboard with weather and summary stats
│   │   ├── OrchardPage.jsx     # Plot and Tree management (CRUD)
│   │   ├── TreeRecordPage.jsx  # Detailed tree info and growth tracking
│   │   ├── WorkLogPage.jsx     # Activity logging (watering, fertilizing, etc.)
│   │   ├── TaskPlannerPage.jsx # Future task scheduling and calendar
│   │   ├── FinancePage.jsx     # Income and Expense records
│   │   ├── ReportPage.jsx      # Financial and production reports
│   │   └── SettingsPage.jsx    # User preferences and profile
│   ├── App.jsx             # Main router and navigation layout
│   ├── index.css           # Global styles and design system
│   └── main.jsx            # React entry point
├── PLAN.md                 # Project implementation plan
└── PROJECT_MAP.md          # This file
```

## 🛠 Core Functionalities

### 1. Data Persistence
- **Location:** `src/hooks/useStorage.js`
- **Logic:** Uses `localStorage` to save and retrieve state, ensuring user data is preserved between sessions.
- **Keys:** `durian_plots`, `durian_trees`, `durian_worklogs`, `durian_tasks`, `durian_finance`.

### 2. Orchard Management
- **Location:** `src/pages/OrchardPage.jsx`
- **Features:**
    - Create/Edit/Delete Orchard Plots.
    - View tree lists within each plot.
    - Add/Edit/Delete individual durian trees.
    - Search and Filter plots by name or variety.

### 3. Activity & Task Tracking
- **Location:** `src/pages/WorkLogPage.jsx` & `src/pages/TaskPlannerPage.jsx`
- **Features:**
    - Record daily agricultural tasks (watering, spraying, etc.).
    - Plan future activities with a calendar view.
    - Mark tasks as completed.

### 4. Financial Tracking
- **Location:** `src/pages/FinancePage.jsx`
- **Features:**
    - Record income from harvests.
    - Track expenses for fertilizers, labor, and fuel.
    - Real-time balance and summary cards.

### 5. Growth Monitoring
- **Location:** `src/pages/TreeRecordPage.jsx`
- **Features:**
    - QR Code identification for trees.
    - Tracking flowering dates.
    - Automatic harvest date calculation (approx. 120 days for Mon Thong).
    - Status monitoring (Normal, Needs Water, Diseased).
