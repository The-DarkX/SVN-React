interface Address {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    coordinates: {
        latitude: string;
        longitude: string;
    };
}

interface Organization {
    organization_id: string;
    organization_name: string;
    address: Address;
    professional_skills: string[];
}

interface GeoJSONFeature {
    type: 'Feature';
    properties: Organization;
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
}

interface GeoJSONCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

export function convertToGeoJSON(data: Organization[]): GeoJSONCollection {
    const features: GeoJSONFeature[] = data.map((org) => {
        const { organization_id, organization_name, address, professional_skills } = org;
        const { latitude, longitude } = address.coordinates;

        const feature: GeoJSONFeature = {
            type: 'Feature',
            properties: {
                organization_id,
                organization_name,
                professional_skills,
            },
            geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        };

        return feature;
    });

    const geoJSON: GeoJSONCollection = {
        type: 'FeatureCollection',
        features,
    };

    return geoJSON;
}