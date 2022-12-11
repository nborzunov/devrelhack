import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';

import { MockService } from '../../helpers/DataService';
import { profileListFilterState } from '../../store/atoms';
import { MyResponsivePie } from './Chart';

export function ProfileDetails() {
    const chart = [
        {
            id: 'go',
            label: 'go',
            value: 300,
            color: 'hsl(241, 70%, 50%)',
        },
        {
            id: 'javascript',
            label: 'javascript',
            value: 156,
            color: 'hsl(168, 70%, 50%)',
        },
        {
            id: 'haskell',
            label: 'haskell',
            value: 3,
            color: 'hsl(289, 70%, 50%)',
        },
        {
            id: 'python',
            label: 'python',
            value: 449,
            color: 'hsl(279, 70%, 50%)',
        },
        {
            id: 'hack',
            label: 'hack',
            value: 237,
            color: 'hsl(66, 70%, 50%)',
        },
    ];
    return (
        <Flex
            bg="blue.50"
            minHeight="100vh"
            m={0}
            p={0}
            w="100vw"
            justifyContent="start"
            flexDir="column"
            alignItems="center"
        >
            <Box w="1600px" m="4" mt="36" px="14">
                <Flex justifyContent="space-between">
                    <Heading>
                        <Link color="blue.600">nborzunov</Link>/
                    </Heading>
                </Flex>
            </Box>
            <Flex w="1600px" justifyContent="center" alignItems="start">
                <Flex w="1600px" gap="4" m="4">
                    <Box
                        bg="white"
                        py="6"
                        px="5"
                        borderRadius="12"
                        alignSelf="flex-start"
                    ></Box>

                    <Box w="450px">
                        <Box
                            bg="white"
                            py="6"
                            px="5"
                            borderRadius="12"
                            w="450px"
                            h="600px"
                        >
                            <MyResponsivePie data={chart} />
                        </Box>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}
