// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

let RecentProducts = [];
let ReasonableProduct =[];
let SortExpensiveProduct = [];
let SortCheaperProduct = [];
let SortRecentProduct = [];
let SortAncientProduct = [];

// brands and favorite list
let brands = [];
let favoriteProducts = [];

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');

const selectBrand = document.querySelector('#brand-select');
const checkreleased = document.querySelector("input[name=released-check]");
const selectReasonablePrice = document.querySelector("#reasonablePriceSelect");
const selectSortProduct = document.querySelector("#sort-select");
const selectFavoriteProducts = document.querySelector("#favorite-select");

const sectionProducts = document.querySelector('#products');

const spanNbProducts = document.querySelector('#nbProducts');
const spanNbBrands = document.querySelector('#nbBrands');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanLatestRelease = document.querySelector('#latestRelease');
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [limit=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, limit = 12) => {
  try {
    const response = await fetch(
      `https://server-eta-blond-92.vercel.app/products/search`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Fetch brands from api
 * @return {Object}
 */

const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app/brands`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {brands};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {brands};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination,products, brands) => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  spanNbBrands.innerHTML = brands.result.length;
  spanNbNewProducts.innerHTML = RecentProducts.length;

  let sortedProducts = sortDate(products);
  spanLatestRelease.innerHTML = sortedProducts[0].released;
};

/**
 * Render brand selector
 * @param  {Object} brands
 */
const renderBrands = brands => {
  const options = brands.result.map(brand => `<option value="${brand}">${brand}</option>`
  ).join('');
  
  selectBrand.innerHTML = options;
};

const render = (products, pagination, brands) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination,products, brands);
  renderBrands(brands);
};

const renderPValues = (p50, p90, p95) => {
  spanP50.innerHTML = p50;
  spanP90.innerHTML = p90;
  spanP95.innerHTML = p95;
}

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
/**
 * Select the page of product to display
 */
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), selectShow.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Filter by brands
 */

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, event.target.value);
  
  setCurrentProducts(products);

  let selectedBrand = event.target.value;
  let currentBrand = {};
  currentBrand[selectedBrand] = [];

  for (const product of currentProducts) {
    if (product.brand == selectedBrand) {
    currentBrand[product.brand].push(product)
    }
  };
  render(currentBrand[selectedBrand], currentPagination, brands);
});

/**
 * Filter by recent products
 */
checkreleased.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  setCurrentProducts(products);

  if(event.target.checked){
    recentDate(currentProducts,RecentProducts);
    alert ("The check box is checked.");
  }
  else {
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    setCurrentProducts(products);
    render(currentProducts, currentPagination, brands);
  }

  render(RecentProducts, currentPagination, brands);
});

/**
 * Filter by reasonable price
 */
selectReasonablePrice.addEventListener('change',async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  setCurrentProducts(products);

  if(event.target.value == "Yes"){
  for (const prod of currentProducts) {
  if (prod.price <50) {
    ReasonableProduct.push(prod);
    }
  };
}
else {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  setCurrentProducts(products);
  render(currentProducts, currentPagination, brands);
}

  render(ReasonableProduct, currentPagination, brands);
});

/**
 * Sort by price and by date
 */
selectSortProduct.addEventListener('change',async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  setCurrentProducts(products);

  if(event.target.value == "price-asc"){
    render(sortPrice(currentProducts), currentPagination, brands);
  }
  else if (event.target.value == "price-desc"){
    render(sortPrice(currentProducts).reverse(), currentPagination, brands);
  }
  else if (event.target.value == "date-asc"){
    render(sortDate(currentProducts).reverse(), currentPagination, brands);
  }
  else{
    render(sortDate(currentProducts), currentPagination, brands);
  }
  render(currentProducts, currentPagination, brands);
});

/**
 * By favorite products
 */
selectFavoriteProducts.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  setCurrentProducts(products);

  if(event.target.value == "Yes"){
    let favoritesList = JSON.parse(localStorage.getItem("favoriteProducts"));
  
    render(favoritesList, currentPagination, brands);
}
else {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  setCurrentProducts(products);
  render(currentProducts, currentPagination, brands);
  }
});

/**
 * p50, p90 and p95 price value indicator
 */

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();

  setCurrentProducts(products);

  let [p50, p90, p95] = getPValueIndicator(currentProducts);
  renderPValues(p50, p90, p95);

  render(currentProducts, currentPagination,brands);
});

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function recentDate(currentProducts, RecentProduct){
  let twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate()-14)
  twoWeeksAgo = formatDate(twoWeeksAgo);

  for (const prod of currentProducts) {
    if (prod.released > twoWeeksAgo) {
        RecentProduct.push(prod);
    }
  };
}

function sortPrice(tab) {
  tab.sort(function compare(x,y){
    return x.price > y.price;
  });
  return(tab);
};

function sortDate (tab) {
  tab.sort(function compare(x,y){
    return x.released < y.released;
  });
  return(tab);
}

function getPValueIndicator(currentProducts) {
  let sortedCurrentProducts = sortPrice(currentProducts);
  return ([sortedCurrentProducts[Math.floor(currentProducts.length*0.5)].price,
          sortedCurrentProducts[Math.floor(currentProducts.length*0.9)].price,
          sortedCurrentProducts[Math.floor(currentProducts.length*0.95)].price])
};

function manageFavorites (element){

  let favoritesList =  JSON.parse(localStorage.getItem("favoriteProducts"));

  console.log(favoritesList)

  if (!element.checked){
    for (let i = 0; i<favoritesList.length; i++) {
      if (favoritesList.uuid == element.id) {
        favoritesList.splice(i, 1);
        break;
      }
    };
  }
  if (element.checked) {
    for (let i = 0; i<currentProducts.length; i++) {
      if (currentProducts[i].uuid == element.id) {
        if (favoritesList.length == 0){
          favoritesList = [currentProducts[i]]
        }
        else {
          favoritesList.push(currentProducts[i])
        }
        break;
      }
    };
  }

  localStorage.setItem("favoriteProducts", JSON.stringify(favoritesList));
}
