# How to Launch Belay
- Belay consists of two components: a backend flask server and a  frontend react app. 
- The backend server is located in the `backend/` directory and the frontend app is located in the `frontend/` directory.
- Note that to run this application, you will need to first launch the backend server and then the frontend app.
## Launching the backend
To start the backend navigate to `backend/`. Run 
```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
This should start the backend server on http://127.0.0.1:5000.

## Launching the frontend

To start the frontend navigate to `frontend/`. Run 
```
npm install
npm start
```