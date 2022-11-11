#include <SoftwareSerial.h>

SoftwareSerial ArduinoSlave(10, 3);

char cmd = "";
char old_cmd;
char answer = "";
char old_answer;

void setup() {
  Serial.begin(9600);
  Serial.println("ENTER Commands:");
  ArduinoSlave.begin(9600);
}

void loop() {
  old_cmd = cmd;
  old_answer = answer;
  //Read command from monitor
  if (Serial.available()) {
    cmd = Serial.read();
  }
  //Read answer from slave
  if (ArduinoSlave.available()) {
    answer = ArduinoSlave.read();
  }
  //Send data to slave
  if (cmd != old_cmd) {
    Serial.print("Master sent : ");
    Serial.println(cmd);
    ArduinoSlave.write(cmd);
  }
  //Send answer to monitor
  if (answer != old_answer) {
    Serial.print("Slave received : ");
    Serial.println(answer);
  }
}
