import { atom } from 'jotai';

import { Asset } from '@/sections';

export const WalletAssetsAtom = atom<Asset[]>([]);
