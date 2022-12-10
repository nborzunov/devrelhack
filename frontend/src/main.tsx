import './index.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import App from './App';
import { ProfileDetails } from './components/ProfileDetails';
import { ProfileList } from './components/ProfileList/ProfileList';

const theme = extendTheme({
    colors: {
        blue: {
            50: '#F6F8FA',
        },
    },
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/profile/:profileId',
        element: <ProfileDetails />,
    },
    {
        path: '/profiles',
        element: <ProfileList />,
    },
]);

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <ChakraProvider theme={theme}>
        <RecoilRoot>
            <RouterProvider router={router} />
        </RecoilRoot>
    </ChakraProvider>,
);
