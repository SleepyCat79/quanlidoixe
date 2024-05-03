import * as React from "react";
import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import colors from "../assets/colors/color";
import { Ionicons } from "@expo/vector-icons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";

import { Padding, Border } from "../assets/globalstyle";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { ScaledSheet, scale } from "react-native-size-matters";
async function loadFonts() {
  await Font.loadAsync({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.otf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.otf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.otf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.otf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });
}

function Homepage() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [maintainVisible, setMaintainVisible] = React.useState(false);
  const [type, setType] = React.useState("Chọn loại bảo dưỡng");
  const options = ["Thay nhiên liệu", "Sửa chữa linh kiện"];
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [vehicle, setVehicle] = React.useState("");
  const [vehiclename, setVehiclename] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [vehicleShow, setVehicleShow] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState("");
  const [show, setShow] = React.useState(false);

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    fetch("http://10.0.2.2:8000/getmaintain")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, [maintainVisible]);
  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
      } catch (e) {
      } finally {
        setFontsLoaded(true);
      }
    }

    prepare();
  }, []);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };
  const handleSubmit = async () => {
    try {
      if (!type || !name || !date || !vehicle || !vehiclename || !cost) {
        Alert.alert("Missing fields", "Please fill in all fields.", [
          { text: "OK" },
        ]);
        return;
      }

      const response = await fetch("http://10.0.2.2:8000/newmaintain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          name,
          date,
          vehicle,
          vehiclename,
          cost,
          // Add the other fields here
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          Alert.alert("Error", "Phương tiện này đã có lịch trình bảo dưỡng", [
            { text: "OK" },
          ]);
        } else {
          Alert.alert("Error", "Đã có lỗi xảy ra, vui lòng thử lại sau.", [
            { text: "OK" },
          ]);
        }
      } else {
        // Handle success
        Alert.alert("Success", "Lên lịch bảo dưỡng thành công", [
          { text: "OK" },
        ]);
        setMaintainVisible(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Đã có lỗi xảy ra, vui lòng thử lại sau.", [
        { text: "OK" },
      ]);
    }
  };
  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/GetVehicle");
      const data = await response.json();
      setSelectedVehicle(data);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
      } catch (e) {
      } finally {
        setFontsLoaded(true);
      }
      fetchDrivers();
    }

    prepare();
  }, []);
  const renderDriver = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setVehicle(item._id);
        setVehiclename(item.name);
        setVehicleShow(false);
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
        {item.type}
      </Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView
      style={{ backgroundColor: "white", width: "100%", height: "100%" }}
    >
      <Text
        style={{
          color: "black",
          fontSize: 20,
          top: scale(60),
          fontFamily: "Inter-Regular",
          left: scale(40),
        }}
      >
        Welcome, {"\n"} <Text style={{ color: colors.Royalblue }}>Huy Vo</Text>
      </Text>
      <View
        style={{
          top: scale(90),
          left: scale(10),
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%", // make sure the View takes the full width
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto-Regular",
            fontSize: scale(16),
          }}
        >
          Doanh Thu
        </Text>
        <TouchableOpacity>
          <Text style={{ right: scale(20), color: "#666", opacity: 0.7 }}>
            Chi tiết
          </Text>
        </TouchableOpacity>
      </View>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={wp("100%")} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#FBFBFB",
          backgroundGradientFrom: "#FBFBFB",
          backgroundGradientTo: "#FBFBFB",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `#1488D8`,
          labelColor: (opacity = 1) => `#1488D8`,
          style: {
            borderRadius: 6,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "0.5",
            stroke: "#FBFBFB",
          },
        }}
        bezier
        style={{
          marginVertical: scale(110),
          borderRadius: scale(20),
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          top: scale(-100),
          left: scale(10), // make sure the View takes the full width
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto-Regular",
            fontSize: scale(16),
          }}
        >
          Lịch bảo trì
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ right: scale(20), color: "#666", opacity: 0.7 }}>
            Chi tiết
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <View style={{ flexDirection: "row", top: scale(60) }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons
                  name="chevron-back-sharp"
                  size={scale(26)}
                  style={{ right: scale(60) }}
                ></Ionicons>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: scale(16),
                }}
              >
                Lịch sử bảo dưỡng
              </Text>
              <TouchableOpacity onPress={() => setMaintainVisible(true)}>
                <Ionicons
                  name="add-sharp"
                  size={scale(26)}
                  style={{ left: scale(50) }}
                ></Ionicons>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={maintainVisible}
              onRequestClose={() => {
                setMaintainVisible(!maintainVisible);
              }}
            >
              <View
                style={{
                  margin: 20,
                  backgroundColor: "white",
                  padding: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <View style={{ flexDirection: "row", bottom: scale(150) }}>
                  <TouchableOpacity
                    title="Close"
                    onPress={() => {
                      setType("Chọn loại bảo dưỡng");
                      setMaintainVisible(false);
                    }}
                    style={{ right: scale(80) }}
                  >
                    <Ionicons name="close-sharp" size={scale(30)} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: scale(16),
                      right: scale(10),
                    }}
                  >
                    Thêm lịch bảo trì
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setVehicleShow(true)}
                  style={{
                    flexDirection: "column",
                    height: "8%",
                    left: scale(20),
                    bottom: scale(100),
                  }} // Add a specific width
                >
                  <View style={{ flexDirection: "row", height: "100%" }}>
                    <Ionicons
                      name="car-outline"
                      style={{}}
                      size={scale(24)}
                    ></Ionicons>
                    <Text
                      style={{
                        ...styles.addinput,
                        borderWidth: 0,
                        fontSize: scale(14),
                        bottom: scale(20),
                        fontFamily: "Roboto-Regular",
                        fontWeight: "200",
                        color: colors.black,
                      }}
                    >
                      Chọn phương tiện bảo trì
                    </Text>
                  </View>
                  <Text
                    style={{
                      left: scale(40),
                      fontSize: scale(10),
                      fontFamily: "Roboto-Regular",
                      color: colors.black,
                      bottom: scale(35),
                    }}
                  >
                    {vehiclename}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    style={{ left: scale(290), position: "absolute" }}
                    size={scale(24)}
                  ></Ionicons>
                </TouchableOpacity>
                <Modal visible={vehicleShow}>
                  <FlatList
                    data={selectedVehicle}
                    keyExtractor={(item) => item._id}
                    renderItem={renderDriver}
                  />
                </Modal>
                <TextInput
                  style={{
                    ...styles.addinput,
                    bottom: scale(80),
                  }}
                  placeholder="Tên bảo dưỡng"
                  onChangeText={(text) => setName(text)}
                />
                <TouchableOpacity
                  style={{
                    ...styles.addinput,
                    bottom: scale(60),
                  }}
                  onPress={() => setModalVisible2(true)}
                >
                  <Text style={{ fontFamily: "Inter-Medium" }}>{type}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", bottom: scale(40) }}>
                  <TouchableOpacity
                    style={{
                      borderColor: "black",
                      borderWidth: 1.5,
                      width: wp("45%"),
                      height: hp("7.5%"),
                      borderStyle: "solid",
                      alignItems: "center",
                      flexDirection: "row",
                      alignSelf: "center",
                      padding: Padding.p_base,
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
                    <Text>
                      {date ? date.toLocaleDateString() : "Ngày cấp bằng"}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={{
                      ...styles.addinput,
                      width: wp("45%"),
                      marginLeft: scale(10),
                    }}
                    placeholder="Chi phí"
                    onChangeText={(text) => setCost(text)}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    bottom: scale(20),
                    backgroundColor: colors.Royalblue,
                    width: wp("90%"),
                    height: hp("7.5%"),
                    borderRadius: scale(10),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={handleSubmit}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: scale(16),
                      color: "white",
                    }}
                  >
                    Xác nhận bảo trì
                  </Text>
                </TouchableOpacity>
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                  setModalVisible2(!modalVisible);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                >
                  {options.map((options) => (
                    <TouchableOpacity
                      key={options}
                      onPress={() => {
                        setType(options);
                        setModalVisible2(false);
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter-Medium",
                          fontSize: scale(16),
                          padding: scale(10),
                        }}
                      >
                        {options}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Modal>
            </Modal>
            <FlatList
              style={{ top: scale(80), width: "90%" }}
              data={data}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    marginBottom: scale(5),
                    borderRadius: scale(10),
                    backgroundColor:
                      index % 2 === 0 ? "white" : colors.Royalblue,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between", // Add this line
                      alignItems: "center",
                      height: scale(50),
                      margin: scale(10),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row", // Add this line
                        alignItems: "center", // Add this line
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          height: scale(30),
                          width: scale(30),
                          borderRadius: scale(10),
                          justifyContent: "center",
                          alignItems: "center",
                          left: scale(10),
                          marginRight: scale(20),
                        }}
                      >
                        {item.type === "Thay nhiên liệu" ? (
                          <Ionicons
                            name="color-fill-outline"
                            size={24}
                            color={colors.Royalblue}
                          />
                        ) : (
                          <Ionicons
                            name="build-outline"
                            size={24}
                            color={colors.Royalblue}
                          />
                        )}
                      </View>
                      <View style={{ flexDirection: "column" }}>
                        <Text
                          style={{
                            color: index % 2 === 0 ? "black" : "white",
                            fontFamily: "Inter-Medium",
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            color: index % 2 === 0 ? "black" : "white",
                            fontSize: scale(10),
                          }}
                        >
                          {item.vehiclename}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        color: index % 2 === 0 ? "red" : "white",
                        fontFamily: "Inter-Medium",
                        fontSize: scale(14),
                      }}
                    >
                      - $ {item.cost}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </Modal>
      </View>
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            height: scale(55),
            width: wp("90%"),
            backgroundColor: "rgba(128, 128, 128, 0.05)", // gray color with 0.1 opacity
            borderRadius: scale(10),
            top: scale(-80),
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="build-outline"
              size={scale(25)}
              style={{
                color: colors.Royalblue,
                left: scale(5),
              }}
            ></Ionicons>
            <Text
              style={{
                left: scale(20),
                top: scale(-5),
                fontFamily: "Inter-Medium",
                fontSize: scale(14),
              }}
            >
              Maintaince Vehicle
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: scale(11),
                top: scale(7),
                right: scale(108),
              }}
            >
              {"\n"} Due On: Jan 20, 2022
            </Text>
          </View>
        </View>
        <View
          style={{
            height: scale(55),
            width: wp("90%"),
            backgroundColor: "#1488D8", // gray color with 0.1 opacity
            borderRadius: scale(10),
            top: scale(-80),
            alignSelf: "center",
            marginTop: scale(20),
            marginBottom: scale(20),
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="build-outline"
              size={scale(25)}
              style={{
                color: "white",
                left: scale(5),
              }}
            ></Ionicons>
            <Text
              style={{
                left: scale(20),
                top: scale(-5),
                fontFamily: "Inter-Medium",
                fontSize: scale(14),
                color: "white",
              }}
            >
              Maintaince Vehicle
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: scale(11),
                top: scale(7),
                color: "white",
                right: scale(108),
              }}
            >
              {"\n"} Due On: Jan 20, 2022
            </Text>
          </View>
        </View>
        <View
          style={{
            height: scale(55),
            width: wp("90%"),
            backgroundColor: "rgba(128, 128, 128, 0.05)", // gray color with 0.1 opacity
            borderRadius: scale(10),
            top: scale(-80),
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="build-outline"
              size={scale(25)}
              style={{
                color: colors.Royalblue,
                left: scale(5),
              }}
            ></Ionicons>
            <Text
              style={{
                left: scale(20),
                top: scale(-5),
                fontFamily: "Inter-Medium",
                fontSize: scale(14),
              }}
            >
              Maintaince Vehicle
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: scale(11),
                top: scale(7),
                right: scale(108),
              }}
            >
              {"\n"} Due On: Jan 20, 2022
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
export default Homepage;
