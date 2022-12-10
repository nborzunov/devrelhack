import { Avatar, Box, Text } from '@chakra-ui/react';

import { mockProfileDetails } from '../types/mockdata';

export const ProfileDetails = () => {
    const profile = mockProfileDetails;

    return (
        <Box m="8">
            <Box>
                <Avatar src={profile.photoSrc} />
                <Text fontSize="xl" fontWeight="bold">
                    {profile.fullName}
                </Text>
                <Text fontSize="md" color="gray.600">
                    {profile.location}
                </Text>
            </Box>
        </Box>
    );
};
