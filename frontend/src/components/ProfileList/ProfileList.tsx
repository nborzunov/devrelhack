import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Fade,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputRightAddon,
    InputRightElement,
    Link,
    Skeleton,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';

import { DataService } from '../../helpers/DataService';
import { profileListFilterState } from '../../store/atoms';
import { ProfileResponse } from '../../types/types';
import { CustomTable } from '../CustomTable';
import { ProfileFilters } from './Filters';

export function ProfileList() {
    const columns = React.useMemo(() => DataService.getColumns(), []);

    const [profileListFilter, setFilteringState] = useRecoilState(profileListFilterState);

    const [search, setSearch] = React.useState('');
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const [data, setData] = React.useState<ProfileResponse | null>(null);
    const profiles = React.useMemo(() => (data ? data.data : []), [data]);

    const [owner, setOwner] = React.useState('');
    const [repo, setRepo] = React.useState('');
    function handleSearch() {
        const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;

        const matches = regex.exec(search);
        if (!matches) return;
        const owner = matches[1];
        const repo = matches[2];
        setOwner(owner);
        setRepo(repo);

        setIsLoaded(false);
        setLoading(true);

        DataService.getRequest(owner, repo)
            .then((res) => {
                console.log(res, DataService.getData(10));
                setData(res);
            })
            .finally(() => {
                setIsLoaded(true);
            });
    }
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
            <Box w="600px" mt="24" px="14" mb="6">
                <InputGroup size="lg" onSubmit={handleSearch}>
                    <Input
                        placeholder="Put link to repository.."
                        bg="white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={!isLoaded}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <InputRightElement>
                        <SearchIcon color="blue.500" />
                    </InputRightElement>
                </InputGroup>
            </Box>
            <Fade in={loading}>
                <Skeleton isLoaded={isLoaded}>
                    <Box w="1700px" pb="4">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Heading size="lg">
                                <Text as="span" color="blue.600">
                                    {owner}
                                </Text>
                                /
                                <Text as="span" color="blue.600">
                                    {repo}
                                </Text>{' '}
                                repository
                            </Heading>
                            <Tooltip label="Save users to file">
                                <Button colorScheme="blue">Export to Excel</Button>
                            </Tooltip>
                        </Flex>
                    </Box>
                </Skeleton>
            </Fade>
            <Flex w="1700px" justifyContent="center" alignItems="start">
                <Flex w="1700px" gap="4" my="4">
                    <Fade in={loading}>
                        <Skeleton borderRadius="12" isLoaded={isLoaded}>
                            <Box
                                bg="white"
                                py="6"
                                px="5"
                                borderRadius="12"
                                alignSelf="flex-start"
                                w="1384px"
                                minH="854px"
                            >
                                <CustomTable
                                    columns={columns}
                                    data={profiles}
                                    setFilteringState={setFilteringState}
                                    minH="854px"
                                />
                            </Box>
                        </Skeleton>
                    </Fade>

                    <Fade in={loading}>
                        <Skeleton borderRadius="12" isLoaded={isLoaded}>
                            <Box w="300px" minH="941px">
                                <ProfileFilters data={data} />
                            </Box>
                        </Skeleton>
                    </Fade>
                </Flex>
            </Flex>
        </Flex>
    );
}
