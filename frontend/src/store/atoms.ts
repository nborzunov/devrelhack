import { atom } from 'recoil';

import { Activity } from '../types/types';

export const profileListFilterState = atom<{
    locations: string[];
    languages: string[];
    activity: Activity | null;
    registeredDate: [Date, Date];
    followers: [number | null, number | null];
    setFilter: any;
}>({
    key: 'profileListFilterState',
    default: {
        locations: [],
        languages: ['Java'],
        activity: null,
        registeredDate: [new Date(), new Date()],
        followers: [null, null],
        setFilter: () => {},
    },
});
