"use strict";
// GET ITEMS DOM
const cartButton = document.getElementById("cart-button");
const modal = document.querySelector(".modal");
const closed = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.getElementById("logInForm");
const logInInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');
const cartText = document.querySelector('.cart-text');

let login = localStorage.getItem("gloDelivery");

let cart = [];
cart = JSON.parse(localStorage.getItem('cartStorage'));
if (!cart) {
    cart = [];
}

const getData = async function (url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error in ${url},
    status ${response.status}!`);
    }
    return await response.json();
};

const validLogin = function (str) {
    // Username (with a restriction of 2-20 characters, which can be letters and numbers, the first character is necessarily a letter)
    const nameRegex = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return nameRegex.test(str);
};

const validPassword = function (str) {
    //Password: (at least 1 numeric character)
    const passwordRegex = /(?=.*[0-9])/
    return passwordRegex.test(str);
}

function toggleModal() {
    modal.classList.toggle("is-open");
}

function toggleModalAuth() {
    logInInput.style.borderColor = "";
    passwordInput.style.borderColor = '';
    modalAuth.classList.toggle("is-open");
}

// Authorized
function authorized() {
    function logOut() {
        login = null;
        localStorage.removeItem("gloDelivery");
        // remove items from the cart
        cart.length = 0;
        renderCart();
        localStorage.removeItem('cartStorage');

        buttonAuth.style.display = "";
        userName.style.display = "";
        buttonOut.style.display = "";
        logInInput.placeholder = '';
        passwordInput.placeholder = "";

        buttonOut.removeEventListener("click", logOut);
        checkAuth();

        // if the user logs out on a different page he'll be brought to a Home Page
        containerPromo.classList.remove("hide");
        restaurants.classList.remove("hide");
        menu.classList.add("hide");
        cartButton.style.display = '';

    }
    // console.log("Authorized");

    userName.textContent = login;

    // take away and display new buttons
    buttonAuth.style.display = "none";
    userName.style.display = "inline";
    buttonOut.style.display = "flex";
    cartButton.style.display = 'flex';


    buttonOut.addEventListener("click", logOut);
}

// NOT AUTHORIZED
function notAuthorized() {
    console.log("Not authorized");

    function logIn(event) {
        event.preventDefault();

        login = logInInput.value;
        localStorage.setItem("gloDelivery", login); // add user to local storage

        updateTotalItemCart();
        renderCart();

        if (validLogin(login) && validPassword(passwordInput.value)) {
            // trim() removes spaces
            toggleModalAuth();
            buttonAuth.removeEventListener("click", toggleModalAuth);
            closeAuth.removeEventListener("click", toggleModalAuth);
            logInForm.removeEventListener("submit", logIn);
            logInForm.reset(); // reset the form
            checkAuth();

        }
        else {
            logInInput.value = '';
            passwordInput.value = "";
            logInInput.placeholder = "start with a letter";
            passwordInput.placeholder = "at least 1 number";
            logInInput.style.borderColor = "red";
            passwordInput.style.borderColor = 'red';
        }

    }

    buttonAuth.addEventListener("click", toggleModalAuth);
    closeAuth.addEventListener("click", toggleModalAuth);
    logInForm.addEventListener("submit", logIn);
}

function checkAuth() { login ? authorized() : notAuthorized(); }

// create Cards for Restaurants
function createCardRestaurant(restaurant) {
    //destructuring
    const {
        image,
        kitchen,
        name,
        price,
        products,
        stars,
        time_of_delivery: timeOfDelivery, // change name
    } = restaurant;

    const card = document.createElement('a')
    card.className = 'card card-restaurant';
    card.products = products;
    card.info = [name, price, stars, kitchen];

    card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="${name}" class="card-image"/>
    <div class="card-text">
        <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} min</span>
        </div>
        <div class="card-info">
            <div class="rating">
                ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
        </div>
    </div>
</a>
    `);

    cardsRestaurants.insertAdjacentElement("beforeend", card);
}

// Crete Cards for Items
function createCardGood({ description, image, name, price, id }) {

    const card = document.createElement("div");
    card.className = "card";

    card.insertAdjacentHTML(
        "beforeend",
        `
    <img src="${image}" alt="${name}" class="card-image"/>
    <div class="card-text">
        <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
            <div class="ingredients">${description}
            </div>
        </div>
        <div class="card-buttons">
            <button class="button button-primary button-add-cart" id = "${id}">
                <span class="button-card-text">Add to Cart</span>
                <span class="button-cart-svg cart-icon"></span>
            </button>
            <strong class="card-price card-price-bold">${price} ₽</strong>
        </div>
    </div>
</div>
    `
    );

    cardsMenu.insertAdjacentElement("beforeend", card);
}

// open Restaurant's menu
function openGoods(event) {

    const target = event.target;

    const restaurant = target.closest(".card-restaurant"); // go to this parent element

    if (restaurant) {

        if (login) {

            const [name, price, stars, kitchen] = restaurant.info;

            cardsMenu.textContent = "";
            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");

            restaurantTitle.textContent = name;
            rating.textContent = stars;
            minPrice.textContent = `From ${price} ₽`;
            category.textContent = kitchen;

            getData(`./db/${restaurant.products}`)
                .then(data => data.forEach(createCardGood));
        } else {
            toggleModalAuth();
        }
    }
}

function returnMain() {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
}

function updateTotalItemCart() {
    const totalItemsCart = cart.reduce(function (result, item) {
        return result + item.count;
    }, 0);
    cartText.textContent = `Cart (${totalItemsCart})`
}

function addToCart(event) {

    const target = event.target;
    // localStorage.setItem('cartStorage', JSON.stringify(cart));

    // get the right click
    const buttonAddToCart = target.closest('.button-add-cart');

    if (buttonAddToCart) {
        // get the card name and cost
        const card = target.closest('.card');
        const title = card.querySelector('.card-title-reg').textContent;
        const cost = card.querySelector('.card-price').textContent;
        const id = buttonAddToCart.id;

        // check if same item is already present into array
        const food = cart.find(item => item.id === id);

        // if present increase a count
        if (food) {
            food.count += 1;
        } else {
            // push to our cart array a new object
            cart.push({ id, title, cost, count: 1 });
        }
        localStorage.setItem('cartStorage', JSON.stringify(cart));
        updateTotalItemCart();
        // Change added element cart color
        const buttonCartIcon = buttonAddToCart.querySelector('.cart-icon');
        buttonCartIcon.style.backgroundColor = '#1890ff';
        setTimeout(function () { buttonCartIcon.style.backgroundColor = '' }, 500);
    }

}



// const buttonCartIcon = document.querySelector('.cart-icon');

// buttonCartIcon.style.backgroundColor = '#1890ff';
// setTimeout(function () { buttonCartIcon.style.backgroundColor = '' }, 1000);


function renderCart() {
    // empty the Cart
    modalBody.textContent = '';
    // create new items in a the Cart
    cart.forEach(function ({ id, title, cost, count }) {
        const itemCart = `
           <div class="food-row">
                <span class="food-name">${title}</span>
                <strong class="food-price">${cost}</strong>
                 <div class="food-counter">
                <button class="counter-button counter-minus" data-id =${id}>-</button>
                <span class="counter">${count}</span>
                <button class="counter-button counter-plus" data-id =${id}>+</button>
        </div>
    </div>
        `;

        modalBody.insertAdjacentHTML('afterbegin', itemCart);
    });

    // calculate the total price in the cart
    const totalPrice = cart.reduce(function (result, item) {
        return result + (parseFloat(item.cost) * item.count);
    }, 0);

    // display total price on UI
    modalPrice.textContent = totalPrice + ' ₽';
    updateTotalItemCart();
}

// change the count by using + and - in the Cart
function changeCount(event) {
    const target = event.target;
    // check if target has a certain class 
    if (target.classList.contains('counter-button')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        if (target.classList.contains('counter-minus')) {
            food.count--;
            if (food.count === 0) {
                cart.splice(cart.indexOf(food), 1);
            }
        }

        if (target.classList.contains('counter-plus')) food.count++;
        localStorage.setItem('cartStorage', JSON.stringify(cart));

        renderCart();
    }
}

function init() {
    getData("./db/partners.json").then(data => {
        data.forEach(createCardRestaurant);
    });

    updateTotalItemCart();
    // clear the Cart
    buttonClearCart.addEventListener('click', () => {
        cart.length = 0;
        renderCart();
        localStorage.removeItem('cartStorage');
    })

    logo.addEventListener("click", returnMain);

    // Change count in the Cart
    modalBody.addEventListener('click', changeCount);

    cardsRestaurants.addEventListener("click", openGoods);

    // add click to the Cart
    cartButton.addEventListener("click", renderCart);
    cartButton.addEventListener("click", toggleModal);

    // work with restaurant cards
    closed.addEventListener("click", toggleModal);

    // work with the Cart
    cardsMenu.addEventListener('click', addToCart);

    // Add Search by Name and Restaurant
    inputSearch.addEventListener('keydown', event => {

        if (event.keyCode === 13) {
            const target = event.target;
            const value = target.value.toLowerCase().trim();
            target.value = '';

            if (!value || value.length < 4) {
                target.style.backgroundColor = 'pink';
                setTimeout(function () {
                    target.style.backgroundColor = '';
                }, 2000);
                return;
            }

            const goods = [];

            getData("./db/partners.json")
                .then(function (data) {
                    const products = data.map(item => item.products);

                    products.forEach(function (product) {
                        getData(`./db/${product}`)
                            .then(function (data) {
                                goods.push(...data);

                                const searchGoods = goods
                                    .filter(item => {
                                        return item.name.toLowerCase().includes(value);
                                    });

                                cardsMenu.textContent = "";
                                containerPromo.classList.add("hide");
                                restaurants.classList.add("hide");
                                menu.classList.remove("hide");

                                restaurantTitle.textContent = 'Результат поиска';
                                rating.textContent = '';
                                minPrice.textContent = '';
                                category.textContent = '';

                                return searchGoods;
                            })
                            .then(data => data.forEach(createCardGood));
                    });

                })

        };
    });

    checkAuth();

    let swiper = new Swiper(".swiper-container", {
        loop: true,
        autoplay: true,
        speed: 400,
    });
};

init();