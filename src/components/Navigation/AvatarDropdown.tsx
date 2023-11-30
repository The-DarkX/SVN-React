import { Grid, Dropdown, Menu, MenuButton, MenuItem, Badge, Avatar } from "@mui/joy";

const AvatarDropdown = () => {
    return (
        <Grid container xs={2} justifyContent='flex-end'>
            <Dropdown>
                <MenuButton className='nav-avatar-btn' variant='soft'>
                    <Badge badgeInset="14%" color="danger">
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </Badge>
                </MenuButton>
                <Menu>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My account</MenuItem>
                    <MenuItem>Logout</MenuItem>
                </Menu>
            </Dropdown>
        </Grid>
    );
};

export default AvatarDropdown;