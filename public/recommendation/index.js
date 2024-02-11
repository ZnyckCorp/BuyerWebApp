async function  search(search){
    document.getElementById('search-input').value = search;
    if(!search || search == "" || search == undefined){
      return;
    }
    setSpiner(true);
    await fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/queryrecom?query_term=${search}`,{
      method: 'GET',
    }).then(res => res.json())
    .then(data => {
      setSpiner(false);
      showView(data);
    }).catch(err => {
      console.log(err);
      setSpiner(false);
    })
}


// Show the view
async function showView(data) {
  let skimmerCard = document.getElementById("loading-card-skimmer");
  let productContainer = document.getElementById("product-container");
  let productCard = document.getElementById("card-product");

  let fetchPromises = [];

  data.forEach((element, index) => {
    const newSkimmerCard = skimmerCard.cloneNode(true);
    newSkimmerCard.style.display = "block";
    productContainer.appendChild(newSkimmerCard);

    let fetchPromise = fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/getProduct?product_id=${element.id}`, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
      const newProductCard = productCard.cloneNode(true);
      newProductCard.querySelector('.card-title').textContent = data.item_name;
      newProductCard.querySelector('.description').textContent = data.item_description;
      newProductCard.querySelector('.location').textContent = "Unit: " + data.item_unit;
      newProductCard.querySelector('.price').textContent = "Price: Rs." + data.item_price;
      newProductCard.querySelector('.product-image').src = data.image_url_primary;

      productContainer.replaceChild(newProductCard, newSkimmerCard);
      newProductCard.style.display = "block";
    })
    .catch(err => {
      productContainer.removeChild(newSkimmerCard);
      console.error(err);
    });

    fetchPromises.push(fetchPromise);
  });  

  await Promise.all(fetchPromises);
}


 function init(){
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('search');
  if (search != null && search != "" && search != undefined) {
    document.getElementById("center-container-boxy").style.display = "none";
     this.search(search);
  }else{
    document.getElementById("center-container-boxy").style.display = "block";
  }
}

async function  onSearchClick(search){
  let value = document.getElementById('search-input').value;
  if(!value || value == "" || value == undefined){
    return;
  }

  window.location.href = `${window.location.origin}${window.location.pathname}?search=${value}`;
}

init();

function setSpiner(bool){
  let loadingCard = document.getElementById("center-container-boxy-spinner");
  if(bool){
    return loadingCard.style.display = "block";
  }
  return loadingCard.style.display = "none";
}