// Utility functions

// Format air date similar to tvOS app
function formatAirDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const episodeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Check if today
  if (episodeDate.getTime() === today.getTime()) {
    return `Today at ${timeStr}`;
  }

  // Check if yesterday
  if (episodeDate.getTime() === yesterday.getTime()) {
    return `Yesterday at ${timeStr}`;
  }

  // Check if within the past week
  const diffDays = Math.floor((today - episodeDate) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} at ${timeStr}`;
  }

  // Otherwise full date
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Format duration in seconds to human-readable format
function formatDuration(seconds) {
  if (!seconds) return '';

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}

// Format time in seconds to HH:MM:SS or MM:SS
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Calculate progress percentage
function calculateProgress(resumePosition, duration) {
  if (!resumePosition || !duration || duration === 0) return 0;
  return Math.min(Math.floor((resumePosition / duration) * 100), 100);
}

// Check if episode is watched
function isWatched(episode) {
  return episode.watched === 1 || episode.watched === true;
}

// Check if episode should show resume indicator
function shouldShowResume(episode) {
  const progress = calculateProgress(episode.resume_position, episode.duration_minutes * 60);
  return progress > 0 && progress < 95;
}

// Get image URL or placeholder
function getImageURL(imageUrl, fallback = 'https://via.placeholder.com/300x200?text=No+Image') {
  return imageUrl || fallback;
}

// Show error message
function showError(message, duration = 5000) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
  alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alertDiv);

  if (duration > 0) {
    setTimeout(() => {
      alertDiv.remove();
    }, duration);
  }
}

// Show success message
function showSuccess(message, duration = 3000) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
  alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alertDiv);

  if (duration > 0) {
    setTimeout(() => {
      alertDiv.remove();
    }, duration);
  }
}

// Show loading spinner
function showLoading(container) {
  container.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

// Capitalize first letter
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
