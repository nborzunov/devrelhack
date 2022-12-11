import { EmailIcon } from '@chakra-ui/icons';
import { Flex, Link, Text } from '@chakra-ui/react';
import axios from 'axios';

import { ActivityColumn } from '../components/Columns/Activity';
import { DateColumn } from '../components/Columns/Date';
import { LanguagesColumn } from '../components/Columns/Languages';
import { UserColumn } from '../components/Columns/User';
import { Activity, Option, ProfileResponse, ProfileRow } from '../types/types';

export class DataService {
    static getRequest(owner: string, repo: string): Promise<ProfileResponse> {
        const api_url = `http://127.0.0.1:8000/repos/${owner}/${repo}`;
        return axios
            .get(api_url)
            .then((res) => {
                console.log(res.data);
                return res.data;
            })
            .then((data) => {
                data.languages = data.languages.map(
                    ([label, count]: [string, number]) => ({
                        label,
                        count,
                    }),
                );

                data.activities = data.activities.map(
                    ([label, count]: [string, number]) => ({
                        label,
                        count,
                    }),
                );

                data.locations = data.locations.map(
                    ([label, count]: [string, number]) => ({
                        label,
                        count,
                    }),
                );

                console.log(data);
                return data;
            });
    }

    static getData(count: number): ProfileResponse {
        const result: any = {};
        const data: ProfileRow[] = [];

        const locations = [
            { label: 'Armenia, Yerevan', count: 31 },
            { label: 'Russia, Moscow', count: 24 },
            { label: 'USA, New York', count: 19 },
            { label: 'France, Paris', count: 14 },
            { label: 'Germany, Berlin', count: 11 },
            { label: 'Italy, Rome', count: 8 },
            { label: 'Spain, Madrid', count: 7 },
            { label: 'UK, London', count: 7 },
            { label: 'China, Beijing', count: 6 },
            { label: 'Japan, Tokyo', count: 5 },
            { label: 'India, New Delhi', count: 3 },
            { label: 'Australia, Sydney', count: 1 },
            { label: 'Canada, Ottawa', count: 1 },
            { label: 'Brazil, Brasilia', count: 1 },
            { label: 'Mexico, Mexico City', count: 1 },
        ];

        const languages = [
            { label: 'JavaScript', count: 45 },
            { label: 'TypeScript', count: 31 },
            { label: 'Python', count: 19 },
            { label: 'Java', count: 14 },
            { label: 'C++', count: 11 },
            { label: 'C#', count: 8 },
            { label: 'PHP', count: 7 },
            { label: 'C', count: 7 },
            { label: 'Ruby', count: 6 },
            { label: 'Go', count: 5 },
            { label: 'Swift', count: 3 },
            { label: 'Kotlin', count: 1 },
            { label: 'Rust', count: 1 },
        ];

        result.activities = {
            [Activity.High]: 0,
            [Activity.Medium]: 0,
            [Activity.Low]: 0,
        };
        for (let i = 0; i < count; i++) {
            const random = Math.random();
            const activity =
                random > 0.75
                    ? Activity.High
                    : random > 0.5
                    ? Activity.Medium
                    : Activity.Low;

            const commits = Math.floor(random * 500);
            const followers = Math.floor(random * 1500);
            data.push({
                profileSrc: 'https://github.com/nborzunov',
                photoSrc: 'https://picsum.photos/200/300',
                fullName: 'Nikolay Borzunov',
                location: locations[(Math.random() * locations.length) | 0],
                languages: languages
                    .sort(() => 0.5 - Math.random())
                    .slice(0, (Math.random() * 3) | 2)
                    .sort((a, b) => b.count - a.count),
                activity: activity,
                commits: commits,
                createdAt: '2021-03-01T12:00:00.000Z',
                followers: followers,
            });
            result.activities[activity]++;
        }
        result.data = data;
        result.locations = locations;
        result.languages = languages.sort((a, b) => b.count - a.count);
        result.activities = Object.entries(result.activities).map(([key, value]) => ({
            label: key,
            count: value as number,
        }));

        return result;
    }

    static getColumns() {
        function multiSelectFilter(rows, columnIds, filterValue) {
            return filterValue.length === 0
                ? rows
                : rows.filter((row: any) => {
                      const value = row.original[columnIds[0]];

                      if (Array.isArray(value)) {
                          return value.find((language: Option) =>
                              filterValue.includes(language),
                          );
                      } else {
                          return filterValue.includes(value);
                      }
                  });
        }

        function selectFilter(rows, columnIds, filterValue) {
            return !filterValue
                ? rows
                : rows.filter((row: any) => row.original[columnIds] == filterValue);
        }

        function emailFilter(rows, columnIds, filterValue) {
            return !filterValue
                ? rows
                : rows.filter((row: any) => row.original[columnIds]);
        }

        return [
            {
                Header: 'Full Name',
                accessor: 'fullName',
                Cell: (props: any) => <UserColumn user={props.data[props.row.id]} />,
            },
            {
                Header: 'Location',
                accessor: 'location',
                Cell: (props: any) => (
                    <Text
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        maxWidth="140px"
                        overflow="hidden"
                    >
                        {props.value.charAt(0).toUpperCase() + props.value.slice(1)}
                    </Text>
                ),
                filter: multiSelectFilter,
            },
            {
                Header: 'Languages',
                accessor: 'languages',
                Cell: (props: any) => <LanguagesColumn user={props.data[props.row.id]} />,
                filter: multiSelectFilter,
            },
            {
                Header: 'Registered Date',
                accessor: 'createdAt',
                Cell: (props: any) => <DateColumn value={props.value || 'Not defined'} />,
            },
            {
                Header: 'Activity',
                accessor: 'activity',
                filter: selectFilter,
                Cell: (props: any) => <ActivityColumn user={props.data[props.row.id]} />,
            },
            {
                Header: 'Followers',
                accessor: 'followers',
                meta: {
                    isNumeric: true,
                },
            },
            {
                Header: 'Email',
                accessor: 'email',
                Cell: (props: any) => (
                    <>
                        {props.value ? (
                            <Link href={`mailto: ${props.value}`}>
                                <Flex alignItems="center">
                                    <Text
                                        mr="2"
                                        fontWeight="semibold"
                                        title={props.value}
                                    >
                                        {props.value}
                                    </Text>
                                    <EmailIcon />
                                </Flex>
                            </Link>
                        ) : (
                            <Text color="gray.500">Not defined</Text>
                        )}
                    </>
                ),
                filter: emailFilter,
            },
        ];
    }
}
