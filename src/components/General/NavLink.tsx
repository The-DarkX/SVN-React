import React from 'react';

import './NavLink.css';

const NavLink: React.FC<{ text: string, link?: string, openInNewPage?: boolean, color?: string; }> = ({ text, link = '#', openInNewPage = false, color = 'white' }) => {
    return (
        <a href={link} className='nav-link' target={openInNewPage ? '_blank' : '_top'} style={{ color: color }}>{text}</a>

    );
};

export default NavLink;