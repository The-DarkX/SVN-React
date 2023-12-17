import './Maps.css';

import React, { useEffect, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { WorkspaceList } from './WorkspaceBox';
import { convertToGeoJSON } from '../../../utils/jsonUtils';
import { useOrganizationService } from '../../../Services/OrganizationService';
import { haversineDistance } from '../../../utils/UtilFuncts';
import FilterMenu, { getFilterOptionsData, subscribeToUpdate, unsubscribe } from './FilterMenu';

mapboxgl.accessToken = process.env.MAPBOX_API_KEY;

//#region ClusterMap
export const ClusterMap = () => {
    const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
    const [filterData, setFilterData] = useState(getFilterOptionsData());

    let useFilter: boolean = true;

    const organizationsJSON = useOrganizationService().getOrganizations();

    let geojsonData: object = {};

    if (filterData.skillPreferences.length > 0 || filterData.distance) useFilter = true;
    else useFilter = false;

    const findNearestLocations = useOrganizationService().filterOrganizationsByAll(filterData.skillPreferences, filterData.distance, [34.142509, -118.255074]);

    let filteredJsonArray = [];


    if (!useFilter) {
        filteredJsonArray.push(...organizationsJSON);
    } else {
        filteredJsonArray = organizationsJSON.filter(jsonObj =>
            findNearestLocations.some(customObj => customObj.organization_id === jsonObj.organization_id)
        );
    }

    geojsonData = convertToGeoJSON(filteredJsonArray);


    useEffect(() => {
        const handleFilterUpdate = (updatedData) => {
            setFilterData(updatedData);
        };

        subscribeToUpdate(handleFilterUpdate);

        const map = new mapboxgl.Map({
            container: 'cluster-map',
            style: 'mapbox://styles/mapbox/dark-v11',
            // style: 'mapbox://styles/mapbox/satellite-streets-v12',

            center: [-118.255074, 34.142509],
            zoom: 10
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
                        'fill-extrusion-color': '#a1a1a1',

                        // Use an 'interpolate' expression to
                        // add a smooth transition effect to
                        // the buildings as the user zooms in.
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 1
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
                clusterMaxZoom: 20, // Max zoom to cluster points on
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

                if (features.length > 0) {
                    const clusterId = features[0].properties!.cluster_id;
                    map.getSource('worksites').getClusterLeaves(
                        clusterId,
                        Infinity, // To get all leaves in the cluster
                        0, // Start index
                        (err: any, leaves: any) => {
                            if (err) return;

                            const numberOfCoordinates = leaves.length;

                            if (numberOfCoordinates <= 20) {
                                // console.log(...leaves.map((leaf: any) => ([leaf.properties.organization_id])));
                                setSelectedWorkspaces([]);
                                setSelectedWorkspaces((workspace) =>
                                    [
                                        ...workspace,
                                        ...leaves.map((leaf: any) => ([leaf.properties.organization_id]))
                                    ]);

                                const targetScrollPosition = window.innerHeight;

                                // Scroll down to the target position smoothly
                                window.scrollBy({
                                    top: targetScrollPosition,
                                    behavior: "smooth"
                                });
                            }

                            else {
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
                            }
                        }
                    );
                }
            });

            // When a click event occurs on a feature in
            // the unclustered-point layer, open a popup at
            // the location of the feature, with
            // description HTML from its properties.
            map.on('click', 'unclustered-point', (e) => {

                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['unclustered-point']
                });

                const orgId = features[0].properties!.organization_id;

                location.href = `/workspaces/${orgId}`;
            });

            map.on('mouseenter', 'clusters', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'clusters', () => {
                map.getCanvas().style.cursor = '';
            });
            map.on('mouseenter', 'unclustered-point', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'unclustered-point', () => {
                map.getCanvas().style.cursor = '';
            });
        });

        return () => {
            map.remove(); // Cleanup when the component is unmounted
            unsubscribe(handleFilterUpdate);
        };

    });

    useEffect(() => {
        if (selectedWorkspaces.length > 0) {
            const targetScrollPosition = window.innerHeight;

            // Scroll down to the target position smoothly
            window.scrollBy({
                top: targetScrollPosition,
                behavior: "smooth"
            });
        }
    }, [selectedWorkspaces]);

    return (
        <>
            <div className='cluster-map-container'>
                <div id="cluster-map"></div>
                <FilterMenu />
            </div>

            <WorkspaceList selectedIds={selectedWorkspaces} />
        </>
    );
};
//#endregion

//#region MiniMap
export const MiniMap: React.FC<{ worksiteLngLat: [number, number], currentLngLat: [number, number]; }> = ({ worksiteLngLat, currentLngLat }) => {
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'minimap',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: currentLngLat, // Center of the world
            zoom: 10, // Zoom level (adjust as needed)
        });

        const worksiteMarker = new mapboxgl.Marker()
            .setLngLat(worksiteLngLat)
            .addTo(map);

        // Create a default Marker, colored black, rotated 45 degrees.
        const userLocationMarker = new mapboxgl.Marker({ color: 'black' })
            .setLngLat(currentLngLat)
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

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div className='minimap-container' style={{ position: 'relative', width: '25rem', height: '25rem' }}>
            <div id="minimap"></div>
        </div>
    );
};
//#endregion