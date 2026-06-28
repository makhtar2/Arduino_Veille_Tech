# Guide Pratique Pas-à-Pas : Liaison Arduino, Node.js et MongoDB

Ce guide est la suite directe de votre premier TP. Il vous explique comment récupérer les mesures physiques envoyées sur le port série par votre code Arduino d'origine, les extraire intelligemment dans un serveur Node.js à l'aide d'expressions régulières, et les sauvegarder automatiquement toutes les **3 minutes** dans une base de données **MongoDB**.

---

## 📋 Prérequis matériels et logiciels

1. **Votre Arduino Uno** branché avec le capteur **DHT11** (Broche DATA sur la broche 2).
2. **MongoDB** installé localement (ou un compte MongoDB Atlas).
3. **MongoDB Compass** installé pour visualiser la base de données.
4. **Node.js** (version 16 ou supérieure) installé sur votre ordinateur.

---

## 🛠️ Étape 1 : Le Code Arduino d'Origine (Émetteur)
Nous conservons **exactement** votre code d'origine de la Veille 1. La carte envoie continuellement des lignes de texte lisibles par l'humain sur le port série.

```cpp
#include "DHT.h"

#define DHTPIN 2      // Broche DATA reliée à la broche numérique 2
#define DHTTYPE DHT11 // Notre capteur est le DHT11 bleu

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  Serial.println("--- Demarrage de la station ---");
  dht.begin();
}

void loop() {
  delay(2000); // Le capteur a besoin de 2 secondes entre chaque mesure

  float humidite = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Test de sécurité : si le câble est débranché, le moniteur va vous le dire
  if (isnan(humidite) || isnan(temperature)) {
    Serial.println("Erreur de lecture ! Verifiez les fils rouge/noir/signal.");
    return; 
  }

  // Affichage propre des données
  Serial.print("Humidite ambiante : ");
  Serial.print(humidite);
  Serial.print(" %  |  ");
  Serial.print("Temperature : ");
  Serial.print(temperature);
  Serial.println(" *C");
}
```

---

## 🗄️ Étape 2 : Installation et Configuration de MongoDB (En Local)

Pour faire simple et éviter la complexité de la configuration dans le cloud, nous utilisons la base de données en local sur votre ordinateur.

### 1. Installer et démarrer MongoDB sur votre PC Linux
Ouvrez un terminal et exécutez la commande suivante pour installer et démarrer le service MongoDB :
```bash
sudo apt update && sudo apt install -y mongodb && sudo systemctl start mongodb
```
*La base de données tourne désormais silencieusement en tâche de fond sur votre ordinateur.*

### 2. Installer MongoDB Compass (l'interface graphique)
Pour visualiser vos données enregistrées :
1. Téléchargez le fichier d'installation en cliquant ici : [Télécharger MongoDB Compass (.deb)](https://downloads.mongodb.com/compass/mongodb-compass_1.43.0_amd64.deb)
2. Une fois le téléchargement terminé, double-cliquez sur le fichier `.deb` dans votre dossier Téléchargements pour l'installer (ou exécutez `sudo dpkg -i ~/Downloads/mongodb-compass_*.deb` dans le terminal).

### 3. Se connecter et préparer la Base de Données
1. Lancez **MongoDB Compass** depuis la liste de vos applications.
2. Une fenêtre s'ouvre avec une case pré-remplie contenant la chaîne par défaut : `mongodb://localhost:27017`.
3. Cliquez simplement sur le bouton vert **"Connect"**.
4. Une fois connecté, cliquez sur **Create database** (Créer une base de données) :
   * **Database Name** : `iot_database`
   * **Collection Name** : `sensor_data`
5. Laissez Compass ouvert de côté.

---

## 💻 Étape 3 : Création du Projet Backend Node.js

### 1. Initialiser le projet
Ouvrez votre terminal et créez le dossier du serveur :
```bash
mkdir -p /home/almuxtaar/Desktop/Veille_Technologique_Microcontroleur/iot_backend
cd /home/almuxtaar/Desktop/Veille_Technologique_Microcontroleur/iot_backend
npm init -y
```

### 2. Installer les bibliothèques requises
Nous installons les pilotes pour communiquer avec MongoDB et l'USB :
```bash
npm install mongoose serialport @serialport/parser-readline dotenv
```

### 3. Configurer les Variables d'Environnement (`.env`)
Créez un fichier nommé `.env` dans votre dossier `iot_backend` :
```env
MONGO_URI=mongodb://127.0.0.1:27017/iot_database
SERIAL_PORT=/dev/ttyACM0
BAUD_RATE=9600
```
*Note : Sur Linux, le port série est généralement `/dev/ttyACM0` ou `/dev/ttyUSB0`. Sur Windows, ce sera un port comme `COM3`.*

---

## 🛠️ Étape 4 : Écriture du Serveur Node.js (`index.js`)

Créez le fichier `/home/almuxtaar/Desktop/Veille_Technologique_Microcontroleur/iot_backend/index.js`. 

Pour lire le texte brut envoyé par l'Arduino (`Humidite ambiante : 45.00 % | Temperature : 22.00 *C`), le serveur utilise une **Expression Régulière (Regex)** qui extrait automatiquement les nombres.

```javascript
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
const INTERVALLE_3_MINUTES = 3 * 60 * 1000;

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
```

---

## 🏃‍♂️ Étape 5 : Exécuter le Projet et Présenter le TP

### 1. Téléverser le code Arduino
Téléversez votre code d'origine de la Veille 1 sur la carte Arduino.

### 2. Lancer le Serveur Node.js
Dans votre dossier `/home/almuxtaar/Desktop/Veille_Technologique_Microcontroleur/iot_backend`, exécutez :
```bash
node index.js
```

Le terminal affichera :
```text
Démarrage du pont de données Arduino -> MongoDB...
✅ Connexion réussie à MongoDB !
🔌 Écoute du port série établie sur /dev/ttyACM0
[Arduino] --- Demarrage de la station ---
[Reçu] Température : 24.50°C | Humidité : 62.00%
[Reçu] Température : 24.50°C | Humidité : 62.00%
```

### 3. Vérification de la sauvegarde automatique
Laissez tourner le programme. Toutes les 3 minutes, la ligne suivante apparaîtra dans votre terminal, indiquant que les données ont bien été enregistrées dans MongoDB :
```text
💾 [MongoDB] Données sauvegardées en base avec succès !
```

### 4. Contrôle dans MongoDB Compass
Dans MongoDB Compass, ouvrez la collection `sensor_data` de la base `iot_database` et cliquez sur **Refresh** : vous verrez apparaître vos documents stockés avec les températures et humidités réelles, associées à la date et heure précises (`createdAt`).
