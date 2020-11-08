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
    ],
  });
  const [analyticsModalData, setAnalyticsModalData] = useState({});

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

  const onGraphPress = (measurements, visualRepresentation) => {
    const fromData = measurements[0].timestamp;
    const toData = measurements[measurements.length - 1].timestamp;
    const modalTitle = `From ${fromData} to ${toData}`;
    setModalTitle(modalTitle);
    setModalData({
      datasets: [
        {
          data: visualRepresentation,
        },
      ],
    });
  };

  const onAnalyticsPress = (analytics) => {
    const modalTitle = "Analytics insights";
    console.log("Analytics", analytics);
    setModalTitle(modalTitle);
    setAnalyticsModalData(analytics);
  };

  const renderItemAccessory = (props, item) => (
    <>
      {item.analytics && (
        <Button
          status="success"
          size="tiny"
          onPress={() => onAnalyticsPress(item.analytics)}
          style={{ marginRight: 5 }}
        >
          ANALYTICS
        </Button>
      )}
      <Button
        size="tiny"
        onPress={() =>
          onGraphPress(item.measurements, item.visualRepresentation)
        }
      >
        GRAPH
      </Button>
    </>
  );

  const renderItemIcon = (props) => <Icon {...props} name="bar-chart" />;

  const renderItem = ({ item }) => {
    const title = `From ${item.measurements[0].timestamp} to ${
      item.measurements[item.measurements.length - 1].timestamp
    }`;
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

  const closeAnalyticsModal = () => {
    setVisibleAnalyticsModal(false);
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
              backdropStyle={styles.backdrop}
              onBackdropPress={closeAnalyticsModal}
            >
              <Card disabled>
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <Text>{analyticsModalData}</Text>
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
