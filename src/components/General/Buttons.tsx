import React from 'react';
import { primary } from "../../utils/ColorScheme";
import { changeColorExposure } from '../../utils/UtilFuncts';

import './Buttons.css';

type btnType = "button" | "submit" | "reset" | undefined;

export const OutlineButton: React.FC<{
    children?: any,
    size?: string,
    color?: string,
    textColor?: string,
    url?: string,
    type?: btnType,
    newTab?: boolean,
    className?: string,
    onClick?: any,
    style?: {};
}> = ({
    children,
    size,
    color = primary,
    textColor = 'white',
    url,
    type = 'button',
    newTab = false,
    onClick,
    className,
    style,
    ...rest
}) => {
        const btnStyle = {
            fontSize: size,
            '--btn-regular-color': color,
            '--btn-hover-color': color,
            '--btn-active-color': changeColorExposure(color, 0.1),
            '--btn-text-color': textColor,
            ...style
        };

        return (
            <>
                {url ? (
                    <a href={url} target={newTab ? '_blank' : '_self'} onClick={onClick}>
                        <button className={`btn-outline ${className}`} type={type} style={btnStyle} {...rest}>
                            {children}
                        </button>
                    </a>
                ) : (
                        <button className={`btn-outline ${className}`} type={type} style={btnStyle} {...rest}>
                        {children}
                    </button>
                )}
            </>
        );
    };

export const SolidButton: React.FC<{
    children?: any,
    size?: string,
    color?: string,
    textColor?: string,
    url?: string,
    style?: {},
    type?: btnType,
    onClick?: any,
    className?: string,
    newTab?: boolean;
}> = ({
    children,
    size,
    color = primary,
    textColor = 'white',
    url,
    type = 'button',
    newTab = false,
    onClick,
    className,
    style,
    ...rest
}) => {
        const btnStyle = {
            fontSize: size,
            '--btn-regular-color': color,
            '--btn-hover-color': changeColorExposure(color, 0.05),
            '--btn-active-color': changeColorExposure(color, 0.1),
            '--btn-text-color': textColor,
            ...style
        };

        return (
            <>
                {url ? (
                    <a href={url} target={newTab ? '_blank' : '_self'} onClick={onClick}>
                        <button className={`btn-solid ${className}`} type={type} style={btnStyle}  {...rest}>
                            {children}
                        </button>
                    </a>
                ) : (
                        <button className={`btn-solid ${className}`} type={type} style={btnStyle} {...rest}>
                        {children}
                    </button>
                )}
            </>
        );
    };

export const EmptyButton: React.FC<{
    children?: any,
    size?: string,
    url?: string,
    type?: btnType,
    newTab?: boolean,
    onClick?: any,
    className?: string,
    style?: {};
}> = ({
    children,
    size,
    url,
    type = 'button',
    newTab = false,
    onClick,
    className,
    style,
    ...rest
}) => {
        const btnStyle = {
            fontSize: size,
            ...style
        };

        return (
            <>
                {url ? (
                    <a href={url} target={newTab ? '_blank' : '_self'} onClick={onClick}>
                        <button className={`btn-none ${className}`} type={type} style={btnStyle} {...rest}>
                            {children}
                        </button>
                    </a>
                ) : (
                        <button className={`btn-none ${className}`} type={type} style={btnStyle} {...rest}>
                        {children}
                    </button>
                )}
            </>
        );
    };