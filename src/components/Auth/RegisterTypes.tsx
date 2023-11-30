// import React, { useState } from "react";
import { Grid, Input, Button } from '@mui/joy';

import PasswordField from '../General/PasswordField';

export const PersonalRegister = () => {
    return (
        <Grid container
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Grid xs={12}>
                <h2>Register</h2>
            </Grid>
            <Grid xs={12} mb='20px'>
                <Input color="neutral" disabled={false} size="md" variant="soft" placeholder='Email' />
            </Grid>
            <Grid xs={12} mb='20px'>
                <PasswordField />
            </Grid>
            <Grid xs={12} mb='20px'>
                <PasswordField placeholder='Confirm Password' />
            </Grid>
            <Grid xs={12}>
                <Button variant="solid" size='lg'>Sign Up</Button>
            </Grid>
        </Grid>
    );
};

export const BusinessRegister = () => {
    return (
        <Grid container
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Grid xs={12}>
                <h2>Register</h2>
            </Grid>
            <Grid xs={12} mb='20px'>
                <Input color="neutral" type='text' size="md" variant="soft" placeholder='Business Name' />
            </Grid>
            <Grid xs={12} mb='20px'>
                <Input color="neutral" type='email' size="md" variant="soft" placeholder='Email' />
            </Grid>
            <Grid xs={12} mb='20px'>
                <Input color="neutral" type='text' size="md" variant="soft" placeholder='Address' />
            </Grid>
            <Grid xs={12} mb='20px'>
                <PasswordField />
            </Grid>
            <Grid xs={12} mb='20px'>
                <PasswordField placeholder='Confirm Password' />
            </Grid>
            <Grid xs={12}>
                <Button variant="solid" size='lg'>Sign Up</Button>
            </Grid>
        </Grid>
    );
};
