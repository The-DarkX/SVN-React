import { useEffect, useState } from 'react';
import { haversineDistance } from '../utils/UtilFuncts';
import { getCommonArray } from '../utils/UtilFuncts'
import axios from 'axios';

// import organizationData from '../../Organization Generator/organizations_data.json'

export interface Address {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    full_address: string;
    lat: string;
    lng: string;
}

export interface Image {
    id: number;
    url: string;
    caption: string;
}

export interface Review {
    author: string;
    rating: number;
    comment: string;
}

export interface WorkDay {
    weekDay: string;
    opening_time: string;
    closing_time: string;
}

export interface Workspace {
    workspace_id: string;
    organization_id: string;
    workspace_position: string;
    available_positions: number;
    workspace_location: Address;
    workspace_hours: WorkDay[];
    skills_required: string[];
}

export interface OrganizationContent {
    images: Image[];
    short_description: string;
    long_description: string;
    average_rating: number;
    individual_reviews: Review[];
}

export interface Organization {
    id: string;
    organization_name: string;
    organization_content: OrganizationContent;
    workspaces: Workspace[];
}

export function useOrganizationService() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    const saveToken = (token: string) => {
        localStorage.setItem('jwtToken', token);
    };

    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const fetchOrganizations = async (): Promise<Organization[]> => {
        try {
            const response = await axios.get('http://localhost:8088/api/organizations');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch organizations');
        }
    };

    const fetchWorkspaces = async (): Promise<Workspace[]> => {
        try {
            const response = await axios.get('http://localhost:8088/api/workspaces');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch workspaces');
        }
    };

    // Create a new organization
    const createOrganization = (organization: Organization) => {
        setOrganizations((prevOrganizations) => [...prevOrganizations, organization]);
        updateLocalStorage(organizations);
    };

    const createworkspace = (workspace: Workspace, organizationId: string) => {
        const changedOrg = getOrganizationById(organizationId);
        changedOrg?.workspaces.push(workspace);
        if (changedOrg)
            updateOrganization(organizationId, changedOrg);
        else
            console.warn("Cannot Create workspace... Organization is null");
    };

    const getWorkspaces = (idOnly: boolean = false) => {
        const allworkspaces: Workspace[] = organizations.flatMap((organization) => organization.workspaces);
        const allworkspaceIds: string[] = allworkspaces.map((workspace) => workspace.workspace_id);

        if (idOnly)
            return allworkspaceIds;
        else
            return allworkspaces;
    };

    const getWorkspaceById = async (workspaceId: string): Promise<Workspace | undefined> => {
        if (!workspaceId) return undefined;

        try {
            const response = await axios.get(`http://localhost:8088/api/workspaces/${workspaceId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch workspace, id: ${workspaceId}`);
        }
    };

    const getOrganizationById = async (organizationId: string): Promise<Organization | undefined> => {
        if (!organizationId) return undefined;

        try {
            const response = await axios.get(`http://localhost:8088/api/organizations/${organizationId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch organization, id: ${organizationId}`);
        }
    };

    // const updateworkspace = (changedworkspace: workspace, workspaceId: string) => {
    //     //go through all organizations and find where workspace that has the same id as workspaceid
    //     // create a new org that has the workspace with workspaceid updated to changedworkspace
    //     //update org
    // };

    // const deleteworkspace = (workspaceId: string) => {
    //     //go through all organizations and find where workspace that has the same id as workspaceid
    //     //create a new organization that doesn't have the selected workspace
    //     //update organization with the new organization
    // }

    // Read organizations
    const getOrganizations = () => {
        return organizations;
    };

    // Find an organization by its ID
    // const getOrganizationById = (id: string | undefined) => {
    //     if (!id) return undefined

    //     const foundOrganization = organizations.find(org => org.organization_id === id);
    //     return foundOrganization; // Return null if the organization is not found
    // };

    const getOrganizationByWorkspaceId = (workspaceId: string | undefined): Organization | undefined => {
        if (!workspaceId) return undefined

        const organizationWithworkspace = organizations.find((org) =>
            org.workspaces.some((workspace) => workspace.workspace_id === workspaceId)
        );
        return organizationWithworkspace;
    };

    // Update an organization
    const updateOrganization = (organizationId: string, updatedOrganization: Organization) => {
        const updatedOrganizations = organizations.map((org) =>
            org.organization_id === organizationId ? updatedOrganization : org
        );
        setOrganizations(updatedOrganizations);
        updateLocalStorage(updatedOrganizations);
    };

    // Delete an organization
    const deleteOrganization = (organizationId: string) => {
        const filteredOrganizations = organizations.filter((org) => org.organization_id !== organizationId);
        setOrganizations(filteredOrganizations);
        updateLocalStorage(filteredOrganizations);
    };

    const filterLocationsBySkills = (skills: string[]) => {
        const filteredSkills = workspaces.filter((workspace) => skills.some((skill) => workspace.skills_required.includes(skill)));
        return filteredSkills.map((workspace) => workspace.workspace_id);
    };

    const filterLocationsByPositions = (positions: string[]) => {
        const filteredPositions = workspaces.filter((workspace: Workspace) => positions.includes(workspace.workspace_position));
        return filteredPositions.map((workspace) => workspace.workspace_id);
    };

    const filterLocationsByRating = (rating: number) => {
        const filteredOrgs = organizations.filter((org) => org.organization_content.average_rating >= rating);
        const selectedworkspaces = filteredOrgs.flatMap(org => org.workspaces);
        return selectedworkspaces.map((workspace) => workspace.workspace_id);
    };

    const filterLocationsByDistance = (workspacesList: Workspace[], maxDistance: number, currentLatLng: [number, number]) => {
        const workspacesWithDistances = workspacesList.map((workspace) => ({
            ...workspace,
            distance: haversineDistance(currentLatLng[0], currentLatLng[1], parseFloat(workspace.workspace_location.lat), parseFloat(workspace.workspace_location.lng)),
        }));

        const filteredworkspaces = workspacesWithDistances.filter((obj) => obj.distance <= maxDistance);
        return filteredworkspaces.map((workspace) => workspace.workspace_id);
    };

    const findNearestLocations = (latitude: number, longitude: number) => {
        // Calculate distances and add them to the organizations
        const locationsWithDistances = workspaces.map((workspace) => ({
            ...workspace,
            distance: haversineDistance(latitude, longitude, parseFloat(workspace.workspace_location.lat), parseFloat(workspace.workspace_location.lng)),
        }));

        // Sort organizations by distance
        locationsWithDistances.sort((a, b) => a.distance - b.distance);
        const selectedIds = locationsWithDistances.map((workspace) => workspace.workspace_id);
        return selectedIds;
    };

    const filterLocationsByAll = (skills: { label: string; }[], positions: { label: string; }[], rating: number, maxDistance: number, currentLatLng: [number, number]) => {
        let filteredBySkills: string[] = [];
        let filteredByPosition: string[] = [];
        let filteredByRating: string[] = [];
        let filteredByDistance: string[] = [];

        let filterOptions: string[][] = [];

        const skillsArray = skills.map(item => item.label);
        const positionsArray = positions.map(item => item.label);

        if (skills.length > 0) {
            filteredBySkills = filterLocationsBySkills(skillsArray);
            filterOptions.push(filteredBySkills);
        }
        else
            filteredBySkills = [];

        if (positions.length > 0) {
            filteredByPosition = filterLocationsByPositions(positionsArray);
            filterOptions.push(filteredByPosition);
        }
        else
            filteredByPosition = [];

        if (rating > 0) {
            filteredByRating = filterLocationsByRating(rating);
            filterOptions.push(filteredByRating);
        }
        else
            filteredByRating = [];

        if (maxDistance >= 0 && maxDistance < 50)
            filteredByDistance = filterLocationsByDistance(workspaces, maxDistance, currentLatLng);
        else {
            filteredByDistance = filterLocationsByDistance(workspaces, 100, currentLatLng);
        }
        filterOptions.push(filteredByDistance);

        const combinedFilter = getCommonArray(...filterOptions);

        if (filterOptions.length > 0) {
            return combinedFilter;
        }
        else {
            return findNearestLocations(currentLatLng[0], currentLatLng[1]);
        }
    };

    // Update local storage with the latest organizations data
    const updateLocalStorage = (data: Organization[]) => {
        localStorage.setItem('organization_data', JSON.stringify(data));
    };

    const getAllFilterOptions = () => {
        const skills = Array.from(new Set(organizations
            .flatMap((org) => org.workspaces.map((workspace) => workspace.skills_required))
            .reduce((accumulator, skills) => [...accumulator, ...skills], [])
        ));

        const workspacePositions = Array.from(new Set(organizations
            .flatMap((org) => org.workspaces.map((workspace) => workspace.workspace_position))
        ));

        return { skillsList: skills, workspacePositionsList: workspacePositions };
    }

    return {
        createOrganization,
        getOrganizations,
        getOrganizationById,
        getOrganizationByWorkspaceId,
        updateOrganization,
        deleteOrganization,
        findNearestLocations,
        filterLocationsByAll,
        filterLocationsByDistance,
        filterLocationsByPositions,
        filterLocationsByRating,
        filterLocationsBySkills,
        getAllFilterOptions,
        getWorkspaces,
        getWorkspaceById,
        createworkspace,
        saveToken,
        fetchOrganizations,
        fetchWorkspaces,
        // updateworkspace,
        // deleteworkspace
    };
}