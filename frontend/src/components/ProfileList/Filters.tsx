import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
    Stack,
} from '@chakra-ui/react';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { useRecoilState } from 'recoil';

import { profileListFilterState } from '../../store/atoms';
import { ProfileResponse } from '../../types/types';
import { Autocomplete } from './Autocomplete';

export function ProfileFilters({ data }: { data: ProfileResponse }) {
    const [profileListFilter, setProfileListFilter] =
        useRecoilState(profileListFilterState);

    function createChangeHandler(column: string) {
        return (filterValue: any) => profileListFilter.setFilter(column, filterValue);
    }
    return (
        <Box bg="white" py="6" px="5" borderRadius="12">
            <Stack spacing={3}>
                <Autocomplete
                    options={data.locations}
                    label="Location"
                    field="locations"
                    placeholder="Print location or select down below"
                    selected={profileListFilter.locations}
                    setFilter={createChangeHandler('location')}
                />
                <Autocomplete
                    options={data.languages}
                    label="Language"
                    field="languages"
                    placeholder="Print language or select down below"
                    selected={profileListFilter.languages}
                    setFilter={createChangeHandler('languages')}
                />
                <Autocomplete
                    options={data.activities}
                    label="Activity"
                    field="activity"
                    placeholder="Select activity"
                    selected={[profileListFilter.activity]}
                    singleSelect={true}
                    showInput={false}
                    setFilter={createChangeHandler('activity')}
                />
                <FormControl>
                    <FormLabel>Registered Date</FormLabel>
                    <RangeDatepicker
                        selectedDates={profileListFilter.registeredDate}
                        onDateChange={(val) =>
                            setProfileListFilter((prev) => ({
                                ...prev,
                                registeredDate: val,
                            }))
                        }
                        propsConfigs={{
                            dateNavBtnProps: {
                                color: 'cyan',
                            },
                        }}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Followers</FormLabel>

                    <RangeSlider
                        aria-label={['min', 'max']}
                        colorScheme="cyan"
                        defaultValue={[10, 30]}
                    >
                        <RangeSliderTrack>
                            <RangeSliderFilledTrack />
                        </RangeSliderTrack>
                        <RangeSliderThumb index={0} />
                        <RangeSliderThumb index={1} />
                    </RangeSlider>

                    <Flex justifyContent="space-between" gap="4" my="2">
                        <Input placeholder="0" colorScheme="cyan" />
                        <Input placeholder="2157" colorScheme="cyan" />
                    </Flex>
                </FormControl>
            </Stack>
        </Box>
    );
}
