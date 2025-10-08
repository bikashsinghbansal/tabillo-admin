import { FILE_URL } from "../constants";

export function addUrlToFile(img: String) {
  return `${FILE_URL}/${img}`;
}

export function getFileType(url: string): string | null {
  const parts = url.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() ?? null : null;
}

export function getMediaType(url: string): "image" | "video" | "unknown" {
  const extension = getFileType(url);
  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
  const videoTypes = ["mp4", "webm", "mov", "avi"];

  if (!extension) return "unknown";

  if (imageTypes.includes(extension)) return "image";
  if (videoTypes.includes(extension)) return "video";
  return "unknown";
}
