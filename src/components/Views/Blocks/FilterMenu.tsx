import React, { useState, useEffect } from 'react';
import { Drawer, Stack, Box, Slider, Autocomplete } from '@mui/joy';

import { Rating } from '@mui/material';
import { EmptyButton, SolidButton } from '../../General/Buttons';

import { faFilter, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOrganizationService } from '../../../Services/OrganizationService';

import './FilterMenu.css';

export interface FilterOptions {
    distance: number,
    selectedSkills: { label: string; }[],
    selectedJobPositions: { label: string; }[],
    averageRating: number;
};

let filterOptionsData: FilterOptions = { distance: 0, averageRating: 0, selectedSkills: [], selectedJobPositions: [] };

let subscribers: Function[] = [];

const setFilterOptionsData = (newData: any) => {
    filterOptionsData = newData;
    subscribers.forEach((subscriber) => {
        subscriber(filterOptionsData);
    });
};

const getFilterOptionsData = () => {
    return filterOptionsData;
};

const subscribeToUpdate = (updateFn: any) => {
    subscribers.push(updateFn);
};

const unsubscribe = (updateFn: any) => {
    subscribers = subscribers.filter((subscriber) => subscriber !== updateFn);
};

const FilterMenu: React.FC = () => {
    const [sliderValue, setSliderValue] = useState<number>(-1);
    const [selectedSkillOptions, setSelectedSkillOptions] = useState<{ label: string; }[]>([]);
    const [selectedPositionOptions, setSelectedPositionOptions] = useState<{ label: string; }[]>([]);
    const [ratingValue, setRatingValue] = React.useState<number>(-1);

    const [open, setOpen] = useState(false);

    const filterOptions = useOrganizationService().getAllFilterOptions();

    useEffect(() => {
        if (sessionStorage.getItem('filter_options')) {
            // Retrieve values from sessionStorage on mount
            // const storedSliderValue = JSON.parse(sessionStorage.getItem('sliderValue') || '0');
            const storedSelectedOptions: FilterOptions = JSON.parse(sessionStorage.getItem('filter_options') || '{}');

            setSliderValue(storedSelectedOptions.distance || 0);
            setSelectedSkillOptions(storedSelectedOptions.selectedSkills || '');
            setSelectedPositionOptions(storedSelectedOptions.selectedJobPositions || '');
            setRatingValue(storedSelectedOptions.averageRating || 0)

            const newFilterData = storedSelectedOptions;

            setFilterOptionsData(newFilterData);
        }
    }, []);

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

    const skillObjects = filterOptions.skillsList.map((skill: string) => ({ label: skill }));
    const positionObjects = filterOptions.jobPositionsList.map(skill => ({ label: skill }));

    const distanceMarks = [
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

    const handleSliderChange = (_e: Event, newValue: number | number[]) => {
        const adjustedVal: number = (parseFloat(newValue.toString()) / 100) * 50;
        setSliderValue(adjustedVal);
    };

    const handleSkillChange = (_event: any, value: any) => {
        setSelectedSkillOptions(value);
    };

    const handlePositionChange = (_event: any, value: any) => {
        setSelectedPositionOptions(value);
    };

    const handleRatingChange = (_event: any, value: any) => {
        setRatingValue(value);
    };

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setOpen(false);

        const newFilterData: FilterOptions = { distance: sliderValue, selectedSkills: selectedSkillOptions, selectedJobPositions: selectedPositionOptions, averageRating: ratingValue };
        setFilterOptionsData(newFilterData);

        sessionStorage.setItem('filter_options', JSON.stringify(filterOptionsData));
        // console.log(filterOptionsData)
    };

    const handleReset = () => {
        setSliderValue(-1);
        setRatingValue(-1);
        setSelectedSkillOptions([]);
        setSelectedPositionOptions([]);

        setOpen(false);

        const newFilterData: FilterOptions = { distance: sliderValue, selectedSkills: selectedSkillOptions, selectedJobPositions: selectedPositionOptions, averageRating: ratingValue };
        setFilterOptionsData(newFilterData);

        sessionStorage.setItem('filter_options', JSON.stringify(filterOptionsData));
    }

    return (
        <Box className='filter-container'>
            {/* <button type='button' aria-label='filter' className='filter-menu-btn' onClick={toggleDrawer(true)}>
                <FontAwesomeIcon icon={faFilter} fontSize='1.25rem' />
            </button> */}
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
                                    step={sliderValue <= 20 ? 2.5 : 5}
                                    onChange={handleSliderChange}
                                    marks={distanceMarks}
                                    valueLabelDisplay="off"
                                    id='slider'
                                    name='slider'
                                    value={(sliderValue / 50) * 100}

                                />
                            </div>
                            <div>
                                <h4>Skills</h4>
                                <Autocomplete
                                    multiple
                                    placeholder="Select"
                                    limitTags={3}
                                    options={skillObjects}
                                    getOptionLabel={option => option.label}
                                    id='skillsList'
                                    name='skillsList'
                                    isOptionEqualToValue={(option, value) => option.label === value.label}
                                    value={selectedSkillOptions}
                                    onChange={handleSkillChange}
                                />
                            </div>
                            <div>
                                <h4>Job Positions</h4>
                                <Autocomplete
                                    multiple
                                    placeholder="Select"
                                    limitTags={3}
                                    options={positionObjects}
                                    getOptionLabel={option => option.label}
                                    id='jobPosList'
                                    name='jobPosList'
                                    isOptionEqualToValue={(option, value) => option.label === value.label}
                                    value={selectedPositionOptions}
                                    onChange={handlePositionChange}
                                />
                            </div>
                            <div>
                                <h4>Average Rating</h4>
                                <Rating
                                    name="averageRating"
                                    value={ratingValue}
                                    precision={1}
                                    icon={<FontAwesomeIcon icon={faStar} />}
                                    emptyIcon={<FontAwesomeIcon opacity={0.35} icon={faStar} />}
                                    onChange={handleRatingChange}
                                />
                            </div>
                            <Stack direction='row' spacing={5}>
                                <SolidButton size='1rem' type='submit'>Search</SolidButton>
                                <SolidButton size='1rem' type='submit' onClick={handleReset} color='grey'>Reset</SolidButton>
                            </Stack>
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