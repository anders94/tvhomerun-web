# TVHomeRun Web

A modern web frontend for [tvhomerun-backend](https://github.com/anders94/tvhomerun-backend). Provides a user-friendly interface for browsing and watching recorded TV shows from your HDHomeRun DVR.

## Features

- **Server Configuration**: Easy setup with backend server URL validation
- **Shows Browser**: Grid layout displaying all recorded shows with metadata
- **Episode List**: Detailed episode information with progress indicators
- **Video Player**: HLS video streaming with:
  - Resume from last position
  - Auto-play next episode
  - Progress tracking (saved every 30 seconds)
  - Keyboard shortcuts (Space/K: play/pause, Arrow keys: skip, F: fullscreen)
  - Skip forward (+30s) and backward (-15s)
  - Episode navigation (next/previous)
- **Progress Tracking**: Visual indicators for watched and partially watched episodes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: tvOS-inspired dark interface with blue/purple gradients

## Prerequisites

- Node.js (v14 or higher)
- npm
- TVHomeRun backend running (default: http://localhost:3000)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Default (uses http://localhost:3000 as backend)
npm start

# With custom backend URL
node server.js http://192.168.1.100:3000

# Or using environment variable
BACKEND_URL=http://192.168.1.100:3000 npm start
```

3. Open your browser and navigate to:
```
http://localhost:8080
```

## Usage

The web frontend automatically connects to the backend URL configured when starting the server. There is no setup screen - just start the server and open your browser.

### Browsing Shows

- Shows are displayed in a responsive grid layout
- Each show card displays:
  - Poster image
  - Title
  - Category
  - Episode count
- Click any show to view its episodes
- Click the settings gear icon to change server URL

### Watching Episodes

- Episodes are listed with full metadata:
  - Episode number (S01E02)
  - Title and synopsis
  - Air date and duration
  - Channel information
  - Resume position (if partially watched)
- Visual indicators:
  - **Red progress bar**: Shows watch progress (0-100%)
  - **Green checkmark**: Episode fully watched
  - **Play icon**: Episode has resume position
- Click any episode to start playback

### Video Player Controls

- **Play/Pause**: Click video or press Space/K
- **Skip Forward**: +30 seconds
- **Skip Backward**: -15 seconds
- **Next/Previous**: Navigate between episodes
- **Progress Bar**: Click to seek
- **Fullscreen**: Press F key
- **Close**: Returns to episode list
- Controls auto-hide after 5 seconds (move mouse to show)

### Progress Tracking

- Progress is automatically saved every 30 seconds
- Position is saved when closing the player
- Episodes within last 30 seconds are marked as "watched"
- Resume position syncs with backend for cross-device playback

## Configuration

### Port Configuration

Change the port by setting the `PORT` environment variable:

```bash
PORT=3001 npm start
```

### Backend URL Configuration

The backend URL is configured when starting the server:

```bash
# Using command-line argument (recommended)
node server.js http://192.168.1.100:3000

# Using environment variable
BACKEND_URL=http://192.168.1.100:3000 npm start

# Using default (http://localhost:3000)
npm start
```

The web frontend will automatically connect to this backend URL. If the backend server is not accessible, the frontend will display an error with a retry button.

## Project Structure

```
tvhomerun-web/
├── server.js                 # Express server
├── package.json              # Project dependencies
├── public/                   # Static files
│   ├── shows.html           # Shows list page (root)
│   ├── episodes.html        # Episodes list page
│   ├── player.html          # Video player page
│   ├── css/
│   │   └── style.css        # Custom styles
│   └── js/
│       ├── api-client.js    # API client with retry logic
│       └── utils.js         # Utility functions
└── README.md                # This file
```

## Technology Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript (no framework)
- **UI Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Video**: HLS.js for adaptive streaming
- **Configuration**: Server-side (command-line/environment variable)

## API Integration

The app connects to the TVHomeRun backend API:

- `GET /health` - Health check
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id/episodes` - Get episodes for a show
- `GET /api/episodes/:id` - Get episode details
- `PUT /api/episodes/:id/progress` - Update watch progress
- `GET /api/stream/:id/playlist.m3u8` - HLS video stream

## Browser Compatibility

- **Chrome/Edge**: Full support with HLS.js
- **Firefox**: Full support with HLS.js
- **Safari**: Native HLS support
- **Mobile browsers**: Responsive design with touch controls

## Troubleshooting

### Video won't play
- Ensure backend is running and accessible
- Check browser console for errors
- Verify HLS transcoding is working on backend
- Try a different browser

### Progress not saving
- Check network connection to backend
- Verify backend API is responding
- Check browser console for errors

### Shows not loading
- Verify backend URL is correct
- Check backend is running (visit /health endpoint)
- Ensure HDHomeRun devices are discovered
- Check browser console for errors

## Development

For development with auto-reload, you can use nodemon:

```bash
npm install -g nodemon
nodemon server.js
```

## License

ISC

## Credits

Designed to match the look and feel of the TVHomeRun tvOS app.
