#include <SoftwareSerial.h>

SoftwareSerial ArduinoSlave(10, 3);

char id = 0;

void setup() {
  Serial.begin(9600);
  ArduinoSlave.begin(9600);
}

void loop() {
  if (id != 1) ArduinoSlave.write(id);
  if (id == 0 && ArduinoSlave.available()) {
    id = ArduinoSlave.read();
    Serial.println("Slave sent: " + (int) id);
  }
}
