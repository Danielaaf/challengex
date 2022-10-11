# challengex project

## Run the system
We can easily run all with only a single command:
```bash
docker-compose up --build
```

Docker will pull MongoDB and Node.js images if they are not at your machine already.

## Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker-compose down
```

Or, in the terminal, press Ctrl + C.

## Secret
For the docker-compose to start properly and to setup the enviroment variables correctly you need to create an .env file, here is an example:
```bash
MONGODB_USER=root
MONGODB_PASSWORD=university1223
MONGODB_DATABASE=university_db
MONGODB_LOCAL_PORT=7017
MONGODB_DOCKER_PORT=27017

NODE_LOCAL_PORT=6868
NODE_DOCKER_PORT=8080

CLIENT_ORIGIN=http://127.0.0.1:8888
CLIENT_API_BASE_URL=http://127.0.0.1:6868/api

REACT_LOCAL_PORT=8888
REACT_DOCKER_PORT=80
```

## Test Application
When you run the application, you can visit this ports on your localhost to access all parts of it (considering the .env file configuration mentioned before):
- Mongo Connection String: mongodb://{MONGODB_USER}:{MONGODB_PASSWORD}@localhost:{MONGODB_LOCAL_PORT}/university_db?authSource=admin
- Backend (Node.js) on port {NODE_LOCAL_PORT}: http://127.0.0.1:{NODE_LOCAL_PORT}
- Frontend (React) on port {REACT_LOCAL_PORT}: http://127.0.0.1:{REACT_LOCAL_PORT}

> This app needs some security improvement to get published on the cloud, but technichally it's ready for deployment :)

> This app has a db with an existing user to start using the app. The user is username:admin and password:admin.
