// Navigation, footer and socials for the skills site. It shares the personal site's look, not its pages.
export const MAIN = 'https://haythamasalama.me';

export const site = { name: 'Haytham A. Salama', since: 2022 };

export const REPO_URL = 'https://github.com/haythamasalama/skills';

export const links = [
  { label: 'haythamasalama.me', to: MAIN },
  { label: 'skills.sh', to: 'https://skills.sh' },
];

export const contact = { label: 'GitHub', to: REPO_URL };

export const socials = [
  { label: 'GitHub', to: 'https://github.com/haythamasalama', icon: 'github', size: 18 },
  { label: 'X', to: 'https://x.com/haythamasalama', icon: 'x', size: 16 },
  { label: 'LinkedIn', to: 'https://www.linkedin.com/in/haythamasalama', icon: 'linkedin', size: 17 },
  { label: 'Medium', to: 'https://medium.com/@haythamasalama', icon: 'medium', size: 18 },
  { label: 'Email', to: 'mailto:haythamasalama@gmail.com', icon: 'mail', size: 17 },
];

/** The owner's own apps, shown in the banner above the footer. */
export const apps = [
  {
    name: 'Runarks',
    kind: 'Governed access to production databases',
    logo: '/logos/runarks.svg',
    to: 'https://runarks.com/',
  },
  {
    name: 'EasyShoot',
    kind: 'Screenshot app for macOS · coming soon',
    logo: '/logos/easyshoot.svg',
    to: 'https://easyshoot.haythamasalama.me/',
  },
  {
    name: 'WhatsApp Business Monitor',
    kind: 'Dashboard for WhatsApp Business',
    logo: '/logos/whatsapp-manager.svg',
    to: 'https://github.com/haythamasalama/whatsapp-business-monitor',
  },
];
