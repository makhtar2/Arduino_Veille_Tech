require('dotenv').config();
const mongoose = require('mongoose');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

console.log("Démarrage du pont de données Arduino -> MongoDB...");

// 1. Connexion à la Base de Données
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connexion réussie à MongoDB !"))
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });

// 2. Définition du Schéma Mongoose
// { timestamps: true } ajoute automatiquement les champs createdAt et updatedAt
const sensorSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true }
}, { 
  timestamps: true 
});

const SensorData = mongoose.model('sensor_data', sensorSchema);

// 3. Liaison avec le Port Série de l'Arduino
const port = new SerialPort({
  path: process.env.SERIAL_PORT,
  baudRate: parseInt(process.env.BAUD_RATE)
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

port.on('open', () => {
  console.log(`🔌 Écoute du port série établie sur ${process.env.SERIAL_PORT}`);
});

port.on('error', (err) => {
  console.error("❌ Erreur de communication série :", err.message);
});

// Variable temporaire pour conserver la dernière mesure lue
let derniereMesure = null;

// 4. Analyse et extraction des données textuelles de l'Arduino
parser.on('data', (line) => {
  // Ligne attendue : "Humidite ambiante : 62.00 %  |  Temperature : 24.50 *C"
  // Expression régulière pour extraire l'humidité (1er groupe) et la température (2e groupe)
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
      console.log(`[Reçu] Température : ${temp}°C | Humidité : ${hum}%`);
    }
  } else {
    // Affiche les messages système de l'Arduino (comme "--- Demarrage de la station ---")
    console.log(`[Arduino] ${line}`);
  }
});

// 5. Enregistrement en base toutes les 3 minutes (180 000 ms)
// const INTERVALLE_3_MINUTES = 3 * 60 * 1000;
const INTERVALLE_3_MINUTES = 10000;
setInterval(async () => {
  if (derniereMesure !== null) {
    try {
      const nouvelEnregistrement = new SensorData(derniereMesure);
      await nouvelEnregistrement.save();
      console.log(`💾 [MongoDB] Données sauvegardées en base avec succès !`);
    } catch (err) {
      console.error("❌ Impossible d'enregistrer les données :", err.message);
    }
  } else {
    console.log("⚠️ En attente de mesures valides de l'Arduino...");
  }
}, INTERVALLE_3_MINUTES);