/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');

//https://www.montlimart.com/99-vetements
//https://shop.circlesportswear.com/collections/collection-homme 
//https://www.dedicatedbrand.com/en/men/all-men 
const montlimart = require('./eshops/montlimart');

const circlesportswear = require('./eshops/circlesportswear')

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/loadfilter') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    //const products = await dedicatedbrand.scrape(eshop);
    //const products = await dedicatedbrand.scrapeAndSave(eshop,'dedicated.json');
    const products = await dedicatedbrand.getProducts()

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
