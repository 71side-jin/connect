export const MODEL_TYPE_OPTIONS = [
  "text",
  "image",
  "video",
  "multimodal",
];

export const STATUS_OPTIONS = [
  "processing",
  "success",
  "failed",
];

export const RESULT_OPTIONS = [
  "REAL",
  "FAKE",
];

export const MODEL_NAME_MAP: Record<string, string[]> = {
  text: [
    "text-ai-detector",
    "text-fact-check",
  ],
  image: [
    "image-fast",
    "image-precision",
  ],
  video: [
    "video-efficientnet-n7",
  ],
  multimodal: [
    "mm-openclip",
    "mm-flava",
    "mm-blip-nli",
    "mm-avsync",
    "mm-frequency",
    "mm-scenegraph",
  ],
};

