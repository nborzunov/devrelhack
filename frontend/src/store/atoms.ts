import { atom } from 'recoil';

export const profileListFilterState = atom({
    key: 'profileListFilterState',
    default: {
        locations: [],
        languages: ['Java'],
        activity: null,
        registeredDate: [new Date(), new Date()],
        followers: [null, null],
    },
});
