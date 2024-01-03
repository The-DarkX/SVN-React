import { useEffect, useState } from 'react';
import { haversineDistance } from '../utils/UtilFuncts';


interface Address {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    full_address: string;
    coordinates: { lat: string, lng: string; };
}

interface Image {
    id: number;
    url: string;
    caption: string;
}

interface Review {
    rating: number;
    comment: string;
}

interface JobHours {
    Monday: { opening_time: string; closing_time: string; };
    Tuesday: { opening_time: string; closing_time: string; };
    Wednesday: { opening_time: string; closing_time: string; };
    Thursday: { opening_time: string; closing_time: string; };
    Friday: { opening_time: string; closing_time: string; };
    Saturday?: { opening_time: string; closing_time: string; };
    Sunday?: { opening_time: string; closing_time: string; };
}

interface Job {
    job_id: string;
    job_position: string;
    available_positions: number;
    job_location: Address;
    job_hours: JobHours;
    skills_required: string[];
}

interface OrganizationContent {
    images: Image[];
    short_description: string;
    long_description: string;
    reviews: {
        average_rating: number;
        individual_reviews: Review[];
    };
}

interface Organization {
    organization_id: string;
    organization_name: string;
    address: Address;
    organization_content: OrganizationContent;
    jobs: Job[];
}

export function useOrganizationService() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    useEffect(() => {
        // Load organizations from local storage on component mount
        const storedOrganizations = JSON.parse(localStorage.getItem('organizations') || '[]');
        setOrganizations(storedOrganizations);
    }, []);

    // Create a new organization
    const createOrganization = (organization: Organization) => {
        setOrganizations((prevOrganizations) => [...prevOrganizations, organization]);
        updateLocalStorage(organizations);
    };

    // Read organizations
    const getOrganizations = () => {
        return organizations;
    };

    // Find an organization by its ID
    const getOrganizationById = (organizationId: string) => {
        const foundOrganization = organizations.find((org) => org.organization_id === organizationId);
        return foundOrganization || null; // Return null if the organization is not found
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

    // Filter organizations by professional skills
    const filterOrganizationsBySkills = (skills: string[]) => {
        return organizations.filter((org) => skills.some((skill) => org.professional_skills.includes(skill)));
    };

    const filterOrganizationsByAll = (skills: { label: string; }[], maxDistance: number, currentLatLng: [number, number]) => {
        let filteredBySkills = null;
        // console.log(filterOrganizationsBySkills(skills));

        const skillsArray = skills.map(item => item.label)

        if (skills.length > 0)
            filteredBySkills = filterOrganizationsBySkills(skillsArray);
        else
            filteredBySkills = findNearestOrganizations(currentLatLng[0], currentLatLng[1]);

        const filteredByDistance = filterOrganizationsByDistance(filteredBySkills, maxDistance, currentLatLng);
        return filteredByDistance;
    };

    // Find the nearest organizations based on current location (latitude, longitude)
    const findNearestOrganizations = (latitude: number, longitude: number) => {
        // Calculate distances and add them to the organizations
        const organizationsWithDistances = organizations.map((org) => ({
            ...org,
            distance: haversineDistance(latitude, longitude, parseFloat(org.address.coordinates.latitude), parseFloat(org.address.coordinates.longitude)),
        }));

        // Sort organizations by distance
        organizationsWithDistances.sort((a, b) => a.distance - b.distance);

        return organizationsWithDistances;
    };

    const filterOrganizationsByDistance = (organizations: Organization[], maxDistance: number, currentLatLng: [number, number]) => {
        const organizationsWithDistances = organizations.map((org) => ({
            ...org,
            distance: haversineDistance(currentLatLng[0], currentLatLng[1], parseFloat(org.address.coordinates.latitude), parseFloat(org.address.coordinates.longitude)),
        }));

        const filteredOrganizations = organizationsWithDistances.filter((obj) => obj.distance <= maxDistance);
        return filteredOrganizations;
    };

    // Update local storage with the latest organizations data
    const updateLocalStorage = (data: Organization[]) => {
        localStorage.setItem('organizations', JSON.stringify(data));
    };

    const getAllFilterOptions = () => {
        const skills = Array.from(new Set(organizations
            .flatMap((org) => org.jobs.map((job) => job.skills_required))
            .reduce((accumulator, skills) => [...accumulator, ...skills], [])
        ));

        const jobPositions = Array.from(new Set(organizations
            .flatMap((org) => org.jobs.map((job) => job.job_position))
        ));

        return { skillsList: skills, jobPositionsList: jobPositions };
    }

    return {
        createOrganization,
        getOrganizations,
        getOrganizationById,
        updateOrganization,
        deleteOrganization,
        filterOrganizationsBySkills,
        findNearestOrganizations,
        filterOrganizationsByDistance,
        filterOrganizationsByAll,
        getAllFilterOptions
    };
}