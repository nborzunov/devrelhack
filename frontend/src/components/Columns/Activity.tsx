import { Tag, Text, Tooltip } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { Activity, ProfileRow } from '../../types/types';

export function ActivityColumn({ user }: { user: ProfileRow }) {
    let colorScheme;

    switch (user.activity) {
        case Activity.Low:
            colorScheme = 'yellow';
            break;
        case Activity.Medium:
            colorScheme = 'orange';
            break;
        case Activity.High:
            colorScheme = 'green';
            break;
        default:
            colorScheme = 'gray';
    }

    return (
        <Tooltip label={user.commits + ' commits due past year'}>
            <Tag variant="solid" colorScheme={colorScheme} cursor="pointer">
                {user.activity}
            </Tag>
        </Tooltip>
    );
}
