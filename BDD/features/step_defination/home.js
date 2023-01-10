const { expect } = require("chai");
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { Builder, By, Key, until, sleep } = require("selenium-webdriver");

const delay = 5000;

Given("I am on Home Page", { timeout: 30000 }, async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3000");

  await driver.wait(until.elementLocated(By.id("featured-products")), 30000);
  expect(await driver.wait(until.elementLocated(By.id("featured-products"))));
  await driver.quit();
});
