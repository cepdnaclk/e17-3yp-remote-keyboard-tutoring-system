#include <avr/io.h>
#include <NeoSWSerial.h>
#include <NeoHWSerial.h>

#define DEFAULT_BAUD 9600
#define MIN_BAUD 300
#define MIDI_BAUD 31250
#define MAX_BAUD 115200
// Calculate the prescaler value to be loaded into the UBRR (USART Baud Rate Register) for the given baud rate.
#define BAUD_PRESCALE(baudRate) (((F_CPU / (baudRate * 16UL))) - 1)

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


#define TEST_LED 9
#define TEST_LED2 8

// Each visualizer block is initially in the "Device Discovery" mode.
// If dev_discovery is set to false, then the block is successfully connected to the host.
volatile bool dev_discovery = true;
volatile bool dev_side_incoming = false, host_side_incoming = false;

volatile uint8_t dev_id = UNK_ID;
volatile int host_side_rcv = 0, device_side_rcv = 0;
volatile uint32_t host_side_rcv_buff[4], device_side_rcv_buff[4];

NeoSWSerial ss(10, 2);

uint32_t createPacket(uint32_t rec_id, uint32_t send_id, uint32_t action, uint32_t ctrl) {
	return rec_id | (send_id << SEND_OFFSET) | (action << ACTION_OFFSET) | (ctrl << CTRL_OFFSET);
}

uint32_t hostNotify(uint32_t notif_code) {
	return createPacket(HOST_ID, dev_id, HOST_NOTIFY, notif_code);
}

uint32_t deviceNotify(uint32_t notif_code) {
	return createPacket(UNK_ID, UNK_ID, DEV_NOTIFY, notif_code);
}

int alternate = 0;

void notifyHost() {
	while (dev_discovery) {
		digitalWrite(TEST_LED, alternate);
		alternate = !alternate;
		uint32_t packet = deviceNotify(CONNECTED);
		NeoSerial1.write(START_BYTE);
		NeoSerial1.write((uint8_t) (packet >> 24));
		NeoSerial1.write((uint8_t) (packet >> 16));
		NeoSerial1.write((uint8_t) (packet >> 8));
		NeoSerial1.write((uint8_t) packet);
		NeoSerial1.write(END_BYTE);
		delay(1000);
	}
	// Wait until the connection is acknowledged.
	while (dev_id == UNK_ID) {
		digitalWrite(TEST_LED, HIGH);
		delay(1000);
	}
}

// Handle device-side RX.
static void handleRxDevice(uint8_t c) {
	if (c == START_BYTE) {
		dev_side_incoming = true;
		device_side_rcv = 0;
		return;
	}
	if (!dev_side_incoming) return;
	if (c == END_BYTE && device_side_rcv == 4) {
		dev_side_incoming = false;
		device_side_rcv = 0;
		return;
	}
	if (device_side_rcv >= 4) {
		dev_side_incoming = false;
		device_side_rcv = 0;
		return;
	}
	device_side_rcv_buff[device_side_rcv++] = c;
	if (device_side_rcv == 4) {
		uint32_t rec_id = device_side_rcv_buff[3] & RCV_MSK;
		uint32_t send_id = (device_side_rcv_buff[3] & SEND_MSK) >> SEND_OFFSET;
		uint32_t action = device_side_rcv_buff[2] & ACTION_MSK;
		uint32_t ctrl = ((device_side_rcv_buff[2] & CTRL_MSK) >> ACTION_OFFSET2) | (device_side_rcv_buff[1] << CTRL_OFFSET2);
		uint32_t packet = createPacket(rec_id, send_id, action, ctrl);
		// If the device is already connected to the host,
		if (!dev_discovery) {
			// If the packet is a Device Notify: Connected packet, then respond with a Device Discovery packet.
			if (action == DEV_NOTIFY && ctrl == CONNECTED) {
				packet = createPacket(rec_id, dev_id, DEV_DISCOVERY, 0);
				// Send the start byte.
				ss.write(START_BYTE);
				ss.write((uint8_t) (packet >> 24));
				ss.write((uint8_t) (packet >> 16));
				ss.write((uint8_t) (packet >> 8));
				ss.write((uint8_t) packet);
				// Send the end byte.
				ss.write(END_BYTE);
			}
			// If the packet is a Host Notify: Connected packet, then forward the packet to the host.
			else if (action == HOST_NOTIFY && ctrl == CONNECTED) {
				// Send the start byte.
				NeoSerial1.write(START_BYTE);
				NeoSerial1.write((uint8_t) (packet >> 24));
				NeoSerial1.write((uint8_t) (packet >> 16));
				NeoSerial1.write((uint8_t) (packet >> 8));
				NeoSerial1.write((uint8_t) packet);
				// Send the end byte.
				NeoSerial1.write(END_BYTE);
			}
			// ...
		}
	}
}

// Handle host-side RX using interrupts.
static void handleRxHost(uint8_t c) {
	// uint8_t c = UDR1;
	if (c == START_BYTE) {
		host_side_incoming = true;
		host_side_rcv = 0;
		return;
	}
	if (!host_side_incoming) return;
	if (c == END_BYTE && host_side_rcv == 4) {
		host_side_incoming = false;
		host_side_rcv = 0;
		return;
	}
	if (host_side_rcv >= 4) {
		host_side_incoming = false;
		host_side_rcv = 0;
		return;
	}
	host_side_rcv_buff[host_side_rcv++] = c;
	if (host_side_rcv == 4) {
		uint32_t rec_id = host_side_rcv_buff[3] & RCV_MSK;
		uint32_t send_id = (host_side_rcv_buff[3] & SEND_MSK) >> SEND_OFFSET;
		uint32_t action = host_side_rcv_buff[2] & ACTION_MSK;
		uint32_t ctrl = ((host_side_rcv_buff[2] & CTRL_MSK) >> ACTION_OFFSET2) | (host_side_rcv_buff[1] << CTRL_OFFSET2);
		// If the device is not yet connected to the host,
		if (dev_discovery) {
			// If the packet is a Device Discovery packet from the host, then respond with a Host Notify: Connected packet.
			// Assign the device ID as 1 to self.
			if (action == DEV_DISCOVERY && send_id == HOST_ID) {
				dev_id = 1;
				uint32_t packet = hostNotify(CONNECTED);
				// Send the start byte.
				NeoSerial1.write(START_BYTE);
				NeoSerial1.write((uint8_t) (packet >> 24));
				NeoSerial1.write((uint8_t) (packet >> 16));
				NeoSerial1.write((uint8_t) (packet >> 8));
				NeoSerial1.write((uint8_t) packet);
				// Send the end byte.
				NeoSerial1.write(END_BYTE);
				dev_discovery = false;
			}
			// Otherwise, assign the device ID as send_id + 1 and respond with a Host Notify: Connected packet.
			else if (action == DEV_DISCOVERY && send_id != HOST_ID) {
				dev_id = send_id + 1;
				uint32_t packet = hostNotify(CONNECTED);
				cli();
				// THIS DELAY IS NECESSARY.
				delay(1500);
				// Send the start byte.
				NeoSerial1.write(START_BYTE);
				NeoSerial1.write((uint8_t) (packet >> 24));
				NeoSerial1.write((uint8_t) (packet >> 16));
				NeoSerial1.write((uint8_t) (packet >> 8));
				NeoSerial1.write((uint8_t) packet);
				// Send the end byte.
				NeoSerial1.write(END_BYTE);
				dev_discovery = false;
				sei();
			}
		}
		// If the device is connected to the host,
		else {
			// ...
		}
	}
}

void setup() {
	pinMode(TEST_LED, OUTPUT);
	pinMode(TEST_LED2, OUTPUT);

	// Serial.begin(DEFAULT_BAUD);
	NeoSerial1.attachInterrupt(handleRxHost);
	NeoSerial1.begin(MIDI_BAUD);
	ss.attachInterrupt(handleRxDevice);
	ss.begin(MIDI_BAUD);
	notifyHost();
	digitalWrite(TEST_LED, LOW);
}

void loop() {
	digitalWrite(TEST_LED2, !alternate);
	alternate = !alternate;
	delay(1000);
}
