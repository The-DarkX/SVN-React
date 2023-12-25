import React, { useState } from 'react';
import { Stack, Modal, ModalClose, ModalDialog, DialogTitle, DialogContent } from '@mui/joy';
import Thumbnail from './Thumbnail';
import './WorkspaceBox.css';
import { SolidButton } from '../../General/Buttons';
import { useOrganizationService } from '../../../Services/OrganizationService';
import GlassBox from './GlassBox';
import { RequestImageService } from '../../../Services/RequestImageService';



export const WorkspaceBox: React.FC<{ worksiteID: string, imageUrl: string; }> = ({ worksiteID, imageUrl }) => {
    const [open, setOpen] = React.useState<boolean>(false);

    const worksite = useOrganizationService().getOrganizationById(worksiteID);
    const worksiteName = worksite?.organization_name;
    const worksiteAddress = worksite?.address.street + ', ' + worksite?.address.city + ' ' + worksite?.address.postal_code;

    return (
        <GlassBox padding='0.75rem' bgColor='purple' className="workspace-box" style={{ marginBottom: '1rem' }}>
            <Stack direction='row' useFlexGap justifyContent='flex-start' alignItems='center' spacing={5}>
                <div>
                    <Thumbnail imgUrl={imageUrl} size='7rem' backgroundColor='white' overlayColor='rgba(0,0,0,0.1)' />
                </div>
                <div className="workspace-box-text">
                    <h4>{worksiteName}</h4>
                    <p>{worksiteAddress}</p>
                    <SolidButton size='0.75rem' onClick={() => setOpen(true)}>View Location</SolidButton>
                    <Modal
                        aria-labelledby="modal-title"
                        aria-describedby="modal-desc"
                        open={open}
                        onClose={() => setOpen(false)}
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <ModalDialog className='modal-container'>
                            <ModalClose variant='plain' sx={{ m: 1 }} />
                            <DialogTitle sx={{ fontSize: '2rem', color: 'white' }} >{worksite?.organization_name}</DialogTitle>
                            <DialogContent sx={{ color: 'white', backgroundColor: '#252525', borderRadius: '1rem' }}>
                                <Stack className='modal-body' padding='1rem' direction='column' spacing={5} overflow='auto'>
                                    <Stack direction='row' spacing={5}>
                                        <img src="https://imagekit.io/blog/content/images/2019/12/image-optimization.jpg" alt="" style={{ width: '50%' }} />
                                        <div>
                                            <h4>Location</h4>
                                            <p>{worksite?.address.street + ', ' + worksite?.address.city + ', ' + worksite?.address.state + ' ' + worksite?.address.postal_code}</p>
                                        </div>
                                    </Stack>
                                    <div>
                                        <h4>Description</h4>
                                        <p>
                                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam nesciunt velit nostrum, ab sapiente rem consectetur aspernatur mollitia minima? Ipsa magnam iste omnis dolorem a minima quisquam accusantium reprehenderit sequi!
                                            Nihil, eligendi inventore ullam repellat blanditiis quibusdam asperiores similique facere accusantium eos voluptatum eum cupiditate voluptatibus reiciendis. Ea dolorem repellat hic? Magni illum quisquam nostrum animi at voluptatem sunt quas.
                                            Mollitia eaque quibusdam nihil atque consequuntur, suscipit nemo obcaecati, ullam perspiciatis quas autem officia minus saepe voluptate, id fugit architecto maxime? Blanditiis, corporis quidem vero temporibus maiores mollitia nostrum commodi.
                                            Numquam ipsam cum et repellendus, delectus illum omnis quam adipisci consequuntur enim cupiditate, doloremque voluptas vero quos quod totam impedit similique expedita quas temporibus necessitatibus, officia ut. Quaerat, facilis quasi.
                                            Aut asperiores quidem nihil? Veniam totam illo repudiandae culpa nostrum quisquam laborum assumenda maxime nobis accusantium. Facilis repudiandae, inventore non beatae hic maxime tempore, nostrum nihil corporis tenetur placeat? Quas.
                                        </p>
                                    </div>
                                    <SolidButton url={`/workspaces/${worksite?.organization_id}`} size='1rem'>View More</SolidButton>
                                </Stack>
                            </DialogContent>
                        </ModalDialog>
                    </Modal>
                </div>
            </Stack>
        </GlassBox >
    );
};

export const WorkspaceList: React.FC<{ selectedIds: string[]; }> = ({ selectedIds }) => {
    return (
        <div className="workspace-list">
            <h2 style={{ textAlign: 'center', paddingBottom: '1rem', paddingTop: '1rem', color: 'white' }}>Selected Workspaces</h2>
            {selectedIds.map((index) => (
                <WorkspaceBox key={index} worksiteID={index} imageUrl="no-image.png" />
            ))}
        </div>
    );
};