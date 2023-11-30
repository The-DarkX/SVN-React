import React, { useState } from 'react';

import { Switch } from '@mui/joy';

import { BusinessRegister, PersonalRegister } from './RegisterTypes';

const Register = () => {
    const [checked, setChecked] = useState<boolean>(false);

    return (
        <>
            <Switch
                checked={checked}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setChecked(event.target.checked)
                }
                color={checked ? 'success' : 'primary'}
                variant='solid'
                startDecorator='Individual' endDecorator='Business'
            />

            {!checked ? <PersonalRegister /> : <BusinessRegister />}
        </>
    );
};

export default Register;