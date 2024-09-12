import { atom } from 'jotai';
import { Asset } from '@/sections';

// Atom for the send state
export const SendStateAtom = atom({
  asset: null as Asset | null,
  amount: 0.0,
});

// Atom for the receive state
export const ReceiveStateAtom = atom({
  asset: null as Asset | null,
  amount: 0.0,
});
