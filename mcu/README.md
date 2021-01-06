# Arduino microcontroller firmware
It receives a string of data containing 6 digits from OpenBCI or custom designed
electronics board, where first 3 characters represent first analog sensor and
last 3 - second analog sensor correspondingly.
For example a received string `123456` would mean that the first analog sensor
value is `123`, while the second analog sensor value is `456`.

## Requirements
- Arduino IDE
- Arduino Nano
- HC05 Bluetooth module (setup to use `115200` baud-rate)

## How to setup
1. Connect HC05 Bluetooth module to Arduino using jumper wires so RX of
   Bluetooth module is connected to D2 pin of Arduino, while TX of Bluetooth
   module is connected to D3 pin of Arduino.
2. Connect 3.3V(5V) power and GND from Arduino to HC05 Bluetooth module.
3. Open `mcu.ino` file in Arduino IDE, connect Arduino Nano using USB to your
   computer and upload the code.
4. Connect OpenBCI or custom designed circuit board to send data to Arduino
   using Arduino's RX ports correspondingly.
4. You can open Serial Monitor in Arduino IDE to debug what values are sent
