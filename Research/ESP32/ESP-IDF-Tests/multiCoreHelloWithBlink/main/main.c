#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "driver/gpio.h"

#define BLINK_GPIO 2

void hello_task(void *pvParameter)
{
    char *taskName = pcTaskGetName(NULL);
	while(1)
	{
	    printf("%s running in core %d: Hello world!\n", taskName, xPortGetCoreID());
	    vTaskDelay(100 / portTICK_RATE_MS);
	}
}

void blinky(void *pvParameter)
{
    /* Configure the IOMUX register for pad BLINK_GPIO (some pads are
       muxed to GPIO on reset already, but some default to other
       functions and need to be switched to GPIO. Consult the
       Technical Reference for a list of pads and their default
       functions.)
    */
    gpio_reset_pin(BLINK_GPIO);
    /* Set the GPIO as a push/pull output */
    gpio_set_direction(BLINK_GPIO, GPIO_MODE_OUTPUT);

    char *taskName = pcTaskGetName(NULL);

    while(1) {
        /* Blink off (output low) */
        printf("%s running in core %d: Turning off the LED\n", taskName, xPortGetCoreID());
        // Can use logging too
        // ESP_LOGI(taskName, "Turning off the LED\n");
        gpio_set_level(BLINK_GPIO, 0);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        /* Blink on (output high) */
        printf("%s running in core %d: Turning on the LED\n", taskName, xPortGetCoreID());
        gpio_set_level(BLINK_GPIO, 1);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}

void app_main(void)
{
    xTaskCreatePinnedToCore(hello_task,     /* Function to implement the task */
                        "hello_task",       /* Name of the task */
                        2048,               /* Stack size in words */
                        NULL,               /* Parameter to pass into the task */
                        2,                  /* Priority of the task */
                        NULL,               /* Task handle */
                        0                   /* Core ID where the task will be created */
                            );
    xTaskCreatePinnedToCore(blinky, "blinky", 2048, NULL, 2, NULL, 1);
}