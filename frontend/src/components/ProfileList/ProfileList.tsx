import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Fade,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Skeleton,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
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
                setData(res);
            })
            .finally(() => {
                setIsLoaded(true);
            });
    }

    const workbook = new Excel.Workbook();

    const exportData = async () => {
        try {
            // creating one worksheet in workbook
            const worksheet = workbook.addWorksheet('Worksheet - 1');

            // add worksheet columns
            // each columns contains header and its mapping key from data
            const columns = [
                { header: 'Full Name', key: 'fullName' },
                { header: 'Location', key: 'location' },
                { header: 'Languages', key: 'languages' },
                { header: 'Registration Date', key: 'createdAt' },
                { header: 'Activity', key: 'activity' },
                { header: 'Followers', key: 'followers' },
                { header: 'Email', key: 'email' },
                { header: 'Profile Url', key: 'profileSrc' },
            ];
            worksheet.columns = columns;

            // updated the font for first row.
            worksheet.getRow(1).font = { bold: true };

            // loop through all of the columns and set the alignment with width.

            const result = profiles.filter((item) => {
                if (!profileListFilter.hasEmail && !item.email) {
                    return false;
                }

                if (
                    profileListFilter.languages.length &&
                    !item.languages.find((language: any) =>
                        profileListFilter.languages.includes(language),
                    )
                ) {
                    return false;
                }

                if (
                    profileListFilter.locations.length &&
                    !profileListFilter.locations.find(
                        (location: any) => item.location == location,
                    )
                ) {
                    return false;
                }

                if (
                    profileListFilter.activity &&
                    profileListFilter.activity !== item.activity
                ) {
                    return false;
                }

                return true;
            });
            worksheet.columns.forEach((column) => {
                column.width = column.header.length + 5;
                column.alignment = { horizontal: 'center' };
            });

            // loop through data and add each one to worksheet
            result.forEach((singleData) => {
                worksheet.addRow(singleData);
            });

            // loop through all of the rows and set the outline style.
            worksheet.eachRow({ includeEmpty: false }, (row) => {
                // store each cell to currentCell
                const currentCell = row._cells;

                // loop through currentCell to apply border only for the non-empty cell of excel
                currentCell.forEach((singleCell) => {
                    // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
                    const cellAddress = singleCell._address;

                    // apply border
                    worksheet.getCell(cellAddress).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                });
            });

            // write the content using writeBuffer
            const buf = await workbook.xlsx.writeBuffer();

            // download the processed file
            saveAs(new Blob([buf]), `${owner}/${repo}.xlsx`);
        } catch (error) {
            console.error('<<<ERRROR>>>', error);
            console.error('Something Went Wrong', error.message);
        } finally {
            // removing worksheet's instance to create new one
            workbook.removeWorksheet('Worksheet - 1');
        }
    };

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
                                <Button colorScheme="blue" onClick={exportData}>
                                    Export to Excel
                                </Button>
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
                            <Box w="300px" minH="750px">
                                <ProfileFilters data={data} />
                            </Box>
                        </Skeleton>
                    </Fade>
                </Flex>
            </Flex>
        </Flex>
    );
}
