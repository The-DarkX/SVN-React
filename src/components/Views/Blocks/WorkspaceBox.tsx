import React from 'react';
import { Stack } from '@mui/joy';
import Thumbnail from './Thumbnail';
import './WorkspaceBox.css';
import { SolidButton } from '../../General/Buttons';
import { secondaryGradient } from '../../../utils/ColorScheme';
import { hideFooterVisibility, showFooterVisibility } from '../../Navigation/Footer';
import { useOrganizationService } from '../../../Services/OrganizationService';

export const WorkspaceBox: React.FC<{ worksiteID: string, imageUrl: string; }> = ({ worksiteID, imageUrl }) => {
    const workspaceboxStyles = {
        ...secondaryGradient('45deg')
    };

    const worksite = useOrganizationService().getOrganizationById(worksiteID);
    const worksiteName = worksite?.organization_name;
    const worksiteAddress = worksite?.address.street + ', ' + worksite?.address.city + ' ' + worksite?.address.postal_code;

    return (
        <div className="workspace-box" style={workspaceboxStyles}>
            <Stack direction='row' useFlexGap justifyContent='flex-start' alignItems='center' spacing={5}>
                <div>
                    <Thumbnail imgUrl={imageUrl} size='7rem' backgroundColor='white' overlayColor='rgba(0,0,0,0.1)' />
                </div>
                <div className="workspace-box-text">
                    <h4>{worksiteName}</h4>
                    <p>{worksiteAddress}</p>
                </div>
                <SolidButton size='0.9rem' url={`/workspaces/${worksiteID}`}>View Location</SolidButton>
            </Stack>
        </div>
    );
};

export const WorkspaceList: React.FC<{ selectedIds: string[]; }> = ({ selectedIds }) => {
    if (selectedIds.length === 0) {
        hideFooterVisibility();
        return;
    }
    else {
        showFooterVisibility();


    }
    return (
        <div className="workspace-list" style={{ paddingBottom: '20rem' }}>
            <h2 style={{ textAlign: 'center', paddingTop: '7rem', paddingBottom: '3rem' }}>Workspaces</h2>
            {selectedIds.map((index) => (
                <WorkspaceBox key={index[0]} worksiteID={index[0]} imageUrl="no-image.png" />
            ))}
        </div>
    );
};