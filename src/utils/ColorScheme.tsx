export const primary = '#fb8500';
export const warning = '#ffb703';
export const danger = '#7B0828';
export const secondary = '#219ebc';
export const light = '#8ecae6';
export const dark = '#023047';

export function primaryGradient(angle: string = '60deg') {
    const grad = {
        background: `linear-gradient(${angle}, rgba(255,183,3,1) 0%, rgba(251,133,0,1) 50%, rgba(123,8,40,1) 100%, rgba(111,156,183,1) 023047%)`,
        color: 'white'
    };
    return grad;
}

export function secondaryGradient(angle: string = '60deg') {
    const grad = {
        background: `linear-gradient(${angle}, rgba(142,202,230,1) 0%, rgba(33,158,188,1) 50%, rgba(2,48,71,1) 100%)`,
        color: 'white'
    };
    return grad;
}