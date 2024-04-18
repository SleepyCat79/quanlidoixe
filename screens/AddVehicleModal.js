import React, { useState } from "react";
import { Modal, View, Text, Button } from "react-native";

const AddVehicle = ({ isVisible, onClose }) => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Text>Add Vehicle</Text>
      <Button title="Submit" />
      <Button title="Close" onPress={onClose} />
    </View>
  );
};

export default AddVehicle;
