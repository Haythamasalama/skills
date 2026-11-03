// The personal site's navigation, footer and socials, so this subdomain reads as part of it.
export const MAIN = 'https://haythamasalama.me';

export const site = { name: 'Haytham A. Salama', since: 2022 };

export const nav = [
  { label: 'About', to: `${MAIN}/about` },
  { label: 'Work', to: `${MAIN}/work` },
  { label: 'Open Source', to: `${MAIN}/open-source` },
  { label: 'Blog', to: `${MAIN}/articles` },
  { label: 'Skills', to: '#/', current: true },
];

export const footer = [
  { label: 'Snippets', to: `${MAIN}/snippets` },
  { label: 'Tools', to: `${MAIN}/tools` },
  { label: 'Uses', to: `${MAIN}/uses` },
  { label: 'Brand', to: `${MAIN}/brand` },
  { label: 'Skills', to: '#/' },
];

export const contact = { label: 'Contact', to: 'mailto:haythamasalama@gmail.com' };

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
