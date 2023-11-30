import { Grid } from "@mui/joy";
import NavLink from "../General/NavLink";

const NavLinks = () => {
    return (
        <>
            <Grid container md={2} justifyContent='flex-start'>
                <a href="#" className='nav-brand'>SVN</a>
            </Grid>
            <Grid container md={8} justifyContent='center'>
                <NavLink text="Home" link="/" />
                <NavLink text="About" link="/about" />
                <NavLink text="Map" link="/mapboard" />
                <NavLink text="Dashboard" />
            </Grid>
        </>
    );
};

export default NavLinks;