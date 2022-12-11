import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Link, Text } from '@chakra-ui/react';

import { ProfileRow } from '../../types/types';

export function UserColumn({ user }: { user: ProfileRow }) {
    return (
        <Link href={user.profileSrc}>
            <Flex alignItems="center">
                <Avatar name={user.fullName} src={user.photoSrc} size="xs" />
                <Text
                    mx="2"
                    fontWeight="semibold"
                    title={user.profileSrc}
                    whiteSpace="nowrap"
                >
                    {user.fullName}
                </Text>

                <ExternalLinkIcon />
            </Flex>
        </Link>
    );
}
