const productList = document.getElementById("products");

let PRODUCTS;
let CART = [];

const cartDisplay = document.getElementById("cart");

/**
 * Click the add to cart button
 * Add the item to CART []
 * Call updateCart()
 */

function addToCart(event) {
  const buttonClicked = event.target;
  const productId = buttonClicked.dataset["product"];

  let product = PRODUCTS.find((product) => {
    return product.id == productId;
  });

  /**
   * Check the cart to see if the product already exist in CART
   * If it does, then simply increase the quantity by 1
   */

  const productIndexInCart = CART.findIndex(
    (cartProduct) => cartProduct.id === product.id
  );

  if (productIndexInCart > -1) {
    // Increment quantity
    const productInCart = CART[productIndexInCart];

    productInCart.quantity = productInCart.quantity + 1;

    CART.splice(productIndexInCart, 1, productInCart);
  } else {
    // Add product to cart
    product.quantity = 1;

    CART.push(product);
  }

  updateCart();
}

function removeFromCart(event) {
  const buttonClicked = event.target;
  const productId = buttonClicked.dataset["product"];

  const productIndexInCart = CART.findIndex(
    (cartProduct) => cartProduct.id == productId
  );

  if (productIndexInCart > -1) {
    CART.splice(productIndexInCart, 1);

    console.log("Removing from ", productIndexInCart);
  }

  updateCart();
}

function updateCart() {
  /**
   * remove the items currently displayed in cart
   * check the cart
   * add each item in cart to the display
   * compute the total amount
   */
  if (CART.length > 0) {
    let cartTotal = 0;
    let cartProducts = [];

    document.querySelector("table").classList.remove("d-none");

    cartDisplay.innerHTML = "";

    CART.forEach((product) => {
      cartProducts.push(`
        <tr>
          <td>${product.name}</td>
          <td><input type="number" min="1" step="1" value="${
            product.quantity
          }" /></td>
          <td>₦${new Intl.NumberFormat().format(
            product.price * product.quantity
          )}</td>
          <td> <button data-product="${
            product.id
          }" class="btn btn-sm btn-outline-danger btn-remove-from-cart">Remove</button>
          </td>
        </tr>`);

      // const cartListItem = document.createElement("li");
      // cartListItem.innerText = `${
      //   product.name
      // } - ₦${new Intl.NumberFormat().format(product.price)}`;

      // cartList.append(cartListItem);

      cartTotal = cartTotal + product.price * product.quantity;
    });

    cartDisplay.innerHTML = cartProducts.join("");

    // const totalAmount = document.createElement("h3");
    const totalAmount = document.getElementById("total");

    totalAmount.style.color = "#dc143e";
    totalAmount.style.padding = "0.3em 0.65em";
    totalAmount.innerText = "₦" + new Intl.NumberFormat().format(cartTotal);

    // document.getElementById("cart-total").innerText = cartTotal;

    // totalAmount.appendChild(totalAmount);
  } else {
    document.querySelector("table").classList.add("d-none");
  }

  const removeFromCartButtons = document.querySelectorAll(
    ".btn-remove-from-cart"
  );

  removeFromCartButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

async function displayProducts() {
  PRODUCTS = await fetch("../assets/data/products.json").then((data) =>
    data.json()
  );

  let products = [];

  PRODUCTS.forEach((product) => {
    let display = `
   <div class="col-12 col-md-4 product">
      <div class="content">
        <img
          src="${product.image}"
          alt=""${product.name}"
        />
        <h5 class="text-uppercase text-bold">${product.name}</h5>
        <p>${product.description}</p>
        <h3 class="price">₦${new Intl.NumberFormat().format(product.price)}</h3>
        <button data-product="${
          product.id
        }" class="btn btn-sm btn-primary btn-add-to-cart">Add to Cart</button>
      </div>
    </div>`;

    products.push(display);
  });

  productList.innerHTML = products.join("");

  const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

function alreadyInCart(id) {
  const inCart = CART.indexOf((cartProduct) => cartProduct.id == id) > -1;

  console.log(inCart);

  return inCart;
}

displayProducts();

updateCart();
