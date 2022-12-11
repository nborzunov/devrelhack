import { HStack, Tag, Tooltip } from '@chakra-ui/react';

import { ProfileRow } from '../../types/types';

export function LanguagesColumn({ user }: { user: ProfileRow }) {
    let index = 0;
    let length = 0;

    if (!user.languages) return <></>;
    for (let i = 0; i < user.languages?.length; i++) {
        length += user.languages[i].length + 2;
        index = i;
        if (length > 25) {
            break;
        }
    }

    const visible = user.languages.slice(0, index + 1);
    const rest = user.languages.slice(index + 1);
    return (
        <HStack spacing={2}>
            {visible.map((language) => (
                <Tag
                    key={language}
                    variant="solid"
                    colorScheme="teal"
                    cursor="pointer"
                    whiteSpace="nowrap"
                >
                    {language}
                </Tag>
            ))}
            {rest.length > 0 && (
                <Tooltip label={rest.join(', ')}>
                    <Tag variant="solid" colorScheme="teal" cursor="pointer">
                        ...
                    </Tag>
                </Tooltip>
            )}
        </HStack>
    );
}
