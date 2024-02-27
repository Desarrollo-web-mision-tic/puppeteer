const puppeteer = require('puppeteer');
require('dotenv').config();

exports.obtenerDatos = async (req, res) => {
  const idNumbers = req.body.idNumbers;
  const results = [];

  const browser = await puppeteer.launch();

  for (const idNumber of idNumbers) {
    const page = await browser.newPage();
    try {
      await page.goto(process.env.URL_MUISCA);
      await page.waitForSelector('input[id="vistaConsultaEstadoRUT:formConsultaEstadoRUT:numNit"]');
      await page.type('input[id="vistaConsultaEstadoRUT:formConsultaEstadoRUT:numNit"]', idNumber);
      await page.click('input[id="vistaConsultaEstadoRUT:formConsultaEstadoRUT:btnBuscar"]');
      await new Promise(resolve => setTimeout(resolve, 5000));

      const data = await page.evaluate(() => {
        const firstName = document.querySelector('span[id="vistaConsultaEstadoRUT:formConsultaEstadoRUT:primerNombre"]');
        const otherNames = document.querySelector('span[id="vistaConsultaEstadoRUT:formConsultaEstadoRUT:otrosNombres"]');
        const firstSurname = document.querySelector('span[id="vistaConsultaEstadoRUT:formConsultaEstadoRUT:primerApellido"]');
        const secondSurname = document.querySelector('span[id="vistaConsultaEstadoRUT:formConsultaEstadoRUT:segundoApellido"]');
        const status = document.querySelector('span[id="vistaConsultaEstadoRUT:formConsultaEstadoRUT:estado"]');

        return { 
          firstName: firstName ? firstName.innerText : null,
          otherNames: otherNames ? otherNames.innerText : null,
          firstSurname: firstSurname ? firstSurname.innerText : null,
          secondSurname: secondSurname ? secondSurname.innerText : null,
          status: status ? status.innerText : "No activo"
        };
      });

      results.push({ idNumber, data });
    } catch (error) {
      console.error(`Error while processing id number ${idNumber}:`, error);
      results.push({ idNumber, error: error.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  res.json(results);
};
