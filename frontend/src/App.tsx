import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

function App() {
    return (
        <Container minH="100vh" h="100%" w="100vw" m="0">
            <Grid templateColumns="3fr 7fr" w="100vw" h="100vh">
                <GridItem h="100%">
                    <Box backgroundColor="white"></Box>
                </GridItem>
                <GridItem h="100%" backgroundColor="blue.50">
                    <Box h="100%"></Box>
                </GridItem>
            </Grid>
        </Container>
    );
}

export default App;
