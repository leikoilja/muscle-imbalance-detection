import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
  Layout,
  Text,
  Icon,
  Modal,
  Card,
  Button,
  TopNavigation,
  TopNavigationAction,
  Spinner,
  ListItem,
  List,
} from "@ui-kitten/components";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import Toast from "react-native-toast-message";
import OrangeLineChart, {
  blueLineColor,
  greenLineColor,
} from "../../components/OrangeLineChart";
import { ISOtimestampToString } from "../../utils/time_utils";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export default function MeasurementsScreen({ navigation, route }) {
  const { user, measurements } = route.params;
  const [isFetching, setIsFetching] = useState(false);
  const [measurementsData, setMeasurementsData] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleAnalyticsModal, setVisibleAnalyticsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalData, setModalData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
      {
        data: [],
      },
    ],
  });
  const [analyticsModalData, setAnalyticsModalData] = useState([]);

  useEffect(() => {
    if (measurementsData.length > 0) {
      setIsFetching(false);
    }
    if (modalData.datasets[0].data.length > 0) {
      setVisibleModal(true);
    }
    if (analyticsModalData.length > 0) {
      setVisibleAnalyticsModal(true);
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchMeasurements = async () => {
        console.log("Fetching MEASUREMENTS on focus", measurements);
        setIsFetching(true);
        let fetchedMeasurementsData = [];
        for (const measurementUid of measurements) {
          await firebase
            .firestore()
            .collection("measurements")
            .doc(measurementUid)
            .get()
            .then((doc) => {
              if (!doc.exists) {
              } else {
                const data = doc.data();
                fetchedMeasurementsData.push({ ...data, uid: measurementUid });
              }
            })
            .catch((error) => {
              console.error("Error reading document: ", error);
              setIsFetching(false);
            });
        }
        setMeasurementsData(fetchedMeasurementsData);
      };

      if (measurements.length > 0) {
        fetchMeasurements();
      }
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const onBackPress = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={onBackPress} />
  );

  const onFetchArchiveRecords = async () => {
    setIsFetching(true);
    const fetchedMeasurementsData = [];
    await firebase
      .firestore()
      .collection("measurements")
      .where("userUid", "==", user.user.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMeasurementsData.push({ ...data, uid: doc.id });
        });
      })
      .catch((error) => {
        console.error("Error reading document: ", error);
        setIsFetching(false);
      });

    setMeasurementsData(fetchedMeasurementsData);
  };

  const onGraphPress = (
    measurements,
    visualRepresentationSensorOne,
    visualRepresentationSensorTwo
  ) => {
    const fromDataISO = measurements[0].timestamp;
    const untilDataISO = measurements[measurements.length - 1].timestamp;
    const fromData = ISOtimestampToString(fromDataISO);
    const untilData = ISOtimestampToString(untilDataISO);
    const modalTitle = `From ${fromData} to ${untilData}`;
    setModalTitle(modalTitle);
    setModalData({
      datasets: [
        {
          data: visualRepresentationSensorOne,
          color: blueLineColor,
        },
        {
          data: visualRepresentationSensorTwo,
          color: greenLineColor,
        },
      ],
    });
  };

  const onAnalyticsPress = (analytics) => {
    const modalTitle = "Analytics Insights";
    const fetchedAnalyticsData = [];
    for (const analytic of analytics) {
      const key = Object.keys(analytic)[0];
      fetchedAnalyticsData.push({ key: key, value: analytic[key] });
    }
    console.log("Analytics", fetchedAnalyticsData);
    setModalTitle(modalTitle);
    setAnalyticsModalData(fetchedAnalyticsData);
  };

  const renderItemAccessory = (props, item) => (
    <View style={styles.buttonGroup}>
      {item.Analytics && (
        <Button
          status="success"
          size="tiny"
          onPress={() => onAnalyticsPress(item.Analytics)}
          style={styles.button}
        >
          ANALYTICS
        </Button>
      )}
      <Button
        size="tiny"
        onPress={() =>
          onGraphPress(
            item.measurements,
            item.visualRepresentationSensorOne,
            item.visualRepresentationSensorTwo
          )
        }
        style={styles.button}
      >
        GRAPH
      </Button>
    </View>
  );

  const renderAnalyticsItemAccessory = (props, value) => <Text>{value}</Text>;

  const renderItemIcon = (props) => <Icon {...props} name="bar-chart" />;

  const renderItem = ({ item }) => {
    try {
      const fromDataISO = item.measurements[0].timestamp;
      const untilDataISO =
        item.measurements[item.measurements.length - 1].timestamp;
      const fromData = ISOtimestampToString(fromDataISO);
      const untilData = ISOtimestampToString(untilDataISO);
      const title = `From ${fromData} to ${untilData}`;
      const description = `UID ${item.uid}`;
      return (
        <ListItem
          title={title}
          description={description}
          accessoryLeft={renderItemIcon}
          accessoryRight={(props) => renderItemAccessory(props, item)}
        />
      );
    } catch (error) {
      console.log(item);
      console.error(
        "Failed loading measurement's data for item: " +
          item +
          " with error: " +
          error
      );
      Toast.show({
        text1: "Failed loading measurements data",
        text2: `For measurement ${item.uid}`,
        visibilityTime: 3000,
        autoHide: true,
      });
      navigation.navigate("Home");
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
  };

  const renderAnalyticsItem = ({ item }) => {
    const title = item.key;

    return (
      <ListItem
        title={title}
        // description={description}
        accessoryRight={(props) =>
          renderAnalyticsItemAccessory(props, item.value)
        }
      />
    );
  };

  const closeModal = () => {
    setModalData({
      labels: [],
      datasets: [
        {
          data: [],
        },
      ],
    });
    setVisibleModal(false);
  };

  const closeAnalyticsModal = () => {
    setVisibleAnalyticsModal(false);
    setAnalyticsModalData([]);
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation accessoryLeft={BackAction} title="Go Back" />
      <Text style={styles.descText}>Uploaded measurements archive</Text>
      <View style={styles.listContainer}>
        {isFetching ? (
          <View style={styles.spinnerContainer}>
            <Spinner size="large" />
          </View>
        ) : (
          <>
            <List
              style={styles.list}
              data={measurementsData}
              renderItem={renderItem}
            />
            <Modal
              visible={visibleModal}
              backdropStyle={styles.backdrop}
              onBackdropPress={closeModal}
            >
              <Card disabled>
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <OrangeLineChart data={modalData} />
                <Button style={styles.modalButton} onPress={closeModal}>
                  DISMISS
                </Button>
              </Card>
            </Modal>
            <Modal
              visible={visibleAnalyticsModal}
              style={styles.analyticModal}
              backdropStyle={styles.backdrop}
              onBackdropPress={closeAnalyticsModal}
            >
              <Card disabled>
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <List
                  data={analyticsModalData}
                  renderItem={renderAnalyticsItem}
                />
                <Button
                  style={styles.modalButton}
                  onPress={closeAnalyticsModal}
                >
                  DISMISS
                </Button>
              </Card>
            </Modal>
          </>
        )}

        <Button style={styles.bottomButton} onPress={onFetchArchiveRecords}>
          Reload
        </Button>
      </View>
    </Layout>
  );
}
