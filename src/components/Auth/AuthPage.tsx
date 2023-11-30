import React, { useState } from 'react';
import { Stack, Grid, Button } from '@mui/joy';
import ContentBanner from '../Views/Blocks/ContentBanner';
import GlassBox from '../Views/Blocks/GlassBox';

import Login from './Login';
import Register from './Register';

import './AuthPage.css';

const Prompt: React.FC<{ isSignIn: boolean; onToggleSignIn: () => void; }> = ({
    isSignIn,
    onToggleSignIn,
}) => {
    if (isSignIn) {
        return (
            <>
                <h2>Howdy Friend!</h2>
                <p>New to our website? Register down below to unlock your potential!</p>
                <Button type="button" onClick={onToggleSignIn} size='lg'>
                    {isSignIn ? "Sign Up" : "Log In"}
                </Button>
            </>
        );
    } else {
        return (
            <>
                <h2>Welcome Back Friend!</h2>
                <p>Already have an account? Log in down below!</p>
                <Button type="button" onClick={onToggleSignIn} size='lg'>
                    {isSignIn ? "Sign Up" : "Log In"}
                </Button>
            </>
        );
    }
};

const AuthPage: React.FC = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    const toggleSignIn = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <ContentBanner size='fit' style={{ minHeight: '100vh' }} imgUrl='https://preview.free3d.com/img/2018/08/2705062933989164650/zgwtre5k.jpg' overlayColor='rgba(0,0,0,0.5)'>
            <Stack direction={{ xs: 'column', sm: 'row' }} paddingBottom='5rem' spacing={{ xs: 1, sm: 2, md: 4 }} useFlexGap alignItems='center' justifyContent='center'>
                <GlassBox padding='2rem' style={{ flexBasis: '60%' }}>
                    <Grid md={6} xs={12}>
                        {isSignIn ? <Login /> : <Register />}
                    </Grid>
                </GlassBox>
                <GlassBox padding='2rem' style={{ flexBasis: '40%' }}>
                    <Grid md={6} xs={12}>
                        <Prompt isSignIn={isSignIn} onToggleSignIn={toggleSignIn} />
                    </Grid>
                </GlassBox>
            </Stack>
        </ContentBanner >
    );
};

export default AuthPage;