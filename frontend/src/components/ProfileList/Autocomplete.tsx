import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
} from '@chakra-ui/react';
import { GroupBase, Select } from 'chakra-react-select';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { profileListFilterState } from '../../store/atoms';
import { Option } from '../../types/types';
export function Autocomplete({
    options,
    label,
    field,
    showInput = true,
    selected,
    singleSelect = false,
    setFilter,
}: {
    options: Option[];
    label: string;
    field: string;
    placeholder: string;
    showInput?: boolean;
    singleSelect?: boolean;
    selected: Array<string | null>;
    setFilter?: any;
}) {
    const [opened, setOpened] = useState(false);

    const setValue = useSetRecoilState(profileListFilterState);
    const optionsToView = [...options].map((item) => ({
        ...item,
        selected: selected.includes(item.label),
    }));

    function handleChange(option: Option, value: boolean) {
        let newValue: string | Array<string | null> | null;
        if (singleSelect) {
            newValue = value ? option.label : null;
        } else {
            newValue = value
                ? [...selected, option.label]
                : [...selected].filter((item) => item !== option.label);
        }

        console.log(newValue);
        setValue((prev) => {
            return { ...prev, [field]: newValue };
        });
        setFilter(newValue);
    }

    function handleChangeMultiSelect(value: any) {
        console.log(value);
        setValue((prev) => {
            return { ...prev, [field]: value };
        });
        setFilter(selected);
    }
    return (
        <Box>
            <FormControl>
                <FormLabel>{label}</FormLabel>
                {showInput && (
                    // <InputGroup>
                    //     <Input placeholder="Search..." />
                    //     <InputRightElement>
                    //         <SearchIcon color="cyan.500" />
                    //     </InputRightElement>
                    // </InputGroup>
                    <Select<Option, true, GroupBase<Option>>
                        isMulti
                        name="colors"
                        options={optionsToView}
                        placeholder="Search..."
                        closeMenuOnSelect={false}
                        value={optionsToView.filter((option) => option.selected)}
                        onChange={handleChangeMultiSelect}
                    />
                )}
            </FormControl>
            <Box my="2">
                <CheckboxGroup colorScheme="cyan">
                    <Stack spacing={1}>
                        {(opened ? optionsToView : optionsToView.slice(0, 5)).map(
                            (option) => (
                                <Checkbox
                                    key={option.label}
                                    isChecked={option.selected}
                                    onChange={(e) =>
                                        handleChange(option, e.target.checked)
                                    }
                                >
                                    {option.label}{' '}
                                    <Text as="span" color="gray.400">
                                        ({option.count})
                                    </Text>
                                </Checkbox>
                            ),
                        )}
                    </Stack>
                </CheckboxGroup>
                {options.length > 5 && (
                    <Button
                        variant="link"
                        colorScheme="cyan"
                        size="sm"
                        onClick={() => setOpened(!opened)}
                        my="2"
                    >
                        {opened ? 'Show Less' : 'Show More'}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
