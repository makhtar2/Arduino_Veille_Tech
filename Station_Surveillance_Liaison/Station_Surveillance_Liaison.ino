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
