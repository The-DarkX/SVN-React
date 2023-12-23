import React from 'react';

import { Grid, Stack } from '@mui/joy';

import './ContentBlock.css';

const ContentBlock: React.FC<{ img: string, reverseAlign?: boolean, children?: any, style?: object, id?: string, padding?: string; }> = ({ img, reverseAlign = false, children, style, id, padding = '3rem 2rem' }) => {
    return (
        <div id={id}>
            <Stack direction={!reverseAlign ? 'row' : 'row-reverse'} flexWrap='wrap' spacing={1} alignItems='center' textAlign={reverseAlign ? 'end' : 'start'} alignContent='flex-start' justifyContent='space-around' sx={{ ...style, padding }}>
                <Grid container xs={12} md={5} justifyContent={reverseAlign ? 'flex-end' : 'flex-start'}>
                    {children}
                </Grid>
                <Grid container xs={12} md={5}>
                    <div className="content-img-container">
                        <img src={img} alt="" className='content-img' />
                    </div>
                </Grid>
            </Stack>
        </div>
    );
};

export default ContentBlock;