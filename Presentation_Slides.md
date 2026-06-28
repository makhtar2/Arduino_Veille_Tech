---
marp: true
theme: default
paginate: true
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  section {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 20px;
    background: #f8faff;
    color: #1e293b;
    padding: 48px 64px;
    position: relative;
  }

  section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #6366f1, #06b6d4);
  }

  section::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #06b6d4, #6366f1);
    opacity: 0.3;
  }

  h1 {
    font-size: 34px;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  h2 {
    font-size: 26px;
    font-weight: 700;
    color: #6366f1;
    border-left: 5px solid #06b6d4;
    padding-left: 14px;
    margin-bottom: 20px;
    line-height: 1.3;
  }

  p {
    line-height: 1.7;
    color: #334155;
  }

  ul, ol {
    line-height: 1.9;
    color: #334155;
    padding-left: 20px;
  }

  li::marker {
    color: #6366f1;
    font-weight: 600;
  }

  strong {
    color: #4f46e5;
    font-weight: 600;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 17px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(99,102,241,0.08);
    margin-top: 10px;
  }

  th {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: #ffffff;
    font-weight: 600;
    padding: 11px 14px;
    text-align: left;
    letter-spacing: 0.02em;
  }

  td {
    padding: 9px 14px;
    border-bottom: 1px solid #e2e8f0;
    color: #374151;
  }

  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) td { background-color: #eef2ff; }
  tr:hover td { background-color: #e0e7ff; transition: background 0.2s; }

  code {
    background: #eef2ff;
    color: #4f46e5;
    padding: 2px 8px;
    border-radius: 5px;
    font-size: 15px;
    font-family: 'Courier New', monospace;
    border: 1px solid #c7d2fe;
  }

  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 16px 20px;
    border-radius: 10px;
    font-size: 15px;
    border-left: 4px solid #06b6d4;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }

  pre code {
    background: transparent;
    color: #e2e8f0;
    border: none;
    padding: 0;
  }

  blockquote {
    background: #eef2ff;
    border-left: 5px solid #6366f1;
    border-radius: 0 8px 8px 0;
    padding: 12px 18px;
    margin: 14px 0;
    color: #4338ca;
    font-style: normal;
    font-weight: 500;
  }

  section.cover {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  footer, section > p:last-child[style] {
    font-size: 13px;
    color: #94a3b8;
  }

  /* Pagination styling */
  section::after[class="marp-paginator"] {
    color: #94a3b8;
  }
---

<!-- _class: cover -->

# Veille Technologique
## Microcontrôleurs & Arduino

**Groupe TP — Juin 2026**

---

## Slide 1 — Rôle d'une carte Arduino

![bg right:40% 90%](images/arduino_uno.png)

Une carte Arduino est une **plateforme de prototypage électronique** qui fait le lien entre le monde réel et le code informatique. Elle permet de :

- **Lire** des informations depuis l'environnement (capteurs de température, lumière, distance...)
- **Traiter** ces données via un programme chargé dans sa mémoire
- **Agir** sur l'environnement en contrôlant des actionneurs (moteurs, LEDs, écrans...)

C'est l'outil de référence pour apprendre l'électronique embarquée et réaliser des prototypes rapidement.

---

## Slide 1b — Arduino Uno : schéma complet des broches et composants

![bg 86%](images/arduino_uno_pinout.png)

---

## Slide 2 — Comparaison : Arduino Uno vs Mega vs Nano

![bg 82%](images/arduino_comparison.png)

---

## Slide 2b — Analyse comparative : quelle carte choisir ?

![bg right:42% 95%](images/arduino_mega.png)

**Arduino Uno** — La carte idéale pour débuter. Simple, bien documentée, parfaite pour la majorité des projets d'apprentissage et de prototypage.

**Arduino Mega** — Conçue pour les projets complexes nécessitant de nombreuses entrées/sorties : 54 broches numériques, 16 entrées analogiques, 4 ports série matériels.

**Arduino Nano** — Même puissance que l'Uno dans un format 3x plus petit. Idéale pour les projets compacts ou portables.

---

## Slide 2c — Arduino Nano : la carte miniature

![bg right:45% 90%](images/arduino_nano.png)

La Nano embarque le même ATmega328P que l'Uno mais dans un format ultra-compact qui s'enfiche directement sur une breadboard.

**Points forts :**
- 8 entrées analogiques (vs 6 sur l'Uno)
- Pas besoin de shield pour prototypage
- Compatible avec les mêmes bibliothèques que l'Uno

**Contraintes :**
- Pas de connecteur jack d'alimentation
- Port Mini-USB ou Micro-USB selon la version
- Courant de sortie par broche identique (40 mA max)

---

## Slide 3 — Pourquoi l'ESP32 est-il populaire pour l'IoT ?

![bg right:38% 85%](images/esp32.png)

L'ESP32 est devenu un standard dans l'Internet des Objets car il intègre nativement ce qu'il faut acheter en plus pour un Arduino Uno classique :

- **Wi-Fi et Bluetooth inclus** directement sur la puce, sans module externe.
- **Processeur double-cœur à 240 MHz** contre 16 MHz monocœur pour l'Uno, soit une puissance bien supérieure.
- **Mémoire généreuse** (520 Ko de RAM) permettant de faire tourner des protocoles réseau comme HTTPS ou MQTT.
- **Modes de veille profonde** pour économiser la batterie dans les objets autonomes.
- Prix comparable à un Arduino Uno, ce qui en fait un choix rationnel pour tout projet connecté.

---

## Slide 4 — Les entrées et sorties d'une carte Arduino

Une carte Arduino expose plusieurs types de connexions physiques :

| Type | Broches | Utilité concrète |
|------|---------|-----------------|
| Numériques | D0 à D13 | Lire un bouton, allumer une LED |
| PWM (numérique) | D3, 5, 6, 9, 10, 11 | Varier la vitesse d'un moteur ou l'intensité d'une LED |
| Analogiques | A0 à A5 | Lire un potentiomètre, une LDR, un capteur de gaz |
| Alimentation | 5V, 3.3V, GND | Alimenter les capteurs et modules |
| Communication | TX/RX, SDA/SCL | Liaisons série, I2C, SPI |

---

## Slide 5 — Entrée analogique vs entrée numérique

La différence fondamentale est la nature du signal reçu :

**Entrée numérique** : ne reconnaît que deux états — HAUT (5V) ou BAS (0V). Utilisée pour des interrupteurs ou des capteurs tout-ou-rien. Fonction Arduino : `digitalRead()`.

**Entrée analogique** : mesure une tension qui varie en continu entre 0V et 5V. Le convertisseur intégré la traduit en une valeur entre **0 et 1023** (résolution 10 bits). Utilisée pour quantifier des grandeurs physiques continues. Fonction Arduino : `analogRead()`.

> Exemple concret : un bouton utilise une entrée numérique, un capteur de luminosité (LDR) utilise une entrée analogique.

---

## Slide 6 — Les fonctions setup() et loop()

Tout programme Arduino repose sur deux fonctions obligatoires :

**`setup()`** — exécutée **une seule fois** au démarrage ou après un reset. On y initialise le programme : configuration des broches, démarrage de la communication série, initialisation des capteurs.

**`loop()`** — exécutée **en boucle infinie** juste après. C'est le coeur du programme : lecture des capteurs, prise de décision, contrôle des sorties. Elle tourne sans jamais s'arrêter tant que la carte est alimentée.

```
Démarrage → setup() → loop() → loop() → loop() → ...
```

---

## Slide 7 — Communication entre Arduino et ordinateur

L'Arduino communique avec l'ordinateur via le câble USB, mais ce n'est pas du USB natif du côté du microcontrôleur. Une puce dédiée (ATmega16U2 sur les cartes officielles, CH340 sur les clones) **convertit le signal USB en protocole UART**, compris par le microcontrôleur.

Côté code, on envoie des données avec :
```cpp
Serial.begin(9600);       // initialiser la liaison à 9600 bauds
Serial.println(valeur);   // envoyer une valeur vers l'ordinateur
```

---

## Slide 8 — Le Moniteur Série

Le moniteur série est un **outil de débogage et de communication** intégré à l'IDE Arduino. Il affiche en temps réel les données que l'Arduino envoie via `Serial.println()`.

Il est indispensable pour :
- Vérifier les valeurs lues par les capteurs
- Suivre l'exécution d'un programme étape par étape
- Envoyer des commandes textuelles depuis l'ordinateur vers la carte

**Accès** : Outils > Moniteur Série (ou Ctrl+Shift+M). La vitesse sélectionnée doit correspondre à celle déclarée dans `Serial.begin()`.

---

## Slide 9 — Rôle du module Wi-Fi ESP8266

L'ESP8266 est un module Wi-Fi qui ajoute la connectivité réseau à un microcontrôleur qui n'en possède pas nativement (comme l'Arduino Uno).

- Il communique avec l'Arduino via une liaison série en utilisant des **commandes AT** (ex: `AT+CWJAP` pour se connecter à un réseau Wi-Fi).
- En version autonome (NodeMCU), il peut fonctionner **sans Arduino** : il intègre lui-même un microcontrôleur programmable.
- Il est utilisé pour envoyer des données vers un serveur, appeler une API web ou piloter un objet à distance.

---

## Slide 10 — Connecter un capteur à un Arduino

La connexion d'un capteur suit toujours le même schéma à trois fils :

| Broche du capteur | Connectée à | Raison |
|-------------------|-------------|--------|
| VCC (ou +) | 5V ou 3.3V de l'Arduino | Alimenter le capteur |
| GND (ou -) | GND de l'Arduino | Référence commune de tension |
| SIG / OUT / DATA | Broche numérique ou analogique | Transmettre la mesure |

Si la sortie est une tension variable (ex: LDR) → broche **analogique (A0-A5)**.
Si la sortie est un signal binaire ou numérique (ex: DHT11) → broche **numérique (D2-D13)**.

---

## Slide 11 — Commander un actionneur

Un actionneur (moteur, buzzer, relais) est contrôlé depuis une broche de sortie. Deux cas de figure :

**Faible puissance (< 40 mA)** : connexion directe à une broche numérique avec une résistance de limitation de courant. Convient aux LEDs, buzzers passifs.

**Forte puissance** : l'Arduino ne peut pas fournir assez de courant. Il faut une interface intermédiaire :
- **Transistor MOSFET** pour les charges continues (moteur DC)
- **Relais** pour isoler et contrôler des circuits 220V (ampoules, pompes)
- **Pont en H (L298N)** pour contrôler le sens de rotation d'un moteur

L'Arduino commande l'interrupteur, une alimentation externe alimente l'actionneur.

---

## Slide 12 — Bibliothèque Arduino

Une bibliothèque est un ensemble de fonctions préconçues qui simplifient la communication avec des composants complexes. Au lieu de programmer la séquence d'octets nécessaire pour interroger un capteur, on appelle une fonction lisible.

**Sans bibliothèque** : 30 lignes de gestion de protocoles bas niveau.
**Avec bibliothèque** : `float t = dht.readTemperature();` — une seule ligne.

Les bibliothèques les plus courantes :
- **DHT.h** — capteur de température et humidité
- **Servo.h** — contrôle de servomoteurs
- **LiquidCrystal_I2C.h** — écran LCD sur bus I2C
- **Wire.h** — communication I2C générique

Installation : Croquis > Inclure une bibliothèque > Gérer les bibliothèques.

---

## Slide 13 — Broches VCC, GND, SIG, AO et DO

Ces étiquettes se retrouvent sur la quasi-totalité des modules du kit :

| Broche | Nom complet | Rôle |
|--------|-------------|------|
| VCC | Tension d'alimentation | Reçoit le +5V ou +3.3V |
| GND | Ground (masse) | Référence électrique commune (0V) |
| SIG | Signal | Entrée ou sortie de données |
| AO | Analog Output | Tension continue proportionnelle à la mesure |
| DO | Digital Output | Signal binaire selon un seuil réglable (via potentiomètre) |

Sur les modules à double sortie (ex: capteur de flamme), **AO** donne une valeur précise et **DO** déclenche au-delà d'un seuil ajustable.

---

## Slide 14 — Identifier les broches sans documentation

Lorsqu'aucune étiquette ni datasheet n'est disponible, plusieurs méthodes permettent d'identifier les broches :

1. **Sérigraphie** : examiner le circuit imprimé des deux côtés — les étiquettes VCC, GND, S, +, - sont souvent gravées sur le PCB.
2. **Référence du circuit intégré** : noter le nom de la puce principale et chercher sa datasheet sur Google (ex: "LM393 datasheet").
3. **Multimètre en continuité** : le GND est souvent relié aux grandes surfaces de cuivre (plan de masse). VCC passe généralement par des condensateurs ou une LED témoin.
4. **Potentiomètre visible** : sa présence indique généralement une sortie numérique DO dont le seuil est ajustable.

---

## Slide 15 — Limites d'une carte Arduino

L'Arduino Uno est excellent pour apprendre et prototyper, mais montre ses limites pour des applications exigeantes :

| Limite | Explication |
|--------|-------------|
| Mémoire réduite | 2 Ko de RAM — impossible de gérer des chaînes longues ou des tableaux importants |
| Mono-tâche | `delay()` bloque complètement le programme — aucun multitâche natif |
| Pas de réseau | Aucun Wi-Fi ni Bluetooth intégré |
| Vitesse limitée | 16 MHz ne permettent pas de traitement audio/vidéo ou calculs complexes |
| Pas de sécurité | Aucun moteur de chiffrement pour des communications sécurisées |

---

## Slide 16 — Quand choisir l'ESP32 plutôt que l'Arduino Uno ?

L'ESP32 s'impose lorsque le projet dépasse les capacités de l'Uno :

- Le projet doit envoyer ou recevoir des données via **Wi-Fi ou Bluetooth**.
- Le traitement de données est **intensif** (audio, cryptographie légère, protocoles réseau).
- On a besoin d'exécuter **plusieurs tâches simultanément** grâce à FreeRTOS sur les deux coeurs.
- L'objet doit fonctionner sur **batterie** avec une consommation minimale (mode deep sleep).

Pour un projet de démarrage sans réseau, l'Uno reste suffisant et plus simple à prendre en main.

---

## Slide 17 — Choisir le bon port série dans l'IDE

Lorsque plusieurs ports apparaissent dans la liste, il est facile de se tromper. La méthode fiable :

1. Ouvrir **Outils > Port** et noter les ports déjà présents.
2. **Débrancher** la carte Arduino.
3. **Rebrancher** : le nouveau port qui apparaît est celui de votre carte.

Noms typiques :
- Sous Windows : `COM3`, `COM7`...
- Sous Linux : `/dev/ttyACM0` ou `/dev/ttyUSB0`

Si aucun port n'apparaît, le pilote de la puce USB-Série n'est probablement pas installé (CH340 pour les cartes clones).

---

## Slide 18 — Choisir le bon modèle de carte dans l'IDE

Il est important de sélectionner le modèle exact car cela détermine la configuration de la compilation et du téléversement.

1. Aller dans **Outils > Type de carte > Arduino AVR Boards**.
2. Sélectionner le modèle exact : **Arduino Uno**, **Arduino Mega**, **Arduino Nano**...
3. Pour les cartes non officielles (ESP32, ESP8266), il faut d'abord ajouter une URL dans les Préférences de l'IDE, puis installer la définition via le Gestionnaire de cartes.

Un mauvais choix de carte peut provoquer des erreurs de téléversement ou un comportement imprévisible du programme.

---

## Slide 19 — Compiler vs Téléverser

Ces deux actions sont souvent confondues mais sont bien distinctes :

**Compiler (Vérifier)** : l'ordinateur traduit le code C++ écrit par le développeur en langage machine binaire (fichier `.hex`). Cette étape ne nécessite pas que la carte soit branchée. Elle détecte les erreurs de syntaxe et les problèmes de logique structurelle.

**Téléverser (Upload)** : compile d'abord le programme, puis transfère le binaire vers la mémoire flash du microcontrôleur via le câble USB. Un petit programme préinstallé sur l'Arduino, appelé **bootloader**, gère la réception et l'écriture de ce fichier.

---

## Slide 20 — Le Baud Rate (débit en bauds)

Le baud rate est la **vitesse de communication** d'une liaison série, exprimée en bits transmis par seconde.

- `9600` bauds signifie que 9 600 bits sont échangés chaque seconde.
- Valeurs courantes : `9600`, `19200`, `57600`, `115200`.

Cette valeur doit être **identique** des deux côtés de la communication. Si l'Arduino envoie à 9600 et que le Moniteur Série écoute à 115200, les bits sont lus au mauvais rythme et le texte affiché sera illisible (symboles aléatoires).

Déclaration dans le code : `Serial.begin(9600);`
Sélection dans le Moniteur Série : menu déroulant en bas à droite.

---

## Slide 21 — Tester un capteur avant de l'intégrer

Avant d'intégrer un capteur dans un projet complet, il est recommandé de le tester de manière isolée pour s'assurer qu'il fonctionne correctement :

1. Connecter uniquement le capteur à l'Arduino sur une breadboard.
2. Écrire un code minimal qui lit la valeur et l'affiche sur le Moniteur Série.
3. Provoquer des variations de la grandeur mesurée (approcher la main, couvrir la lumière...) et vérifier que les valeurs réagissent logiquement.
4. Si le capteur répond bien, l'intégrer ensuite dans le projet principal.

Cette isolation évite de passer des heures à chercher un bug dans un montage complexe.

---

## Slide 22 — Diagnostiquer la source d'une erreur

Face à un comportement anormal, il faut identifier si le problème vient du code, du câblage ou du composant lui-même :

| Hypothèse | Symptômes typiques | Vérification |
|------------|-------------------|--------------|
| **Code** | Valeurs brutes correctes, comportement logique faux | Relire les conditions `if`, les conversions, les seuils |
| **Câblage** | Valeur bloquée à 0 ou 1023, composant chaud | Multimètre, vérifier chaque connexion |
| **Capteur HS** | Exemple officiel + câblage vérifié → résultat impossible | Remplacer le composant |

La règle est de toujours tester avec un exemple de bibliothèque certifié avant de conclure à une panne matérielle.

---

## Slide 23 — Station de surveillance intelligente d'une salle

Objectif : concevoir un système autonome surveillant en temps réel la température, la luminosité et la sécurité d'une salle.

**Capteurs utilisés :**
- DHT11 → mesure la température et l'humidité
- LDR → détecte le niveau de luminosité
- PIR → détecte la présence humaine par infrarouge

**Actionneurs utilisés :**
- LED RVB → indique l'état général (vert = normal, rouge = alerte)
- Buzzer → émet une alarme sonore en cas d'intrusion ou de surchauffe
- Écran LCD I2C → affiche les valeurs en temps réel

**Logique du système :**
- Si mouvement détecté → alerte rouge + buzzer
- Si température dépasse 28°C → alerte orange + bip
- Si tout est normal → LED verte + lecture continue toutes les secondes

---

## Slide 24 — Classification des composants du kit

| Composant | Catégorie | Rôle principal |
|-----------|-----------|----------------|
| Arduino Uno | Contrôle | Exécute le programme, orchestre les composants |
| Breadboard + fils | Prototypage | Connexions sans soudure pour les tests |
| DHT11 | Capteur numérique | Température et humidité ambiante |
| LDR | Capteur analogique | Niveau de luminosité |
| HC-SR04 | Capteur | Distance par ultrasons |
| PIR | Capteur | Détection de mouvement humain |
| LED / LED RVB | Actionneur | Signalisation visuelle |
| Buzzer | Actionneur | Signalisation sonore |
| Écran LCD I2C | Afficheur | Affichage de données utilisateur |
| Relais 5V | Actionneur | Contrôle de circuits à forte puissance (220V) |
| Servomoteur SG90 | Actionneur | Mouvement angulaire précis (0° à 180°) |
| Résistances | Composant passif | Limitation de courant, protection des composants |
| Potentiomètre | Composant passif | Réglage manuel d'une valeur analogique |
| Bouton poussoir | Interface utilisateur | Déclenchement manuel d'une action |

---

## Conclusion — Points clés à retenir

- Arduino est la porte d'entrée de l'électronique embarquée : simple, documenté, communauté massive.
- ESP32 est l'évolution naturelle pour tout projet qui nécessite du réseau ou plus de puissance.
- Les fonctions `setup()` et `loop()` sont la colonne vertébrale de tout programme Arduino.
- Le baud rate doit être identique côté code et côté Moniteur Série pour une communication lisible.
- La méthode : tester chaque composant seul avant d'assembler un système complet.
- En cas d'erreur, éliminer méthodiquement les hypothèses — code, câblage, puis composant.

---
*Merci de votre attention — Place à la démonstration pratique.*
