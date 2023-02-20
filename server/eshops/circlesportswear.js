const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('#product-grid')
    .map((i, element) => {
      const name = $(element)
        .find('.card__heading')
        .text()
        .split(' ')
        .filter(function(value, index, self) { 
            return self.indexOf(value) === index;
        }).join(' ')
        .trim()
        .replace(/\s/g, ' ');
      const price =$(element)
          .find('.price__regular .price-item--regular')
          .text()
          .trim()
          .replace(/\s/g, ' ')
          .replace('€', '');
      const link ='https://shop.circlesportswear.com/'+ $(element)
          .find('.full-unstyled-link').attr('href');

      const image = $(element)
        .find('.motion-reduce')
        .attr('srcset');
    let date = new Date().toISOString().slice(0, 10);
      return {name, price,link,image,date};
    })

    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
