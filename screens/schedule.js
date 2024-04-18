import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { ScaledSheet, scale } from "react-native-size-matters";

export default function Schedule() {
  const [region, setRegion] = useState(null);
  const [duration, setDuration] = useState(null); // Add this line

  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null); // Add this line
  const [selectedPlace, setSelectedPlace] = useState(null);
  const GOOGLE_MAPS_APIKEY = "AIzaSyBHCqtK7dmaygyViQOrQeC7ORXw-HAPHnA";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({})
        .then((location) => {
          console.log(location);
          return location; // Add this line
        })
        .catch((error) => {
          console.log(error);
        });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    })();
  }, []);

  const handlePress = () => {
    if (selectedPlace) {
      setDestination(selectedPlace);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "100%", height: "30%", top: scale(30) }}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (
              details &&
              details.geometry &&
              details.geometry.location &&
              details.geometry.location.lat &&
              details.geometry.location.lng
            ) {
              setDestination({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
            }
          }}
          query={{
            key: "AIzaSyBHCqtK7dmaygyViQOrQeC7ORXw-HAPHnA",
            language: "en",
          }}
        />
      </View>
      {region && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={region}
        >
          <Marker coordinate={region} title="My Location" />
          {destination && (
            <>
              <Marker coordinate={destination} title="Destination" />
              <MapViewDirections
                origin={region}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="hotpink"
                mode="TRANSIT"
                onReady={(result) => {
                  setDistance(result.distance); // Add this line
                  setDuration(result.duration); // Add this line
                }}
              />
            </>
          )}
        </MapView>
      )}
      {distance && <Text>Distance: {parseFloat(distance).toFixed(2)} km</Text>}
      {duration && (
        <Text>
          Estimated Time: {(parseFloat(duration) / 2.5).toFixed(2)} mins
        </Text>
      )}
    </View>
  );
}
