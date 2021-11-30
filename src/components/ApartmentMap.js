import React, { useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import { Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

function ApartmentMap(props) {
  const { placeholder, center, searchBoxChange } = props;
  const [autoComplete, setAutoComplete] = useState(null);
  const onLoad = autoComplete => {
    setAutoComplete(autoComplete);
  };

  const onPlaceChanged = () => {
    const { geometry } = autoComplete.getPlace();
    const lat = geometry && geometry.location.lat();
    const lng = geometry && geometry.location.lng();
    searchBoxChange(lat, lng);
  };

  const handleMapClick = e => {
    if (e) {
      searchBoxChange(e.latLng.lat(), e.latLng.lng());
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_MAP_KEY}
      libraries={["places"]}
    >
      <GoogleMap
        id="searchbox-example"
        mapContainerStyle={containerStyle}
        zoom={6}
        center={center}
        onClick={handleMapClick}
      >
        <Marker onLoad={onLoad} position={center} />
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder={placeholder}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `300px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
            }}
          />
        </Autocomplete>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(ApartmentMap);
