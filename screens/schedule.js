import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Autocomplete from "react-native-autocomplete-input";
import * as Location from "expo-location";
import { Polyline } from "react-native-maps";
import { ScaledSheet, scale } from "react-native-size-matters";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Padding, Border } from "../assets/globalstyle";
import colors from "../assets/colors/color";
import { Ionicons } from "@expo/vector-icons";

export default function Schedule() {
  const [region, setRegion] = useState({
    latitude: 14.0583,
    longitude: 108.2772,
    latitudeDelta: 15,
    longitudeDelta: 7,
  });
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [startLocationText, setStartLocationText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [startLocation, setStartLocation] = useState(null);
  const [destinationAutocompleteData, setDestinationAutocompleteData] =
    useState([]);
  const [showMap, setShowMap] = useState(false);
  const [driverShow, setDriverShow] = React.useState(false);
  const [driverName, setDriverName] = React.useState("");
  const [drivers, setDrivers] = React.useState([]);
  const [driver, setDriver] = React.useState("");
  const [uocluong, setUocluong] = React.useState("");
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [duration, setDuration] = useState(null);
  const [doanhthu, setDoanhthu] = useState(null);
  const [distance, setDistance] = useState(null);
  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  const fetchRoute = async (origin, destination) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=pk.eyJ1Ijoic2xlZXB5Y2F0NzkiLCJhIjoiY2x2MnFlaWxhMGtwdTJxcXY3d28yMjdzNyJ9.SERIf1nsEuT_LMNoAFmE5Q`;
    const response = await fetch(url);
    const data = await response.json();
    setDuration(data.routes[0].duration);
    setDistance(data.routes[0].distance);

    return data.routes[0].geometry.coordinates.map(([longitude, latitude]) => ({
      latitude,
      longitude,
    }));
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };
  const handleSubmit = () => {
    if (startLocation && destination) {
      setShowMap(true);
    } else {
      alert("Please set both start location and destination");
    }
  };
  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/GetDrivers");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error(error);
    }
  };
  const schedule = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver,
          doanhthu,
          start: startLocationText,
          end: destinationText,
          distance: Math.round(distance / 1000),
          time: Math.round(duration / 60),
          date: date,
        }),
      });
      const data = await response.json();
      console.log(data);

      // If the request is successful, display an alert
      if (response.ok) {
        alert("Đã lên lịch thành công");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          const currentLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          setRegion(currentLocation);
          setStartLocation(currentLocation); // Set the start location to the current location
        }
      );

      return () => {
        locationWatcher.remove();
      };
    })();
    fetchDrivers();
  }, []);
  const renderDriver = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setDriver(item._id);
        setDriverName(item.name);
        setDriverShow(false);
      }}
      style={{
        height: scale(55),
        width: wp("90%"),
        backgroundColor: "rgba(128, 128, 128, 0.05)", // gray color with 0.1 opacity
        borderRadius: scale(10),
        alignSelf: "center",
        justifyContent: "center",
        marginTop: scale(20),
      }}
    >
      <Text
        style={{
          left: scale(20),
          top: scale(-3),
          fontFamily: "Inter-Medium",
          fontSize: scale(14),
          color: colors.Royalblue,
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          fontFamily: "Inter-Regular",
          fontSize: scale(11),
          color: "black",
          left: scale(20),
        }}
      >
        {item.address}
      </Text>
    </TouchableOpacity>
  );
  const handleSearch = async (searchText, setAutocompleteData) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchText
        )}.json?bbox=102.148224,8.195494,109.469293,23.392373&access_token=pk.eyJ1Ijoic2xlZXB5Y2F0NzkiLCJhIjoiY2x2MnFlaWxhMGtwdTJxcXY3d28yMjdzNyJ9.SERIf1nsEuT_LMNoAFmE5Q`
      );

      const data = await response.json();

      if (data.features) {
        setAutocompleteData(
          data.features.map((feature) => ({
            name: feature.place_name,
            coordinates: {
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
            },
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <Text
        style={{ textAlign: "center", top: scale(40), fontSize: scale(18) }}
      >
        Lịch trình chuyến đi
      </Text>
      <View
        style={{ flexDirection: "row", marginTop: scale(80), left: scale(10) }}
      >
        <TouchableOpacity
          onPress={() => setDriverShow(true)}
          style={{
            flexDirection: "column",
            height: scale(80),
            width: "45%",
          }} // Add a specific width
        >
          <View
            style={{
              flexDirection: "row",
              height: "50%",
              bottom: scale(20),
              borderWidth: 1,
              borderColor: colors.black,
              borderRadius: scale(10),
            }}
          >
            <Ionicons
              name="person-outline"
              style={{}}
              size={scale(24)}
            ></Ionicons>
            <Text
              style={{
                borderWidth: 0,
                fontSize: scale(14),
                fontFamily: "Roboto-Regular",
                fontWeight: "200",
                color: colors.black,
              }}
            >
              Chọn tài xế
            </Text>
          </View>
          <Text
            style={{
              fontSize: scale(10),
              bottom: scale(40),
              left: scale(30),
              fontFamily: "Roboto-Regular",
              color: colors.black,
            }}
          >
            {driverName}
          </Text>
        </TouchableOpacity>
        <Modal visible={driverShow}>
          <FlatList
            data={drivers}
            keyExtractor={(item) => item._id}
            renderItem={renderDriver}
          />
        </Modal>
        <TextInput
          placeholder="Doanh Thu"
          placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
          keyboardType="number-pad"
          value={doanhthu}
          style={{
            ...styles.addinput,
            left: scale(20),
            width: "40%",
            height: scale(40),
            borderRadius: scale(10),
            fontSize: scale(14),
            bottom: scale(40),
            fontSize: scale(10),
            fontFamily: "Roboto-Regular",
            color: colors.black,
          }}
          onChangeText={setDoanhthu}
        ></TextInput>
      </View>
      <TouchableOpacity
        style={{
          borderColor: "black",
          borderWidth: 1.5,
          width: wp("45%"),
          height: hp("4%"),
          bottom: scale(50),
          borderStyle: "solid",
          justifyContent: "center",
          alignItems: "center",
          left: scale(100),
          flexDirection: "row",
          alignSelf: "center",

          alignSelf: "flex-start",
        }}
        onPress={showDatepicker}
      >
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <Text style={{ flexShrink: 1 }}>
          {date ? date.toLocaleDateString() : "Ngày di chuyển"}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          width: "100%",
          bottom: scale(20),
          flexDirection: "row",
          right: scale(30),
          zIndex: 1,
          maxHeight: scale(120),
          height: scale(120),
        }}
      >
        <Text style={{ bottom: scale(20), left: scale(40) }}>
          Điểm xuất phát
        </Text>

        <View style={{ width: "45%", right: scale(50) }}>
          <Autocomplete
            data={autocompleteData.slice(0, 3).map((item) => item.name)}
            value={startLocationText} // Use the state variable for the value
            onChangeText={(text) => {
              setStartLocationText(text); // Update the text when it changes
              handleSearch(text, setAutocompleteData);
            }}
            flatListProps={{
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    const selectedItem = autocompleteData.find(
                      (i) => i.name === item
                    );
                    if (selectedItem) {
                      const newLocation = {
                        ...selectedItem.coordinates,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                      };

                      setStartLocation(newLocation);
                      setStartLocationText(item);
                      setRegion(newLocation);
                      fetchRoute(newLocation, destination).then(setRoute);
                      setAutocompleteData([]); // Clear the autocomplete data
                    }
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ), // Removed the comma here
            }}
            style={{
              backgroundColor: "white", // Set the background color to white
              borderColor: "gray", // Set the border color to gray
              borderWidth: 1, // Set the border width to 1
              borderRadius: 5, // Set the border radius to 5
            }} // Add top margin to move the search box down
          />
        </View>
        <Text style={{ bottom: scale(20), right: scale(30) }}>Điểm đến</Text>
        <View style={{ width: "45%", right: scale(80) }}>
          <Autocomplete
            data={destinationAutocompleteData
              .slice(0, 3)
              .map((item) => item.name)}
            value={destinationText} // Use the state variable for the value
            onChangeText={(text) => {
              setDestinationText(text); // Update the text when it changes
              handleSearch(text, setDestinationAutocompleteData);
            }}
            flatListProps={{
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    const selectedItem = destinationAutocompleteData.find(
                      (i) => i.name === item
                    );
                    if (selectedItem) {
                      setDestination(selectedItem.coordinates);
                      setDestinationText(item);
                      fetchRoute(region, selectedItem.coordinates).then(
                        setRoute
                      );
                      setDestinationAutocompleteData([]); // Clear the destination autocomplete data
                    }
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ), // Removed the comma here
            }}
            style={{
              backgroundColor: "white", // Set the background color to white
              borderColor: "gray", // Set the border color to gray
              borderWidth: 1, // Set the border width to 1
              borderRadius: 5, // Set the border radius to 5
            }} // Add top margin to move the search box down
          />
        </View>
      </View>
      <View style={{ bottom: scale(80), left: scale(10) }}>
        <Text
          style={{
            fontFamily: "Inter-Medium",
            fontSize: scale(14),
          }}
        >
          Thời gian dự kiến:{" "}
          {uocluong && duration ? Math.round(duration / 60) + " phút" : ""}
        </Text>

        <Text style={{ fontFamily: "Inter-Medium", fontSize: scale(14) }}>
          Ước lượng khoảng cách:{" "}
          {uocluong && distance ? Math.round(distance / 1000) + " km" : ""}
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Medium",
            fontSize: scale(14),
            color: colors.Royalblue,
          }}
        >
          Ước lượng lợi nhuận:{" "}
          {uocluong ? doanhthu - Math.round(distance / 1000) * 0.85 + " $" : ""}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setUocluong(true);
          handleSubmit();
        }}
        style={{
          alignSelf: "center",
          backgroundColor: colors.Royalblue,
          width: wp("100%"),
          height: scale(30),
          alignItems: "center",
          bottom: scale(60),
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-Medium",
            color: "white",
            fontSize: scale(13),
          }}
        >
          Ước lượng
        </Text>
      </TouchableOpacity>
      <View style={{ bottom: scale(40) }}>
        <Button title="Lên lịch" onPress={schedule}></Button>
      </View>
      {showMap && region && (
        <MapView style={{ flex: 1 }} initialRegion={region}>
          <Marker coordinate={region} title="My Location" />
          {destination && (
            <Marker coordinate={destination} title="Destination" />
          )}
          <Polyline coordinates={route} strokeColor="#ff0000" strokeWidth={3} />
        </MapView>
      )}
    </View>
  );
}

const styles = ScaledSheet.create({
  addinput: {
    borderColor: "black",
    borderWidth: 1.5,
    width: wp("90%"),
    height: hp("7.5%"),
    borderStyle: "solid",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    padding: Padding.p_base,
  },
});
