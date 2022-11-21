/*
 * Receiver
 */

#include <esp_now.h>
#include <WiFi.h>

#define ONBOARD_LED  2

#define MIDI_BAUD 31250
#define MAX_BAUD 115200

#define RCV_MSK 0xF
#define SEND_MSK 0xF0
#define SEND_OFFSET 4
#define ACTION_MSK 0x3
#define ACTION_OFFSET 8
#define ACTION_OFFSET2 2
#define CTRL_MSK 0xFC
#define CTRL_OFFSET 10
#define CTRL_OFFSET2 8

#define UNK_ID 0xF
#define HOST_ID 0
// These bytes may never occur in a packet, so they are used to indicate the start and end of a packet.
#define START_BYTE 0x7E
#define END_BYTE 0x7F

#define DEV_NOTIFY 0
#define DEV_DISCOVERY 1
#define HOST_NOTIFY 2
#define CONTROL 3

#define CONNECTED 1

uint32_t rcv_buff[4], wifi_rcv_buff[4];
bool incoming = false;
bool wifi_incoming = false;

uint32_t createPacket(uint32_t rec_id, uint32_t send_id, uint32_t action, uint32_t ctrl) {
  return rec_id | (send_id << SEND_OFFSET) | (action << ACTION_OFFSET) | (ctrl << CTRL_OFFSET);
}

uint32_t deviceDiscovery() {
  return createPacket(UNK_ID, HOST_ID, DEV_DISCOVERY, 0);
}

int j = 0;

// callback function that will be executed when data is received
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  uint8_t b = *incomingData;
  if (b == START_BYTE) {
        wifi_incoming = true;
        j = 0;
        return;
      }
      if (b == END_BYTE) {
        wifi_incoming = false;
        j = 0;
        return;
      }
      if (!wifi_incoming) return;
      wifi_rcv_buff[j++] = b;
      if (j == 4) {
        Serial.print(wifi_rcv_buff[3], HEX);
        Serial.print(" ");
        Serial.print(wifi_rcv_buff[2], HEX);
        Serial.print(" ");
        Serial.print(wifi_rcv_buff[1], HEX);
        Serial.print(" ");
        Serial.print(wifi_rcv_buff[0], HEX);
        Serial.println();
      }
}
 
void setup() {
  
  // Initialize Serial Monitor
//  Serial.begin(115200);
  Serial.begin(9600);
  Serial2.begin(MIDI_BAUD);
  
  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  
  // Once ESPNow is successfully Init, we will register for recv CB to
  // get recv packer info
  esp_now_register_recv_cb(OnDataRecv);
}

// i -> visualizer bar communication byte counter
// j -> wifi com byte counter
int i = 0;

bool alt = false;

void loop() {
  if (Serial2.available()) {
      char b = Serial2.read();
      // Serial.println(b, HEX);
      if (b == START_BYTE) {
        incoming = true;
        i = 0;
        return;
      }
      if (b == END_BYTE) {
        incoming = false;
        i = 0;
        return;
      }
      if (!incoming) return;
      rcv_buff[i++] = b;
      if (i == 4) {
        // Serial.println(packet, HEX);
        // **** TESTING THE PACKET ****
        // Serial.print(rcv_buff[3], HEX);
        // Serial.print(" ");
        // Serial.print(rcv_buff[2], HEX);
        // Serial.print(" ");
        // Serial.print(rcv_buff[1], HEX);
        // Serial.print(" ");
        // Serial.print(rcv_buff[0], HEX);
        // Serial.println();
        uint32_t rec_id = rcv_buff[3] & RCV_MSK;
        uint32_t send_id = (rcv_buff[3] & SEND_MSK) >> SEND_OFFSET;
        uint32_t action = rcv_buff[2] & ACTION_MSK;
        uint32_t ctrl = ((rcv_buff[2] & CTRL_MSK) >> ACTION_OFFSET2) | (rcv_buff[1] << CTRL_OFFSET2);
      if (action == DEV_NOTIFY && ctrl == CONNECTED) {
        Serial.println("Visualizer bar detected!");
        Serial.println("Sending device discovery packet...");
        uint32_t packet = deviceDiscovery();
        Serial2.write(START_BYTE);
        Serial2.write((uint8_t) (packet >> 24));
        Serial2.write((uint8_t) (packet >> 16));
        Serial2.write((uint8_t) (packet >> 8));
        Serial2.write((uint8_t) packet);
        Serial2.write(END_BYTE);
      }
      else if (action == HOST_NOTIFY && ctrl == CONNECTED) {
        Serial.println("Visualizer block-" + String(send_id) + " connected!");
      }
      }
    }
}
