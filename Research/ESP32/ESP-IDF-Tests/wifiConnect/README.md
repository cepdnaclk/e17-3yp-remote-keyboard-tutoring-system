# Connecting to a Wifi Network

## FreeRTOS Event Groups

You may think of an event group as a bit field where every bit is a flag that corresponds to a certain event. The event bit can be set or cleared. The state of the bits is altered to signal the status of a process to other functions.

For example, if there is a Task A that must kill itself after Task B is complete, you may use an event group with a bit indicating status of Task B, which Task A can poll to determine when Task B is done.

Event group handles are **created as static variables** and are simply pointers to the event group structure (the structure must be dynamically allocated before use).

### When to use event groups

When you plan on **waiting for an event** to occur, you should use an event group.
The event group does not notify itself of any events. The functions using the event group must signal when an event is over.

### Files to include

* FreeRTOS.h
* event_groups.h

### Declare Event Groups

```C
// Declare a variable with file-wide scope
EventGroupHandle_t xCreatedEventGroup;
// Allocate the event group
// NULL return means not allocated
xCreatedEventGroup = xEventGroupCreate();
```

**NOTE**: The event group in case of esp-idf can hold 24 bits according to the FreeeRTOS config file.

### Wait for event bit

```C
EventBits_t xEventGroupWaitBits
(
const EventGroupHandle_t xEventGroup,    // Group handle
const EventBits_t uxBitsToWaitFor,       // Bits to wait for until set
const BaseType_t xClearOnExit,           // Clear bits on exit if pdTRUE
const BaseType_t xWaitForAllBits,        // Wait for all bits to set if pdTRUE
TickType_t xTicksToWait                  // Max wait time
);
```