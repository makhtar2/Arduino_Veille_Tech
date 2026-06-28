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

Pour faire simple et éviter la complexité de la configuration dans le cloud, nous utilisons la base de données en local. Suivez les étapes correspondant à votre système d'exploitation.

### Option A : Si vous êtes sur Windows
1. **Télécharger l'installateur** : Rendez-vous sur le site officiel et téléchargez le fichier d'installation `.msi` : [Télécharger MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. **Lancer l'installation** : Double-cliquez sur le fichier téléchargé. 
   * Choisissez le mode d'installation **"Complete"**.
   * Laissez cochée la case **"Install MongoDB as a Service"** (cela permet à la base de démarrer automatiquement avec votre PC).
   * Laissez également cochée la case **"Install MongoDB Compass"** (l'interface graphique s'installera en même temps).
3. **Se connecter** : Ouvrez **MongoDB Compass**, laissez l'adresse par défaut `mongodb://localhost:27017` et cliquez sur le bouton vert **"Connect"**.

### Option B : Si vous êtes sur Linux (Ubuntu/Debian)
1. **Installer et démarrer le service** :
   ```bash
   sudo apt update && sudo apt install -y mongodb && sudo systemctl start mongodb
   ```
2. **Installer MongoDB Compass** :
   * Téléchargez le fichier `.deb` : [Télécharger MongoDB Compass (.deb)](https://downloads.mongodb.com/compass/mongodb-compass_1.43.0_amd64.deb).
   * Installez-le en double-cliquant dessus ou via le terminal : `sudo dpkg -i ~/Downloads/mongodb-compass_*.deb`.
3. **Se connecter** : Lancez **MongoDB Compass** et cliquez sur le bouton vert **"Connect"** (avec la chaîne `mongodb://localhost:27017`).

### 3. Préparer la Base de Données (Identique pour Windows & Linux)
Une fois connecté sur MongoDB Compass :
1. Cliquez sur le bouton **Create database** (Créer une base de données).
2. Remplissez les champs ainsi :
   * **Database Name** : `iot_database`
   * **Collection Name** : `sensor_data`
3. Cliquez sur **Create Database**. Laissez Compass ouvert de côté.

---

## 💻 Étape 3 : Création du Projet Backend Node.js

### 1. Initialiser le projet
Ouvrez votre invite de commande (CMD/PowerShell sur Windows, ou Terminal sur Linux) et lancez :
```bash
# Créez le dossier et entrez dedans
mkdir iot_backend
cd iot_backend

# Initialisez le projet Node.js
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
SERIAL_PORT=COM3
BAUD_RATE=9600
```
*Note sur le Port Série (SERIAL_PORT) :*
* **Sur Windows** : Il s'agit d'un port COM (ex: `COM3`, `COM4`, `COM5`). Vous pouvez trouver le numéro exact dans l'Arduino IDE (menu *Outils > Port*) ou dans le *Gestionnaire de périphériques* de Windows.
* **Sur Linux** : C'est généralement `/dev/ttyACM0` ou `/dev/ttyUSB0`.

---

## 🛠️ Étape 4 : Écriture du Serveur Node.js (`index.js`)

Créez le fichier `index.js` dans le dossier `iot_backend`. 

Pour lire le texte brut envoyé par l'Arduino (`Humidite ambiante : 45.00 % | Temperature : 22.00 *C`), le serveur utilise une **Expression Régulière (Regex)** qui extrait uniquement les valeurs numériques et construit un objet propre sans fioritures ni timestamps automatiques générés par la base de données.

```javascript
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

// Enregistrement periodique en base de donnees (toutes les 3 minutes)
// Pour vos tests, vous pouvez mettre 10000 (10 secondes) au lieu de 3 * 60 * 1000
const INTERVALLE_3_MINUTES = 3 * 60 * 1000; 

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
```

---

## 🏃‍♂️ Étape 5 : Exécuter le Projet et Présenter le TP

### 1. Téléverser le code Arduino
Téléversez votre code d'origine de la Veille 1 sur la carte Arduino.

### 2. Lancer le Serveur Node.js
Dans votre dossier `iot_backend`, exécutez :
```bash
node index.js
```

Le terminal affichera :
```text
Demarrage du pont de donnees Arduino -> MongoDB...
Connexion reussie a MongoDB
Port serie ouvert sur COM3
Arduino: --- Demarrage de la station ---
Mesure recue - Temp: 24.50C | Hum: 62.00%
Mesure recue - Temp: 24.50C | Hum: 62.00%
```

### 3. Vérification de la sauvegarde automatique
Laissez tourner le programme. Toutes les 3 minutes, la ligne de confirmation apparaît dans votre console :
```text
Donnees enregistrees en base a 18:45:12 (28/06/2026)
```

### 4. Contrôle dans MongoDB Compass
Dans MongoDB Compass, ouvrez la collection `sensor_data` de la base `iot_database` et cliquez sur **Refresh**. 

Chaque document enregistré sera extrêmement propre et contiendra **uniquement** les champs suivants :
* `_id` (généré automatiquement par MongoDB)
* `temperature` (valeur numérique)
* `humidity` (valeur numérique)
* `date` (format "JJ/MM/AAAA")
* `heure` (format "HH:MM:SS")

*Il n'y a aucun autre champ système inutile ou date UTC parasite dans vos documents.*
