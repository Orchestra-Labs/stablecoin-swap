import { Discord, GitHub, Telegram, XIcon } from '@/assets/icons';
import { LinkTree } from '@/assets/icons/LinkTree';

export const MAIN_LAYOUT_LINKS = [
  {
    id: '1',
    label: 'Airdrop',
    href: 'https://airdrop-tracker.orchestralabs.org/',
  },
  {
    id: '2',
    label: 'Swap',
    href: 'https://swap.orchestralabs.org/',
  },
  {
    id: '3',
    label: 'Whitepaper',
    href: 'https://orchestralabs.org/whitepaper',
  },
  { id: '4', label: 'Learn', href: 'https://orchestralabs.org/documentation' },
];

export const SOCIAL_LINKS = [
  { id: '1', href: 'https://twitter.com/orchestra_labs', Icon: XIcon },
  { id: '2', href: 'https://t.me/+xFieHCYYyx41NGQx', Icon: Telegram },
  { id: '3', href: 'https://github.com/Orchestra-Labs', Icon: GitHub },
  { id: '4', href: 'https://discord.gg/symphonyblockchain', Icon: Discord },
  { id: '5', href: 'https://linktr.ee/OrchestraLabs', Icon: LinkTree },
];
