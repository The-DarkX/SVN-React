import React from 'react';
import { Stack } from '@mui/joy';

type SizeType = 'full' | 'half' | 'fit';

const ContentBanner: React.FC<{ children?: any, imgUrl?: string, bgColor?: string, bgGradient?: any, overlayColor?: string, size: SizeType, itemSpacing?: number, style?: {}; }> = ({ children, imgUrl, bgColor, bgGradient, overlayColor, size = 'full', itemSpacing, style }) => {
    const fullSize = {
        height: '100vh'
    };

    const halfSize = {
        height: '60vh'
    };

    const fitSize = {
        height: 'fit-content'
    };

    let selectedSize = null;

    switch (size) {
        case 'full': selectedSize = fullSize; break;
        case 'half': selectedSize = halfSize; break;
        case 'fit': selectedSize = fitSize; break;
    }

    let backgroundStyles = {};
    if (imgUrl) {
        backgroundStyles = {
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        };
    }
    if (bgColor) {
        backgroundStyles = {
            backgroundColor: bgColor
        };
    }
    if (bgGradient) {
        backgroundStyles = bgGradient;
    }

    const overlayStyles: React.CSSProperties = {
        backgroundColor: overlayColor,
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    };

    const textStyles: React.CSSProperties = {
        left: '0',
        margin: '0',
        position: 'relative',
        top: '50%',
        marginInline: '8rem'
    };

    return (
        <div className='banner-container' style={{ ...selectedSize, ...backgroundStyles, ...style }}>
            <div style={{ ...overlayStyles }}>
                <Stack direction='column' spacing={itemSpacing} alignItems='center' justifyContent='center' sx={textStyles}>
                    {children}
                </Stack>
            </div>

        </div>
    );
};

export default ContentBanner;