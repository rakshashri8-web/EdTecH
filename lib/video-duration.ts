import { extractDriveFileId, isGoogleDriveUrl, getGoogleDriveAccessToken } from "./google-drive";

export interface DurationResult {
  duration: string;
  durationSeconds: number;
  status: "ready" | "processing" | "empty" | "error";
  source?: "gdrive" | "youtube" | "client" | "unknown";
  message?: string;
}

/**
 * Converts seconds into clean, human-readable minutes and seconds.
 * Examples:
 * - 45 -> "45 secs"
 * - 125 -> "2 mins 5 secs"
 * - 875 -> "14 mins 35 secs"
 * - 3665 -> "1 hr 1 min 5 secs"
 */
export function formatDuration(seconds: number | string): string {
  const numSecs = typeof seconds === "string" ? parseFloat(seconds) : seconds;
  if (!numSecs || isNaN(numSecs) || numSecs <= 0) return "";

  const rounded = Math.round(numSecs);
  const hours = Math.floor(rounded / 3600);
  const remainder = rounded % 3600;
  const mins = Math.floor(remainder / 60);
  const secs = remainder % 60;

  if (hours > 0) {
    const hrStr = `${hours} hr${hours === 1 ? "" : "s"}`;
    const minStr = mins > 0 ? ` ${mins} min${mins === 1 ? "" : "s"}` : "";
    const secStr = secs > 0 ? ` ${secs} sec${secs === 1 ? "" : "s"}` : "";
    return `${hrStr}${minStr}${secStr}`.trim();
  }

  if (mins > 0) {
    const minStr = `${mins} min${mins === 1 ? "" : "s"}`;
    const secStr = secs > 0 ? ` ${secs} sec${secs === 1 ? "" : "s"}` : "";
    return `${minStr}${secStr}`.trim();
  }

  return `${secs} sec${secs === 1 ? "" : "s"}`;
}

/**
 * Extracts a YouTube video ID if URL is a valid YouTube link.
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Automatically detects YouTube video duration via YouTube page metadata.
 */
export async function detectYouTubeDuration(url: string): Promise<DurationResult> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return {
      duration: "",
      durationSeconds: 0,
      status: "error",
      source: "youtube",
      message: "Invalid YouTube URL",
    };
  }

  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const html = await res.text();

      // 1. Try approxDurationMs
      const approxMatch = html.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
      if (approxMatch) {
        const ms = parseInt(approxMatch[1], 10);
        const secs = Math.round(ms / 1000);
        return {
          duration: formatDuration(secs),
          durationSeconds: secs,
          status: "ready",
          source: "youtube",
        };
      }

      // 2. Try schema ISO duration PT1M30S
      const isoMatch =
        html.match(/itemprop="duration"\s+content="PT([^"]+)"/i) ||
        html.match(/"duration"\s*:\s*"PT([^"]+)"/i);
      if (isoMatch) {
        const iso = isoMatch[1];
        let secs = 0;
        const h = iso.match(/(\d+)H/i);
        const m = iso.match(/(\d+)M/i);
        const s = iso.match(/(\d+)S/i);
        if (h) secs += parseInt(h[1], 10) * 3600;
        if (m) secs += parseInt(m[1], 10) * 60;
        if (s) secs += parseInt(s[1], 10);

        if (secs > 0) {
          return {
            duration: formatDuration(secs),
            durationSeconds: secs,
            status: "ready",
            source: "youtube",
          };
        }
      }
    }
  } catch (err: any) {
    console.warn("YouTube duration detection error:", err);
  }

  return {
    duration: "Processing video...",
    durationSeconds: 0,
    status: "processing",
    source: "youtube",
    message: "YouTube duration metadata not ready yet",
  };
}

/**
 * Automatically detects Google Drive video duration via Google Drive API metadata.
 */
export async function detectGoogleDriveDuration(fileId: string): Promise<DurationResult> {
  try {
    const accessToken = await getGoogleDriveAccessToken();

    const driveUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
      fileId
    )}?fields=id,name,mimeType,videoMediaMetadata`;

    const res = await fetch(driveUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      const durationMillis = data?.videoMediaMetadata?.durationMillis;

      if (durationMillis) {
        const ms = parseInt(durationMillis, 10);
        const secs = Math.round(ms / 1000);
        if (secs > 0) {
          return {
            duration: formatDuration(secs),
            durationSeconds: secs,
            status: "ready",
            source: "gdrive",
          };
        }
      }

      // Google Drive file exists, but videoMediaMetadata is still processing
      return {
        duration: "Processing video...",
        durationSeconds: 0,
        status: "processing",
        source: "gdrive",
        message: "Google Drive is still processing video metadata",
      };
    }
  } catch (err: any) {
    console.warn("Google Drive duration detection notice:", err?.message || err);
  }

  return {
    duration: "Processing video...",
    durationSeconds: 0,
    status: "processing",
    source: "gdrive",
    message: "Drive metadata pending authorization or processing",
  };
}

/**
 * Primary auto-detection function for any lesson video URL.
 * Automatically chooses Google Drive API or YouTube metadata extraction.
 */
export async function detectVideoDuration(videoUrl?: string | null): Promise<DurationResult> {
  if (!videoUrl || !videoUrl.trim()) {
    return {
      duration: "",
      durationSeconds: 0,
      status: "empty",
    };
  }

  const trimmed = videoUrl.trim();

  // 1. Google Drive Video
  if (isGoogleDriveUrl(trimmed)) {
    const fileId = extractDriveFileId(trimmed);
    if (fileId) {
      return await detectGoogleDriveDuration(fileId);
    }
  }

  // 2. YouTube Video
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return await detectYouTubeDuration(trimmed);
  }

  // 3. Fallback for pending/unsupported URL
  return {
    duration: "Processing video...",
    durationSeconds: 0,
    status: "processing",
    source: "unknown",
  };
}
