/* eslint-disable react/prop-types */

import './Map.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ locationData }) {
    
    // Assuming locationData has latitude and longitude properties
    const center = [locationData?.location.lat, locationData?.location.lng];
    const markerPosition = center;

    return (
        <MapContainer key={locationData?.ip} center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            {markerPosition && (
                <Marker position={markerPosition}>
                    <Popup>
                        {`Location: ${locationData?.location.city}, ${locationData?.location.region}, ${locationData?.location.country}`}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

export default Map;
