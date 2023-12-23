import ContentBlock from '../Blocks/ContentBlock';
import ContentBanner from '../Blocks/ContentBanner';
import { primaryGradient } from '../../../utils/ColorScheme';

import { OutlineButton } from '../../General/Buttons';
import { Stack } from '@mui/joy';

const Home = () => {
    const bannerGradient = {
        background: 'linear-gradient(45deg, rgba(2,48,71,1) 0%, rgba(33,158,188,1) 30%, rgba(142,202,230,1) 50%, rgba(255,183,3,1) 50%, rgba(251,133,0,1) 70%, rgba(123,8,40,1) 100%)',
        color: 'white',
        paddingBottom: '20rem'
    };
    return (
        <div>
            <div style={{ position: 'relative' }}>
                <ContentBanner size='full' bgGradient={bannerGradient}>
                    <Stack direction='column' spacing={5}>
                        <h1>Welcome to SVN!</h1>
                        <h2>
                            Need help with your business or want to help your
                            community?
                        </h2>
                        <OutlineButton url='' size='1.5em'>Sign Up Now!</OutlineButton>
                    </Stack>
                </ContentBanner>

                {/* <object data="wave (2).svg" type="image/svg+xml" style={{ width: '100%', position: 'absolute', bottom: '0', left: '0', userSelect: 'none' }}></object> */}
            </div>

            <ContentBlock img='people_group.png' reverseAlign={false}>
                <h3>Why Us?</h3>
                <p>SNV is a volunteering managemnet system that simplifies
                    the process of connecting volunteers with organizations in need.
                    Whether you're an individual looking to contribute your time
                    and skills, or an organization seeking volunteers to your
                    cause, SVN has you convered.</p>
            </ContentBlock>
            <div style={{ position: 'relative' }}>
                <object data="wave (2).svg" type="image/svg+xml" style={{ width: '100%', position: 'absolute', top: '-1%', left: '0', transform: 'rotate(180deg)', userSelect: 'none' }}></object>

                <ContentBlock img='small_business.png' reverseAlign={true} padding='20rem 2rem' style={{ ...primaryGradient() }}>
                    <h3>Volunteering Automated...</h3>
                    <p>Effortlessly manage your volunteer program with SVN's
                        intuitive platform. Easily create volunteer opportunities, track
                        volunteer hours, and communicate with your volunteer all in
                        one place. Say goodbye to filling out papers and scrambling
                        for signatures, SVN automates everything for you, so you can focus on what's important.
                    </p>
                    <OutlineButton size='1.25rem'>Start Now</OutlineButton>
                </ContentBlock>
                <object data="wave (2).svg" type="image/svg+xml" style={{ width: '100%', position: 'absolute', bottom: '-1%', left: '0', userSelect: 'none' }}></object>
            </div>
            <ContentBlock img='community.png' reverseAlign={false}>
                <h3>World At Your Step!</h3>
                <p>Our intuitive map is designed to make your search for
                    volunteer locations a breeze. Simply enter your location or use
                    the map's interactive features to explore nearby options. With
                    our user-friendly interface, you can quickly identify volunteer
                    organizations, events, and projects that align with your
                    interests and availability.
                </p>
                <OutlineButton size='1.25rem' textColor='black'>View Locations</OutlineButton>
            </ContentBlock>
            <div style={{ marginBottom: '15rem' }}></div>
        </div>
    );
};

export default Home;

