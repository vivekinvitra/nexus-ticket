export interface Author {
  id: string;
  name: string;
  avatar: string;
  slug: string;
}

export const AUTHORS: Author[] = [
  {
    id: '1',
    name: 'Liam Hargreaves',
    avatar: '/images/aaf6ebbc67a56008.jpg',
    slug: 'liam-hargreaves',
  },
  {
    id: '2',
    name: 'Tara Whitfield',
    avatar: '/images/c7f6b84dd1e2dd01.jpg',
    slug: 'tara-whitfield',
  },
  {
    id: '3',
    name: 'Chloe Drummond',
    avatar: '/images/caf78abc6a0d2992.jpg',
    slug: 'chloe-drummond',
  },
  {
    id: '4',
    name: 'Owen Castellano',
    avatar: '/images/be8489d0dfeb7fdc.jpg',
    slug: 'owen-castellano',
  },
  {
    id: '5',
    name: 'Dexter Okafor',
    avatar: '/images/a672ccc365f08f83.jpg',
    slug: 'dexter-okafor',
  },
  {
    id: '6',
    name: 'Anika Sharma',
    avatar: '/images/17a0fc2f15c2417e.jpg',
    slug: 'anika-sharma',
  },
];

export const getAuthorBySlug = (slug: string): Author | undefined =>
  AUTHORS.find((a) => a.slug === slug);

export const getAuthorByName = (name: string): Author | undefined =>
  AUTHORS.find((a) => a.name === name);
