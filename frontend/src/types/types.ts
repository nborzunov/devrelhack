export enum Activity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export interface Option {
    label: string;
    count: number;
}
export interface ProfileMainInfo {
    photoSrc: string;
    profileSrc: string;
    fullName: string;
    location: Option;
    languages: Option[];
    activity?: Activity;
    commits?: number;
}

export interface ProfileDetails extends ProfileMainInfo {
    repositories: string[];
    linkedin?: string;
    readme?: string;
}

export interface ProfileRow extends ProfileMainInfo {
    createdAt: string;
    followers: number;
}

export interface Repository {
    id: string;
    name: string;
    description: string;
    contributors: ProfileMainInfo[];
    usedBy: ProfileMainInfo[];
}

export interface ProfileResponse {
    data: ProfileRow[];
    locations: Option[];
    languages: Option[];
    activities: Option[];
}
