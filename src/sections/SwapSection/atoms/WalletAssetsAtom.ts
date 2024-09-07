import { atom } from 'jotai/vanilla/atom';

import { Asset } from '@/sections';

export const WalletAssetsAtom = atom<Asset[]>([]);
