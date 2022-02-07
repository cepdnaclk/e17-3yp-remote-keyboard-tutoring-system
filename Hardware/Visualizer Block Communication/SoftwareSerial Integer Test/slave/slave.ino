#include <SoftwareSerial.h>

SoftwareSerial ArduinoMaster(2, 3);

byte id = -1;

void setup() {
  ArduinoMaster.begin(9600);
}

void loop() {
  if (id == -1 && ArduinoMaster.available()) id = ArduinoMaster.read();
  if (id == 0) {
    id++;
    ArduinoMaster.write(id);
  }
}
