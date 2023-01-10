const { expect } = require("chai");
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { Builder, By, Key, until, sleep } = require("selenium-webdriver");

const delay = 5000;

Given("I am an on Profile Page", { timeout: 30000 }, async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3000/profile");

  await driver.wait(until.elementLocated(By.id("UserProfile")), 30000);
  expect(await driver.wait(until.elementLocated(By.id("UserProfile"))));
  await driver.quit();
});
