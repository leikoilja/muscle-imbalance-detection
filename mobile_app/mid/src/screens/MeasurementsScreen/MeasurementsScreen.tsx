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
import OrangeLineChart from "../../components/OrangeLineChart";
import {
  unixTimestampToDate,
  unixTimestampToDateNoSeconds,
  unixTimestampToDateNoDate,
} from "../../utils/unixTimeToDate";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export default function MeasurementsScreen({ navigation, route }) {
  const { measurements } = route.params;
  const [isFetching, setIsFetching] = useState(true);
  const [measurementsData, setMeasurementsData] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalData, setModalData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (measurementsData.length > 0) {
      setIsFetching(false);
    }
    if (modalData.datasets[0].data.length > 0) {
      setVisibleModal(true);
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchMeasurements = async () => {
        console.log("Fetching MEASUREMENTS on focus", measurements);
        setIsFetching(true);
        const fetchedMeasurementsData = [];
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

      fetchMeasurements();
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

  const onGraphPress = (measurements) => {
    console.log("props", measurements);
    let labels = [];
    const dataPoints = [];
    const fromData = unixTimestampToDate(measurements[0].unixTimestamp);
    const toData = unixTimestampToDate(
      measurements[measurements.length - 1].unixTimestamp
    );
    const modalTitle = `From ${fromData} to ${toData}`;
    for (const measurement of measurements) {
      dataPoints.push(parseInt(measurement.value));
      labels.push(unixTimestampToDateNoDate(measurement.unixTimestamp));
    }
    setModalTitle(modalTitle);
    // Hide labels if there are too many of them
    if (labels.length > 10) {
      labels = [];
    }
    setModalData({
      labels,
      datasets: [
        {
          data: dataPoints,
        },
      ],
    });
  };

  const renderItemAccessory = (props, item) => (
    <Button size="tiny" onPress={() => onGraphPress(item.measurements)}>
      GRAPH
    </Button>
  );

  const renderItemIcon = (props) => <Icon {...props} name="bar-chart" />;

  const renderItem = ({ item }) => {
    const title = unixTimestampToDateNoSeconds(
      item.measurements[0].unixTimestamp
    );
    const description = `UID ${item.uid}`;
    return (
      <ListItem
        title={title}
        description={description}
        accessoryLeft={renderItemIcon}
        accessoryRight={(props) => renderItemAccessory(props, item)}
      />
    );
  };

  const data = new Array(8).fill({
    title: "Title for Item",
    description: "Description for Item",
  });

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
          </>
        )}
      </View>
    </Layout>
  );
}
