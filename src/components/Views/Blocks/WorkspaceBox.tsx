import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Stack, Breadcrumbs } from '@mui/joy';
import Thumbnail from './Thumbnail';
import './WorkspaceBox.css';
import { SolidButton } from '../../General/Buttons';
import { secondaryGradient } from '../../../utils/ColorScheme';
import { useOrganizationService } from '../../../Services/OrganizationService';
import GlassBox from './GlassBox';
import { RequestImageService } from '../../../Services/RequestImageService';



export const WorkspaceBox: React.FC<{ worksiteID: string, imageUrl: string; }> = ({ worksiteID, imageUrl }) => {
    const workspaceboxStyles = {
        ...secondaryGradient('45deg')
    };

    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleClick = () => {
        // Append workspaceId to URL params on button click
        navigate(`/mapboard?selectedWorkspace=${worksiteID}`);
    };

    const worksite = useOrganizationService().getOrganizationById(worksiteID);
    const worksiteName = worksite?.organization_name;
    const worksiteAddress = worksite?.address.street + ', ' + worksite?.address.city + ' ' + worksite?.address.postal_code;

    return (
        // <div className="workspace-box" style={workspaceboxStyles}>
        <GlassBox padding='0.75rem' bgColor='purple' className="workspace-box" style={{ marginBottom: '1rem' }}>
            <Stack direction='row' useFlexGap justifyContent='flex-start' alignItems='center' spacing={5}>
                <div>
                    <Thumbnail imgUrl={imageUrl} size='7rem' backgroundColor='white' overlayColor='rgba(0,0,0,0.1)' />
                </div>
                <div className="wo  rkspace-box-text">
                    <h4>{worksiteName}</h4>
                    <p>{worksiteAddress}</p>
                    <SolidButton size='0.75rem' onClick={handleClick}>View Location</SolidButton>
                </div>
            </Stack>
        </GlassBox>
        // </div>
    );
};

export const WorkspaceList: React.FC<{ selectedIds: string[]; }> = ({ selectedIds }) => {
    const [searchParams] = useSearchParams();
    const selectedWorkspace = searchParams.get('selectedWorkspace');
    const worksite = useOrganizationService().getOrganizationById(selectedWorkspace);

    const navigate = useNavigate();

    // Function to clear query parameters and navigate to the same location
    const clearQueryParams = () => {
        navigate('.', { replace: true }); // Navigating to the current location without query parameters
    };    

    if (!selectedWorkspace) {
        return (
            <div className="workspace-list">
                <h2 style={{ textAlign: 'center', paddingBottom: '1rem', paddingTop: '1rem', color: 'white' }}>Selected Workspaces</h2>
                <Breadcrumbs size='lg' sx={{ color: 'white' }}>
                    <a href="" onClick={clearQueryParams}>Map</a>
                    <p>Cluster</p>
                </Breadcrumbs>
                {selectedIds.map((index) => (
                    <WorkspaceBox key={index[0]} worksiteID={index[0]} imageUrl="no-image.png" />
                ))}
            </div>
        );
    }
    else {
        return (
            <Stack className='selected-workspace' padding='1rem' direction='column' spacing={5}>
                <Breadcrumbs size='lg' style={{ color: 'white' }}>
                    <a href="" onClick={clearQueryParams}>Map</a>
                    <a href='#' onClick={clearQueryParams}>Cluster</a>
                    <p>{worksite?.organization_name}</p>
                </Breadcrumbs>
                <h3 style={{ color: 'white' }}>{worksite?.organization_name}</h3>
                <img src="https://imagekit.io/blog/content/images/2019/12/image-optimization.jpg" alt="" style={{ width: '100%' }} />
                <div>
                    <h4 style={{ color: 'white' }}>Location</h4>
                    <p style={{ color: 'white' }}>{worksite?.address.street + ', ' + worksite?.address.city + ', ' + worksite?.address.state + ' ' + worksite?.address.postal_code}</p>
                </div>
                <div>
                    <h4 style={{ color: 'white' }}>Description</h4>
                    <p style={{ color: 'white' }}>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam nesciunt velit nostrum, ab sapiente rem consectetur aspernatur mollitia minima? Ipsa magnam iste omnis dolorem a minima quisquam accusantium reprehenderit sequi!
                    Nihil, eligendi inventore ullam repellat blanditiis quibusdam asperiores similique facere accusantium eos voluptatum eum cupiditate voluptatibus reiciendis. Ea dolorem repellat hic? Magni illum quisquam nostrum animi at voluptatem sunt quas.
                    Mollitia eaque quibusdam nihil atque consequuntur, suscipit nemo obcaecati, ullam perspiciatis quas autem officia minus saepe voluptate, id fugit architecto maxime? Blanditiis, corporis quidem vero temporibus maiores mollitia nostrum commodi.
                    Numquam ipsam cum et repellendus, delectus illum omnis quam adipisci consequuntur enim cupiditate, doloremque voluptas vero quos quod totam impedit similique expedita quas temporibus necessitatibus, officia ut. Quaerat, facilis quasi.
                        Aut asperiores quidem nihil? Veniam totam illo repudiandae culpa nostrum quisquam laborum assumenda maxime nobis accusantium. Facilis repudiandae, inventore non beatae hic maxime tempore, nostrum nihil corporis tenetur placeat? Quas.
                    </p>
                </div>
                <SolidButton url={`/workspaces/${worksite?.organization_id}`} size='1rem'>View More</SolidButton>
            </Stack>
        );
    }
};