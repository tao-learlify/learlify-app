// ─────────────────────────────────────────────────────────────
// Course Content Schema — Asset References
// ─────────────────────────────────────────────────────────────
// All media references use typed asset objects instead of raw
// URL strings. This enables CDN switching, format negotiation,
// and consistent metadata across the platform.
// ─────────────────────────────────────────────────────────────

/**
 * A reference to an audio file (listening recordings, speaking prompts).
 */
export interface AudioAsset {
  /** CDN URL or asset key */
  src: string;
  /** Duration in seconds (if known) */
  duration?: number;
  /** MIME type, e.g. "audio/mpeg" */
  mimeType?: string;
  /** Plain-text transcript of the audio content */
  transcript?: string;
}

/**
 * A reference to an image file (speaking image prompts, vocabulary cards).
 */
export interface ImageAsset {
  /** CDN URL or asset key */
  src: string;
  /** Accessible description of the image */
  alt: string;
  /** Width in pixels (if known) */
  width?: number;
  /** Height in pixels (if known) */
  height?: number;
}
