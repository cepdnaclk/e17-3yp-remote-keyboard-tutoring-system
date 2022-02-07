# Basic Wifi Scan

## Primary Components in ESP-IDF Networking

* TCPIP Stack (lwIP): Embedded networking stack, with POSIX/BSD socket interface to application.
* TCP/IP Adapter Layer: Interfacing layer that provides wrappers on TCP/IP stack APIs, for default handlers from Event Loop Task.
* Event Loop Task: Task responsible for event dispatching and co-ordination between WiFi driver, TCP/IP stack and Application. This has default handlers registered for various system events.
* WiFi Driver: Acts as MAC layer in networking, with interface for sending/receiving data and WiFi events to higher layers.

## Different modes of WiFi network

The wifi libraries provide support for configuring and monitoring the ESP32 wifi networking functionality. This include configuration for:

* Station mode (aka STA mode or WiFi client mode). ESP32 connects to an access point.
* AP mode (aka Soft-AP mode or Access Point mode). Stations connect to the ESP32.
* Combined AP-STA mode (ESP32 is concurrently an access point and a station connected to another access point).
* Various security modes for the above (WPA, WPA2, WEP, etc.)
* Scanning for access points (active & passive scanning).
* Promiscuous mode monitoring of IEEE 802.11 WiFi packets.

>Access Point (AP) is the thing you connect to in order to connect a wireless device to a wired network, e.g. wireless router. Wireless/Mobile station (STA) is your end user device that has access to WiFi and allows transmission and reception of data. e.g. your phone.

The purpose of **ESP-NETIF** library is twofold:

* It provides an abstraction layer for the application on top of the TCP/IP stack. This will allow applications to choose between IP stacks in the future.
* The APIs it provides are thread safe, even if the underlying TCP/IP stack APIs are not.

ESP-IDF currently implements ESP-NETIF for the lwIP TCP/IP stack only. However, the adapter itself is TCP/IP implementation agnostic and different implementations are possible.