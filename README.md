# Smart Home Device Monitor

This project is a simple server and web application to monitor smart home devices. It uses Express, a web framework for Node.js, to create the server and handle HTTP requests. The application pings devices periodically to check if they are online and displays their status in a web interface.

## Overview

### The code consists of two main parts:

- index.js: This is the server-side code that sets up an Express server and Socket.IO for real-time communication. It loads a list of devices from a YAML file (devices.yml), schedules a job to ping the devices at specified intervals, and serves a web page with the device list and their status.
- index.html: This is the client-side code that displays the list of devices, their online/offline status, and other details like the room and accessory type. It also allows the user to group devices either by accessory type or by room. The client-side JavaScript code updates the device status periodically by fetching the data from the server and re-rendering the device list.

## Dependencies
### To run this application, you need to have the following dependencies installed:

- express: A web framework for Node.js.
- yamljs: A library to parse and stringify YAML files.
- ping: A library to perform ICMP echo (ping) requests.
- node-schedule: A library to schedule jobs with cron-like syntax.
- socket.io: A library for real-time communication between the server and the client.

## Setup

- Install the required dependencies by running npm install express yamljs ping node-schedule socket.io.
- Create a devices.yml file in the same directory as index.js, which should contain a list of devices with their IP addresses, names, accessory types, and rooms. 

Example devices.yaml:
```
- name: Living Room Light
  ip: 192.168.1.2
  accessorytype: Light
  room: Living Room
  
- name: Kitchen Thermostat
  ip: 192.168.1.3
  accessorytype: Thermostat
  room: Kitchen
```  
## Running the Application

- Start the server by running node index.js.
- Open a web browser and go to http://localhost:3000 to view the list of devices and their status.

## Running in Docker

dockerfile:
```
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```
Build image
```
docker build --no-cache -t smart-home-device-monitor .
```
Run

```
docker run -p 3000:3000 --name smart-home-device-monitor-instance smart-home-device-monitor
```

Configurable ENV variables, defaulted to the ones below if not set

```
// UI language
LANGUAGE: en
// Server ping configuration
PING_INTERVAL: 5000
// Server port configuration
PORT: 3000
```

## Note

This code example doesn't handle errors or edge cases and is meant for demonstration purposes. You might want to add error handling, validation, and additional features for a production-ready application.
