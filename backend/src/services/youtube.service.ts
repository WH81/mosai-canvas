import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

// simple in-memory cache with TTL
const cache = new Map<string, { data: any; expires: number }>();

export class YouTubeService {
  static async getChannelVideos(channelId: string) {
    const now = Date.now();

    // 1. cache check (10 min TTL)
    const cached = cache.get(channelId);
    if (cached && cached.expires > now) {
      return cached.data;
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY?.trim()) {
      throw new Error("Missing the YOUTUBE_API_KEY");
    }

    try {
      // 2. get channel uploads playlist
      const channelRes = await axios.get(`${BASE_URL}/channels`, {
        params: {
          part: "contentDetails",
          id: channelId,
          key: API_KEY,
        },
      });

      const uploadsPlaylistId =
        channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        return [];
      }

      // 3. get playlist videos
      const videosRes = await axios.get(`${BASE_URL}/playlistItems`, {
        params: {
          part: "snippet",
          playlistId: uploadsPlaylistId,
          maxResults: 25,
          key: API_KEY,
        },
      });

      const videos = videosRes.data.items.map((item: any) => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
      }));

      // 4. cache for 10 minutes
      cache.set(channelId, {
        data: videos,
        expires: now + 10 * 60 * 1000,
      });

      return videos;
    } catch (err) {
      console.error("YouTube API error:", err);
      return [];
    }
  }
}
