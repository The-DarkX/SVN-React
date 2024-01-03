import './Maps.css';

import React, { ReactElement, useEffect, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { WorkspaceList } from './WorkspaceBox';
import { convertToGeoJSON } from '../../../utils/jsonUtils';
import { useOrganizationService } from '../../../Services/OrganizationService';
import { haversineDistance } from '../../../utils/UtilFuncts';
import FilterMenu, { getFilterOptionsData, subscribeToUpdate, unsubscribe } from './FilterMenu';
import { hideFooterVisibility } from '../../Navigation/Footer';
import { SolidButton } from '../../General/Buttons';
import { renderToString } from 'react-dom/server';
import GlassBox from './GlassBox';
import { Feature } from 'geojson';

mapboxgl.accessToken = process.env.MAPBOX_API_KEY as string;

//#region ClusterMap
export const ClusterMap = () => {
    const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<{ distance: number; skillPreferences: never[]; }>({ distance: 0, skillPreferences: [] });

    const userLocationData: [number, number] = JSON.parse(sessionStorage.getItem('user-location') as string);
    const lastMapPosition: { center: { lng: number, lat: number; }, zoom: number, pitch: number, bearing: number; } = JSON.parse(sessionStorage.getItem('last-map-position') as string);

    const defaultUserData: { userLocation: [number, number], mapPosition: { center: { lng: number, lat: number; }, zoom: number, pitch: number, bearing: number; }; } = {
        userLocation: [-100.255074, 5.142509], mapPosition: { center: { lng: -100.255074, lat: 5.142509 }, zoom: 10, pitch: 0, bearing: 0 }
    }

    /*

    const organizationsJSON = useOrganizationService().getOrganizations();
    const findNearestLocations = useOrganizationService().filterOrganizationsByAll(filterData.skillPreferences, filterData.distance, [userLocationData[1], userLocationData[0]]);

    let useFilter: boolean = true;
    let geojsonData: object = {};
    let filteredJsonArray = [];

    if (filterData.skillPreferences.length > 0 || filterData.distance) useFilter = true;
    else useFilter = false;

    if (!useFilter) {
        filteredJsonArray.push(...organizationsJSON);
    } else {
        filteredJsonArray = organizationsJSON.filter(jsonObj =>
            findNearestLocations.some(customObj => customObj.organization_id === jsonObj.organization_id)
        );
    }

    geojsonData = convertToGeoJSON(filteredJsonArray);

    useEffect(() => {
        if (filterData.skillPreferences.length === 0 || !filterData.distance) {
            const data = getFilterOptionsData();
            setFilterData(data);
        }
    }, []);

    
    useEffect(() => {
        const handleFilterUpdate = (updatedData) => {
            setFilterData(updatedData);
        };

        subscribeToUpdate(handleFilterUpdate);

        const map = new mapboxgl.Map({
            container: 'cluster-map',
            style: 'mapbox://styles/mapbox/dark-v11',
            // style: 'mapbox://styles/mapbox/satellite-streets-v12',

            center: sessionStorage.getItem('last-map-position') === null ?
                (sessionStorage.getItem('user-location') === null ? defaultUserData.userLocation : userLocationData) :
                lastMapPosition.center,
            zoom: sessionStorage.getItem('last-map-position') === null ?
                defaultUserData.mapPosition.zoom :
                lastMapPosition.zoom,
            pitch: sessionStorage.getItem('last-map-position') === null ?
                defaultUserData.mapPosition.pitch :
                lastMapPosition.pitch,
            bearing: sessionStorage.getItem('last-map-position') === null ?
                defaultUserData.mapPosition.bearing :
                lastMapPosition.bearing,
        });

        map.on('style.load', () => {
            map.setFog({
                color: 'rgb(186, 210, 235)', // Lower atmosphere
                'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
                'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                'space-color': 'rgb(11, 11, 25)', // Background color
                'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
            });

            // Insert the layer beneath any symbol layer.
            const layers = map.getStyle().layers;
            const labelLayerId = layers.find(
                (layer) => layer.type === 'symbol' && layer.layout!['text-field']
            )!.id;

            // The 'building' layer in the Mapbox Streets
            // vector tileset contains building height data
            // from OpenStreetMap.

            map.addLayer(
                {
                    'id': 'add-3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#e6aa6a',
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            17,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            17,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            16,
                            1
                        ]
                    }
                },
                labelLayerId
            );
        });

        map.on('load', () => {
            map.loadImage('pin.png', (error, image) => {
                if (error) throw error;
                map.addImage('custom-pin-marker', image!);
            });

            map.addSource('worksites', {
                type: 'geojson',
                data: geojsonData,
                cluster: true,
                clusterMaxZoom: 17, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });

            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'worksites',
                filter: ['has', 'point_count'],
                paint: {
                    //   * Blue, 20px circles when point count is less than 100
                    //   * Yellow, 30px circles when point count is between 100 and 750
                    //   * Pink, 40px circles when point count is greater than or equal to 750
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6',
                        100,
                        '#f1f075',
                        750,
                        '#f28cb1'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });

            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'worksites',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 20
                }
            });

            map.addLayer({
                id: 'unclustered-point',
                type: 'symbol',
                source: 'worksites',
                filter: ['!', ['has', 'point_count']],
                layout: {
                    'icon-image': 'custom-pin-marker', // Use the custom pin marker image
                    'icon-size': 0.065, // Adjust the icon size as needed
                    'icon-allow-overlap': true, // Allow icons to overlap
                    'icon-rotate': 30
                },

            });

            // inspect a cluster on click
            map.on('click', 'clusters', (e: any) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });

                const clusterId = features[0].properties!.cluster_id;
                map.getSource('worksites').getClusterExpansionZoom(
                    clusterId,
                    (err: any, zoom: number) => {
                        if (err) return;
                        map.easeTo({
                            center: features[0].geometry.coordinates as LngLatLike,
                            zoom: zoom
                        });
                    }
                );
            });

            // When a click event occurs on a feature in
            // the unclustered-point layer, open a popup at
            // the location of the feature, with
            // description HTML from its properties.
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: true,
                maxWidth: 'fit-content'
            });

            let isPopupOpened = false;


            map.on('click', 'unclustered-point', (e) => {
                isPopupOpened = true;

                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['unclustered-point']
                });

                const orgId = features[0].properties!.organization_id;
                const org = organizationsJSON.find(org => org.organization_id === orgId);

                var longDescription: ReactElement = (
                    <GlassBox padding='0.75rem' bgColor='purple'>
                    <div className='popup-container'>
                            <img className='popup-img' src={"https://source.unsplash.com/collection/484351"} alt="" />
                        <h4 className='popup-heading'>{org?.organization_name}</h4>
                        <h5 className='popup-description'>wdaudbuwafb wuiafbwuiafb uwuiafb uiawfbwuiafbui a wdhawifbwalfb </h5>
                        <div className='popup-address'>
                            <h5>Address:</h5>
                            <h5 style={{ fontWeight: 300 }}>{org?.address.street}, {org?.address.city}, {org?.address.state} {org?.address.postal_code}</h5>
                        </div>
                            <SolidButton url={`/workspaces/${org?.organization_id}`} size='0.5rem' newTab={true}>View More</SolidButton>
                        </div>
                    </GlassBox>
                );

                const coordinates = e.features[0].geometry.coordinates.slice();

                popup.setMaxWidth('15rem');
                popup.setLngLat(coordinates).setHTML(renderToString(longDescription)).addTo(map);

                const popupContainer = popup.getElement();
                popupContainer.firstChild!.style.borderColor = 'transparent';
                popupContainer.lastChild!.style.backgroundColor = 'transparent';
            });

            map.on('mouseenter', 'clusters', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'clusters', () => {
                map.getCanvas().style.cursor = '';
            });

            const getLocationsWithinViewport = () => {
                const bounds = map.getBounds(); // Get current bounds of the map

                // Filter locations based on whether they fall within the bounds
                const locationsWithinBounds = geojsonData.features.filter((location) => {
                    const lng = location.geometry.coordinates[0];
                    const lat = location.geometry.coordinates[1];

                    // Check if the location's coordinates are within the map bounds
                    return (
                        lng >= bounds.getWest() &&
                        lng <= bounds.getEast() &&
                        lat >= bounds.getSouth() &&
                        lat <= bounds.getNorth()
                    );
                });

                return locationsWithinBounds.map((item: Feature) => item.properties?.organization_id);
            };

            const locationsInViewport = getLocationsWithinViewport();
            setSelectedWorkspaces(locationsInViewport);

            const handleMapMove = () => { 
                const locationsInViewport = getLocationsWithinViewport();
                setSelectedWorkspaces(locationsInViewport);

                const currentZoom = map.getZoom();
                const currentCenter = map.getCenter();
                const currentPitch = map.getPitch();
                const currentBearing = map.getBearing();

                const mapPositionObj = { zoom: currentZoom, center: currentCenter, pitch: currentPitch, bearing: currentBearing };

                sessionStorage.setItem('last-map-position', JSON.stringify(mapPositionObj));

                // console.log(locationsInViewport);
            };

            map.on('moveend', handleMapMove);

            map.on('mouseenter', 'unclustered-point', (e) => {
                map.getCanvas().style.cursor = 'pointer';

                if (isPopupOpened) return;

                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['unclustered-point']
                });

                const orgId = features[0].properties?.organization_id;
                const org = organizationsJSON.find(org => org.organization_id === orgId);

                var shortDescription: ReactElement = (
                    <GlassBox padding='0.75rem' bgColor='purple'>
                        <div className='popup-hover-container'>
                            <h4 className='popup-hover-heading'>{org?.organization_name}</h4>
                            <p className='popup-hover-address'>{org?.address.street}, {org?.address.city}, {org?.address.state} {org?.address.postal_code}</p>
                        </div>
                    </GlassBox>
                );

                const coordinates = e.features[0].geometry.coordinates.slice();
                popup.setLngLat(coordinates).setHTML(renderToString(shortDescription)).addTo(map);

                const popupContainer = popup.getElement();
                popupContainer.firstChild!.style.borderColor = 'transparent';
                popupContainer.lastChild!.style.backgroundColor = 'transparent';
            });

            map.on('mouseleave', 'unclustered-point', () => {
                map.getCanvas().style.cursor = '';
                if (!isPopupOpened) {
                    popup.remove();
                }
            });

            popup.on('close', () => {
                isPopupOpened = false; // Reset flag when popup is closed
            });
        });

        return () => {
            map.remove(); // Cleanup when the component is unmounted
            unsubscribe(handleFilterUpdate);
        };        
    }, [filterData, organizationsJSON]);
*/
    hideFooterVisibility();

    return (
        <div className="cluster-map-container">
            {/* <div id="selected-workspaces">
                <WorkspaceList selectedIds={selectedWorkspaces} />
            </div> */}
            {/* <div id="cluster-map"></div> */}
            <FilterMenu />
        </div>
    );
};
//#endregion

//#region MiniMap
export const MiniMap: React.FC<{ worksiteLngLat: [number, number]; }> = ({ worksiteLngLat }) => {

    const userLocationData: [number, number] = JSON.parse(sessionStorage.getItem('user-location'));

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'minimap',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: userLocationData, // Center of the world
            zoom: 10, // Zoom level (adjust as needed)
        });

        const worksiteMarker = new mapboxgl.Marker()
            .setLngLat(worksiteLngLat)
            .addTo(map);

        // Create a default Marker, colored black, rotated 45 degrees.
        const userLocationMarker = new mapboxgl.Marker({ color: 'black' })
            .setLngLat(userLocationData)
            .addTo(map);

        const worksiteCoord = worksiteMarker.getLngLat();
        const userCoord = userLocationMarker.getLngLat();

        // Function to calculate the zoom level based on the distance
        const calculateZoomLevel = (distance: number) => {
            // Adjust this factor as needed to fit the points on the screen
            const zoomFactor = 2.5;
            return 16 - Math.log2(distance * zoomFactor);
        };

        const midpointCoordinates: LngLatLike = [(worksiteCoord.lng + userCoord.lng) / 2, (worksiteCoord.lat + userCoord.lat) / 2];
        // const distance = getDistance([worksiteCoord.lat, worksiteCoord.lng], [userCoord.lat, userCoord.lng]);
        const distance = haversineDistance(worksiteCoord.lat, worksiteCoord.lng, userCoord.lat, userCoord.lng);


        const zoom = calculateZoomLevel(distance);

        // // Set the map center to the calculated midpoint
        map.setCenter(midpointCoordinates);
        map.setZoom(zoom);

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            // maxWidth: '12rem'
            offset: [0, -30],
        });

        const headerNode = document.createElement('h6');
        headerNode.textContent = 'Current Location';
        // headerNode.style.backgroundColor = 'red';

        popup.setDOMContent(headerNode);

        popup.setLngLat(userLocationData).addTo(map);

        const popupContainer = popup.getElement();
        popupContainer.firstChild.style.borderColor = 'transparent';
        popupContainer.lastChild.style.backgroundColor = 'darkorange';

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div className='minimap-container'>
            <div id="minimap"></div>
        </div>
    );
};
//#endregion


