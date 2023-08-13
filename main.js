const puppeteer = require("puppeteer");
const Config = require("./config/Config");
const SystemUtils = require("./utils/SystemUtils");

async function main() {
  let browser;
  try {
    let options = {
      headless: "new",
      defaultViewport: { width: 1440, height: 1000 },
      ignoreHTTPSErrors: false,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--no-sandbox",
        "--lang=zh-CN",
        "--disable-blink-features=AutomationControlled",
        `--window-size=${1440},${1000}`,
      ],
    };
    // options.headless = false;
    // options.devtools = true;
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      const newProto = navigator.__proto__;
      delete newProto.webdriver;
      navigator.__proto__ = newProto;
    });

    // 有时候会跳转到广告页面, 这里多跳转几次, 保证是真实的登录页.
    await page.goto(Config.BASE_URL + "login.php");
    await page.goto(Config.BASE_URL + "login.php");
    await page.goto(Config.BASE_URL + "login.php");
    await page.goto(Config.BASE_URL + "login.php");


    await page.waitForSelector("input[name='pwuser']");
    await page.type("input[name='pwuser']", Config.ACCOUNT);
    await page.type("input[name='pwpwd']", Config.PASSWORD);
    if (Config.QUESTION) {
      await page.select("select[name='question']", Config.QUESTION);
    }
    if (Config.ANSWER) {
      await page.type("input[name='answer']", Config.ANSWER);
    }
    await (await page.$(".btn")).click();
    await SystemUtils.sleep(5000);
    await page.goto(Config.BASE_URL + "hack.php?H_name=qiandao");
    await page.waitForSelector("input[name='qdxq']");
    await (await page.$("input[name='qdxq']")).click();
    await (await page.$("#hy_code")).click();

    const frameHandle = await page.waitForSelector("#tcaptcha_iframe");
    await frameHandle.contentFrame();

    // 多滑几次保证成功登陆.
    await doSlide(browser, page);
    await doSlide(browser, page);
    await doSlide(browser, page);
    await doSlide(browser, page);
    await SystemUtils.sleep(4000);

    // 输出页面截图.
    let name = "hjd2048.png";
    await page.screenshot({ path: name });
    console.log(
      "data:image/png;base64," + (await SystemUtils.readFileToBase64(name))
    );
  } catch (e) {
    console.log(e);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function doSlide(browser, page) {
  const iframe = await page
    .frames()
    .find((f) => f.url().includes("cap_union_new_show.php"));
  await SystemUtils.sleep(4000);
  if (!iframe) {
    return;
  }
  const start = await iframe.$("#tcaptcha_drag_thumb");
  if (!start) {
    return;
  }

  const bgElement = await iframe.$(".tc-bg-img");
  const slideElement = await iframe.$(".tc-jpp-img");
  if (!bgElement) {
    return;
  }
  const bgSrc = await bgElement.evaluate((img) => img.src);
  const slideSrc = await slideElement.evaluate((img) => img.src);

  const bgBase64 = await getBase64FromUrl(bgSrc, browser);
  const slideBase64 = await getBase64FromUrl(slideSrc, browser);
  let distance = await SystemUtils.getVerifyPosition(bgBase64, slideBase64);
  distance = distance / 2;
  console.log('distance', distance);

  const startInfo = await start.boundingBox();
  let startX = startInfo.x + 10;
  let startY = startInfo.y + 10;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  for (let i = 0; i < distance; i = i + Math.floor(Math.random() * 11)) {
    await SystemUtils.sleep(Math.floor(Math.random() * 100));
    await page.mouse.move(startX + i, startY);
  }
  await SystemUtils.sleep(500);
  await page.mouse.up();
  await SystemUtils.sleep(2000);
}

async function getBase64FromUrl(url, browser) {
  const page = await browser.newPage();
  await page.goto(url);

  let data = await page.evaluate(() => {
    const img = document.querySelector("img");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    return canvas.toDataURL("image/png");
  });
  await page.close();
  return data;
}

main();