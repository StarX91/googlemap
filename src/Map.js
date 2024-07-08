import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faHandPointer } from '@fortawesome/free-solid-svg-icons';

const containerStyle = {
  width: '100%',
  height: '400px',
  position: 'relative'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

const Map = () => {
  const [mapCenter, setMapCenter] = useState(center);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [pinnedLocations, setPinnedLocations] = useState([]);
  const [isPinning, setIsPinning] = useState(false);
  const autocompleteRef = useRef(null);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const location = place.geometry.location;
      setMapCenter({
        lat: location.lat(),
        lng: location.lng()
      });
      setMarkerPosition({
        lat: location.lat(),
        lng: location.lng()
      });
    } else {
      console.error("No geometry available for the selected place.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onPlaceChanged();
    }
  };

  const onMapClick = (event) => {
    if (isPinning) {
      const newPin = {
        id: new Date().getTime(), // unique id
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setPinnedLocations([...pinnedLocations, newPin]);
    }
  };

  const togglePinningMode = () => {
    setIsPinning(!isPinning);
  };

  const removePin = (pinId) => {
    setPinnedLocations(pinnedLocations.filter(pin => pin.id !== pinId));
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDEIv1QNf-ygOSToYwVykWC0f75fmUwkL0" libraries={['places']}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Autocomplete
          onLoad={ref => (autocompleteRef.current = ref)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search places"
            onKeyPress={handleKeyPress}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: 'absolute',
              top: '10px',
              left: '50%',
              marginLeft: '-120px',
              zIndex: 10
            }}
          />
        </Autocomplete>
        <button
          onClick={togglePinningMode}
          style={{
            position: 'absolute',
            top: '60px', // Lower the button 20px more
            right: '10px',
            zIndex: 10,
            padding: '10px',
            backgroundColor: isPinning ? 'red' : 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          <FontAwesomeIcon icon={isPinning ? faHandPointer : faMapMarkerAlt} />
        </button>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
          onClick={onMapClick}
        >
          <Marker position={markerPosition} />
          {pinnedLocations.map((location, index) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              }}
              onClick={() => removePin(location.id)}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;
