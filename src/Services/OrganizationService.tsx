import { useEffect, useState } from 'react';
import { haversineDistance } from '../utils/UtilFuncts';
import { getCommonArray } from '../utils/UtilFuncts'

export interface Address {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    full_address: string;
    coordinates: { latitude: string, longitude: string; };
}

export interface Image {
    id: number;
    url: string;
    caption: string;
}

export interface Review {
    rating: number;
    comment: string;
}

export interface JobHours {
    Monday: { opening_time: string; closing_time: string; };
    Tuesday: { opening_time: string; closing_time: string; };
    Wednesday: { opening_time: string; closing_time: string; };
    Thursday: { opening_time: string; closing_time: string; };
    Friday: { opening_time: string; closing_time: string; };
    Saturday?: { opening_time: string; closing_time: string; };
    Sunday?: { opening_time: string; closing_time: string; };
}

export interface Job {
    job_id: string;
    job_position: string;
    available_positions: number;
    job_location: Address;
    job_hours: JobHours;
    skills_required: string[];
}

export interface OrganizationContent {
    images: Image[];
    short_description: string;
    long_description: string;
    reviews: {
        average_rating: number;
        individual_reviews: Review[];
    };
}

export interface Organization {
    organization_id: string;
    organization_name: string;
    address: Address;
    organization_content: OrganizationContent;
    jobs: Job[];
}

export function useOrganizationService() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        // Load organizations from local storage on component mount
        const storedOrganizations = JSON.parse(localStorage.getItem('organizations') || '[]');
        setOrganizations(storedOrganizations);

        const allJobs: Job[] = organizations.flatMap((organization) => organization.jobs);
        setJobs(allJobs);
    }, []);

    // Create a new organization
    const createOrganization = (organization: Organization) => {
        setOrganizations((prevOrganizations) => [...prevOrganizations, organization]);
        updateLocalStorage(organizations);
    };

    const createJob = (job: Job, organizationId: string) => {
        const changedOrg = getOrganizationById(organizationId);
        changedOrg?.jobs.push(job);
        if (changedOrg)
            updateOrganization(organizationId, changedOrg);
        else
            console.warn("Cannot Create Job... Organization is null");
    };

    const getJobs = (idOnly: boolean = false) => {
        const allJobs: Job[] = organizations.flatMap((organization) => organization.jobs);
        const allJobIds: string[] = allJobs.map((job) => job.job_id);

        if (idOnly)
            return allJobIds;
        else
            return allJobs;
    };

    const getJobById = (jobId: string) => {
        const job: Job | undefined = jobs.find((job) => job.job_id === jobId);
        return job;
    };

    const updateJob = (changedJob: Job, jobId: string) => {
        //go through all organizations and find where job that has the same id as jobid
        // create a new org that has the job with jobid updated to changedJob
        //update org
    };

    const deleteJob = (jobId: string) => {
        //go through all organizations and find where job that has the same id as jobid
        //create a new organization that doesn't have the selected job
        //update organization with the new organization
    }

    // Read organizations
    const getOrganizations = () => {
        return organizations;
    };

    // Find an organization by its ID
    const getOrganizationById = (id: string) => {
        const foundOrganization = organizations.find(org => org.organization_id === id);
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
    // const filterOrganizationsBySkills = (skills: string[]) => {
    //     return organizations.filter((org) => skills.some((skill) => org.professional_skills.includes(skill)));
    // };

    const filterLocationsBySkills = (skills: string[]) => {
        const filteredSkills = jobs.filter((job) => skills.some((skill) => job.skills_required.includes(skill)));
        return filteredSkills.map((job) => job.job_id);
    };

    const filterLocationsByPositions = (positions: string[]) => {
        const filteredPositions = jobs.filter((job: Job) => positions.includes(job.job_position));
        return filteredPositions.map((job) => job.job_id);
    };

    const filterLocationsByRating = (rating: number) => {
        const filteredOrgs = organizations.filter((org) => org.organization_content.reviews.average_rating >= rating);
        const selectedJobs = filteredOrgs.flatMap(org => org.jobs);
        return selectedJobs.map((job) => job.job_id);
    };

    const filterLocationsByDistance = (jobsList: Job[], maxDistance: number, currentLatLng: [number, number]) => {
        const jobsWithDistances = jobsList.map((job) => ({
            ...job,
            distance: haversineDistance(currentLatLng[0], currentLatLng[1], parseFloat(job.job_location.coordinates.latitude), parseFloat(job.job_location.coordinates.longitude)),
        }));

        const filteredJobs = jobsWithDistances.filter((obj) => obj.distance <= maxDistance);
        return filteredJobs.map((job) => job.job_id);
    };

    const findNearestLocations = (latitude: number, longitude: number) => {
        // Calculate distances and add them to the organizations
        const locationsWithDistances = jobs.map((job) => ({
            ...job,
            distance: haversineDistance(latitude, longitude, parseFloat(job.job_location.coordinates.latitude), parseFloat(job.job_location.coordinates.longitude)),
        }));

        // Sort organizations by distance
        locationsWithDistances.sort((a, b) => a.distance - b.distance);
        const selectedIds = locationsWithDistances.map((job) => job.job_id);
        return selectedIds;
    };

    const filterOrganizationsByAll = (skills: { label: string; }[], positions: { label: string; }[], rating: number, maxDistance: number, currentLatLng: [number, number]) => {
        let filteredBySkills: string[] = [];
        let filteredByPosition: string[] = [];
        let filteredByRating: string[] = [];
        let filteredByDistance: string[] = [];

        const skillsArray = skills.map(item => item.label);
        const positionsArray = positions.map(item => item.label);

        if (skills.length > 0)
            filteredBySkills = filterLocationsBySkills(skillsArray);
        else
            filteredBySkills = findNearestLocations(currentLatLng[0], currentLatLng[1]);

        if (positions.length > 0)
            filteredByPosition = filterLocationsByPositions(positionsArray);
        else
            filteredByPosition = [];

        if (rating)
            filteredByRating = filterLocationsByRating(rating);
        else
            filteredByRating = [];

        if (maxDistance > 0 && maxDistance < 50)
            filteredByDistance = filterLocationsByDistance(jobs, maxDistance, currentLatLng);
        else
            filteredByDistance = filterLocationsByDistance(jobs, 100, currentLatLng);

        const combinedFilter = getCommonArray(filteredBySkills, filteredByPosition, filteredByRating, filteredByDistance);

        return combinedFilter;
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
        findNearestLocations,
        filterOrganizationsByAll,
        filterLocationsByDistance,
        filterLocationsByPositions,
        filterLocationsByRating,
        filterLocationsBySkills,
        getAllFilterOptions,
        getJobs,
        getJobById,
        createJob,
        updateJob,
        deleteJob
    };
}