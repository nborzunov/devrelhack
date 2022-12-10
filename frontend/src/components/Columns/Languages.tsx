import { HStack, Tag, Tooltip } from '@chakra-ui/react';

import { ProfileRow } from '../../types/types';

export function LanguagesColumn({ user }: { user: ProfileRow }) {
    return (
        <HStack spacing={2}>
            {user.languages.map((language) => (
                <Tag variant="solid" colorScheme="teal" cursor="pointer">
                    {language.label}
                </Tag>
            ))}
        </HStack>
    );
}
