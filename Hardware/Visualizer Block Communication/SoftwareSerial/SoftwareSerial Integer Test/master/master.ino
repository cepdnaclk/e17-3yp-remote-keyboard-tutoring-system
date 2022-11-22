// #include <NeoSWSerial.h>

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

uint32_t rcv_buff[4];
bool incoming = false;

uint32_t createPacket(uint32_t rec_id, uint32_t send_id, uint32_t action, uint32_t ctrl) {
	return rec_id | (send_id << SEND_OFFSET) | (action << ACTION_OFFSET) | (ctrl << CTRL_OFFSET);
}

uint32_t deviceDiscovery() {
	return createPacket(UNK_ID, HOST_ID, DEV_DISCOVERY, 0);
}

void IRAM_ATTR isr() {
	
}

void setup() {
	Serial.begin(9600);
	Serial2.begin(MIDI_BAUD);
	pinMode(23, INPUT_PULLUP);
	attachInterrupt(23, isr, FALLING);
}

int i = 0;

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
			Serial.print("rec_id: ");
			Serial.println(rec_id, HEX);
			Serial.print("send_id: ");
			Serial.println(send_id, HEX);
			Serial.print("action: ");
			Serial.println(action, HEX);
			Serial.print("ctrl: ");
			Serial.println(ctrl, HEX);
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
