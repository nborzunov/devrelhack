import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Avatar, Flex, Link, Text } from '@chakra-ui/react';

import { ProfileRow } from '../../types/types';

export function UserColumn({ user }: { user: ProfileRow }) {
    return (
        <Link href={user.profileSrc} as={Flex} alignItems="center">
            <Avatar name={user.fullName} src={user.photoSrc} size="xs" />
            <Text mx="2" fontWeight="semibold" title={user.profileSrc}>
                {user.fullName}
            </Text>
            <ExternalLinkIcon />
        </Link>
    );
}
