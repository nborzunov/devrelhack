import { Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

export function DateColumn({ value }: { value: string }) {
    return <Text>{dayjs(value).format('MMMM DD, YYYY')}</Text>;
}
