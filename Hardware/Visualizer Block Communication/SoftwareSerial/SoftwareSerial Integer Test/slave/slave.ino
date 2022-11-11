#include <avr/io.h>
#include <NeoSWSerial.h>

#define DEFAULT_BAUD 9600
#define MIN_BAUD 300
#define MAX_BAUD 115200
// Calculate the prescaler value to be loaded into the UBRR (USART Baud Rate Register) for the given baud rate.
#define BAUD_PRESCALE(baudRate) (((F_CPU / (baudRate * 16UL))) - 1)

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


#define TEST_LED 9
#define TEST_LED2 8

// Each visualizer block is initially in the "Device Discovery" mode.
// If dev_discovery is set to false, then the block is successfully connected to the host.
volatile bool dev_discovery = true;
volatile bool dev_side_incoming = false, host_side_incoming = false;

volatile uint8_t dev_id = UNK_ID;
volatile int host_side_rcv = 0, device_side_rcv = 0;
volatile uint32_t host_side_rcv_buff[4], device_side_rcv_buff[4];

NeoSWSerial ss(10, 3);

// Function to set the baud rate of the USART port.
void USART_setBaudRate(uint16_t baudRate) {
    // Check if the baud rate is in the valid range.
    uint16_t validBaud = (baudRate >= MIN_BAUD && baudRate <= MAX_BAUD) ? baudRate : DEFAULT_BAUD;
    // Set the baud rate by writing the appropriate value to the UBRR.
    UBRR1H = (uint8_t) (BAUD_PRESCALE(validBaud) >> 8);
    UBRR1L = (uint8_t) BAUD_PRESCALE(validBaud);
}

// Function to initialize the USART.
void USART_init(uint16_t baudRate) {
    // Enable the USART transmitter and receiver.
    UCSR1B = (1 << RXEN1) | (1 << TXEN1);
    // Asynchronous mode (UMSELn1:0 are cleared), 8-bit data frame (UCSZ01 and UCSZ00 are set), 1 stop bit (USBS1 is cleared), no parity (UPMn1:0 are cleared).
    UCSR1C = (1 << UCSZ11) | (1 << UCSZ10);
	// Enable the USART receive interrupt.
	UCSR1B |= (1 << RXCIE1);
    // Set baud rate.
    USART_setBaudRate(baudRate);
}

// Function to send a 32-bit integer over the USART.
void USART_send(uint32_t data) {
	// cli();
	// Wait for the USART data register to be empty.
//	while (!(UCSR1A & (1 << UDRE1)));
	// Send the start byte.
//	UDR1 = START_BYTE;
	// Wait for the USART data register to be empty.
	while (!(UCSR1A & (1 << UDRE1)));
	UDR1 = 'A';
	// Send the 32-bit integer.
	// UDR1 = (uint8_t) (data >> 24);
	// while (!(UCSR1A & (1 << UDRE1)));
	// UDR1 = (uint8_t) (data >> 16);
	// while (!(UCSR1A & (1 << UDRE1)));
	// UDR1 = (uint8_t) (data >> 8);
	// while (!(UCSR1A & (1 << UDRE1)));
	// UDR1 = (uint8_t) data;
//	while (!(UCSR1A & (1 << UDRE1)));
	// Send the end byte.
//	UDR1 = END_BYTE;
	// sei();
}

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
		USART_send(deviceNotify(CONNECTED));
		delay(1000);
	}
}

// Handle device-side RX.
static void handleRxChar(uint8_t c) {
	if (c == START_BYTE) {
		dev_side_incoming = true;
		device_side_rcv = 0;
		return;
	}
	if (c == END_BYTE) {
		dev_side_incoming = false;
		device_side_rcv = 0;
		return;
	}
	if (!dev_side_incoming) return;
	device_side_rcv_buff[device_side_rcv++] = c;
	if (device_side_rcv == 4) {
		uint32_t packet = (device_side_rcv_buff[0] << 24) | (device_side_rcv_buff[1] << 16) | (device_side_rcv_buff[2] << 8) | device_side_rcv_buff[3];
		uint8_t rec_id = packet & RCV_MSK;
		uint8_t send_id = (packet & SEND_MSK) >> SEND_OFFSET;
		uint8_t action = (packet & ACTION_MSK) >> ACTION_OFFSET;
		uint16_t ctrl = (packet & CTRL_MSK) >> CTRL_OFFSET;
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
			else if (action == HOST_NOTIFY && ctrl == CONNECTED)
				USART_send(packet);
			// ...
		}
	}
}

// Handle host-side RX using interrupts.
ISR(USART_RX_vect) {
	uint8_t c = UDR1;
	if (c == START_BYTE) {
		host_side_incoming = true;
		host_side_rcv = 0;
		return;
	}
	if (c == END_BYTE) {
		host_side_incoming = false;
		return;
	}
	if (!host_side_incoming) return;
	host_side_rcv_buff[host_side_rcv++] = c;
	if (host_side_rcv == 4) {
		uint32_t packet = (host_side_rcv_buff[0] << 24) | (host_side_rcv_buff[1] << 16) | (host_side_rcv_buff[2] << 8) | host_side_rcv_buff[3];
		uint8_t rec_id = packet & RCV_MSK;
		uint8_t send_id = (packet & SEND_MSK) >> SEND_OFFSET;
		uint8_t action = (packet & ACTION_MSK) >> ACTION_OFFSET;
		uint16_t ctrl = (packet & CTRL_MSK) >> CTRL_OFFSET;
		// If the device is not yet connected to the host,
		if (dev_discovery) {
			// If the packet is a Device Discovery packet from the host, then respond with a Host Notify: Connected packet.
			// Assign the device ID as 1 to self.
			if (action == DEV_DISCOVERY && send_id == HOST_ID) {
				dev_id = 1;
				USART_send(hostNotify(CONNECTED));
				dev_discovery = false;
			}
			// Otherwise, assign the device ID as send_id + 1 and respond with a Host Notify: Connected packet.
			else if (action == DEV_DISCOVERY && send_id != HOST_ID) {
				dev_id = send_id + 1;
				USART_send(hostNotify(CONNECTED));
				dev_discovery = false;
			}
		}
		// If the device is connected to the host,
		else {
			// If the packet is Device Discovery packet from the host, forward the packet to the next device.
			if (action == DEV_DISCOVERY) {
				packet = createPacket(rec_id, dev_id, DEV_DISCOVERY, 0);
				ss.write((uint8_t) (packet >> 24));
				ss.write((uint8_t) (packet >> 16));
				ss.write((uint8_t) (packet >> 8));
				ss.write((uint8_t) packet);
			}
		}
	}
}

void setup() {
	pinMode(TEST_LED, OUTPUT);
	pinMode(TEST_LED2, OUTPUT);

	USART_init(DEFAULT_BAUD);
	// ss.attachInterrupt(handleRxChar);
	// ss.begin(DEFAULT_BAUD);
	cli();
	notifyHost();
	sei();
}

void loop() {
	digitalWrite(TEST_LED2, !alternate);
	alternate = !alternate;
	delay(1000);
}
