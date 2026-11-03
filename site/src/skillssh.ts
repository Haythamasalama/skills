import { avatarOf } from './catalog';

interface Found {
  id: string;
  name: string;
  source: string;
  installs: number;
}

export interface Listing {
  name: string;
  source: string;
  from: string;
  url: string;
  avatar: string | null;
  installs: number;
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

export const formatInstalls = (n: number) => `${compact.format(n)} installs`;

// skills.sh sends no CORS headers, so /api/search is proxied: by Vite in dev and by a Vercel rewrite in production.
export async function searchSkillsSh(query: string, signal: AbortSignal): Promise<Listing[]> {
  const res = await fetch(`/api/search?${new URLSearchParams({ q: query, limit: '30' })}`, { signal });

  if (!res.ok) throw new Error(`skills.sh answered ${res.status}`);

  const { skills = [] } = (await res.json()) as { skills?: Found[] };

  return skills.map(skill => {
    const site = !skill.source.includes('/');

    return {
      name: skill.name,
      source: skill.source,
      from: site ? `https://${skill.source}/` : skill.source,
      url: `https://skills.sh/${site ? 'site/' : ''}${skill.id}`,
      avatar: avatarOf(skill.source, site),
      installs: skill.installs,
    };
  });
}
