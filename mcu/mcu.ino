#include <SoftwareSerial.h>
#include <TimerOne.h>

// Define the data transmit/receive pins in Arduino
#define TxD 2
#define RxD 3

// RX, TX for Bluetooth
SoftwareSerial mySerial(RxD, TxD);

String inData;

void setup() {
    mySerial.begin(115200); // For Bluetooth
    Serial.begin(115200); // For the IDE monitor Tools -> Serial Monitor
}

void sendBTData(String receivedUartData) {
    // Extract necessary sensor values from incoming string
    String firstSensorValue = receivedUartData.substring(2,5);
    String secondSensorValue = receivedUartData.substring(8,11);
    String valueToSend = firstSensorValue + secondSensorValue;
    Serial.print("Arduino Sending: ");
    Serial.println(valueToSend);
    Serial.println("-----");
    mySerial.println(valueToSend);
}

void readUartData() {
    /*
        Read serial transmitted data from OpenBCI string by string from RxD(UART
        receive pin). When end of new line reached - send the data to Bluetooth
        module using TxD(UART transmit pin)
    */
    while (mySerial.available() > 0) {
        char recieved = mySerial.read();
        inData += recieved;
        // Process message when new line character is recieved
        if (recieved == '\n') {
            Serial.print("Arduino Received: ");
            Serial.print(inData);
            sendBTData(inData);
            inData = ""; // Clear recieved buffer
        }
    }
}

void loop() {
  readUartData();
}
