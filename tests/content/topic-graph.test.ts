import { describe, it, expect } from 'vitest';
import {
  TOPICS,
  TOPIC_EDGES,
  CATEGORIES,
  getTopicById,
  getTopicsByCategory,
  getPrerequisiteTopics,
  getNextTopics
} from '@/data/topics';

describe('Topic Graph & Architecture Knowledge Base', () => {
  it('contains valid topic nodes across all categories', () => {
    expect(TOPICS.length).toBeGreaterThanOrEqual(10);
    expect(CATEGORIES.length).toBe(6);

    const validCategoryIds = new Set(CATEGORIES.map((c) => c.id));
    for (const topic of TOPICS) {
      expect(validCategoryIds.has(topic.category)).toBe(true);
      expect(topic.title).toBeTruthy();
      expect(topic.shortDescription).toBeTruthy();
      expect(topic.detailedDescription).toBeTruthy();
    }
  });

  it('ensures all prerequisite references point to valid topics', () => {
    const topicIds = new Set(TOPICS.map((t) => t.id));

    for (const topic of TOPICS) {
      for (const prereqId of topic.prerequisites) {
        expect(topicIds.has(prereqId)).toBe(true);
      }
    }
  });

  it('ensures all next-topic references point to valid topics', () => {
    const topicIds = new Set(TOPICS.map((t) => t.id));

    for (const topic of TOPICS) {
      for (const nextId of topic.nextTopics) {
        expect(topicIds.has(nextId)).toBe(true);
      }
    }
  });

  it('ensures all graph edges have valid source and target nodes', () => {
    const topicIds = new Set(TOPICS.map((t) => t.id));

    for (const edge of TOPIC_EDGES) {
      expect(topicIds.has(edge.source)).toBe(true);
      expect(topicIds.has(edge.target)).toBe(true);
      expect(edge.source).not.toBe(edge.target);
      expect(edge.description).toBeTruthy();
    }
  });

  it('correctly resolves prerequisite and downstream helper functions', () => {
    const clientServer = getTopicById('client-server');
    expect(clientServer).toBeDefined();

    const prereqs = getPrerequisiteTopics('client-server');
    expect(prereqs.length).toBeGreaterThanOrEqual(1);
    expect(prereqs.some((p) => p.id === 'networking-foundations')).toBe(true);

    const nexts = getNextTopics('client-server');
    expect(nexts.length).toBeGreaterThanOrEqual(1);
    expect(nexts.some((n) => n.id === 'http-protocols')).toBe(true);
  });
});
