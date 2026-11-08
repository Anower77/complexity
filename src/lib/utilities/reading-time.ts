export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content) return 1;
  const clean = content.replace(/<\/?[^>]+(>|$)/g, '').replace(/```[\s\S]*?```/g, '');
  const wordCount = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}
