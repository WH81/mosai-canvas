import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const REQUEST_TIMEOUT_MS = 5000; // 5 seconds
const MAX_RESULTS = 25;

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string | undefined;
  publishedAt: string;
}

interface CacheEntry {
  data: YouTubeVideo[];
  expires: number;
}

interface YouTubeChannelResponse {
  items?: Array<{
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
}

interface YouTubePlaylistItem {
  snippet?: {
    title?: string;
    publishedAt?: string;
    resourceId?: {
      videoId?: string;
    };
    thumbnails?: {
      high?: {
        url?: string;
      };
      medium?: {
        url?: string;
      };
      default?: {
        url?: string;
      };
    };
  };
}

interface YouTubePlaylistResponse {
  items?: YouTubePlaylistItem[];
}

// Simple in-memory cache with TTL.
const cache = new Map<string, CacheEntry>();

export class YouTubeService {
  static async getChannelVideos(
    channelId: string
  ): Promise<YouTubeVideo[]> {
    // Validate the channel ID before making an external request.
    const trimmedChannelId = channelId?.trim();

    if (!trimmedChannelId) {
      return [];
    }

    const now = Date.now();

    // Return cached data when available and not expired.
    const cached = cache.get(trimmedChannelId);

    if (cached && cached.expires > now) {
      return cached.data;
    }

    // API key must remain server-side.
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY?.trim()) {
      throw new Error("Missing YOUTUBE_API_KEY");
    }

    try {
      // Get the channel's uploads playlist.
      const channelRes =
        await axios.get<YouTubeChannelResponse>(
          `${BASE_URL}/channels`,
          {
            params: {
              part: "contentDetails",
              id: trimmedChannelId,
              key: API_KEY,
            },
            timeout: REQUEST_TIMEOUT_MS,
          }
        );

      const uploadsPlaylistId =
        channelRes.data.items?.[0]
          ?.contentDetails
          ?.relatedPlaylists
          ?.uploads;

      // Channel doesn't have a usable uploads playlist.
      if (!uploadsPlaylistId) {
        return [];
      }

      // Get videos from the uploads playlist.
      const videosRes =
        await axios.get<YouTubePlaylistResponse>(
          `${BASE_URL}/playlistItems`,
          {
            params: {
              part: "snippet",
              playlistId: uploadsPlaylistId,
              maxResults: MAX_RESULTS,
              key: API_KEY,
            },
            timeout: REQUEST_TIMEOUT_MS,
          }
        );

      const items = videosRes.data.items ?? [];

      // Only return valid video records.
      const videos: YouTubeVideo[] = items
        .map((item): YouTubeVideo | null => {
          const snippet = item.snippet;
          const videoId = snippet?.resourceId?.videoId;
          const title = snippet?.title;
          const publishedAt = snippet?.publishedAt;

          // Ignore malformed API records instead of throwing.
          if (!videoId || !title || !publishedAt) {
            return null;
          }

          return {
            videoId,
            title,
            thumbnail:
              snippet.thumbnails?.high?.url ||
              snippet.thumbnails?.medium?.url ||
              snippet.thumbnails?.default?.url,
            publishedAt,
          };
        })
        .filter(
          (video): video is YouTubeVideo => video !== null
        );

      // Cache successful results for 10 minutes.
      cache.set(trimmedChannelId, {
        data: videos,
        expires: now + CACHE_TTL_MS,
      });

      return videos;
    } catch (err: unknown) {
      // Log only safe, non-sensitive error information.
      // Never log the API key, request URL, or Axios config.
      if (axios.isAxiosError(err)) {
        console.error(
          `YouTube API error: HTTP ${
            err.response?.status ?? "unknown"
          }`
        );
      } else {
        console.error("YouTube service error");
      }

      // Preserve existing behavior:
      // return an empty array when the YouTube API request fails.
      return [];
    }
  }
}