# Description

.........................A Python package for supporting the external loading and processing of biological signals .It can be installed through pip command.

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install biosignalsnotebooks.
Setting up firebase access to python (https://firebase.google.com/docs/firestore/quickstart)

```bash
pip install biosignalsnotebooks
pip install numpy
pip install pandas
pip install matplotlib
pip install --upgrade firebase-admin
```

## Usage

```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('path/to/serviceAccount.json')#use your persnol key here
firebase_admin.initialize_app(cred)

db = firestore.client()
```
where datas are collected from firebase and store to a dataframe then to make readable in biosignals notebook few changes is made by adding channels for example kindly please check links in the examples. 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
## Credits
Biosignals notebooks(https://biosignalspulux.com/learn/notebooks/Categories/Detect/detect_bursts_rev.php).

## License
[MIT]().
[Biosignalspulux]()
