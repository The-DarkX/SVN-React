// export const WorkspaceBox: React.FC<{ worksiteID: string; }> = ({ worksiteID }) => {
//     const [open, setOpen] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [worksite, setWorksite] = useState<any>(null);
//     const [organization, setOrganization] = useState<any>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const fetchedWorksite = await useOrganizationService().getJobById(worksiteID);
//                 const fetchedOrganization = await useOrganizationService().getOrganizationByJobId(worksiteID);

//                 setWorksite(fetchedWorksite);
//                 setOrganization(fetchedOrganization);
//             }
//             catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [worksiteID]);
import React, { useEffect, useState } from 'react';
import { Stack, Modal, ModalClose, ModalDialog, DialogTitle, DialogContent, Grid } from '@mui/joy';
import './WorkspaceBox.css';
import { SolidButton } from '../../General/Buttons';
import { Image, useOrganizationService, Organization, Job } from '../../../Services/OrganizationService';

export const WorkspaceBox: React.FC<{ worksiteID: string; }> = ({ worksiteID }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [worksite, setWorksite] = useState<Job>();
    const [organization, setOrganization] = useState<Organization>();
    const organizationService = useOrganizationService(); // Move the hook call outside

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data for worksiteID:', worksiteID);

                const fetchedWorksite = await organizationService.getJobById(worksiteID);
                const fetchedOrganization = await organizationService.getOrganizationByJobId(worksiteID);

                console.log('Fetched worksite:', fetchedWorksite);
                console.log('Fetched organization:', fetchedOrganization);

                setWorksite(fetchedWorksite);
                setOrganization(fetchedOrganization);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [organizationService, worksiteID]);


    if (loading) {
        return <div style={{ color: 'white' }}>Loading...</div>;
    }

    if (!worksite || !organization) {
        return <div style={{ color: 'white' }}>Error loading data</div>;
    }

    const worksiteName = worksite.job_position || "test";
    const worksiteAddress = worksite.job_location?.full_address || "address test";
    const worksiteImages: Image[] = organization.organization_content.images || [
        { url: '/no-image.png', caption: 'no image', id: 0 }
    ];

    return (
        <>
            <div className="workspace-box">
                <Stack onClick={() => setOpen(true)} direction='column' useFlexGap justifyContent='center' alignItems='center' spacing={2}>
                    <div className='img-container'>
                        <img src={worksiteImages[0].url + "/" + worksiteID} loading='lazy' alt={worksiteImages[0].caption} />
                    </div>
                    <div className='box-content-container'>
                        <h4>{worksiteName}</h4>
                        <p>{worksiteAddress}</p>
                    </div>
                </Stack>
            </div>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <ModalDialog className='modal-container'>
                    <ModalClose variant='plain' sx={{ m: 1 }} />
                    <DialogTitle sx={{ fontSize: '2rem', color: 'white' }} >{worksite?.job_position}</DialogTitle>
                    <DialogContent sx={{ color: 'white', backgroundColor: '#252525', borderRadius: '1rem' }}>
                        <Grid container columnSpacing={10} width={'100%'} padding='2rem'>
                            <Grid xs={6}>
                                <h4>Description</h4>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam nesciunt velit nostrum, ab sapiente rem consectetur aspernatur mollitia minima? Ipsa magnam iste omnis dolorem a minima quisquam accusantium reprehenderit sequi!
                                    Nihil, eligendi inventore ullam repellat blanditiis quibusdam asperiores similique facere accusantium eos voluptatum eum cupiditate voluptatibus reiciendis. Ea dolorem repellat hic? Magni illum quisquam nostrum animi at voluptatem sunt quas.
                                    Mollitia eaque quibusdam nihil atque consequuntur, suscipit nemo obcaecati, ullam perspiciatis quas autem officia minus saepe voluptate, id fugit architecto maxime? Blanditiis, corporis quidem vero temporibus maiores mollitia nostrum commodi.
                                    Numquam ipsam cum et repellendus, delectus illum omnis quam adipisci consequuntur enim cupiditate, doloremque voluptas vero quos quod totam impedit similique expedita quas temporibus necessitatibus, officia ut. Quaerat, facilis quasi.
                                    Aut asperiores quidem nihil? Veniam totam illo repudiandae culpa nostrum quisquam laborum assumenda maxime nobis accusantium. Facilis repudiandae, inventore non beatae hic maxime tempore, nostrum nihil corporis tenetur placeat? Quas.
                                </p>
                            </Grid>
                            <Grid xs={6}>
                                <Stack direction='column' spacing={4}>
                                    <img src={worksiteImages[0].url + "/" + worksiteID} loading='lazy' alt={worksiteImages[0].caption} style={{ height: '25rem', objectFit: 'cover', borderRadius: '1rem' }} />

                                    <div>
                                        <h4>Location</h4>
                                        <p>{worksiteAddress}</p>
                                    </div>
                                    <SolidButton url={`/workspaces/${worksite?.job_id}`} size='1rem'>View More</SolidButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </>
    );
};

export const WorkspaceList: React.FC<{ selectedIds: string[]; }> = ({ selectedIds }) => {

    if (selectedIds.length > 0) {
        return (
            <Grid
                container
                rowSpacing={5}
                columnSpacing={{ xs: 1, sm: 3, md: 5 }}
                sx={{ width: '100%' }}
            >
                {selectedIds.map((index) => (
                    <Grid xs={6} key={index}>
                        <WorkspaceBox worksiteID={index} />
                    </Grid>
                ))}
            </Grid>
        );
    }
    else {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <h2 style={{ color: 'white' }}>No Locations Available</h2>
            </div>
        );
    }
};

// export const WorkspaceBox: React.FC<{ worksiteID: string; }> = ({ worksiteID }) => {
//     const [open, setOpen] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [worksite, setWorksite] = useState<any>(null);
//     const [organization, setOrganization] = useState<any>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const fetchedWorksite = await useOrganizationService().getJobById(worksiteID);
//                 const fetchedOrganization = await useOrganizationService().getOrganizationByJobId(worksiteID);

//                 setWorksite(fetchedWorksite);
//                 setOrganization(fetchedOrganization);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [worksiteID]);

//     // if (loading) {
//     //     return <div style={{ color: 'white' }}>Loading...</div>;
//     // }

//     if (!worksite || !organization) {
//         return <div style={{ color: 'white' }}>Error loading data</div>;
//     }

//     return (
//         <div>
//             <h4>{worksite.job_position || "test"}</h4>
//             <p>{worksite.job_location?.full_address || "address test"}</p>
//         </div>
//     );
// };

// export const WorkspaceList: React.FC<{ selectedIds: string[]; }> = ({ selectedIds }) => {

//     if (selectedIds.length > 0) {
//         return (
//             <Grid
//                 container
//                 rowSpacing={5}
//                 columnSpacing={{ xs: 1, sm: 3, md: 5 }}
//                 sx={{ width: '100%' }}
//             >
//                 {selectedIds.map((index) => (
//                     <Grid xs={6} key={index}>
//                         <WorkspaceBox worksiteID={index} />
//                     </Grid>
//                 ))}
//             </Grid>
//         );
//     }
//     else {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//                 <h2 style={{ color: 'white' }}>No Locations Available</h2>
//             </div>
//         );
//     }
// };