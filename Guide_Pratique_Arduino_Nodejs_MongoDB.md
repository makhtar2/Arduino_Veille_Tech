# Guide Pratique Pas-à-Pas : Liaison Arduino, Node.js et MongoDB

Ce guide est la suite directe de la **Station de Surveillance Intelligente**. Il explique comment récupérer les mesures physiques envoyées sur le port série par votre Arduino, les analyser dans un serveur Node.js, et les sauvegarder automatiquement toutes les **3 minutes** dans une base de données **MongoDB**.

---

## 📋 Prérequis matériels et logiciels

1. **La Station de Surveillance assemblée** (Arduino Uno + DHT11 + LDR + PIR + LED RVB + Buzzer).
2. **MongoDB** installé localement (ou un compte MongoDB Atlas).
3. **MongoDB Compass** installé pour visualiser la base de données.
4. **Node.js** (version 16 ou supérieure) installé sur votre ordinateur.

---

## 🛠️ Étape 1 : Préparation du code Arduino (Émetteur)

Votre Arduino mesure la température, l'humidité, la luminosité et la détection d'intrusion. Afin que le serveur Node.js puisse lire facilement ces données, nous allons modifier le programme de l'Arduino pour qu'il envoie les mesures sous forme d'une chaîne structurée simple, facile à découper (par exemple séparée par des virgules `,`).

### Nouveau code Arduino (`Station_Surveillance_Liaison.ino`)
Remplacez le code de votre Arduino par celui-ci :

```cpp
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define LDRPIN A0
#define PIRPIN 3
#define BUZZER_PIN 8
#define LED_RED 9
#define LED_GREEN 10
#define LED_BLUE 11

#define SEUIL_TEMP_ALERTE 28.0
#define SEUIL_LUM_OBSCURITE 300

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600); // Communication avec l'ordinateur
  dht.begin();

  pinMode(PIRPIN, INPUT);
  pinMode(LDRPIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  // Auto-test des LEDs au démarrage
  allumerRGB(255, 0, 0); delay(300);
  allumerRGB(0, 255, 0); delay(300);
  allumerRGB(0, 0, 255); delay(300);
  allumerRGB(0, 0, 0);
}

void loop() {
  // 1. Lecture des capteurs
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int lux = analogRead(LDRPIN);
  int mouvement = digitalRead(PIRPIN);

  if (isnan(temp) || isnan(hum)) {
    // Si le capteur DHT11 a un problème, on n'envoie pas de fausses mesures
    return;
  }

  // 2. Formatage des données pour Node.js : "temp,hum,lux,mouvement"
  // Exemple de sortie : "24.50,62.00,450,0" ou "28.20,65.00,210,1"
  Serial.print(temp);
  Serial.print(",");
  Serial.print(hum);
  Serial.print(",");
  Serial.print(lux);
  Serial.print(",");
  Serial.println(mouvement);

  // 3. Logique d'alerte locale (inchangée)
  bool alerteSecurite = (mouvement == HIGH);
  bool alerteThermique = (temp >= SEUIL_TEMP_ALERTE);

  if (alerteSecurite) {
    allumerRGB(255, 0, 0);
    tone(BUZZER_PIN, 1000);
    delay(500);
    noTone(BUZZER_PIN);
    delay(500);
  } 
  else if (alerteThermique) {
    allumerRGB(255, 128, 0);
    tone(BUZZER_PIN, 500, 200);
    delay(1000);
  } 
  else {
    noTone(BUZZER_PIN);
    if (lux < SEUIL_LUM_OBSCURITE) {
      allumerRGB(0, 0, 150); // Bleu (nuit)
    } else {
      allumerRGB(0, 150, 0); // Vert (normal)
    }
    delay(1000);
  }
}

void allumerRGB(int r, int g, int b) {
  analogWrite(LED_RED, r);
  analogWrite(LED_GREEN, g);
  analogWrite(LED_BLUE, b);
}
```

---

## 🗄️ Étape 2 : Configuration de la Base de Données MongoDB

1. Lancez **MongoDB Compass** sur votre ordinateur.
2. Connectez-vous à votre instance locale de MongoDB (généralement via l'URI `mongodb://localhost:27017`).
3. Cliquez sur **Create database** (Créer une base de données) :
   * **Database Name** : `iot_database`
   * **Collection Name** : `sensor_data`
4. Laissez la base de données ouverte.

---

## 💻 Étape 3 : Création du Backend Node.js

### 1. Initialiser le projet
Ouvrez un terminal et créez un nouveau dossier pour le serveur :
```bash
mkdir -p /home/almuxtaar/Desktop/Veille_Technologique_Microcontroleur/iot_backend
cd /home/almuxtaar/Desktop/Veille_Technologique_Microcontroleur/iot_backend
npm init -y
```

### 2. Installer les bibliothèques requises
Nous installons les outils pour se connecter à la base, communiquer avec l'USB, et gérer les variables d'environnement :
```bash
npm install mongoose serialport @serialport/parser-readline dotenv
```

### 3. Fichier de Configuration (`.env`)
Créez un fichier `.env` pour cacher vos identifiants et configurer les paramètres de connexion :
```env
MONGO_URI=mongodb://127.0.0.1:27017/iot_database
SERIAL_PORT=/dev/ttyACM0
BAUD_RATE=9600
```
*Note pour Linux : Si votre port série n'est pas `/dev/ttyACM0`, vérifiez avec `ls /dev/tty*` (généralement `/dev/ttyUSB0` ou `/dev/ttyACM0`). Sur Windows, ce sera un port COM comme `COM3`.*

---

## 🛠️ Étape 4 : Code du Serveur Node.js (`index.js`)

Créez le fichier `/home/almuxtaar/Desktop/Veille_Technologique_Microcontroleur/iot_backend/index.js` et collez-y le code suivant :

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

console.log("Démarrage du système de surveillance...");

// 1. Connexion à la Base de Données MongoDB via Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connexion réussie à MongoDB !"))
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB :", err);
    process.exit(1);
  });

// 2. Définition du Schéma de données (Température, Humidité, Lumière, Intrusion)
// Mongoose ajoutera automatiquement les champs createdAt et updatedAt grâce à { timestamps: true }
const sensorDataSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  light: { type: Number, required: true },
  intrusion: { type: Boolean, required: true }
}, { 
  timestamps: true // Enregistre la date et l'heure exactes de chaque mesure
});

// Création du modèle
const SensorData = mongoose.model('sensor_data', sensorDataSchema);

// 3. Connexion au Port Série USB de l'Arduino
const port = new SerialPort({
  path: process.env.SERIAL_PORT,
  baudRate: parseInt(process.env.BAUD_RATE)
});

// Utilisation du parser pour lire les données ligne par ligne
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

port.on('open', () => {
  console.log(`🔌 Liaison série établie sur le port ${process.env.SERIAL_PORT} (9600 bauds)`);
});

port.on('error', (err) => {
  console.error("❌ Erreur sur le port série :", err.message);
});

// Variables temporaires pour stocker la dernière mesure reçue de l'Arduino
let derniereMesure = null;

// 4. Réception en temps réel des données du port série
parser.on('data', (data) => {
  // Les données arrivent sous la forme : "24.50,62.00,450,0"
  const elements = data.split(',');

  if (elements.length === 4) {
    const temp = parseFloat(elements[0]);
    const hum = parseFloat(elements[1]);
    const lux = parseInt(elements[2]);
    const intrusionDetectee = parseInt(elements[3]) === 1;

    // Validation des données numériques
    if (!isNaN(temp) && !isNaN(hum) && !isNaN(lux)) {
      derniereMesure = {
        temperature: temp,
        humidity: hum,
        light: lux,
        intrusion: intrusionDetectee
      };
      
      // Affichage de contrôle dans la console
      console.log(`[Reçu] Temp: ${temp}°C | Hum: ${hum}% | Lumière: ${lux} | Intrusion: ${intrusionDetectee ? "OUI" : "NON"}`);
    }
  }
});

// 5. Enregistrement automatique toutes les 3 minutes (180 000 ms)
const INTERVALLE_3_MINUTES = 3 * 60 * 1000;

setInterval(async () => {
  if (derniereMesure !== null) {
    try {
      // Création d'un enregistrement en base
      const nouvelEnregistrement = new SensorData(derniereMesure);
      await nouvelEnregistrement.save();
      
      console.log(`💾 [MongoDB] Mesures sauvegardées en base à ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      console.error("❌ Impossible de sauvegarder en base :", err.message);
    }
  } else {
    console.log("⚠️ Aucune mesure reçue de l'Arduino pour le moment, attente...");
  }
}, INTERVALLE_3_MINUTES);
```

---

## 🏃‍♂️ Étape 5 : Exécuter et valider le TP

### 1. Téléverser le code Arduino
Ouvrez l'Arduino IDE et téléversez le code `Station_Surveillance_Liaison.ino` sur votre carte Arduino Uno.

### 2. Démarrer le serveur Node.js
Dans votre dossier `iot_backend`, lancez le serveur :
```bash
node index.js
```
Vous devriez voir s'afficher :
```text
Démarrage du système de surveillance...
✅ Connexion réussie à MongoDB !
🔌 Liaison série établie sur le port /dev/ttyACM0 (9600 bauds)
[Reçu] Temp: 24.50°C | Hum: 62.00% | Lumière: 450 | Intrusion: NON
```

### 3. Vérification de l'intervalle
Laissez tourner le programme. Toutes les 3 minutes, vous devriez voir la ligne suivante apparaître sur la console de votre serveur :
```text
💾 [MongoDB] Mesures sauvegardées en base à 14:35:12
```

### 4. Visualisation dans MongoDB Compass
* Ouvrez MongoDB Compass.
* Allez dans la base de données `iot_database`, puis dans la collection `sensor_data`.
* Cliquez sur le bouton de rafraîchissement (**Refresh**).
* Vous verrez vos documents s'enregistrer avec les champs `temperature`, `humidity`, `light`, `intrusion`, ainsi que `createdAt` (date et heure automatiques).
