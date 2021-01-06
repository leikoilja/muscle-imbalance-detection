<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/leikoilja/muscle-imbalance-detection">
    <img src="images/logo.png" alt="Logo" height="200">
  </a>

  <h3 align="center">Muscle Imbalance Detection (MID)</h3>

  <p align="center">
    This project was a part of <a href="https://www.kth.se/">KTH</a> University <a href="https://www.kth.se/student/kurser/kurs/HL2032?l=en">HL2032</a> course to create a medical engineering project.
    <br />
    <a href="https://github.com/leikoilja/muscle-imbalance-detection/tree/master/analytics">Analytics</a>
    &
    <a href="https://github.com/leikoilja/muscle-imbalance-detection/tree/master/electornics">Electornics</a>
    &
    <a href="https://github.com/leikoilja/muscle-imbalance-detection/tree/master/mcu">MCU</a>
    &
    <a href="https://github.com/leikoilja/muscle-imbalance-detection/tree/master/mobile_app">Mobile app</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#design">Design</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#device-demonstration">Demonstration</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
Patients recovering from knee surgery can have inferior long-term mobility if they do not perform specific rehabilitation exercises soon after surgery. Rehabilitation can fail if the patient does not begin it immediately after surgery, or if they do not have good compliance to the treatment plan. We present a device to assist patients and physicians with visualization of the rehabilitation process, to help them make better decisions about how to tailor a recovery plan. The device can display real time muscle activity feedback using reusable fabric electrodes with equivalent sensitivity to a much more expensive commercial sensor, and store and process the data to provide clinical information.

### Design

The system architecture of data communication is shown in figure 1.
[![Product Name Screen Shot][communication-screenshot]](https://example.com)

#### Electrical and Hardware
The system uses pairs of fabric electrodes integrated into a wearable device to detect muscle activity from the patient. A circuit was implemented to amplify and filter the signals before passing them to a microcontroller, and the EMG signal sensitivity can be adjusted using an integrated potentiometer.
The bluetooth module HC-05 is used to communicate between the signal detection circuit and the mobile application. Data sampling rate is currently set to 1KHz.

#### Mobile applicaton
The mobile app was implemented using React Native open-source mobile application framework. It supports user authentication, Bluetooth connectivity for real-time data monitoring, recording of monitored data, and uploading to cloud computing for further processing. It also allows one to see the archive of previous measurements and their corresponding analysis.

#### Cloud computing
The project utilizes Google firebase product which powers up authentication and cloud data storage functionalities. Firebase was chosen due to its robustness and sensitive data safety.
Backend analysis is implemented using python3.7 open source programming language which is mainly used for EMG signal analysis, filtration, and processing with the data collected from the cloud. The dataset we created from various sources used to recognize muscle recovery over time and muscle fatigue level.

<!-- GETTING STARTED -->
## Getting Started

To get started follow the corresponding sections and their READMEs:
<br />
<a href="https://github.com/leikoilja/muscle-imbalance-detection/tree/master/analytics">Analytics</a>
&
<a href="https://github.com/leikoilja/muscle-imbalance-detection/tree/master/electornics">Electornics</a>
&
<a href="https://github.com/leikoilja/muscle-imbalance-detection/tree/master/mcu">MCU</a>
&
<a href="https://github.com/leikoilja/muscle-imbalance-detection/tree/master/mobile_app">Mobile app</a>

### Prerequisites

Basic electronics and software development knowledge.

## Device demonstration

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Katlinkt](https://github.com/Katlinkt)
* [Behname](https://github.com/Behname)
* [sanjayshiva0109](https://github.com/sanjayshiva0109)
* [Vishnu Narayanan](https://github.com/Vishnu1293)
* [Ilja Leiko](https://github.com/leikoilja)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/leikoilja/muscle-imbalance-detection
[contributors-url]: https://github.com/leikoilja/muscle-imbalance-detection/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/leikoilja/muscle-imbalance-detection
[forks-url]: https://github.com/leikoilja/muscle-imbalance-detection/network/members
[stars-shield]: https://img.shields.io/github/stars/leikoilja/muscle-imbalance-detection
[stars-url]: https://github.com/leikoilja/muscle-imbalance-detection/stargazers
[issues-shield]: https://img.shields.io/github/issues/leikoilja/muscle-imbalance-detection
[issues-url]: https://github.com/leikoilja/muscle-imbalance-detection/issues
[license-shield]: https://img.shields.io/github/license/leikoilja/muscle-imbalance-detection
[license-url]: https://github.com/leikoilja/muscle-imbalance-detection/blob/master/LICENSE
[product-screenshot]: images/screenshot.png
[communication-screenshot]: images/communication.png
