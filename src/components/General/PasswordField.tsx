import React, { useState } from 'react';
import { Input, Stack, Grid } from '@mui/joy';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './PasswordField.css';

const PasswordField: React.FC<{ placeholder?: string; }> = ({ placeholder = 'Password' }) => {
    const [hidePassword, sethidePassword] = useState(true);
    const togglePasswordVisibility = () => {
        sethidePassword(!hidePassword);
    };

    return (
        <div className="password-field-container">
            <Stack direction='row' useFlexGap>
                <Grid container justifyContent='flex-start' alignItems='center'>
                    <Input type={hidePassword ? 'password' : 'text'} color="neutral" size="md" variant="soft" placeholder={placeholder} />
                </Grid>
                <Grid container justifyContent='flex-end' alignItems='center'>
                    <button onClick={togglePasswordVisibility} className='password-visibility-btn'>
                        <FontAwesomeIcon icon={hidePassword ? faEyeSlash : faEye} fontSize='18px' />
                    </button>
                </Grid>
            </Stack >
        </div>
    );
};

export default PasswordField;