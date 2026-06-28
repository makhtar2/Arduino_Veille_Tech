# Veille Technologique & TP : Arduino, Node.js et MongoDB

Ce rapport technique présente les concepts théoriques du stockage NoSQL appliqué à l'Internet des Objets (IoT) et propose un guide d'implémentation complet pour interconnecter une carte Arduino avec un serveur Node.js et une base de données MongoDB.

---

## 1. Concepts Fondamentaux de MongoDB & NoSQL

### Qu'est-ce que MongoDB ?
MongoDB est un système de gestion de base de données (SGBD) non relationnel (NoSQL) orienté documents. Conçu pour la flexibilité et la scalabilité, il permet de stocker des données sous forme de documents semi-structurés (semblables à du JSON), ce qui le rend particulièrement adapté au traitement de gros volumes de données variées, comme les flux de capteurs IoT.

### Différence entre Base Relationnelle (SQL) et NoSQL
| Caractéristique | Base de données Relationnelle (SQL) | Base de données NoSQL (ex: MongoDB) |
|---|---|---|
| **Structure** | Tables rigides avec lignes et colonnes. | Documents flexibles (JSON/BSON) ou paires clé-valeur. |
| **Schéma** | Strict et prédéfini (toutes les lignes ont les mêmes colonnes). | Dynamique (chaque document peut avoir des champs différents). |
| **Relations** | Jointures complexes (JOIN) entre plusieurs tables. | Données imbriquées dans un seul document (pas de jointure). |
| **Scalabilité** | Verticale (augmenter la puissance du serveur physique). | Horizontale (distribuer les données sur plusieurs serveurs). |

### Pourquoi MongoDB est-elle orientée documents ?
MongoDB stocke les données sous forme de structures autonomes appelées **documents**. Contrairement au modèle SQL où une entité est découpée dans plusieurs tables liées, MongoDB regroupe toutes les informations d'un objet (par exemple, les caractéristiques d'un capteur et ses dernières mesures) au sein d'un seul et unique document.

### Qu'est-ce qu'un document dans MongoDB ?
Un document est l'unité de base d'enregistrement dans MongoDB. Il s'agit d'une structure de données clé-valeur (similaire à un objet JavaScript).
Exemple de document :
```json
{
  "_id": "60c72b2f9b1d8b2bad0a42f5",
  "sensorName": "DHT11_Salle_101",
  "temperature": 24.5,
  "humidity": 62.0,
  "status": "active"
}
```

### Qu'est-ce qu'une collection ?
Une collection est un regroupement de documents MongoDB. C'est l'équivalent d'une **table** dans une base de données relationnelle, mais sans structure rigide. Une même collection (ex: `sensor_data`) peut contenir des documents ayant des structures légèrement différentes.

### Quel format de données MongoDB utilise-t-elle ?
MongoDB utilise le format **BSON** (Binary JSON) pour stocker les données sur le disque et les échanger en interne. Cependant, pour l'utilisateur et les requêtes, les données sont présentées et manipulées au format **JSON**.

### Différence entre JSON et BSON
*   **JSON (JavaScript Object Notation)** : Format texte simple, lisible par l'humain, très utilisé pour les API. Ses types de données sont limités (chaîne, nombre, booléen, tableau, objet, null).
*   **BSON (Binary JSON)** : Représentation binaire du JSON. Plus rapide à analyser et à parcourir pour la base de données. Il ajoute des types supplémentaires indispensables pour les bases de données (dates réelles, grands nombres, ID uniques `ObjectId`, données binaires brutes).

---

## 2. MongoDB appliqué à l'IoT

### Pourquoi MongoDB est-elle adaptée à l'IoT ?
1.  **Flexibilité du schéma** : Les objets connectés évoluent souvent. Si vous ajoutez un nouveau capteur à votre carte (ex: un capteur de CO2), vous pouvez directement enregistrer ce nouveau champ dans MongoDB sans avoir à modifier la structure globale de la base de données.
2.  **Vitesse d'écriture** : Les objets connectés génèrent des mesures en continu. MongoDB gère très bien les écritures rapides grâce à son architecture non bloquante.
3.  **Facilité d'intégration** : Node.js (JavaScript) et MongoDB (JSON/BSON) partagent la même syntaxe d'objet, ce qui simplifie grandement l'écriture du code de passerelle.

### Quels types de données provenant d’un Arduino peut-on enregistrer ?
*   **Données analogiques brutes** (de 0 à 1023) : Photorésistances (LDR), potentiomètres.
*   **Données physiques converties** : Température (°C), humidité (%), distance (cm).
*   **États binaires** : Présence (0/1), bouton enfoncé (vrai/faux).
*   **Métadonnées** : Identifiant de la carte (MAC ou IP), état de la batterie, horodatage.

### Limites de MongoDB dans une application IoT
*   **Consommation de stockage** : Le format de document répète le nom des clés (ex: "temperature") dans chaque enregistrement, ce qui peut consommer beaucoup d'espace disque à grande échelle par rapport à des bases optimisées "séries temporelles" (comme InfluxDB).
*   **Pas de traitement temps réel strict** : MongoDB n'est pas conçu pour l'analyse en microsecondes.
*   **Ressources matérielles** : MongoDB nécessite un serveur avec une bonne quantité de RAM, il ne peut pas tourner directement sur un microcontrôleur limité comme l'Arduino.

---

## 3. Communication : Node.js, Mongoose & MongoDB

### Comment Node.js communique-t-il avec MongoDB ?
Node.js utilise le pilote officiel `mongodb` pour se connecter et interroger la base. Toutefois, dans la pratique, on utilise presque toujours une bibliothèque intermédiaire appelée **Mongoose**.

### Quel est le rôle de la bibliothèque Mongoose ?
Mongoose est un **ODM** (Object Document Mapper) pour MongoDB. Il permet de :
1.  Structurer et valider les données côté code (définir les types, rendre certains champs obligatoires).
2.  Simplifier les requêtes avec des fonctions JavaScript lisibles.
3.  Créer une couche d'abstraction structurée pour éviter d'enregistrer des données incohérentes.

### Qu'est-ce qu'un schéma Mongoose ?
Un schéma Mongoose définit la structure des documents au sein d'une collection spécifique, avec leurs types et validations.
Exemple :
```javascript
const sensorSchema = new mongoose.Schema({
  sensorName: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});
```

### Requêtes CRUD de base avec Mongoose

#### Enregistrer les données d'un capteur :
```javascript
const newMeasure = new Sensor({ sensorName: "DHT11", value: 24.5 });
await newMeasure.save();
```

#### Rechercher les données d'un objet :
```javascript
const results = await Sensor.find({ sensorName: "DHT11" }).sort({ timestamp: -1 });
```

#### Modifier ou supprimer une donnée :
```javascript
// Modifier
await Sensor.updateOne({ _id: "..." }, { value: 25.0 });
// Supprimer
await Sensor.deleteOne({ _id: "..." });
```

### Comment enregistrer automatiquement la date et l’heure ?
On utilise l'option `timestamps` de Mongoose ou la valeur par défaut `Date.now` :
```javascript
const schema = new mongoose.Schema({
  value: Number
}, { timestamps: true }); // Génère automatiquement les champs createdAt et updatedAt
```

---

## 4. Sécurité & Bonnes Pratiques

### MongoDB Local vs MongoDB Atlas
*   **MongoDB Local** : Installé sur votre machine. Gratuit, fonctionne sans connexion internet, idéal pour le développement.
*   **MongoDB Atlas** : Version hébergée dans le Cloud par MongoDB. Sécurisée d'office, accessible depuis n'importe où, avec sauvegardes automatiques. Parfait pour les applications de production.

### Comment sécuriser l’accès à MongoDB ?
1.  **Activer l'authentification** : Ne jamais laisser de base accessible sans mot de passe.
2.  **Filtrage IP (Whitelist)** : N'autoriser que l'adresse IP de votre serveur Node.js à se connecter à la base de données.
3.  **Chiffrement TLS/SSL** : S'assurer que les données échangées entre l'application et la base transitent de manière cryptée.

### Pourquoi protéger les identifiants de connexion ?
L'URI de connexion contient en clair l'adresse de votre base de données, le nom d'utilisateur et le mot de passe. Si un utilisateur malveillant accède à cette chaîne, il peut voler, corrompre ou supprimer l'intégralité de vos données de capteurs.

### Comment utiliser un fichier .env ?
On stocke les identifiants dans un fichier local nommé `.env` (qui ne doit jamais être partagé sur GitHub ou Git) :
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/iot_database
PORT=3000
```
Dans le code Node.js, on charge ces variables avec la bibliothèque `dotenv` :
```javascript
require('dotenv').config();
const dbUri = process.env.MONGO_URI;
```

---

## 5. Architecture Temps Réel & Socket.IO

### Comment organiser les collections d’une solution IoT ?
Pour éviter d'avoir un fichier géant, on utilise souvent deux collections principales :
1.  `devices` : Contient l'état et la configuration de chaque carte (ex: ID, emplacement, type de capteurs connectés).
2.  `measurements` : Enregistre chaque mesure individuelle avec l'ID de la carte, la valeur et l'heure de capture.

### Rôle de Socket.IO dans une application IoT en temps réel
Socket.IO permet d'établir une liaison bidirectionnelle continue entre le serveur et le client web.
```
[Arduino] --(Série)--> [Node.js Server] --(Socket.IO)--> [Interface Web / Client]
                             |
                      (Enregistrement)
                             v
                        [MongoDB]
```
Dès que Node.js reçoit une mesure de l'Arduino, il l'enregistre dans MongoDB pour l'historique et l'envoie instantanément via Socket.IO à la page web pour l'afficher sur un graphique en temps réel, sans que l'utilisateur ait besoin de rafraîchir sa page.

---

## 6. Guide d'Activité Pratique (Implémentation)

Voici les étapes de programmation pour interconnecter votre Arduino et MongoDB toutes les 3 minutes.

### A. Structure du projet Node.js
Créez un dossier `iot_backend` et installez les paquets :
```bash
mkdir iot_backend && cd iot_backend
npm init -y
npm install mongoose serialport dotenv
```

### B. Fichier de Configuration (`.env`)
Créez un fichier `.env` :
```env
MONGO_URI=mongodb://127.0.0.1:27017/iot_database
SERIAL_PORT=/dev/ttyACM0
BAUD_RATE=9600
```

### C. Fichier principal de l'application Node.js (`server.js`)
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// 1. Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB avec succès !'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));

// 2. Définition du Schéma et du Modèle
const sensorDataSchema = new mongoose.Schema({
  sensorName: { type: String, default: "Arduino_Room_Sensor" },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('sensor_data', sensorDataSchema);

// 3. Configuration de la liaison Série avec l'Arduino
const port = new SerialPort({
  path: process.env.SERIAL_PORT,
  baudRate: parseInt(process.env.BAUD_RATE)
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let lastSavedTime = 0;
const THREE_MINUTES_MS = 3 * 60 * 1000; // 3 minutes en millisecondes

// 4. Lecture des données envoyées par l'Arduino
parser.on('data', async (data) => {
  console.log(`Donnée reçue de l'Arduino : ${data}`);
  
  const numericValue = parseFloat(data);
  if (isNaN(numericValue)) {
    console.log("Donnée reçue invalide (pas un nombre)");
    return;
  }

  const now = Date.now();
  // Vérification de l'intervalle de 3 minutes
  if (now - lastSavedTime >= THREE_MINUTES_MS) {
    try {
      const newRecord = new SensorData({ value: numericValue });
      await newRecord.save();
      console.log(`Donnée enregistrée avec succès : ${numericValue} à ${new Date(now).toLocaleTimeString()}`);
      lastSavedTime = now;
    } catch (err) {
      console.error("Erreur lors de l'enregistrement en base :", err);
    }
  }
});
```

### D. Code de l'Arduino (`Arduino_Test.ino`)
Ce programme lit une entrée analogique et l'envoie en boucle sur le port série :
```cpp
const int sensorPin = A0;

void setup() {
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
}

void loop() {
  int sensorValue = analogRead(sensorPin);
  Serial.println(sensorValue); // Envoie la valeur sur le port série
  delay(1000);                 // Envoie toutes les secondes (le script Node gérera l'intervalle de 3 min)
}
```
