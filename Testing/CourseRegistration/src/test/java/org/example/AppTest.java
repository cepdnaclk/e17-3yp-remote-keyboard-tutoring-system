package org.example;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Random;


/**
 * Unit test for simple App.
 */
public class AppTest
{
    /**
     * Rigorous Test :-)
     */
    @Test
    public void shouldAnswerWithTrue() throws InterruptedException {
        String description = new String("A New Way to Learn\n" +
                "\n" +
                "For over a decade, Pianoforall has taught over 200,000 people worldwide how to play amazing pop, jazz, blues, ballads and improvisation, and now weÃ¢â‚¬â„¢re going to teach you how to play INCREDIBLE Classical pieces in the same way.\n" +
                "\n" +
                "These courses are for ADULT BEGINNERS who would love to build a repertoire of great classical pieces but who donÃ¢â‚¬â„¢t have the time (or the inclination) to learn the Ã¢â‚¬ËœtraditionalÃ¢â‚¬â„¢ Ã¢â‚¬ËœhardÃ¢â‚¬â„¢ way.\n" +
                "\n" +
                "This Classics By Ear Series will teach you a NEW way to learn classical piano Ã¢â‚¬â€œ from the Ã¢â‚¬Ëœinside outÃ¢â‚¬â„¢.\n" +
                "\n" +
                "Instead of painstakingly learning complicated sheet music one note at a time by memory, you will learn how to take a piece of classical music apart bar by bar, section by section, and understand how it was all put together: from the musical Ã¢â‚¬ËœformÃ¢â‚¬â„¢ Ã¢â‚¬â€œ distinct sections and subsections Ã¢â‚¬â€œ to the underlying chord structure, visual clues, patterns and repeats.\n" +
                "\n" +
                "So not only do you learn how to play Ã¢â‚¬â€œ the pieces but you UNDERSTAND what you are playing and this makes it SO much easier to memorise and perform.\n" +
                "\n" +
                "No more performance fear\n" +
                "\n"
        );

        System.setProperty("webdriver.chrome.driver","D:\\ChromeDriver\\chromedriver_win32\\chromedriver.exe");
//        ChromeOptions options = new ChromeOptions();
//        options.addArguments("--headless");
//        options.addArguments("start-maximized");
        WebDriver driver = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driver, 20);
        driver.get("http://localhost:3000/");
        driver.manage().window().maximize();

        // Wait untill login page appears
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@class=\"MuiInputBase-input MuiOutlinedInput-input\"]")));
        // Giving login credentials
        driver.findElement(By.xpath("//*[@class=\"MuiInputBase-input MuiOutlinedInput-input\"]")).click();
        driver.findElement(By.xpath("//*[@class=\"MuiInputBase-input MuiOutlinedInput-input\"]")).sendKeys("tutor1");
        driver.findElement(By.xpath("//*[@class=\"MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd\"]")).click();
        driver.findElement(By.xpath("//*[@class=\"MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd\"]")).sendKeys("Test@123");
        driver.findElement(By.xpath("//*[@class=\"btn btn-primary\"]")).click();
        // Traverse to the courses page
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//*[@class=\"nav-icon\"])[2]")));
        driver.findElement(By.xpath("(//*[@class=\"nav-icon\"])[2]")).click();
        // Click new course
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//*[@class=\"MuiButtonBase-root MuiFab-root MuiFab-primary\"])[1]")));
        driver.findElement(By.xpath("(//*[@class=\"MuiButtonBase-root MuiFab-root MuiFab-primary\"])[1]")).click();

        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//*[@class=\"MuiChip-label\"])[1]")));

        driver.findElement(By.name("courseName")).sendKeys("Pianoforall - 'Classics By Ear' - Erik Satie");

        Random rd = new Random(); // creating Random object

        // Setting the difficulty
        driver.findElement(By.xpath(String.format("(//*[@class=\"MuiChip-label\"])[%d]", ((Math.abs(rd.nextInt())%3)+1)))).click();

        driver.findElement(By.xpath(String.format("(//*[@class=\"MuiChip-label\"])[%d]", ((Math.abs(rd.nextInt())%11)+4)))).click();

        driver.findElement(By.xpath("//*[@class=\"MuiInputBase-input MuiOutlinedInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd\"]")).click();
        driver.findElement(By.xpath("//*[@class=\"MuiInputBase-input MuiOutlinedInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd\"]")).sendKeys("Classical\n");

        driver.findElement(By.xpath("(//*[@class=\"btn btn-outline-secondary\"])[2]")).click();

        wait.until(ExpectedConditions.elementToBeClickable(By.name("lesson")));
        // Second Page
        for (int i=0; i<3; i++){
            driver.findElement(By.xpath(String.format("(//*[@name=\"lesson\"])[%d]", i+1))).click();
            driver.findElement(By.xpath(String.format("(//*[@name=\"lesson\"])[%d]", i+1))).sendKeys("You will be able to sit down at any piano and play 3 stunning classical pieces by ear");
        }

        driver.findElement(By.xpath("(//*[@class=\"btn btn-outline-secondary\"])[2]")).click();

        // Third page
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@class=\"ql-editor ql-blank\"]")));
        driver.findElement(By.xpath("//*[@class=\"ql-editor ql-blank\"]")).sendKeys(description);


//        for (int i=1; i<4; i++){
//            wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(String.format("(//*[@name=\"lesson\"])[%d]", i))));
//            driver.findElement(By.xpath(String.format("(//*[@name=\"lesson\"])[%d]", i))).click();
//            driver.findElement(By.xpath(String.format("(//*[@name=\"lesson\"])[%d]", i))).sendKeys("If you have no prior knowledge of piano you need to be willing to put in lots of practice");
//            driver.findElement(By.xpath(String.format("(//*[@class=\"MuiIconButton-label\"])[&d]", (2*i)))).click();
//        }
        driver.findElement(By.xpath("(//*[@class=\"btn btn-outline-secondary\"])[2]")).click();

        // Fourth page
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//*[@class=\"MuiFormLabel-root MuiInputLabel-root MuiInputLabel-animated\"])[1]")));
        driver.findElement(By.xpath("(//*[@class=\"MuiFormLabel-root MuiInputLabel-root MuiInputLabel-animated\"])[1]")).click();
        Actions action = new Actions(driver);
        action.sendKeys(Keys.PAGE_UP).build().perform();

        WebElement element = driver.findElement(By.xpath("//*[@class=\"MuiFormLabel-root MuiInputLabel-root MuiInputLabel-animated\"]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);


//        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div[2]/div/div/div[2]/div[1]/div/div/div[1]/div/div[2]/div[2]/span/input")).click();
//        driver.findElement(By.xpath("/html/body/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[1]/div/div[2]/div[2]/span/span")).sendKeys("1000");

        driver.findElement(By.xpath("(//*[@class=\"btn btn-outline-secondary\"])[2]")).click();

    }
}
