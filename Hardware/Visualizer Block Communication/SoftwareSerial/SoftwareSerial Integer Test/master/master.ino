#include <NeoSWSerial.h>

#define MAX_BAUD 115200

#define RCV_MSK 0xF
#define SEND_MSK 0xF0
#define SEND_OFFSET 4
#define ACTION_MSK 0x300
#define ACTION_OFFSET 8
#define CTRL_MSK 0x3FFC00
#define CTRL_OFFSET 10

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

uint32_t rcv_buff[4];
bool incoming = false;

uint32_t createPacket(uint32_t rec_id, uint32_t send_id, uint32_t action, uint32_t ctrl) {
	return rec_id | (send_id << SEND_OFFSET) | (action << ACTION_OFFSET) | (ctrl << CTRL_OFFSET);
}

uint32_t deviceDiscovery() {
	return createPacket(UNK_ID, HOST_ID, DEV_DISCOVERY, 0);
}

void setup() {
	Serial.begin(9600);
	Serial1.begin(9600);
}

int i = 0;

void loop() {
	if (Serial1.available()) {
		char b = Serial1.read();
   Serial.println(b, HEX);
//		if (b == START_BYTE) {
//			incoming = true;
//			i = 0;
//			return;
//		}
//		if (b == END_BYTE) {
//			incoming = false;
//      i = 0;
//			return;
//		}
//		if (!incoming) return;
//		rcv_buff[i++] = b;
//		if (i == 4) {
//			uint32_t packet = (rcv_buff[0] << 24) | (rcv_buff[1] << 16) | (rcv_buff[2] << 8) | rcv_buff[3];
//			Serial.println(rcv_buff[0]);
//			Serial.println(rcv_buff[1]);
//			Serial.println(rcv_buff[2]);
//			Serial.println(rcv_buff[3]);
//			uint8_t rec_id = packet & RCV_MSK;
//			uint8_t send_id = (packet & SEND_MSK) >> SEND_OFFSET;
//			uint8_t action = (packet & ACTION_MSK) >> ACTION_OFFSET;
//			uint16_t ctrl = (packet & CTRL_MSK) >> CTRL_OFFSET;
//			if (action == DEV_NOTIFY && ctrl == CONNECTED) {
//				Serial.println("Visualizer bar detected!");
//				Serial.println("Sending device discovery packet...");
//				packet = deviceDiscovery();
//				Serial1.write((uint8_t)(packet >> 24));
//				Serial1.write((uint8_t)(packet >> 16));
//				Serial1.write((uint8_t)(packet >> 8));
//				Serial1.write((uint8_t)packet);
//			}
//			else if (action == HOST_NOTIFY && ctrl == CONNECTED) {
//				Serial.println("Visualizer block-" + String(send_id) + " connected!");
//			}
//		}
	}
}
