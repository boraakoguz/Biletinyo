# Biletinyo
A full-stack event ticket marketplace built with Flask, React, and PostgreSQL

## Steps to Run Project
1. Make sure Docker Desktop and Docker Compose is installed on your machine
    
https://docs.docker.com/compose/install/

https://www.docker.com/products/docker-desktop/

2. Clone the repository
```
git clone https://github.com/boraakoguz/Biletinyo.git
```
3. cd to project directory
```
cd ./Biletinyo
```
4. Run Docker Compose while the Docker Engine is running (have Docker Desktop running at the background)
```
docker compose up
```
Or use compose watch to enable hotloading. (Very useful for development purposes)
```
docker compose watch
```
5. Access the localhost port printed on the terminal. Example output:
```
frontend-1  |   VITE v6.0.3  ready in 159 ms
frontend-1  |
frontend-1  |   ➜  Local:   http://localhost:5173/
frontend-1  |   ➜  Network: http://172.18.0.3:5173/
```
You can view the project via the link given in Local. Defaults to http://localhost:5173/