import { describe, it, expect } from 'vitest';
import { STUDIO_TEMPLATES } from '@/components/studio/studio-templates';

describe('Diagram Studio Starter Templates', () => {
  it('should have 8 pre-crafted architecture templates', () => {
    expect(STUDIO_TEMPLATES.length).toBe(8);
  });

  it('each template must possess unique id, title, and valid category', () => {
    const ids = new Set<string>();
    STUDIO_TEMPLATES.forEach((tmpl) => {
      expect(tmpl.id).toBeTruthy();
      expect(tmpl.title).toBeTruthy();
      expect(tmpl.description).toBeTruthy();
      expect(tmpl.category).toBeTruthy();
      expect(ids.has(tmpl.id)).toBe(false);
      ids.add(tmpl.id);
    });
  });

  it('each template elements must have valid coordinates, dimensions, and types', () => {
    STUDIO_TEMPLATES.forEach((tmpl) => {
      expect(tmpl.elements.length).toBeGreaterThan(0);
      tmpl.elements.forEach((el) => {
        expect(el.id).toBeTruthy();
        expect(el.type).toBeTruthy();
        expect(typeof el.x).toBe('number');
        expect(typeof el.y).toBe('number');
        expect(typeof el.width).toBe('number');
        expect(typeof el.height).toBe('number');
        expect(el.strokeColor).toBeTruthy();
        expect(el.fillColor).toBeTruthy();
      });
    });
  });

  it('verifies Three-Tier Web Application topology', () => {
    const threeTier = STUDIO_TEMPLATES.find((t) => t.id === 'three-tier');
    expect(threeTier).toBeDefined();
    const types = threeTier!.elements.map((el) => el.type);
    expect(types).toContain('client');
    expect(types).toContain('loadbalancer');
    expect(types).toContain('server');
    expect(types).toContain('database');
    expect(types).toContain('cache');
  });

  it('verifies Kubernetes Multi-Tier Deployment topology', () => {
    const k8s = STUDIO_TEMPLATES.find((t) => t.id === 'kubernetes-deployment');
    expect(k8s).toBeDefined();
    const types = k8s!.elements.map((el) => el.type);
    expect(types).toContain('gateway');
    expect(types).toContain('loadbalancer');
    expect(types).toContain('pod');
  });
});
