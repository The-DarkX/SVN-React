import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/joy';
import './Navbar.css';

import GlassBox from '../Views/Blocks/GlassBox';
import AvatarDropdown from './AvatarDropdown';
import NavLinks from './NavLinks';

const Navbar: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className="navbar">
            <GlassBox fixedPosition='top' edgeRounding='0 0 2em 2em' bgColor='#121212' opacity={0.7} transparent={scrollPosition === 0}>
                <Stack direction='row' padding='1rem 5rem' alignItems='center' justifyContent='space-between' useFlexGap>
                    <NavLinks />
                    <AvatarDropdown />
                </Stack>
            </GlassBox>
        </header >
    );
};

export default Navbar;