import { Discord, GitHub, Telegram, XIcon } from '@/assets/icons';
import { LinkTree } from '@/assets/icons/LinkTree';
import { ROUTES } from '@/config/routes';

export const MAIN_LAYOUT_LINKS = [
  {
    id: 'swap',
    label: 'Swap',
    href: ROUTES.HOME,
  },
  {
    id: 'stablestaking',
    label: 'Stablestaking',
    href: ROUTES.STABLESTAKING,
  },
  // {
  //   id: 'whitepaper',
  //   label: 'Whitepaper',
  //   target: '_blank',
  //   href: 'https://orchestralabs.org/whitepaper',
  // },
  {
    id: 'documentation',
    label: 'Documentation',
    target: '_blank',
    href: 'https://orchestralabs.org/documentation',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    target: '_blank',
    href: 'https://testnet.ping.pub/symphony',
  },
  {
    id: 'blogs',
    label: 'Blogs',
    target: '_blank',
    rel: 'noopener noreferrer',
    href: 'https://medium.com/@orchestra_labs',
  },
];

export const SOCIAL_LINKS = [
  { id: '1', href: 'https://twitter.com/orchestra_labs', Icon: XIcon },
  { id: '2', href: 'https://t.me/+xFieHCYYyx41NGQx', Icon: Telegram },
  { id: '3', href: 'https://github.com/Orchestra-Labs', Icon: GitHub },
  { id: '4', href: 'https://discord.gg/symphonyblockchain', Icon: Discord },
  { id: '5', href: 'https://linktr.ee/OrchestraLabs', Icon: LinkTree },
];
