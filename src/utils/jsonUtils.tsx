import { Job } from '../Services/OrganizationService';

interface GeoJSONFeature {
    type: 'Feature';
    properties: Job;
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
}

interface GeoJSONCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

export function convertToGeoJSON(data: Job[]): GeoJSONCollection {
    const features: GeoJSONFeature[] = data.map((org) => {
        const { job_id, job_position, job_location, skills_required, available_positions, job_hours } = org;
        const { latitude, longitude } = job_location.coordinates;

        const feature: GeoJSONFeature = {
            type: 'Feature',
            properties: {
                job_id,
                job_position,
                skills_required,
                job_location,
                available_positions,
                job_hours
            },
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
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