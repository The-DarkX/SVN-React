import React, { useEffect, useState } from 'react';
import { Stack, Modal, ModalClose, ModalDialog, DialogTitle, DialogContent, Grid } from '@mui/joy';
import './WorkspaceBox.css';
import { SolidButton } from '../../General/Buttons';
import { Image, useOrganizationService, Organization, Workspace } from '../../../Services/OrganizationService';


export const WorkspaceBox: React.FC<{ worksiteID: string; }> = ({ worksiteID }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [worksite, setWorksite] = useState<Workspace>();
    const [organization, setOrganization] = useState<Organization>();

    const organizationService = useOrganizationService(); // Move the hook call outside

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedWorksite = await organizationService.getWorkspaceById(worksiteID);
                setWorksite(fetchedWorksite);
                const fetchedOrganization = await organizationService.getOrganizationById(worksite?.organization_id);
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

    const worksiteName = worksite.workspace_position;
    const worksiteAddress = worksite.workspace_location?.full_address;
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
                    <DialogTitle sx={{ fontSize: '2rem', color: 'white' }} >{organization.organization_name}</DialogTitle>
                    <DialogContent sx={{ color: 'white', backgroundColor: '#252525', borderRadius: '1rem' }}>
                        <Grid container columnSpacing={10} width={'100%'} padding='2rem'>
                            <Grid xs={6}>
                                <h3 style={{ paddingBottom: '1rem' }}>{worksite.workspace_position}</h3>
                                <h4>Description</h4>
                                <p>{organization.organization_content.long_description}</p>
                            </Grid>
                            <Grid xs={6}>
                                <Stack direction='column' spacing={4}>
                                    {/* <img src={worksiteImages[0].url + "/" + worksiteID} loading='lazy' alt={worksiteImages[0].caption} style={{ height: '25rem', objectFit: 'cover', borderRadius: '1rem' }} /> */}

                                    <div id="imageCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" >
                                        <div className="carousel-inner" style={{ borderRadius: '2rem', aspectRatio: '4/3' }}>
                                            {worksiteImages.map((img) => (
                                                <div key={img.id} className={`carousel-item ${img.id === 0 ? "active" : ""}`}>
                                                    <img src={img.url + "/" + img.id} className="d-block w-100 carousel-img" alt={img.caption} />
                                                </div>
                                            ))}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>

                                    <div>
                                        <h4>Location</h4>
                                        <p>{worksiteAddress}</p>
                                    </div>
                                    <SolidButton url={`/workspaces/${worksite?.workspace_id}`} size='1rem'>View More</SolidButton>
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