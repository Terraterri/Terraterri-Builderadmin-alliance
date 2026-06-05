import React, { useState, useEffect } from 'react'

const GoogleMapComponent = ({ data, latilongs }) => {

    console.log('data from auto complete component', data)

    let map;
    let featureLayer;


    const initMap = async () => {


        let placeId = await data.placeId;

        // Request needed libraries.
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        map = new Map(document.getElementById("map"), {
            center: data.latLng,
            zoom: 12,
            // In the cloud console, configure this Map ID with a style that enables the
            // "Locality" feature layer.
            mapId: "382c3b6e9490950a", // <YOUR_MAP_ID_HERE>,
        });
        //@ts-ignore
        featureLayer = map.getFeatureLayer("LOCALITY");

        // Define a style with purple fill and border.
        //@ts-ignore
        const featureStyleOptions = {
            strokeColor: "#810FCB",
            strokeOpacity: 1.0,
            strokeWeight: 3.0,
            fillColor: "#810FCB",
            fillOpacity: 0.5,
        };

        // Apply the style to a single boundary.
        //@ts-ignore
        featureLayer.style = (options) => {
            if (options.feature.placeId == placeId) {
                return featureStyleOptions;
            }
        };
        const infoWindow = new InfoWindow();
        const draggableMarker = new AdvancedMarkerElement({
            map,
            position: data.latLng,
            gmpDraggable: true,
            title: "This marker is draggable.",
        });

        draggableMarker.addListener("dragend", (event) => {
            const position = draggableMarker.position;

            infoWindow.close();

            infoWindow.setContent(
                `Pin dropped at: ${position.lat()}, ${position.lng()}`,
            );

            console.log(`Pin dropped at: ${position.lat}, ${position.lng}`)
            infoWindow.open(draggableMarker.map, draggableMarker);

            latilongs(
                {
                    lat: position.lat,
                    lng: position.lng
                }
            )
        });

    }

    useEffect(() => {
        initMap();
    })



    return (
        <div id="map" className='mapContainer'></div>
    )
}

export default GoogleMapComponent