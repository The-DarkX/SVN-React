import { useParams } from "react-router-dom";
import { useOrganizationService } from "../../../Services/OrganizationService";
import ContentBanner from "../Blocks/ContentBanner";

const Workspace = () => {
    const { id } = useParams();

    const workspace = useOrganizationService().getOrganizationById(id);

    const name = workspace?.organization_name;

    if (!workspace) {
        return (
            <ContentBanner size="full" bgColor="#a0a0b0">
                <h2 style={{ textAlign: 'center' }}>Workspace Not Found</h2>
            </ContentBanner>
        );
    }

    return (
        <div style={{ height: '100vh' }}>
            <h1>{name}</h1>
        </div>
    );
};

export default Workspace;