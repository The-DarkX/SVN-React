import ContentBlock from '../Blocks/ContentBlock';
import ContentBanner from '../Blocks/ContentBanner';
import { primaryGradient } from '../../../utils/ColorScheme';
import { OutlineButton } from '../../General/Buttons';

const About = () => {
    return (
        <div>
            <div style={{ position: 'relative' }}>
                <ContentBanner size='half' imgUrl='about-banner.jpg' overlayColor='rgba(0,0,0,0.7)' style={{ textAlign: 'left', color: 'white' }}>
                    <div>
                        <h1>About Us</h1>
                        {/* <div style={{ width: '100%' }}>awdwad</div> */}
                        <h2>Get to know our awesome team and our mission</h2>
                    </div>
                </ContentBanner>

                {/* <object data="wave (2).svg" type="image/svg+xml" style={{ width: '100%', position: 'absolute', bottom: '0', left: '0', userSelect: 'none' }}></object> */}
            </div>

            <ContentBlock img='people_group.png' reverseAlign={false}>
                <h3>Meet Our Team</h3>
                <p>Our talented and dedicated team is ready to serve you.</p>
            </ContentBlock>
            <div style={{ position: 'relative' }}>
                <object data="wave (2).svg" type="image/svg+xml" style={{ width: '100%', position: 'absolute', top: '-1%', left: '0', transform: 'rotate(180deg)', userSelect: 'none' }}></object>

                <ContentBlock img='small_business.png' reverseAlign={true} padding='20rem 2rem' style={{ ...primaryGradient() }}>
                    <h3>Our Mission</h3>
                    <p>Discover our commitment and purpose.</p>
                    <p>Explain your company's mission, values, and goals in this section.</p>
                    {/* <OutlineButton size='1.25rem'>Start Now</OutlineButton> */}
                </ContentBlock>
                <object data="wave (2).svg" type="image/svg+xml" style={{ width: '100%', position: 'absolute', bottom: '-1%', left: '0', userSelect: 'none' }}></object>
            </div>
            <ContentBlock img='community.png' reverseAlign={false}>
                <h3>Our History</h3>
                <p>Learn about our journey and milestones.</p>
                <p>Share the history of your company, including significant achievements and developments.</p>
                {/* <OutlineButton size='1.25rem' textColor='black'>View Locations</OutlineButton> */}
            </ContentBlock>
            <div style={{ marginBottom: '15rem' }}></div>
        </div>
    );
};

export default About;