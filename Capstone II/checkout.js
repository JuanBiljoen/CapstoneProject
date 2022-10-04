  // Reference DOM objects
  const productsEl = document.getElementsByClassName("products")[0];
  const cartEl = document.getElementsByClassName("shopping-cart-list")[0];
  const emptyCartEl = document.getElementsByClassName("empty-cart-btn")[0];
  const cartCheckoutEl = document.getElementsByClassName("cart-checkout")[0];
  const totalPriceEl = document.getElementsByClassName("vat-class")[0];
  const totalPriceDeliveryEl = document.getElementsByClassName("delivery-total")[0];
  const totalDiscountEl = document.getElementsByClassName("discount-total")[0];
  const totalPriceAndVatEl = document.getElementsByClassName("total-class")[0];
  const promoInput = document.getElementsByClassName("form-promotion-code")[0];



  let cartTotal = 0;
  let productsInCart = [];
  let includeDelivery = false;
  let deliveryCost = 50;
  let discountAmount = .75;
  let includeDiscount = false;


  //Add products to cart
  function generateCartList() {



    cartEl.innerHTML = "";

    productsInCart.forEach(function (item) {
      var li = document.createElement("li");
      li.innerHTML = `${item.quantity} ${item.product.name} - ${item.product.price * item.quantity}`;
      cartEl.appendChild(li);
    });
    //Here delivery is hidden if it's not selected. If true added to total
    totalPriceDeliveryEl.style.visibility = includeDelivery ? "visible" : "hidden";
    let total = calculateTotalPrice();
    
    if (includeDiscount) {
      total = total * discountAmount;
      totalDiscountEl.innerHTML = `Total after discount: ${total}`;
      totalDiscountEl.style.visibility = "visible";
    } else {
      totalDiscountEl.style.visibility = "hidden";

    }
    if (includeDelivery) {
      total = total + deliveryCost;
      totalPriceDeliveryEl.innerHTML = `Total after delivery: ${total}`;
      totalPriceDeliveryEl.style.visibility = "visible";
    } else {
      totalPriceDeliveryEl.style.visibility = "hidden";
    }
    totalDiscountEl.style.visibility = includeDiscount ? "visible" : "hidden";

    console.log(productsInCart.length);
    let vat = total * 1.15 - total;
    totalPriceEl.innerHTML = "VAT: " + "R" + Math.round(100 * vat) / 100;
    totalPriceAndVatEl.innerHTML = "TOTAL (incl VAT): " + "R" + (total * 1.15);
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
        localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
        productsInCart = [];
      }
      generateCartList();
    });

    cartCheckoutEl.addEventListener("click", function (event) {
      let dataString = JSON.stringify(productsInCart);
      localStorage.setItem("productsInCart", dataString);
      let url = 'checkout.html?data=' + dataStringBase64Safe;
      window.open(url, '_self');
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
    console.log(calculateTotalPrice()); //shows an alert
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

  // Starting with the list and then adding eventlisteners
  function init() {

    var tempString = localStorage.getItem("productsInCart");
    if (tempString) {

      productsInCart = JSON.parse(tempString);
      generateCartList();

    }
  }

  let deliveryTotal = 0;

  $("#collect").change(function () {
    includeDelivery = false;
    generateCartList();
  });

  $("#delivery").change(function () {
    includeDelivery = true;
    generateCartList();
  });

  //promo code
  function submitPromoCode() {
    let promoInput = document.querySelector(".form-promotion-code").value;

    if (promoInput == "1234") {
      includeDiscount = true;
      alert("You just got a 25% discount! YAY!");
    } else {
      includeDiscount = false;
      alert("Wrong code :(");

    }
    generateCartList();
  }


  $('.card-title').click(function () {
    $(this).siblings(".card-body").slideDown();

  });


  $('.card-title').mouseleave(function () {
    $(this).siblings(".card-body").slideUp();
  });

  //generate ref number
  let referenceNumber = Math.floor(Math.random() * 100000) + 1;

  // Emptying cart
  $("#orderButton").click(function () {
    alert("Thank you for your purchase! Your reference number is: " + referenceNumber);
    $("#scooter").animate({
      "margin-left": '750px'
    }, 2000).fadeOut(1000),$(".shopping-cart2").fadeOut();

  });