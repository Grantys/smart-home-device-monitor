const express = require('express');
const YAML = require('yamljs');
const ping = require('ping');
const schedule = require('node-schedule');
const path = require('path');
const i18n = require('i18n');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// i18n configuration
const LANGUAGE = process.env.LANGUAGE || 'en';

i18n.configure({
  locales: ['en', 'hu'],
  directory: __dirname + '/locales',
  defaultLocale: LANGUAGE,
  objectNotation: true,
  register: global
});

app.use(i18n.init);

// Add this middleware function
app.use((req, res, next) => {
  res.setLocale(LANGUAGE);
  console.log(`Server-side language: ${LANGUAGE}`);
  next();
});

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

const devicesFilePath = path.join(__dirname, 'devices.yml');
let devices = YAML.load(devicesFilePath);

// Read environment variables
const PORT = process.env.PORT || 3000;
const PING_INTERVAL = process.env.PING_INTERVAL || 5000;

app.use(express.static('public'));

app.get('/devices', (req, res) => {
  res.json(devices);
});

const pingDevices = async () => {
  const promises = devices.map(async device => {
    const options = {
      timeout: 1 // Set the timeout to 1 second
    };
    const res = await ping.promise.probe(device.ip, options);
    if (res.alive) {
      device.lastSeen = new Date();
    }
  });
  await Promise.all(promises);
  isInitialDataLoaded = true;
  console.log("Server initialized!");
};

schedule.scheduleJob(`*/${Math.ceil(PING_INTERVAL / 60000)} * * * *`, pingDevices);

let isInitialDataLoaded = false;
console.log("Server initializing...");

io.on('connection', socket => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});
