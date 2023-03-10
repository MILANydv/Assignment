const { expect } = require("chai");
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { Builder, By, Key, until, sleep } = require("selenium-webdriver");

const delay = 5000;

Given("I am on the registration page", { timeout: 30000 }, async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3000/signup");
  await driver.findElement(By.id("name")).sendKeys("test");
  await driver.findElement(By.id("email")).sendKeys("test1@gmail.com");
  await driver.findElement(By.id("password")).sendKeys("test1234");
  await driver.findElement(By.id("confirmPassword")).sendKeys("test1234");
  await driver.sleep(delay);
  await driver.findElement(By.id("registerButton")).click();

  await driver.wait(until.elementLocated(By.id("registerForm")), 30000);
  expect(await driver.wait(until.elementLocated(By.id("registerForm"))));
  await driver.quit();
});

Given("I am on the Login page", { timeout: 30000 }, async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3000/signin");
  await driver.findElement(By.id("email")).sendKeys("test@gmail.com");
  await driver.findElement(By.id("password")).sendKeys("test1234");
  await driver.sleep(delay);
  await driver.findElement(By.id("loginBtn")).click();

  await driver.wait(until.elementLocated(By.id("loginForm")), 30000);
  expect(await driver.wait(until.elementLocated(By.id("loginForm"))));
  await driver.quit();
});