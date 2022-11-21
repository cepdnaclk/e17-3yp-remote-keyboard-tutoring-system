# What's MIDI?

- MIDI - Musical Instrument Digital Interface
- A standard protocol for communication between computers and musical instruments. 
- Sends series of **messages** which are intepretted by a MIDI instrument.

## MIDI messages
- Made up of an 8-bit **status byte** (or **command byte**) which is generally followed by 1 or 2 **data bytes**.
- Command byte: tells what type of message is being sent.
- Data bytes: actual data that is sent with the command byte.
- Two types of MIDI messages: *System messages*, *Channel messages*.
![](midi-message-taxonomy.png)
- Channel -> an independent path over which messages travel to their destination.
- A MIDI device has 16 channels.
- Channel messages -> apply to a specific channel, channel number is included in the status byte.
- Channel Messages may be further classified as being either *Channel Voice Messages*, or *Mode Messages*.
- Channel Voice Messages: carries musical performance data.

## Channel Voice Messages

Categories: Note On, Note Off, Polyphonic Key Pressure, Channel Pressure, Pitch Bend Change, Program Change, and the Control Change messages.

- MIDI **data bytes** range from 0 to 127 (MSB is always 0).
- MIDI **command byte** ranges from 128 to 255 (MSB is always 1).
- Two types of bytes are differentiated by the MSB.
- First half of the command byte (three bits after MSB) -> sets the type of command.
- Last half of the command byte -> sets the channel number.

## MIDI Commands

![](protocol.png)

10000000 (128) = note off</br>
10010000 (144) = note on</br>
10100000 (160)  = aftertouch</br>
10110000 (176) = continuous controller</br>
11000000 (192) = patch change</br>
11010000 (208) = channel pressure</br>
11100000 (224) = pitch bend</br>

### Note On

- Sent when a key is pressed.
- Consists of two pieces of info: which key was pressed (**note**) and how fast it was pressed (**velocity**).
- **Note** is a number from 0 to 127. Middle C (C4) is 60.
- **Velocity** is a number from 0 to 127. Describes volume of the note.
(For some voices, different velocities create different **timbres**.)

### Note Off

- Sent when a key is released.
- Also contain **note** information to ensure that it is signalling the end of the right note.
- Sometimes a note off may contain velocity information too.

### Aftertouch

- The amount of pressure applied to a note.
- Sent when a key is pressed.
- Ranges from 0 to 127.
