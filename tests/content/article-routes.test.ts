import { describe, it, expect } from 'vitest';
import { TOPICS } from '@/data/topics';

describe('Article Routes & Topic Publication Verification', () => {
  it('all published topics should point to valid canonical /articles/ routes', () => {
    const publishedTopics = TOPICS.filter((t) => t.status === 'published');
    expect(publishedTopics.length).toBeGreaterThanOrEqual(4);

    publishedTopics.forEach((topic) => {
      expect(topic.articleUrl).toBeDefined();
      expect(topic.articleUrl?.startsWith('/articles/')).toBe(true);
      expect(topic.articleUrl).not.toContain('/courses/');
    });
  });

  it('verifies canonical article endpoints exist for core invariants', () => {
    const slugs = TOPICS.filter((t) => t.status === 'published').map((t) => t.articleUrl);
    expect(slugs).toContain('/articles/client-server-architecture');
    expect(slugs).toContain('/articles/request-lifecycle-and-protocols');
    expect(slugs).toContain('/articles/dns-resolution-and-sockets');
    expect(slugs).toContain('/articles/kubernetes-services-clusterip-nodeport-loadbalancer');
  });
});
