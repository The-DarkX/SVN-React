export const rgbToRgba = (rgb: string, alpha: number): string => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
        throw new Error("Invalid RGB color format");
    }

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const hexToRgba = (hex: string, alpha: number): string => {
    const hexColor = hex.replace(/^#/, '');
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const convertToRgba = (colorStr: string, alpha: number): string => {
    const div = document.createElement('div');
    div.style.color = colorStr;
    document.body.appendChild(div);

    // Get the computed color in RGB format
    const computedColor = window.getComputedStyle(div).color;

    // Clean up the HTML element
    document.body.removeChild(div);

    // Check if the computed color is a valid RGB format
    const rgbRegex = /rgb\((\d+), (\d+), (\d+)\)/;
    const matches = rgbRegex.exec(computedColor);
    if (matches) {
        const [_, r, g, b] = matches;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return `rgba(0,0,0,0)`;
};

export const convertToRgb = (colorStr: string): string => {
    const div = document.createElement('div');
    div.style.color = colorStr;
    document.body.appendChild(div);

    // Get the computed color in RGB format
    const computedColor = window.getComputedStyle(div).color;

    // Clean up the HTML element
    document.body.removeChild(div);

    // Check if the computed color is a valid RGB format
    const rgbRegex = /rgb\((\d+), (\d+), (\d+)\)/;
    const matches = rgbRegex.exec(computedColor);
    if (matches) {
        const [_, r, g, b] = matches;
        return `rgb(${r}, ${g}, ${b})`;
    }

    return `rgb(0,0,0,0)`;
};

export const changeColorExposure = (colorStr: string, lightnessMultiplier: number) => {
    const originalRGB = convertToRgb(colorStr);

    const match = originalRGB.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
        throw new Error("Invalid RGB color format");
    }
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    const darkerR = Math.max(0, r - Math.ceil(r * lightnessMultiplier));
    const darkerG = Math.max(0, g - Math.ceil(g * lightnessMultiplier));
    const darkerB = Math.max(0, b - Math.ceil(b * lightnessMultiplier));

    return `rgb(${darkerR},${darkerG},${darkerB})`;
};

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function convertMilesToKilometers(miles: number): number {
    const kilometersPerMile = 1.60934;
    const kilometers = miles * kilometersPerMile;
    return kilometers;
}

export function getCommonArray<T>(...arrays: T[][]): T[] {
    const nonEmptyArrays = arrays.filter(arr => arr.length > 0);

    if (nonEmptyArrays.length === 0) return [];

    const [firstArray, ...remainingArrays] = nonEmptyArrays;
    return firstArray.filter(item => remainingArrays.every(arr => arr.includes(item)));
}