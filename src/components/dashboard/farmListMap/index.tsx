import React from "react";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { HttpError, useList, useNavigation } from "@refinedev/core";
import { IFarm } from "../../../interfaces";
import { Alert } from "@mui/material";

export const FarmListMap: React.FC = () => {
  const { show } = useNavigation();

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
    <>
      {farmData === undefined || farmData?.data.length === 0 ? (
        <Alert severity="info">No farms found</Alert>
      ) : (
        <MapContainer
          center={farmData.data[0].location as LatLngExpression}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {farmData?.data.map((farm, index) => (
            <Marker
              icon={greenIcon}
              key={index}
              position={farm.location as LatLngExpression}
              eventHandlers={{
                click: () => {
                  show("farms", farm.farm_id);
                },
                mouseover: (event) => {
                  event.target.openPopup();
                },
                mouseout: (event) => {
                  event.target.closePopup();
                },
              }}
            >
              <Popup>{farm.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
};
