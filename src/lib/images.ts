export function cleanImageUrl(url?: string | null): string {
  const placeholder = "/images/project-placeholder.svg";
  if (!url) return placeholder;
  let cleaned = String(url).trim();
  // strip leading/trailing quotes and colons
  cleaned = cleaned.replace(/^["':\s]+|["':\s]+$/g, "");
  if (!cleaned) return placeholder;
  // allow data URIs and absolute URLs
  if (cleaned.startsWith("data:") || cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }
  // local paths must start with /
  if (!cleaned.startsWith("/")) {
    cleaned = "/" + cleaned;
  }
  return cleaned;
}

export function getSafeImageUrl(url?: string | null): string {
  return cleanImageUrl(url);
}
