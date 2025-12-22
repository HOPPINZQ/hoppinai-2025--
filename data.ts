import { TimelineEvent, StatCard, ImageMemory } from './types';

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    date: '2025-01-15',
    type: 'work',
    title: 'Project Alpha Launch',
    description: 'Successfully deployed the new AI infrastructure for the client. The system processed 1M requests on day one.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    color: 'bg-blue-500',
    metrics: { value: 99.9, unit: '% uptime' }
  },
  {
    id: '2',
    date: '2025-02-20',
    type: 'travel',
    title: 'Kyoto Winter Trip',
    description: 'Explored the snowy temples of Kinkaku-ji. A serene start to the year focusing on mindfulness.',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    color: 'bg-rose-400',
  },
  {
    id: '3',
    date: '2025-04-10',
    type: 'personal',
    title: 'Marathon Finisher',
    description: 'Completed my first full marathon in under 4 hours. Training paid off.',
    color: 'bg-green-500',
    metrics: { value: 42, unit: 'km' }
  },
  {
    id: '4',
    date: '2025-06-05',
    type: 'achievement',
    title: 'Design Award',
    description: 'Received the "Best UX 2025" award for the community app redesign.',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    color: 'bg-yellow-500',
  },
  {
    id: '5',
    date: '2025-08-12',
    type: 'work',
    title: 'Senior Engineer Promotion',
    description: 'Recognized for technical leadership and mentorship contributions.',
    color: 'bg-indigo-500',
  },
  {
    id: '6',
    date: '2025-10-30',
    type: 'personal',
    title: 'Moved to New Apartment',
    description: 'Finally settled into the downtown loft with a view of the skyline.',
    imageUrl: 'https://picsum.photos/800/600?random=6',
    color: 'bg-purple-500',
  },
  {
    id: '7',
    date: '2025-12-25',
    type: 'personal',
    title: 'Family Reunion',
    description: 'Hosted the annual holiday dinner. 15 family members gathered.',
    imageUrl: 'https://picsum.photos/800/600?random=7',
    color: 'bg-red-500',
  }
];

export const STAT_CARDS: StatCard[] = [
  { 
    id: '1', 
    label: 'Books Read', 
    value: 24, 
    trend: '+5 from 2024', 
    color: 'bg-amber-100 text-amber-900',
    details: 'Sci-Fi: 10, Bio: 5, Tech: 9. Favorite: "Project Hail Mary".'
  },
  { 
    id: '2', 
    label: 'Cities Visited', 
    value: 7, 
    trend: 'Global Citizen', 
    color: 'bg-sky-100 text-sky-900',
    details: 'Kyoto, Tokyo, Osaka, London, Paris, New York, Seattle.'
  },
  { 
    id: '3', 
    label: 'Code Commits', 
    value: '1,240', 
    color: 'bg-emerald-100 text-emerald-900',
    details: 'Mainly React & Python. 3 Major projects shipped. 120 PRs reviewed.'
  },
  { 
    id: '4', 
    label: 'Coffee Cups', 
    value: 680, 
    trend: 'Caffeine Fueled', 
    color: 'bg-stone-100 text-stone-900',
    details: 'Average 1.8 cups/day. Top beans: Ethiopian Yirgacheffe.'
  },
];

export const MEMORY_IMAGES: ImageMemory[] = [
  { id: '1', url: 'https://picsum.photos/300/300?random=10', alt: 'Memory 1', rotation: -5 },
  { id: '2', url: 'https://picsum.photos/300/300?random=11', alt: 'Memory 2', rotation: 3 },
  { id: '3', url: 'https://picsum.photos/300/300?random=12', alt: 'Memory 3', rotation: -8 },
  { id: '4', url: 'https://picsum.photos/300/300?random=13', alt: 'Memory 4', rotation: 6 },
  { id: '5', url: 'https://picsum.photos/300/300?random=14', alt: 'Memory 5', rotation: -2 },
  { id: '6', url: 'https://picsum.photos/300/300?random=15', alt: 'Memory 6', rotation: 4 },
];
