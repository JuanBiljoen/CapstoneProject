
var item = {};
function loadMore () {
    const productName = document.getElementsByClassName("product-name")[0];
    const productDesc = document.getElementsByClassName("product-price")[0];
    const productPrice = document.getElementsByClassName("product-description")[0];
    const moreImg = document.getElementsByClassName("moreImg")[0];
    let urlParams = new URLSearchParams(window.location.search); // supported on most modern browsers
    let dataStringBase64Safe = urlParams.get('data');
    
    let dataStringBase64 = decodeURIComponent(dataStringBase64Safe);
    let dataString = window.atob(dataStringBase64);
    let data = JSON.parse(dataString);
    item = data;
    productName.innerHTML = data['name'];
    productDesc.innerHTML = data['description'];
    productPrice.innerHTML = data['price'];
    moreImg.src = "../../" + data['imageUrl'];
}
//adds product to cart from more page
function addToCart() {
    var tempString = localStorage.getItem("productsInCart");
    var productsInCart = {}
    if (tempString) {

      productsInCart = JSON.parse(tempString);

      var obj = item;
      if(productsInCart.length === 0 || productFound(obj.id, productsInCart) === undefined) {
        productsInCart.push({product: obj, quantity: 1});
      }
      else
      {
        productsInCart.forEach(function(i) {
          if(i.product.id === obj.id) {
            i.quantity++;
          }
        });
    }
      localStorage.setItem("productsInCart", JSON.stringify(productsInCart) );
    }
    history.back();
}
function productFound(productId, list) {
    return list.find(function(item) {
      return item.product.id === productId;
    });
  }