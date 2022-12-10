import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    Heading,
    Input,
    Link,
    Tooltip,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { MockService } from '../../helpers/Preprocessor';
import { profileListFilterState } from '../../store/atoms';
import { CustomTable } from '../CustomTable';
import { ProfileFilters } from './Filters';

export function ProfileList() {
    const data = React.useMemo(() => MockService.getData(200), []);
    const profiles = React.useMemo(() => data.data, []);
    const columns = React.useMemo(() => MockService.getColumns(), []);

    const [profileListFilter, setFilteringState] = useRecoilState(profileListFilterState);

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
                        <Link color="blue.600">rust-lang</Link>/
                        <Link color="blue.600">rust</Link> repository
                    </Heading>
                    <Tooltip label="Save users to file">
                        <Button colorScheme="blue">Export to Excel</Button>
                    </Tooltip>
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
                        w="1300"
                    >
                        <CustomTable
                            columns={columns}
                            data={profiles}
                            setFilteringState={setFilteringState}
                        />
                    </Box>

                    <Box w="300px">
                        <ProfileFilters data={data} />
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}
