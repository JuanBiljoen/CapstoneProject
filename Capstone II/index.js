  // Refernce DOM objects
  const productsEl = document.getElementsByClassName("products")[0];
  const cartEl = document.getElementsByClassName("shopping-cart-list")[0];
  const emptyCartEl = document.getElementsByClassName("empty-cart-btn")[0];
  const cartCheckoutEl = document.getElementsByClassName("cart-checkout")[0];
  const totalPriceEl = document.getElementsByClassName("total-price")[0];
  let cartTotal = 0;
  let productsInCart = [];
  // Adding products to an array
  var products = [{
      id: 0,
      name: "Blue coat",
      description: "Nice blue coat",
      imageUrl: "products/images/B.jpeg",
      moreDetails: "products/more/B.html",
      price: 1450
    },
    {
      id: 1,
      name: "Denim Trucker",
      description: "All the denim",
      imageUrl: "products/images/C.jpeg",
      moreDetails: "products/more/C.html",
      price: 950,
    },
    {
      id: 2,
      name: "Yellow tracksuit",
      description: "Run, Forest!",
      imageUrl: "products/images/D.jpeg",
      moreDetails: "products/more/D.html",
      price: 2250
    },
    {
      id: 3,
      name: "Grey playsuit",
      description: "Good luck, have fun.",
      imageUrl: "products/images/E.jpeg",
      moreDetails: "products/more/E.html",
      price: 1400
    },
    {
      id: 4,
      name: "Black jacket",
      description: "Paint it black.",
      imageUrl: "products/images/F.jpeg",
      moreDetails: "products/more/F.html",
      price: 850
    },
    {
      id: 5,
      name: "Striped bellbottoms",
      description: "Howzit.",
      imageUrl: "products/images/G.jpeg",
      moreDetails: "products/more/G.html",
      price: 900
    }
  ];

  // Markup of productlist and adding them to screen
  function generateProductList() {
    //<div class="product-description"><span>Description:</span> ${item.description}</div>
    products.forEach(function (item) {
      var productEl = document.createElement("div");
      productEl.className = "product";
      productEl.innerHTML = `<div class="product-image">
                                <img src="${item.imageUrl}" alt="${item.name}">
                             </div>
                              <div class="product-name"><span>Product:</span> ${item.name}</div>
                             <div class="product-price"><span>Price:</span> R${item.price} </div>
                             <div class="product-add-to-cart">
                               <a href="#0" class="button moreInfo" data-id=${item.id}>More Details</a>
                               <a href="#0" class="button add-to-cart" data-id=${item.id}>Add to Cart</a>
                             </div>
                          </div>
`;

      productsEl.appendChild(productEl);
    });
  }

  // Adding to cart
  function generateCartList() {

    cartEl.innerHTML = "";

    productsInCart.forEach(function (item) {
      let li = document.createElement("li");
      li.innerHTML = `${item.quantity} ${item.product.name} - ${item.product.price * item.quantity}`;
      cartEl.appendChild(li);
    });
    let total = calculateTotalPrice();
    console.log(productsInCart.length);

    totalPriceEl.innerHTML = "Total " + "R" + Math.round(100 * total) / 100;
    generateCartButtons()
  }


  // Function that generates Empty Cart and Checkout buttons based on condition that checks if productsInCart array is empty
  function generateCartButtons() {
    if (productsInCart.length > 0) {
      emptyCartEl.style.display = "block";
      cartCheckoutEl.style.display = "block"
    } else {
      emptyCartEl.style.display = "none";
      cartCheckoutEl.style.display = "none";
    }
  }

  // Setting up listeners for click event on all products and Empty Cart button as well
  function setupListeners() {
    productsEl.addEventListener("click", function (event) {
      var el = event.target;
      if (el.classList.contains("add-to-cart")) {
        var elId = el.dataset.id;
        addToCart(elId);
      }
      if (el.classList.contains("moreInfo")) {
        var elId = el.dataset.id;
        moreInfo(elId);
      }
    });

    emptyCartEl.addEventListener("click", function (event) {
      if (confirm("Do you really want to empty your cart?")) {
        productsInCart = [];
        localStorage.setItem("productsInCart", JSON.stringify(productsInCart));

      }
      generateCartList();
    });

    cartCheckoutEl.addEventListener("click", function (event) {
      localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
      window.open("checkout.html", '_self');
    });
  }

  function moreInfo(id) {
    var dataString = JSON.stringify(products[id]);
    var dataStringBase64 = window.btoa(dataString);
    var dataStringBase64Safe = encodeURIComponent(dataStringBase64);
    var url = '/products/more/more.html?data=' + dataStringBase64Safe;


    dataString = JSON.stringify(productsInCart);
    localStorage.setItem("productsInCart", dataString);

    window.open(url, '_self');
  }

  // Adds new items or updates existing one in productsInCart array
  function addToCart(id) {
    var obj = products[id];
    if (productsInCart.length === 0 || productFound(obj.id) === undefined) {
      productsInCart.push({
        product: obj,
        quantity: 1
      });
    } else {
      productsInCart.forEach(function (item) {
        if (item.product.id === obj.id) {
          item.quantity++;
        }
      });
    }
    console.log(calculateTotalPrice()); // shows an alert 
    generateCartList();
  }

  function productFound(productId) {
    return productsInCart.find(function (item) {
      return item.product.id === productId;
    });
  }

  function calculateTotalPrice() {
    return productsInCart.reduce(function (total, item) {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  // Starting with building the list and then adding eventlisteners
  function init() {

    generateProductList();
    setupListeners();
    var tempString = localStorage.getItem("productsInCart");
    if (tempString) {

      productsInCart = JSON.parse(tempString);
      generateCartList();

    }
  }
