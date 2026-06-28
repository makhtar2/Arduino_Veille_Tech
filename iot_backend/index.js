require('dotenv').config();
const mongoose = require('mongoose');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

console.log("Demarrage du pont de donnees Arduino -> MongoDB...");

// Connexion a la base de donnees
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion reussie a MongoDB"))
  .catch(err => {
    console.error("Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });

// Schema de donnees sans options de timestamp automatique
const sensorSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  date: { type: String, required: true },
  heure: { type: String, required: true }
}, {
  versionKey: false // Supprime le champ __v genere par Mongoose
});

const SensorData = mongoose.model('sensor_data', sensorSchema);

// Configuration du port serie
const port = new SerialPort({
  path: process.env.SERIAL_PORT,
  baudRate: parseInt(process.env.BAUD_RATE)
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

port.on('open', () => {
  console.log(`Port serie ouvert sur ${process.env.SERIAL_PORT}`);
});

port.on('error', (err) => {
  console.error("Erreur port serie :", err.message);
});

let derniereMesure = null;

// Lecture des donnees envoyees par l'Arduino
parser.on('data', (line) => {
  const regex = /Humidite ambiante\s*:\s*([\d.]+)\s*%\s*\|\s*Temperature\s*:\s*([\d.]+)\s*\*C/;
  const match = line.match(regex);

  if (match) {
    const hum = parseFloat(match[1]);
    const temp = parseFloat(match[2]);

    if (!isNaN(hum) && !isNaN(temp)) {
      derniereMesure = {
        temperature: temp,
        humidity: hum
      };
      console.log(`Mesure recue - Temp: ${temp}C | Hum: ${hum}%`);
    }
  } else {
    console.log(`Arduino: ${line}`);
  }
});

// Enregistrement periodique en base de donnees
const INTERVALLE_3_MINUTES = 10000; // 10 secondes pour le test de demonstration

setInterval(async () => {
  if (derniereMesure !== null) {
    try {
      const maintenant = new Date();
      const dateLocale = maintenant.toLocaleDateString('fr-FR');
      const heureLocale = maintenant.toLocaleTimeString('fr-FR');

      const nouvelEnregistrement = new SensorData({
        temperature: derniereMesure.temperature,
        humidity: derniereMesure.humidity,
        date: dateLocale,
        heure: heureLocale
      });

      await nouvelEnregistrement.save();
      console.log(`Donnees enregistrees en base a ${heureLocale} (${dateLocale})`);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err.message);
    }
  } else {
    console.log("En attente de mesures valides...");
  }
}, INTERVALLE_3_MINUTES);