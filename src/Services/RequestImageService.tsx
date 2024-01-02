import axios from 'axios';

import React, { useEffect, useState } from 'react';

export const getImageUrl: React.FC<{ width?: number; }> = ({ width = 720 }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        async function fetchImageUrl() {
            try {
                const response = await axios.get(`https://source.unsplash.com/collection/484351`);
                let url: string = response.request.responseURL;
                url = url.replace('w=1080', `w=${width.toString()}`);
                setImageUrl(url);
            } catch (error) {
                console.error('There was a problem with the Axios request:', error);
            }
        }
        fetchImageUrl();
    }, []);

    return imageUrl as string;
};