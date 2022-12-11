import { atom } from 'recoil';

import { Activity } from '../types/types';

export const profileListFilterState = atom<{
    locations: string[];
    languages: string[];
    activity: Activity | null;
    registeredDate: [Date, Date];
    followers: [number | null, number | null];
    hasEmail: boolean;
    setFilter: any;
}>({
    key: 'profileListFilterState',
    default: {
        locations: [],
        languages: [],
        activity: null,
        registeredDate: [new Date(), new Date()],
        followers: [null, null],
        hasEmail: false,
        setFilter: () => {},
    },
});
