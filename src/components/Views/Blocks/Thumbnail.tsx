import React from "react";
import './Thumbnail.css';

const Thumbnail: React.FC<{ imgUrl: string, size: string, backgroundColor?: string, overlayColor?: string; }> = ({ imgUrl, size, backgroundColor = 'transparent', overlayColor = 'rgba(0,0,0,0.5)' }) => {
    const thumbStyle = {
        '--thumb-size': size,
        '--thumb-img': imgUrl,
        '--thumb-background-color': backgroundColor,
        '--thumb-overlay-color': overlayColor
    };

    return (
        <div className="thumbnail-container" style={{ ...thumbStyle }}>
            <img src={imgUrl} alt="" />
            <div className="thumbnail-overlay"></div>
        </div>
    );
};

export default Thumbnail;