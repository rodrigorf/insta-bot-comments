//TODO: Escrever a hora e count em cada entrada do log
//TODO: detectar tela alert e reiniciar o bot/chromedriver (//div[@role="dialog"])

const fs = require('fs');
const chalk = require("chalk")
const logger = require('./src/logger');
const Stopwatch = require('statman-stopwatch');
const puppeteer = require('puppeteer');
const commons = require('./src/commons');

const USER = 'gurudoesporte';
const PASSWORD = 'FumobolBets44@';
const URL_INSTA = 'https://www.instagram.com/accounts/login/?source=auth_switcher';
const URL_POST = 'https://www.instagram.com/p/CDpv2Y2Hf0u/';

let rawdata = fs.readFileSync('./src/comments.json');
let commentsJson = JSON.parse(rawdata);

let ts = new Date();
logger.info(chalk.greenBright(`START: ${ts.getHours()}:${ts.getMinutes()}`));

(async () => {
  const sw = new Stopwatch();
  sw.start();

  // Starting browser
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  // Login flow
  await page.goto(URL_INSTA);
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', USER);
  await page.type('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');

  // Waiting for page to refresh
  await page.waitForNavigation();

  // Navigate to post and submitting the comment
  await page.goto(URL_POST);
  await page.waitForSelector('textarea');

  const commentsList = commentsJson.comments;

  const timer = ms => new Promise(res => setTimeout(res, ms))

  let stepCount = 0;
  for (const comment of commentsList) {
    if(stepCount > 20)
    {
      let bigGap = commons.RandomBetween(200000, 300000);
      timer(bigGap);
      logger.info(`STEP COUNT GAP: ${bigGap}`);
      stepCount = 0;
    };

    await page.$eval('textarea', el => el.value = '');

    page.type('textarea', comment);
    await timer(1000);
    page.click('button[type="submit"]');

    let sleepGap = commons.RandomBetween(25000, 50000);
    logger.info(`Comentario feito: ${comment} - Waiting: ${sleepGap}`);

    await timer(sleepGap);
    stepCount++;
  };
  
  sw.stop();
  const delta = (sw.read() / 1000) / 60;
  logger.info(`Elapsed time: ${delta} minutes`);

  await browser.close();

  ts = Date.now();
  logger.info(chalk.greenBright(`END: ${ts.getHours()}:${ts.getMinutes()}`));

})();