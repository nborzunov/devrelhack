// @ts-nocheck
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Flex,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
} from '@chakra-ui/react';
import { SortingState } from '@tanstack/react-table';
import React from 'react';
import { Cell, Row, useFilters, usePagination, useSortBy, useTable } from 'react-table';

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

export function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={(e) => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    );
}

export function CustomTable({ columns, data }: any) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter((row) => {
                    console.log(row);
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                              .toLowerCase()
                              .startsWith(String(filterValue).toLowerCase())
                        : true;
                });
            },
        }),
        [],
    );

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        [],
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            state: {
                sorting,
            },
            onSortingChange: setSorting,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination,
    );

    // Render the UI for your table
    return (
        <Box w="1228px">
            <Table {...getTableProps()}>
                <Thead>
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <Th
                                    userSelect="none"
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps(),
                                    )}
                                >
                                    <Flex alignItems="center">
                                        {column.render('Header')}
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <ChevronDownIcon ml={1} w={4} h={4} />
                                            ) : (
                                                <ChevronUpIcon ml={1} w={4} h={4} />
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </Flex>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {page.map((row: Row, i) => {
                        prepareRow(row);
                        return (
                            <Tr {...row.getRowProps()}>
                                {row.cells.map((cell: Cell) => {
                                    return (
                                        <Td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </Td>
                                    );
                                })}
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>

            <Flex justifyContent="space-between" m={4} alignItems="center">
                <Flex>
                    <Tooltip label="First Page">
                        <IconButton
                            aria-label="First Page"
                            onClick={() => gotoPage(0)}
                            isDisabled={!canPreviousPage}
                            icon={<ArrowLeftIcon h={3} w={3} />}
                            mr={4}
                        />
                    </Tooltip>
                    <Tooltip label="Previous Page">
                        <IconButton
                            aria-label="Previous Page"
                            onClick={previousPage}
                            isDisabled={!canPreviousPage}
                            icon={<ChevronLeftIcon h={6} w={6} />}
                        />
                    </Tooltip>
                </Flex>

                <Flex alignItems="center">
                    <Text flexShrink="0" mr={8}>
                        Page{' '}
                        <Text fontWeight="bold" as="span">
                            {pageIndex + 1}
                        </Text>{' '}
                        of{' '}
                        <Text fontWeight="bold" as="span">
                            {pageOptions.length}
                        </Text>
                    </Text>

                    <NumberInput
                        ml={2}
                        mr={8}
                        w={28}
                        min={1}
                        max={pageOptions.length}
                        onChange={(_, value) => {
                            const page = value ? value - 1 : 0;
                            gotoPage(page);
                        }}
                        defaultValue={pageIndex + 1}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Select
                        w={32}
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </Select>
                </Flex>

                <Flex>
                    <Tooltip label="Next Page">
                        <IconButton
                            aria-label="Next Page"
                            onClick={nextPage}
                            isDisabled={!canNextPage}
                            icon={<ChevronRightIcon h={6} w={6} />}
                        />
                    </Tooltip>
                    <Tooltip label="Last Page">
                        <IconButton
                            aria-label="Last Page"
                            onClick={() => gotoPage(pageCount - 1)}
                            isDisabled={!canNextPage}
                            icon={<ArrowRightIcon h={3} w={3} />}
                            ml={4}
                        />
                    </Tooltip>
                </Flex>
            </Flex>
        </Box>
    );
}
