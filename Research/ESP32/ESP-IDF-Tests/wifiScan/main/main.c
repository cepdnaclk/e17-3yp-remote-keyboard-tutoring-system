#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/event_groups.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "nvs_flash.h"

#define DEFAULT_SCAN_LIST_SIZE 10

static void wifi_scan(void) {
    ESP_ERROR_CHECK(esp_netif_init());                                  // Initialize the underlying TCP/IP stack.
    ESP_ERROR_CHECK(esp_event_loop_create_default());                   // Create default event loop.
    esp_netif_t *sta_netif = esp_netif_create_default_wifi_sta();       // Creates default WIFI STA. In case of any init error this API aborts.
    assert(sta_netif);

    wifi_init_config_t conf = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&conf));                              // Initialize the WiFi driver.
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));                  // Set the WiFi operating mode to station.
    ESP_ERROR_CHECK(esp_wifi_start());                                  // Start the WiFi driver.
    ESP_ERROR_CHECK(esp_wifi_scan_start(NULL, true));                   // Start a WiFi scan.

    uint16_t ap_count = 0;                                              // Variable to store the access point count.
    ESP_ERROR_CHECK(esp_wifi_scan_get_ap_num(&ap_count));               // Get number of APs found in last scan.

    wifi_ap_record_t ap_info[ap_count];
    memset(ap_info, 0, sizeof(ap_info));                                // Allocate an array to hold info of the found APs.

    ESP_ERROR_CHECK(esp_wifi_scan_get_ap_records(&ap_count, ap_info));  // Get AP list found in last scan.

    printf("%d AP available\n", ap_count);
    printf("|------------------------------|\n");
    printf("SSID\t\t\tRSSI\n");
    /*
        SSID: Service Set Identifier (Name of the wireless network).
        RSSI: Received Signal Strength Indicator (Signal strength of the access point).
    */
    for (int i = 0; i < ap_count; i++)
        printf("%s\t\t\t%d\n", ap_info[i].ssid, ap_info[i].rssi);
}

void app_main(void) {
    nvs_flash_init(); // Initialize NVS
    wifi_scan();
}