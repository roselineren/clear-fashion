/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
//https://www.dedicatedbrand.com/en/loadfilter


const montlimart = require('./eshops/montlimart');
//https://www.montlimart.com/99-vetements


const circlesportswear = require('./eshops/circlesportswear')
//https://shop.circlesportswear.com/collections/collection-homme 


async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/loadfilter') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    //const products = await dedicatedbrand.scrape(eshop);
    const products = await dedicatedbrand.getProducts();
    //const products = await montlimart.scrapeAndSave(eshop,'montlimart2.json');
    //const products = await circlesportswear.scrapeAndSave(eshop,'circlesportswear2.json');
    //const products = await circlesportswear.scrape(eshop);
    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
