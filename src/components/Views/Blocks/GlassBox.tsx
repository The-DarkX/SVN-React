import React from 'react';
import './GlassBox.css';
import { light } from '../../../utils/ColorScheme';
import { convertToRgba } from '../../../utils/UtilFuncts';

type FixedPositionType = 'top' | 'bottom' | 'none';

const GlassBox: React.FC<{
    children?: any,
    bgColor?: string,
    opacity?: number,
    width?: string,
    fixedPosition?: FixedPositionType,
    edgeRounding?: string,
    padding?: string,
    textColor?: string,
    style?: object,
    transparent?: boolean;
}> = ({
    children,
    bgColor = light,
    opacity = 0.6,
    width = '100%',
    fixedPosition = 'none',
    edgeRounding = "2rem",
    padding = '0',
    textColor = 'white',
    transparent = false,
    style = {}
}) => {
        const fixedTop = {
            position: 'fixed',
            top: '0',
            left: '0'
        };

        const fixedBottom = {
            position: 'absolute',
            transform: 'translate(0, -100%)',
        };

        const fixedNone = {
            position: 'relative'
        };

        let fixedPosStyle = {};

        switch (fixedPosition) {
            case 'top': fixedPosStyle = fixedTop; break;
            case 'bottom': fixedPosStyle = fixedBottom; break;
            case 'none': fixedPosStyle = fixedNone; break;
        }

        const selectedStyle = {
            '--background-color': convertToRgba(bgColor, opacity),
            '--text-color': textColor,
            width: width,
            borderRadius: edgeRounding,
            padding: padding,
            ...fixedPosStyle,
            ...style
        };

        return (
            <div className={`box-container${transparent ? '-transparent' : ''}`} style={selectedStyle}>
                {children}
            </div>
        );
    };

export default GlassBox;