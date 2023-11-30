import { Button, Input, Grid, Stack } from '@mui/joy';

import PasswordField from '../General/PasswordField';

const Login = () => {

    return (
        <Stack direction='column' spacing={2}>
            <h2>Login</h2>
            <Input color="neutral" size="md" variant="soft" placeholder='Email' />
            <PasswordField />
            <Grid md={2}>
                <Button variant='solid' size='lg'>Log In</Button>
            </Grid>
        </Stack>
    );
};

export default Login;