import ContentBanner from "../Blocks/ContentBanner";
import { OutlineButton } from "../../General/Buttons";
import { primaryGradient, secondaryGradient } from "../../../utils/ColorScheme";

export const PageNotFound = () => {
    document.title = 'SVN | 404';

    return (
        <ContentBanner size='full' bgGradient={secondaryGradient()} >
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <OutlineButton type="button" size="1em">Go Back</OutlineButton>
        </ContentBanner >
    );
};

export const UnderMaintenance = () => {
    document.title = 'SVN | Under Maintenance';

    return (
        <ContentBanner size='full' bgGradient={secondaryGradient()} >
            <h1>Website Under Maintenance</h1>
            <h2>Come back in a few...</h2>
            <OutlineButton type="button" url="/" size="1em">Reload Page</OutlineButton>
        </ContentBanner >
    );
};

export const ComingSoon = () => {
    document.title = 'SVN | Coming Soon';

    return (
        <ContentBanner size='full' bgGradient={primaryGradient('-45deg')} >
            <h1>Coming Soon</h1>
            <h2>Sorry for the dust, we're renovating our digital home. Don't worry the cleanup crew is on their way!</h2>
        </ContentBanner >
    );
};