import React, { useState } from 'react';
import { Drawer, Stack, Box, Slider, Autocomplete } from '@mui/joy';
import { EmptyButton, SolidButton } from '../../General/Buttons';

import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOrganizationService } from '../../../Services/OrganizationService';

import './FilterMenu.css';

let filterOptionsData = { distance: 0, skillPreferences: [] };

let subscribers: Function[] = [];

const setFilterOptionsData = (newData) => {
    filterOptionsData = newData;
    subscribers.forEach((subscriber) => {
        subscriber(filterOptionsData);
    });
};

const getFilterOptionsData = () => {
    return filterOptionsData;
};

const subscribeToUpdate = (updateFn) => {
    subscribers.push(updateFn);
};

const unsubscribe = (updateFn) => {
    subscribers = subscribers.filter((subscriber) => subscriber !== updateFn);
};




const FilterMenu: React.FC = () => {
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    const toggleDrawer =
        (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setOpen(inOpen);
        };

    const organizationsJSON = useOrganizationService().getOrganizations();

    const uniqueProfessionalSkills = [...new Set(organizationsJSON.flatMap(org => org.professional_skills))];

    const skillObjects = uniqueProfessionalSkills.map(skill => ({ label: skill }));

    const marks = [
        {
            value: 0,
            label: '1mi',
        },
        {
            value: 10,
            label: '5mi',
        },
        {
            value: 20,
            label: '10mi',
        },
        {
            value: 30,
            label: '15mi',
        },
        {
            value: 40,
            label: '20mi',
        },
        {
            value: 60,
            label: '30mi'
        },
        {
            value: 80,
            label: '40mi'
        },
        {
            value: 100,
            label: '50mi+',
        }
    ];

    const handleSliderChange = (e: Event, newValue: number | number[]) => {
        const adjustedVal: number = (parseFloat(newValue.toString()) / 100) * 50;
        setSliderValue(adjustedVal);
    };

    const handleForm = (e: any) => {
        e.preventDefault();
        setOpen(false);
        const newFilterData = { distance: sliderValue, skillPreferences: selectedOptions };
        setFilterOptionsData(newFilterData);
    };

    return (
        <Box className='filter-container'>
            <EmptyButton type='button' onClick={toggleDrawer(true)} aria-label="filter" className='filter-menu-btn'>
                <FontAwesomeIcon icon={faFilter} fontSize='1.25rem' />
            </EmptyButton>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor='right' size='lg'>
                <Box role="presentation">
                    <form id='filterForm' onSubmit={handleForm}>
                        <Stack direction='column' padding='3rem' spacing='3rem'>
                            <h3 style={{ textAlign: 'center' }}>Search Filters</h3>
                            <div>
                                <h4>Max Distance</h4>
                                <Slider
                                    color={"warning"}
                                    aria-label="Always visible"
                                    defaultValue={0}
                                    // getAriaValueText={valueText}
                                    step={5}
                                    // value={value}
                                    onChange={handleSliderChange}
                                    marks={marks}
                                    valueLabelDisplay="off"
                                    id='slider'
                                />
                            </div>
                            <div>
                                <h4>Desired Job Types</h4>
                                <Autocomplete
                                    multiple
                                    placeholder="Skills"
                                    limitTags={3}
                                    options={skillObjects}
                                    getOptionLabel={option => option.label}
                                    id='skillsList'
                                    onChange={(event, value) => setSelectedOptions(value.map((obj) => obj.label))}
                                />
                            </div>
                            <SolidButton size='1rem' type='submit'>Search</SolidButton>
                        </Stack>
                    </form>
                </Box>
            </Drawer>
        </Box>
    );
};

export { filterOptionsData };
export { setFilterOptionsData, getFilterOptionsData, subscribeToUpdate, unsubscribe };

export default FilterMenu;