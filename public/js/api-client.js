// API Client with exponential backoff retry logic
class APIClient {
  constructor() {
    this.baseURL = '';
    this.maxRetries = 3;
    this.initialDelay = 1000; // 1 second
    this.maxDelay = 5000; // 5 seconds
    this.initialized = false;
  }

  // Initialize by fetching backend URL from server config
  async initialize() {
    if (this.initialized) return;

    try {
      const response = await fetch('/api/config');
      const config = await response.json();
      if (config.backendURL) {
        this.setBaseURL(config.backendURL);
        this.initialized = true;
      }
    } catch (error) {
      console.error('Failed to load backend URL from server config:', error);
      throw new Error('Failed to initialize API client');
    }
  }

  setBaseURL(url) {
    // Clean up URL
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    this.baseURL = url;
  }

  getBaseURL() {
    return this.baseURL;
  }

  isConfigured() {
    return this.baseURL !== '';
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchWithRetry(url, options = {}, retryCount = 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retryCount < this.maxRetries) {
        // Calculate delay with exponential backoff: 1s, 2s, 4s (max 5s)
        const delay = Math.min(
          this.initialDelay * Math.pow(2, retryCount),
          this.maxDelay
        );

        console.log(`Request failed, retrying in ${delay}ms... (attempt ${retryCount + 1}/${this.maxRetries})`);
        await this.sleep(delay);
        return this.fetchWithRetry(url, options, retryCount + 1);
      }

      // All retries exhausted
      throw error;
    }
  }

  // Health check
  async checkHealth() {
    const url = `${this.baseURL}/health`;
    return await this.fetchWithRetry(url);
  }

  // Get all shows
  async getShows(search = '', category = '', limit = null) {
    let url = `${this.baseURL}/api/shows`;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit);

    if (params.toString()) url += '?' + params.toString();
    return await this.fetchWithRetry(url);
  }

  // Get specific show
  async getShow(showId) {
    const url = `${this.baseURL}/api/shows/${showId}`;
    return await this.fetchWithRetry(url);
  }

  // Get episodes for a show
  async getEpisodes(showId, watched = null, season = null, sort = 'desc') {
    let url = `${this.baseURL}/api/shows/${showId}/episodes`;
    const params = new URLSearchParams();
    if (watched !== null) params.append('watched', watched);
    if (season) params.append('season', season);
    if (sort) params.append('sort', sort);

    if (params.toString()) url += '?' + params.toString();
    return await this.fetchWithRetry(url);
  }

  // Get recent episodes
  async getRecentEpisodes(limit = 20) {
    const url = `${this.baseURL}/api/episodes/recent?limit=${limit}`;
    return await this.fetchWithRetry(url);
  }

  // Get specific episode
  async getEpisode(episodeId) {
    const url = `${this.baseURL}/api/episodes/${episodeId}`;
    return await this.fetchWithRetry(url);
  }

  // Update episode progress
  async updateProgress(episodeId, position, watched) {
    const url = `${this.baseURL}/api/episodes/${episodeId}/progress`;
    return await this.fetchWithRetry(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        position: Math.floor(position),
        watched: watched ? 1 : 0
      })
    });
  }

  // Get HLS stream URL
  getStreamURL(episodeId) {
    return `${this.baseURL}/api/stream/${episodeId}/playlist.m3u8`;
  }

  // Trigger device discovery
  async triggerDiscovery() {
    const url = `${this.baseURL}/api/discover`;
    return await this.fetchWithRetry(url, { method: 'POST' });
  }
}

// Create singleton instance
const apiClient = new APIClient();
