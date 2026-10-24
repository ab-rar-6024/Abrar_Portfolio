import { certifications, experiences, projects } from './index';

// How each skill is proven: project tags it matches, words in certificate names, and internship ids.
// `note` is a short sub-line for a skill that covers more than its name (Deep Learning includes NLP).
export interface Skill { name: string; note?: string; tags?: string[]; certs?: string[]; interns?: string[] }
export interface SkillGroup { title: string; skills: Skill[] }

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', tags: ['Python'], certs: ['Python', 'Machine Learning A-Z', 'CNN'], interns: ['cognifyz-ml', 'cognifyz-ds', 'dp-world'] },
      { name: 'SQL', tags: ['PostgreSQL', 'MySQL'], certs: ['SQL'], interns: ['dp-world'] },
      { name: 'React', tags: ['React'], interns: ['tracole', 'rr-events'] },
    ],
  },
  {
    title: 'Machine Learning',
    skills: [
      { name: 'Machine Learning', certs: ['Machine Learning'], interns: ['cognifyz-ml'] },
      { name: 'Deep Learning', note: 'incl. NLP', tags: ['Deep Learning', 'NLP'], certs: ['Deep Learning', 'Natural Language'] },
    ],
  },
  {
    title: 'Data',
    skills: [
      { name: 'Power BI', certs: ['Business Intelligence'] },
    ],
  },
  {
    title: 'Web, Apps & Cloud',
    skills: [
      { name: 'Next.js', tags: ['Next.js'], interns: ['apm', 'pabt'] },
      { name: 'Three.js / 3D', tags: ['Three.js', 'React Three Fiber'], interns: ['tracole', 'pabt', 'apm'] },
      { name: 'Node.js & Express', tags: ['Node.js', 'Express'] },
    ],
  },
];

export const SOFT_SKILLS = ['Problem solving', 'Analytical thinking', 'Team collaboration', 'Communication', 'Adaptability', 'Time management'];

export const SKILL_COUNT = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0);

export function receiptsFor(s: Skill) {
  const lower = (x: string) => x.toLowerCase();
  return {
    projects: projects.filter(p => s.tags?.some(t => p.tags.map(lower).includes(lower(t)))),
    certs: certifications.filter(c => s.certs?.some(k => c.name.includes(k))),
    interns: experiences.filter(e => s.interns?.includes(e.id)),
  };
}
