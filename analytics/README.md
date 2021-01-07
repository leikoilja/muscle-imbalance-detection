A Python script for supporting the external loading and processing of biological signals.

Features:
- Signal filtring: low 1hz, high 300hz
- Explains tkeo filter, moving average filter, butter-worth filter
- Signal smoothing (comparing with different different smoothing levels)
- Signal rectification
- Detecting muscle activation (burst duration)
- RMS (root mean squre value)
- Muscle fatigue level

## Installation
Use the package manager [pip](https://pip.pypa.io/en/stable/) to install biosignalsnotebooks and required dependencies:
Please see [this resource](https://firebase.google.com/docs/firestore/quickstart) on how to setup firebase access to python.

```bash
pip install biosignalsnotebooks
pip install numpy
pip install pandas
pip install matplotlib
pip install firebase-admin
```

## Usage
```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('<PATH-TO-YOUR-KEY>')  # use your personal key file here
firebase_admin.initialize_app(cred)

db = firestore.client()
```
Data is collected from firebase and stored as a dataframe.
To make it readable in biosignals notebook few changes have to be made by adding channels (see examples).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Credits
Biosignals [notebooks](https://biosignalspulux.com/learn/notebooks/Categories/Detect/detect_bursts_rev.php).
