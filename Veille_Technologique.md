# Rapport de Veille Technologique & TP : Microcontrôleurs
*Auteurs: Groupe de TP*
*Date: Juin 2026*

---

## Introduction
Ce document constitue le support complet de notre veille technologique sur les microcontrôleurs et la plateforme Arduino. Il est structuré pour répondre aux exigences académiques de compréhension théorique, de classification pratique du matériel du kit, et de conception d'un projet de station intelligente.

---

## 1. Réponses détaillées aux questions de Veille Technologique

### 1. Quel est le rôle d’une carte Arduino ?
Le rôle principal d’une carte Arduino est de servir de **plateforme de prototypage électronique rapide**. C'est un système embarqué à base de microcontrôleur qui permet de :
* **Acquérir des informations** depuis l'environnement physique à l'aide de capteurs (température, lumière, présence, etc.).
* **Traiter les données** en exécutant un programme informatique chargé dans sa mémoire.
* **Agir sur l'environnement** en contrôlant des actionneurs (LEDs, moteurs, écrans, relais, etc.).

Elle sert d'interface programmable entre le monde réel et le code informatique.

---

### 2. Quelle est la différence entre Arduino Uno, Arduino Mega et Arduino Nano ?
Ces trois cartes appartiennent à la même famille mais répondent à des besoins d'intégration et de complexité différents :

| Caractéristique | Arduino Uno (R3) | Arduino Mega 2560 | Arduino Nano |
| :--- | :--- | :--- | :--- |
| **Microcontrôleur** | ATmega328P (8 bits) | ATmega2560 (8 bits) | ATmega328P (8 bits) |
| **Taille / Format** | Standard (moyen) | Grand (projets complexes) | Miniature (idéal breadboard) |
| **Broches Numériques (I/O)**| 14 (dont 6 PWM) | 54 (dont 15 PWM) | 14 (dont 6 PWM) |
| **Entrées Analogiques** | 6 | 16 | 8 |
| **Mémoire Flash** | 32 Ko | 256 Ko | 32 Ko |
| **Mémoire SRAM** | 2 Ko | 8 Ko | 2 Ko |
| **Ports Série Matériels (UART)**| 1 | 4 | 1 |

* **Arduino Uno** : C'est la carte de référence pour l'apprentissage et les projets de taille moyenne.
* **Arduino Mega** : Recommandée pour les projets nécessitant un grand nombre d'entrées/sorties (ex. imprimantes 3D, robots complexes).
* **Arduino Nano** : Identique à l'Uno en termes de puissance mais conçue dans un format ultra-réduit pour être soudée directement ou enfichée sur une plaque d'essais (breadboard).

---

### 3. Pourquoi l’ESP32 est-il souvent utilisé pour les projets IoT ?
L'**ESP32** est devenu le standard incontournable pour l'Internet des Objets (IoT) en raison de ses caractéristiques avancées :
* **Connectivité intégrée** : Il intègre nativement des puces **Wi-Fi** (802.11 b/g/n) et **Bluetooth** (Classic & BLE), ce qui évite l'achat de modules externes.
* **Puissance de calcul** : Il possède un processeur double-cœur Tensilica 32 bits cadencé jusqu'à 240 MHz (contre 16 MHz monocœur pour l'Arduino Uno).
* **Mémoire généreuse** : Environ 520 Ko de SRAM et jusqu'à 4 ou 8 Mo de mémoire Flash, permettant de faire tourner des protocoles réseau lourds (HTTPS, WebSockets, MQTT).
* **Gestion de l'énergie** : Des modes de sommeil profond ("Deep Sleep") ultra-efficaces qui réduisent la consommation à quelques micro-ampères pour les objets sur batterie.
* **Rapport performance/prix** : Son coût de fabrication et d'achat est similaire, voire inférieur, à celui d'une carte Arduino Uno officielle.

---

### 4. Quelles sont les principales entrées et sorties disponibles sur une carte Arduino ?
Une carte Arduino (comme l'Uno) dispose de plusieurs connecteurs pour interagir avec le matériel :
* **Broches Numériques (Digital Pins 0 à 13)** : Peuvent fonctionner en entrée (pour lire un bouton) ou en sortie (pour allumer une LED). Les broches marquées d'un tilde `~` (3, 5, 6, 9, 10, 11) supportent le **PWM** (Pulse Width Modulation) pour simuler une tension variable.
* **Entrées Analogiques (Analog In A0 à A5)** : Conçues pour mesurer des variations continues de tension (entre 0V et 5V) grâce à un convertisseur Analogique-Numérique (ADC) de 10 bits.
* **Broches d'Alimentation (Power)** :
  * **5V & 3.3V** : Fournissent une tension régulée pour alimenter les capteurs.
  * **GND (Ground)** : La masse de référence (0V).
  * **Vin** : Permet d'alimenter la carte avec une source externe (ex. pile 9V).
* **Broches de Communication** :
  * **TX (1) / RX (0)** : Transmission et réception de données série UART.
  * **SDA / SCL** : Bus de communication I2C.
  * **MOSI / MISO / SCK** : Bus de communication SPI.

---

### 5. Quelle est la différence entre une entrée analogique et une entrée numérique ?
* **Entrée Numérique** : Ne comprend que deux états discrets (binaires). Elle détecte si la tension est à la masse (**LOW** / 0V) ou à l'alimentation (**HIGH** / 5V). Utile pour des interrupteurs ou capteurs tout-ou-rien.
* **Entrée Analogique** : Reçoit une tension qui varie de manière continue entre 0V et 5V. Le microcontrôleur convertit cette tension en une valeur numérique entière comprise entre `0` (pour 0V) et `1023` (pour 5V) sur un convertisseur 10 bits. Indispensable pour quantifier des grandeurs physiques fluctuantes (température, lumière, pression).

---

### 6. À quoi servent les fonctions setup() et loop() dans Arduino ?
Ces deux fonctions forment la structure obligatoire de tout programme Arduino ("sketch") :
* **`setup()`** : S'exécute **une seule fois** à la mise sous tension de la carte ou lors d'un appui sur le bouton Reset. On y configure les modes des broches (`pinMode`), on initialise la vitesse de transmission série (`Serial.begin()`), ou on démarre des capteurs spécifiques (ex: `dht.begin()`).
* **`loop()`** : S'exécute **en boucle infinie** immédiatement après la fin de la fonction `setup()`. Elle contient les instructions répétitives de lecture des capteurs, de traitement de données logiques et de contrôle des sorties.

---

### 7. Comment un Arduino communique-t-il avec un ordinateur ?
L'Arduino communique via une liaison série émulée sur un câble USB. La carte embarque une puce d'interface USB-Série (par exemple, le circuit *ATmega16U2* sur l'Uno officiel ou le *CH340* sur les clones). Cette puce convertit les signaux USB reçus en protocole de communication asynchrone UART dirigé vers les broches de transmission TX (1) et réception RX (0) du microcontrôleur principal.

---

### 8. Qu’est-ce que le moniteur série ?
Le moniteur série est un outil interactif (console textuelle) intégré à l'IDE Arduino. Il permet d'afficher en temps réel sur l'écran d'ordinateur les données envoyées par l'Arduino via des commandes comme `Serial.print()` ou `Serial.println()`. Il permet également d'envoyer des chaînes de caractères ou des commandes tapées au clavier depuis l'ordinateur vers la carte Arduino en écoute.

---

### 9. Quel est le rôle d’un module Wi-Fi ESP8266 ?
L'**ESP8266** (comme le module ESP-01) sert de **passerelle réseau sans fil** pour un microcontrôleur hôte. Connecté à un Arduino par liaison série (commandes AT), il lui donne accès à une connexion Wi-Fi pour envoyer ou recevoir des données sur Internet. Dans sa forme évoluée (ex: NodeMCU), l'ESP8266 peut fonctionner de manière totalement autonome en tant que microcontrôleur connecté principal.

---

### 10. Comment connecter un capteur à une carte Arduino ?
La connexion d'un capteur suit un schéma standard en 3 étapes :
1. **Alimentation** : Brancher la broche positive du capteur (marquée *VCC*, *5V*, *3.3V* ou `+`) à la sortie d'alimentation correspondante de l'Arduino.
2. **Masse** : Brancher la broche de masse du capteur (marquée *GND* ou `-`) à l'une des broches GND de l'Arduino pour égaliser les potentiels de référence.
3. **Signal (Données)** : Relier la broche de données (*OUT*, *SIG*, *S* ou *A0/D0*) :
   * À une entrée analogique (A0-A5) si le capteur délivre une tension continue.
   * À une broche numérique (0-13) si le capteur transmet un signal binaire ou un protocole numérique spécifique (ex. bus OneWire ou I2C).

---

### 11. Comment commander un actionneur avec Arduino ?
Un actionneur (ex. moteur, buzzer, relais) est commandé via une broche configurée en sortie numérique ou PWM :
* **Faible puissance (ex. LED, petit buzzer)** : Peut être connecté directement à une broche de l'Arduino avec une résistance en série pour limiter le courant (la limite par broche est d'environ 20 mA à 40 mA maximum).
* **Forte puissance (ex. moteur, pompe, électrovanne)** : L'actionneur consomme trop de courant pour la carte. Il faut utiliser une alimentation externe et une interface de commutation intermédiaire (un transistor MOSFET, un relais optocouplé ou un pont en H type L298N) commandé par le signal logique de l'Arduino.

---

### 12. Qu’est-ce qu’une bibliothèque Arduino ?
Une bibliothèque (*library*) est une collection de codes réutilisables écrite en C++ (fichiers `.h` et `.cpp`) qui encapsule des fonctionnalités complexes. Elle évite au développeur d'avoir à réécrire la logique bas niveau de gestion des capteurs. Par exemple, l'importation de `#include <LiquidCrystal_I2C.h>` permet de contrôler un écran LCD en appelant simplement une méthode lisible comme `lcd.print("Hello")` au lieu d'envoyer manuellement des séquences d'octets sur le bus I2C.

---

### 13. Quel est le rôle des broches VCC, GND, SIG, AO et DO sur un module électronique ?
* **VCC** : Point d'alimentation positive du module (ex: +5V ou +3.3V).
* **GND** : Masse électrique de référence (0V).
* **SIG** : Signal général du capteur (ou commande d'entrée).
* **AO (Analog Output)** : Sortie analogique fournissant une tension continue fluctuant proportionnellement à la grandeur physique mesurée.
* **DO (Digital Output)** : Sortie numérique (binaire) commutant à l'état HAUT (5V) ou BAS (0V) lorsqu'un seuil réglable (souvent via un petit potentiomètre sur le circuit imprimé) est dépassé.

---

### 14. Comment identifier les broches d’un capteur lorsque la documentation n’est pas disponible ?
1. **Sérigraphie (PCB)** : Inspecter visuellement la carte sous toutes ses faces à la recherche d'étiquettes de broches (`VCC`, `GND`, `S`, `+`, `-`, `A`, `D`).
2. **Recherche de puce** : Identifier la référence du circuit intégré principal soudé sur le module (ex: comparateur *LM393*) et analyser sa datasheet pour deviner le schéma électrique.
3. **Multimètre** : Tester la continuité électrique hors tension. Le GND est souvent relié au plan de masse de la carte (grandes surfaces de cuivre). Les broches VCC passent généralement par des condensateurs de découplage ou le pôle positif d'une LED témoin.
4. **Vérification logique** : Si l'un des pins est connecté à une résistance ajustable (potentiomètre), cela indique généralement un module doté d'une sortie numérique (DO) de seuil.

---

### 15. Quelles sont les limites d’une carte Arduino pour une application complexe ?
* **Mémoire extrêmement restreinte** : 2 Ko de RAM limitent drastiquement la manipulation de chaînes de caractères complexes, d'images ou de bases de données locales.
* **Manque de multitâche natif** : Le processeur monocœur exécute les instructions de manière séquentielle. L'utilisation de fonctions de pause bloquantes comme `delay()` gèle complètement l'exécution du code.
* **Absence de sécurité matérielle** : Aucun moteur de chiffrement intégré pour sécuriser des connexions HTTPS ou des mots de passe.
* **Vitesse limitée** : Ses 16 MHz limitent le traitement du signal en temps réel (audio, vidéo).

---

### 16. Dans quels cas faut-il préférer ESP32 à Arduino Uno ?
Il faut privilégier l'ESP32 lorsque le projet exige :
* Une liaison réseau sans fil (Wi-Fi/Bluetooth) pour remonter des données vers un serveur (Cloud, MQTT, HTTP).
* Des calculs mathématiques intensifs ou des traitements de signaux complexes.
* L'exécution simultanée de tâches distribuées grâce à un OS temps réel (FreeRTOS) gérant les deux cœurs physiques.
* Un encombrement minimal combiné à un fonctionnement autonome sur batterie.

---

### 17. Comment choisir le bon port série dans Arduino IDE ?
1. Allez dans le menu **Outils > Port** (Tools > Port).
2. Si vous hésitez, débranchez votre carte Arduino et observez la liste des ports disponibles.
3. Rebranchez la carte : le nouveau port qui apparaît correspond à votre carte.
   * *Sous Windows* : Ce sera un port nommé `COM` suivi d'un numéro (ex: `COM3`).
   * *Sous Linux* : Ce sera généralement de la forme `/dev/ttyACM0` ou `/dev/ttyUSB0`.

---

### 18. Comment choisir le bon modèle de carte dans Arduino IDE ?
1. Allez dans le menu **Outils > Type de carte** (Tools > Board).
2. Sélectionnez la gamme correspondante (ex: **Arduino AVR Boards**).
3. Cliquez sur le modèle exact que vous possédez (ex: **Arduino Uno**).
4. *Note : Pour les cartes tierces comme l'ESP32, il faut préalablement ajouter l'URL de définition de la carte dans les Préférences de l'IDE, puis l'installer via le Gestionnaire de cartes.*

---

### 19. Quelle est la différence entre compiler et téléverser un programme ?
* **Compiler (Vérifier)** : C'est la traduction par l'ordinateur de votre code source écrit en C++ vers du code machine (binaire `.hex` ou `.bin`) compréhensible par le microcontrôleur. Cette étape valide la syntaxe et la cohérence logique du code sans interagir avec la carte physique.
* **Téléverser (Upload)** : Cette étape compile d'abord le programme, puis transfère le binaire généré de l'ordinateur vers la mémoire flash du microcontrôleur à travers le câble USB grâce à un petit programme pré-installé sur l'Arduino appelé le *bootloader*.

---

### 20. Que signifie le terme « baud rate » dans une communication série ?
Le **baud rate** représente la vitesse de transmission d'informations sur un canal série, mesurée en impulsions ou symboles par seconde. Dans la configuration courante de l'UART, 1 symbole équivaut à 1 bit. Ainsi, une vitesse de 9600 bauds signifie qu'environ 9600 bits de données sont transmis chaque seconde, incluant les bits de données, les bits de start/stop et de parité.

---

### 21. Pourquoi la valeur configurée dans Serial.begin() doit-elle correspondre à celle du moniteur série ?
La liaison série asynchrone ne possède pas de fil d'horloge partagé pour rythmer la lecture des données. L'émetteur et le récepteur doivent donc obligatoirement être configurés sur la même vitesse (fréquence de lecture) pour échantillonner les signaux électriques aux bons moments. Si l'Arduino émet à 9600 bauds alors que le moniteur série de l'ordinateur écoute à 115200 bauds, l'ordinateur lira les bits de manière désynchronisée, affichant des caractères corrompus (symboles incohérents).

---

### 22. Comment tester un capteur avant de l’intégrer dans un projet complet ?
La méthode la plus rigoureuse est d'écrire un **sketch de test unitaire** :
1. Connecter le capteur seul à la carte Arduino sur une breadboard.
2. Écrire un code minimaliste lisant la broche du capteur et envoyant immédiatement la valeur brute sur le moniteur série avec `Serial.println(analogRead(pin))`.
3. Soumettre le capteur à des variations réelles de sa grandeur physique (approcher une source chaude, masquer la lumière) pour valider sa réponse dynamique.
4. Cette isolation évite d'avoir à déboguer des conflits logiques ou matériels liés à d'autres composants du projet.

---

### 23. Comment savoir si une erreur vient du code, du câblage ou du capteur ?
* **Erreur de code** : Si l'IDE refuse de compiler le code (erreur de syntaxe) ou si le comportement logique est défectueux alors que les mesures brutes s'affichent correctement (ex. le seuil de déclenchement n'est pas bon dans les structures `if`).
* **Erreur de câblage** : Si le capteur renvoie des valeurs erratiques et instables ("broche flottante" non reliée), reste bloqué à `0` ou `1023` (court-circuit VCC/GND), ou si un composant chauffe anormalement. Une vérification avec les continuités d'un multimètre s'impose.
* **Erreur du capteur** : Si le code est un exemple certifié de bibliothèque officielle et que le câblage a été minutieusement vérifié, mais que le composant renvoie une valeur impossible (par exemple `-127°C` sur un capteur Dallas DS18B20 ou `0` permanent sur un télémètre ultrason).

---

### 24. Quels composants du kit peuvent être utilisés pour réaliser une station intelligente de surveillance d’une salle ?
Pour concevoir une station de surveillance d'une salle, on peut combiner :
* **Unité centrale** : Carte Arduino Uno ou ESP32.
* **Capteurs environnementaux** : Un capteur de température et d'humidité (DHT11/DHT22) pour le confort thermique, et une photorésistance (LDR) pour surveiller l'éclairage de la salle.
* **Capteur de sécurité** : Un détecteur de présence infrarouge (PIR) pour détecter les intrusions.
* **Interfaces utilisateur** : Un écran LCD 1602 I2C pour afficher les métriques locales en direct, et une LED RVB (ou plusieurs LEDs) pour afficher un statut visuel (Vert = OK, Rouge = Alerte).
* **Avertisseur sonore** : Un buzzer piézoélectrique pour émettre une alarme en cas de détection d'intrusion ou de dépassement critique de température.

---

## 2. Guide d'identification et de classification des composants du Kit

Le tableau ci-dessous classe les composants d'un kit de démarrage standard selon leur fonction et explique leur rôle :

| Composant | Catégorie | Rôle et Utilité | Exemple d'utilisation |
| :--- | :--- | :--- | :--- |
| **Arduino Uno R3** | Contrôle / Cerveau | Exécute le code utilisateur, traite les signaux et orchestre l'alimentation. | Traitement logique central. |
| **Breadboard** | Outil de prototypage| Permet de réaliser des connexions électriques sans soudure. | Montage rapide de circuits de test. |
| **Fils de câblage (Jumper)** | Connectique | Relient les broches de l'Arduino aux composants de la breadboard. | Raccordement électrique des signaux. |
| **Capteur DHT11/DHT22** | Capteur numérique | Mesure la température ambiante et le taux d'humidité relative de l'air. | Régulation thermique d'une pièce. |
| **Photorésistance (LDR)** | Capteur analogique | Résistance dont la valeur dépend de l'intensité de la lumière reçue. | Détection jour/nuit automatique. |
| **Capteur Ultrason HC-SR04**| Capteur de distance | Émet des ondes ultrasons pour mesurer la distance d'un obstacle. | Radar de recul, évitement d'obstacles. |
| **Détecteur PIR** | Capteur de mouvement | Capteur infrarouge passif détectant le rayonnement thermique humain. | Système d'alarme de sécurité. |
| **Potentiomètre** | Résistance variable | Permet de faire varier manuellement une tension d'entrée. | Réglage du contraste LCD ou d'un volume. |
| **LED (Standard / RVB)** | Actionneur visuel | Convertit l'énergie électrique en lumière pour indiquer un état. | Témoin d'alerte ou de fonctionnement. |
| **Buzzer Piézoélectrique** | Actionneur sonore | Émet un bip sonore à des fréquences variables via des signaux de tension. | Signalisation d'alarme. |
| **Écran LCD 1602 (avec I2C)**| Afficheur | Affiche du texte sur 2 lignes de 16 caractères pour communiquer avec l'usager. | Affichage en direct de valeurs physiques. |
| **Servomoteur (SG90)** | Actionneur mécanique | Moteur rotatif commandé angulairement avec précision (0° à 180°). | Contrôle d'une barrière d'accès. |
| **Relais 5V** | Commutation | Interrupteur électromécanique isolant la haute puissance de la logique 5V. | Allumage d'une ampoule de secteur 230V. |
| **Résistances** | Composant passif | Limitent le passage du courant électrique pour protéger les composants sensibles. | Protection des LEDs en série. |
| **Bouton poussoir** | Interface d'entrée | Ferme ou ouvre temporairement un circuit électrique par pression mécanique. | Déclenchement manuel d'une action. |

---

## 3. Conception d'une Station de Surveillance Intelligente (TP Pratique)

Voici l'architecture détaillée d'une station de surveillance intelligente autonome pour surveiller la température, l'éclairage et la sécurité d'une salle.

### Schéma logique de raccordement des broches

Pour réaliser cette démonstration pratique, connectez les composants de la manière suivante sur l'Arduino Uno :

* **Capteur DHT11 (Température & Humidité)** :
  * VCC $\rightarrow$ 5V
  * GND $\rightarrow$ GND
  * DATA $\rightarrow$ Broche Numérique **2**
* **Capteur LDR (Lumière - pont diviseur avec résistance 10kΩ)** :
  * Côté 1 LDR $\rightarrow$ 5V
  * Côté 2 LDR $\rightarrow$ Broche Analogique **A0** (et connecté à la masse via la résistance de 10kΩ)
* **Capteur PIR (Détecteur de mouvement)** :
  * VCC $\rightarrow$ 5V
  * GND $\rightarrow$ GND
  * OUT $\rightarrow$ Broche Numérique **3**
* **Buzzer Actif (Alarme)** :
  * Borne $+$ $\rightarrow$ Broche Numérique **8**
  * Borne $-$ $\rightarrow$ GND
* **LED RVB (Indication d'état)** :
  * Broche Rouge $\rightarrow$ Broche Numérique **9** (avec résistance 220Ω)
  * Broche Verte $\rightarrow$ Broche Numérique **10** (avec résistance 220Ω)
  * Broche Bleue $\rightarrow$ Broche Numérique **11** (avec résistance 220Ω)
  * Broche Cathode commune $\rightarrow$ GND

---

### Code source complet d'implémentation (C++)

Voici le code à téléverser dans l'Arduino pour faire fonctionner la station de surveillance. Il inclut les bibliothèques standards pour lire les capteurs et envoyer les états en temps réel sur le moniteur série.

```cpp
#include <DHT.h>

// Définition des broches des capteurs
#define DHTPIN 2
#define DHTTYPE DHT11
#define PIRPIN 3
#define LDRPIN A0

// Définition des broches des actionneurs
#define BUZZER_PIN 8
#define LED_RED 9
#define LED_GREEN 10
#define LED_BLUE 11

// Seuils configurés
const int SEUIL_LUM_OBSCURITE = 300; // Seuil de luminosité basse
const float SEUIL_TEMP_ALERTE = 28.0; // Seuil d'alerte température en °C

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // Initialisation de la communication série
  Serial.begin(9600);
  Serial.println("--- Démarrage de la Station de Surveillance ---");

  // Initialisation du capteur DHT
  dht.begin();

  // Configuration des modes des broches
  pinMode(PIRPIN, INPUT);
  pinMode(LDRPIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  // Auto-test des LEDs au démarrage
  allumerRGB(255, 0, 0); delay(300); // Rouge
  allumerRGB(0, 255, 0); delay(300); // Vert
  allumerRGB(0, 0, 255); delay(300); // Bleu
  allumerRGB(0, 0, 0); // Éteint
}

void loop() {
  // 1. Lecture des capteurs
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int lux = analogRead(LDRPIN);
  int mouvement = digitalRead(PIRPIN);

  // Vérification de la validité de la lecture DHT
  if (isnan(temp) || isnan(hum)) {
    Serial.println("Erreur: Impossible de lire le capteur DHT11 !");
    allumerRGB(255, 0, 0); // Rouge fixe pour signaler une erreur matérielle
    delay(2000);
    return;
  }

  // 2. Affichage des mesures brutes sur le moniteur série
  Serial.print("Temp: "); Serial.print(temp); Serial.print(" °C | ");
  Serial.print("Hum: "); Serial.print(hum); Serial.print(" % | ");
  Serial.print("Lumière: "); Serial.print(lux); Serial.print(" | ");
  Serial.print("Intrusion: "); Serial.println(mouvement == HIGH ? "OUI" : "NON");

  // 3. Logique de décision et gestion des alertes
  bool alerteSecurite = (mouvement == HIGH);
  bool alerteThermique = (temp >= SEUIL_TEMP_ALERTE);

  if (alerteSecurite) {
    // Intrusion détectée : Flash rouge et avertisseur sonore strident
    Serial.println("[ALERTE] Intrusion détectée dans la salle !");
    allumerRGB(255, 0, 0);
    tone(BUZZER_PIN, 1000); // Émettre un son à 1 kHz
    delay(500);
    noTone(BUZZER_PIN);
    delay(500);
  } 
  else if (alerteThermique) {
    // Surchauffe : Jaune clignotant et bip d'avertissement modéré
    Serial.println("[ALERTE] Température excessive détectée !");
    allumerRGB(255, 128, 0); // Orange / Jaune
    tone(BUZZER_PIN, 500, 200); // Petit bip
    delay(1000);
  } 
  else {
    // Tout est normal : Vert continu, pas de son
    noTone(BUZZER_PIN);
    if (lux < SEUIL_LUM_OBSCURITE) {
      // S'il fait sombre, allumer la LED en bleu pour un éclairage d'ambiance
      allumerRGB(0, 0, 150); 
    } else {
      allumerRGB(0, 150, 0); // Vert
    }
    delay(1000); // Pause d'une seconde avant la prochaine mesure
  }
}

// Fonction utilitaire pour piloter la LED RVB
void allumerRGB(int r, int g, int b) {
  // Pour une LED à cathode commune, on applique directement la valeur PWM
  analogWrite(LED_RED, r);
  analogWrite(LED_GREEN, g);
  analogWrite(LED_BLUE, b);
}
```

---

### Guide méthodologique de test pratique lors de la présentation
1. **Étape d'initialisation** : Mettez la carte sous tension. La LED RVB doit clignoter séquentiellement (Rouge, Vert, Bleu) indiquant que la carte exécute le programme et que les actionneurs sont fonctionnels.
2. **Test du capteur LDR** : Ouvrez le moniteur série à 9600 bauds. Masquez la LDR avec votre main : le voyant RVB doit passer au bleu (mode nuit). Éclairez-la : le voyant doit repasser au vert.
3. **Test du capteur PIR** : Évitez de bouger pendant 5 secondes pour laisser le capteur se calibrer. Passez ensuite votre main devant : la LED doit clignoter en rouge et le buzzer doit s'activer de manière saccadée.
4. **Test du DHT11** : Soufflez de l'air chaud et humide à proximité du capteur : vous devez observer la température et l'humidité grimper sur le moniteur série. Si la température franchit $28^\circ\text{C}$, l'alerte thermique doit se déclencher.
