export interface SearchDocument {
  id: string;
  type: 'course' | 'chapter' | 'lesson';
  title: string;
  description: string;
  url: string;
  courseTitle?: string;
  chapterTitle?: string;
  tags?: string[];
  difficulty?: string;
}

export function searchDocuments(query: string, docs: SearchDocument[], limit: number = 10): SearchDocument[] {
  if (!query || query.trim().length === 0) return [];
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const scored = docs.map((doc) => {
    let score = 0;
    const title = doc.title.toLowerCase();
    const desc = (doc.description || '').toLowerCase();
    const tags = (doc.tags || []).map((t) => t.toLowerCase());
    const courseTitle = (doc.courseTitle || '').toLowerCase();

    // Exact title match
    if (title === normalizedQuery) score += 100;
    else if (title.startsWith(normalizedQuery)) score += 50;
    else if (title.includes(normalizedQuery)) score += 30;

    // Tokens match
    for (const token of queryTokens) {
      if (title.includes(token)) score += 15;
      if (tags.some((t) => t.includes(token))) score += 10;
      if (desc.includes(token)) score += 5;
      if (courseTitle.includes(token)) score += 5;
    }

    return { doc, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.doc);
}
