import { Organization, Workspace } from '../Services/OrganizationService';
import { useEffect, useState } from 'react';
import { useOrganizationService, Image, WorkDay, Address } from '../Services/OrganizationService';

export interface GeoJSONProps {
    "workspace_id": string,
    "organization_id": string,
    "workspace_position": string,
    "skills_required": string[],
    "workspace_location": Address,
    "available_positions": number,
    "workspace_hours": WorkDay[],
    "images": Image[],
    "short_description": string,
    "long_description": string;
}

export interface GeoJSONFeature {
    type: 'Feature';
    properties: GeoJSONProps;
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
}

interface GeoJSONCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

export function convertToGeoJSON(data: Workspace[]): GeoJSONCollection {
    const [organizations, setOrganizations] = useState<Organization[]>();

    const organizationService = useOrganizationService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedWorksite = await organizationService.fetchOrganizations();
                setOrganizations(fetchedWorksite);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const features: GeoJSONFeature[] = data.map((workspace) => {
        const { workspace_id, workspace_position, workspace_location, skills_required, available_positions, workspace_hours, organization_id } = workspace;
        const org = organizations?.find((org) => org.id == workspace.organization_id);
        const latitude = workspace_location.lat;
        const longitude = workspace_location.lng;

        const { images, short_description, long_description } = org!.organization_content;
        const feature: GeoJSONFeature = {
            type: 'Feature',
            properties: {
                workspace_id,
                organization_id,
                workspace_position,
                "skills_required": skills_required,
                workspace_location,
                available_positions,
                "workspace_hours": workspace_hours,
                "images": images,
                short_description,
                long_description
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