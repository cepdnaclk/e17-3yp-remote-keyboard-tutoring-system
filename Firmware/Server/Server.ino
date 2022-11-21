/*
  Sender
*/

#include <esp_now.h>
#include <WiFi.h>


// These bytes may never occur in a packet, so they are used to indicate the start and end of a packet.
uint8_t START_BYTE =  0x7E;
uint8_t END_BYTE =  0x7F;

// REPLACE WITH YOUR RECEIVER MAC Address
// 08:3A:F2:50:BF:FC esp 32 3.3 board MAC
uint8_t broadcastAddress[] = {0x08, 0x3A, 0xF2, 0x50, 0xBF, 0xFC};

uint32_t data1 = 0xABCDE091;



esp_now_peer_info_t peerInfo;

// callback when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}
 
void setup() {
  // Init Serial Monitor
  Serial.begin(115200);

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);

  Serial.print("Task1 running on core ");
  Serial.println(xPortGetCoreID());

  
  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Once ESPNow is successfully Init, we will register for Send CB to
  // get the status of Trasnmitted packet
  esp_now_register_send_cb(OnDataSent);
  
  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;  
  peerInfo.encrypt = false;
  
  // Add peer        
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Failed to add peer");
    return;
  }

}


 
void loop() {
  
    esp_err_t result = esp_now_send(broadcastAddress, &START_BYTE, sizeof(START_BYTE));
    uint8_t temp = data1 >> 24;
    result = esp_now_send(broadcastAddress, (const uint8_t*)(&temp), sizeof(uint8_t));
    temp = data1 >> 16;
    result = esp_now_send(broadcastAddress, (const uint8_t*)(&temp), sizeof(uint8_t));
    temp = data1 >> 8;
    result = esp_now_send(broadcastAddress, (const uint8_t*)(&temp), sizeof(uint8_t));
    temp = data1;
    result = esp_now_send(broadcastAddress, (const uint8_t*)(&temp), sizeof(uint8_t));
    result = esp_now_send(broadcastAddress, &END_BYTE, sizeof(END_BYTE));
        
    
     
    if (result == ESP_OK) {
      Serial.println("Sent with success");
    }
    else {
      Serial.println("Error sending the data");
    }
    delay(2000); 
  
}
