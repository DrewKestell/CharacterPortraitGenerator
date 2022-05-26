import fs from "fs";
import playwright from 'playwright';
const { 
  v4: uuidv4,
} = require('uuid');

const timeout = 10000;

const processImage = async (page: playwright.Page) => {
  const uuid = uuidv4();

  await page.goto("https://this-person-does-not-exist.com/en");
  await page.waitForTimeout(timeout);

  const image = await page.$('#avatar');
  if (image != null)
  {
    const imageData = await image.evaluate(htmlElement => {
      const htmlImageElement = htmlElement as HTMLImageElement;
      var cnv = document.createElement('canvas');
      cnv.width = htmlImageElement.naturalWidth;
      cnv.height = htmlImageElement.naturalHeight;
      const ctx = cnv.getContext('2d');
      if (ctx != null)
      {
        ctx.drawImage(htmlImageElement, 0, 0, htmlImageElement.naturalWidth, htmlImageElement.naturalHeight);
        return cnv.toDataURL().substring(22);
      }
    });

    fs.writeFileSync(`C:\\CharacterPortraits\\Input\\${uuid}.png`, imageData as string, 'base64');
  }

  const util = require('util');
  const exec = util.promisify(require('child_process').execFile);
  const options = {
    cwd: "C:\\Repos\\painter\\bin\\Release\\net5.0",
    stdio: "inherit"
  }
  const promise = exec("Painter.exe", [`C:\\CharacterPortraits\\Input\\${uuid}.png`, `C:\\CharacterPortraits\\Output\\${uuid}.png`, "512", "false"], options);
  const child = promise.child;
  child.stdout.on('data', function(data: any) {
    console.log('stdout: ' + data);
  });
  child.stderr.on('data', function(data: any) {
      console.log('stderr: ' + data);
  });
  child.on('close', function(code: any) {
      console.log('closing code: ' + code);
  });
  await promise;
}
  
async function main() {
  const browser = await playwright.firefox.launch({
    headless: false
  });
  const page = await browser.newPage();

  while (true)
  {
    console.log('Processing image...');
    await processImage(page);
    console.log('Done processing image.');
  }
}

main();