import GlassBox from '../Views/Blocks/GlassBox';
import { Stack } from '@mui/joy';
import NavLink from '../General/NavLink';

let showFooter = true;

const Footer = () => {
    if (!showFooter) return;
    return (
        <GlassBox fixedPosition='bottom' edgeRounding='2em 2em 0 0' padding='2rem 0 1rem 0' bgColor='#121212' textColor='#fff' opacity={1}>
            <Stack direction='row' spacing='1rem' padding=' 0 0 1rem 0' alignItems='center' justifyContent='center'>
                <NavLink text='Help' />
                <NavLink text='About' />
                <NavLink text='Devlog' />
                <NavLink text='Privacy' />
                <NavLink text='Terms' />
                <NavLink text='Team' />
            </Stack>
            <h5 style={{ textAlign: 'center', fontSize: '1.2rem' }}>Copyright © 2023 Student Volunteer Network</h5>
        </GlassBox>
    );
};

export const toogleFooterVisibility = () => { showFooter = !showFooter; };
export const hideFooterVisibility = () => { showFooter = false; };
export const showFooterVisibility = () => { showFooter = true; };

export default Footer;