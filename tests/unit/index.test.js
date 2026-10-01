import { jest } from '@jest/globals';

describe('index.js Component Tests', () => {
  let index;

  beforeAll(async () => {
    index = await import('../../scraper/index.js');
  });

  describe('transformJobsForSOLR', () => {
    it('should filter locations to only Romanian cities', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', location: ['România'] },
          { url: 'https://test.com/2', title: 'Job 2', location: ['Bucharest'] },
          { url: 'https://test.com/3', title: 'Job 3', location: ['Bulgaria'] },
          { url: 'https://test.com/4', title: 'Job 4', location: ['Cluj-Napoca'] },
          { url: 'https://test.com/5', title: 'Job 5', location: [] }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].location).toEqual(['România']);
      expect(result.jobs[1].location).toEqual(['Bucharest']);
      expect(result.jobs[2].location).toEqual(['România']);
      expect(result.jobs[3].location).toEqual(['Cluj-Napoca']);
      expect(result.jobs[4].location).toEqual(['România']);
    });

    it('should keep company uppercase', () => {
      const payload = {
        source: 'www.rebeldot.com',
        company: 'rebeldot solutions s.r.l.',
        cif: '39271439',
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', company: 'rebeldot', cif: '39271439' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.company).toBe('REBELDOT SOLUTIONS S.R.L.');
    });

    it('should normalize workmode values', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', workmode: 'Remote' },
          { url: 'https://test.com/2', title: 'Job 2', workmode: 'ON-SITE' },
          { url: 'https://test.com/3', title: 'Job 3', workmode: 'Hybrid' },
          { url: 'https://test.com/4', title: 'Job 4', workmode: 'hybrid' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].workmode).toBe('remote');
      expect(result.jobs[1].workmode).toBe('on-site');
      expect(result.jobs[2].workmode).toBe('hybrid');
      expect(result.jobs[3].workmode).toBe('hybrid');
    });

    it('should handle empty jobs array', () => {
      const result = index.transformJobsForSOLR({ jobs: [] });
      expect(result.jobs).toEqual([]);
    });
  });

  describe('mapToJobModel', () => {
    it('should map raw job to job model format', () => {
      const rawJob = {
        url: 'https://careers.rebeldot.com/job/123',
        title: 'Senior Developer',
        location: ['Bucharest'],
        tags: ['Java', 'Spring'],
        workmode: 'hybrid'
      };

      const COMPANY_NAME = 'REBELDOT SOLUTIONS S.R.L.';
      const COMPANY_CIF = '39271439';

      const result = index.mapToJobModel(rawJob, COMPANY_CIF, COMPANY_NAME);

      expect(result.url).toBe(rawJob.url);
      expect(result.title).toBe(rawJob.title);
      expect(result.company).toBe(COMPANY_NAME);
      expect(result.cif).toBe(COMPANY_CIF);
      expect(result.location).toEqual(rawJob.location);
      expect(result.tags).toEqual(rawJob.tags);
      expect(result.workmode).toBe(rawJob.workmode);
      expect(result.status).toBe('scraped');
      expect(result.date).toBeDefined();
    });

    it('should remove undefined fields', () => {
      const rawJob = {
        url: 'https://test.com/1',
        title: 'Job 1'
      };

      const result = index.mapToJobModel(rawJob, '39271439');

      expect(result.location).toBeUndefined();
      expect(result.tags).toBeUndefined();
      expect(result.workmode).toBeUndefined();
    });

    it('should handle missing title', () => {
      const rawJob = { url: 'https://test.com/1' };

      const result = index.mapToJobModel(rawJob, '39271439');

      expect(result.title).toBeUndefined();
      expect(result.url).toBe('https://test.com/1');
    });
  });

  describe('parseJobsFromHtml', () => {
    const html = `
      <a href="https://careers.rebeldot.com/jobs/1-ai-engineer">AI Engineer</a>
      <span class="text-base">
        <span class="inline-flex">Hybrid</span>
        <span>Cluj-Napoca, Brasov, Oradea</span>
      </span>
      <a href="/jobs/2-remote-dev">Remote Developer</a>
      <span class="text-base"><span class="inline-flex">Remote</span></span>`;

    it('should parse jobs, workmode, locations and tags', () => {
      const { jobs, total } = index.parseJobsFromHtml(html);

      expect(total).toBe(2);
      expect(jobs[0].title).toBe('AI Engineer');
      expect(jobs[0].url).toBe('https://careers.rebeldot.com/jobs/1-ai-engineer');
      expect(jobs[0].workmode).toBe('hybrid');
      expect(jobs[0].location).toEqual(['Cluj-Napoca', 'Brasov', 'Oradea']);
      expect(jobs[0].tags).toContain('ai');
    });

    it('should resolve relative URLs and detect remote', () => {
      const { jobs } = index.parseJobsFromHtml(html);

      expect(jobs[1].url).toBe('https://careers.rebeldot.com/jobs/2-remote-dev');
      expect(jobs[1].workmode).toBe('remote');
      expect(jobs[1].location).toEqual(['Cluj-Napoca']);
    });

    it('should not match short keywords inside other words', () => {
      const { jobs } = index.parseJobsFromHtml('<a href="/jobs/3-maintainer">Maintainer</a>');

      expect(jobs[0].tags).not.toContain('ai');
    });

    it('should skip anchors without a usable title', () => {
      const { jobs } = index.parseJobsFromHtml('<a href="/jobs/4"></a>');

      expect(jobs).toEqual([]);
    });

    it('should handle empty HTML', () => {
      expect(index.parseJobsFromHtml('')).toEqual({ jobs: [], total: 0 });
    });
  });
});
