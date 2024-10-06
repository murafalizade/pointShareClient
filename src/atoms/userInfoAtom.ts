// src/atoms.ts
import { atom } from 'recoil';

export const userInfoAtom = atom({
    key: 'userInfo', // Unique ID for this atom
    default: { name: '', points: 0 }, // Default value (initial value)
});
