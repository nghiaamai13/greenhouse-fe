import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, LatLngLiteral } from "leaflet";
import L from "leaflet";
import { IconButton, InputBase, Paper, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { HttpError, useList, useParsed } from "@refinedev/core";
import { IFarm } from "../../interfaces";

interface LocationPickerProps {
  onChange: (location: LatLngLiteral) => void;
  lat?: number;
  lng?: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onChange,
  lat,
  lng,
}) => {
  const mapRef = useRef<any>(null);
  const [location, setLocation] = useState<LatLngLiteral>({
    lat: 21.027763,
    lng: 105.83416,
  });

  useEffect(() => {
    if (lat !== undefined && lng !== undefined && mapRef.current) {
      setLocation({ lat, lng });
      mapRef.current.setView({ lat, lng }, mapRef.current.getZoom());
    }
  }, [lat, lng]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const MapClickHandler: React.FC = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const roundedLocation = { lat: +lat.toFixed(6), lng: +lng.toFixed(6) };
        setLocation(roundedLocation);
        onChange(roundedLocation);
      },
    });

    return null;
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`,
        { method: "GET" }
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const roundedLocation = { lat: +lat, lng: +lon };
        setLocation(roundedLocation);
        onChange(roundedLocation);
        mapRef.current.setView(roundedLocation, mapRef.current.getZoom());
      } else {
        console.error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const { data: farmData } = useList<IFarm, HttpError>({
    resource: "farms",
  });

  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <Stack direction={"column"} spacing={2}>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for location"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton sx={{ p: "10px" }} onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Paper>

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={8}
        style={{ height: "400px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[location.lat, location.lng]}
          eventHandlers={{
            mouseover: (event) => {
              event.target.openPopup();
            },
            mouseout: (event) => {
              event.target.closePopup();
            },
          }}
        >
          <Popup>Farm Location</Popup>
        </Marker>

        {farmData?.data.map((farm, index) => {
          const isLocationEqual =
            farm.location[0] === lat && farm.location[1] === lng;

          return !isLocationEqual ? (
            <Marker
              key={index}
              position={farm.location as LatLngExpression}
              eventHandlers={{
                click: () => {
                  console.log(`Clicked on farm with ID: ${farm.farm_id}`);
                },
                mouseover: (event) => {
                  event.target.openPopup();
                },
                mouseout: (event) => {
                  event.target.closePopup();
                },
              }}
              icon={greenIcon}
            >
              <Popup>{farm.name}</Popup>
            </Marker>
          ) : null;
        })}

        <MapClickHandler />
      </MapContainer>
    </Stack>
  );
};

export default LocationPicker;
