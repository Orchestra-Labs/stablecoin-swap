import { atom } from 'jotai';
import { Asset } from '@/sections';

export const SendAssetAtom = atom<Asset | null>(null);
export const ReceiveAssetAtom = atom<Asset | null>(null);
