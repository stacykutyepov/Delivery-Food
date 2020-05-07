"use strict";
// GET ITEMS DOM
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const closed = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const logInInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("gloDelivery");

// ^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$

// modalAuth.classList.add("hello");
// console.log(modalAuth.classList.contains('hello'));
// modalAuth.classList.remove('modal-auth');

const getData = async function (url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error in ${url},
    status ${response.status}!`);
    }
    return await response.json();
};

const valid = function (str) {
    const nameRegex = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return nameRegex.test(str);
};

function toggleModal() {
    modal.classList.toggle("is-open");
}

function toggleModalAuth() {
    logInInput.style.borderColor = "";
    modalAuth.classList.toggle("is-open");
}
/* ****************************************************** */
// Authorized
function authorized() {
    function logOut() {
        login = null;
        localStorage.removeItem("gloDelivery");
        buttonAuth.style.display = "";
        userName.style.display = "";
        buttonOut.style.display = "";
        buttonOut.removeEventListener("click", logOut);
        checkAuth();
    }
    // console.log("Authorized");

    userName.textContent = login;

    // take away and display new buttons
    buttonAuth.style.display = "none";
    userName.style.display = "inline";
    buttonOut.style.display = "block";

    buttonOut.addEventListener("click", logOut);
}

/* ****************************************************** */
// NOT AUTHORIZED
function notAuthorized() {
    console.log("Not authorized");

    function logIn(event) {
        event.preventDefault();

        login = logInInput.value;
        localStorage.setItem("gloDelivery", login); // add user to local storage

        if (valid(login)) {
            // trim() removes spaces
            toggleModalAuth();
            buttonAuth.removeEventListener("click", toggleModalAuth);
            closeAuth.removeEventListener("click", toggleModalAuth);
            logInForm.removeEventListener("submit", logIn);
            logInForm.reset(); // reset the form
            checkAuth();
        } else {
            logInInput.style.borderColor = "red";
        }
    }

    buttonAuth.addEventListener("click", toggleModalAuth);
    closeAuth.addEventListener("click", toggleModalAuth);
    logInForm.addEventListener("submit", logIn);
}

function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
}

// create Cards for Restaurants
function createCardRestaurant(restaurant) {
    console.log(restaurant);
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

    const card = `
    <a class="card card-restaurant" data-products = "${products}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
        <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} min</span>
        </div>
        <div class="card-info">
            <div class="rating">
                ${stars}
            </div>
            <div class="price">From ${price} Rub</div>
            <div class="category">${kitchen}</div>
        </div>
    </div>
</a>
    `;


    

    cardsRestaurants.insertAdjacentHTML("beforeend", card);
}
// Crete Cards for Items
function createCardGood({ description, image, name, price }) {
    console.log(description, image, name, price);

    const card = document.createElement("div");
    card.className = "card";

    card.insertAdjacentHTML(
        "beforeend",
        `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
        <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
            <div class="ingredients">${description}
            </div>
        </div>
        <div class="card-buttons">
            <button class="button button-primary button-add-cart">
                <span class="button-card-text">В корзину</span>
                <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">${price} ₽</strong>
        </div>
    </div>
</div>
    `
    );

    cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
    const target = event.target;

    const restaurant = target.closest(".card-restaurant"); // go to this parent element
    if (restaurant) {
        if (login) {
            cardsMenu.textContent = "";
            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");
            getData(`./db/${restaurant.dataset.products}`).then(function (
                data
            ) {
                data.forEach(createCardGood);
            });
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

function init() {
    getData("./db/partners.json").then(function (data) {
        data.forEach(createCardRestaurant);
    });

    logo.addEventListener("click", returnMain);

    cardsRestaurants.addEventListener("click", openGoods);

    cartButton.addEventListener("click", toggleModal);
    closed.addEventListener("click", toggleModal);
    // work with restaurant cards

    checkAuth();

    let swiper = new Swiper(".swiper-container", {
        loop: true,
        autoplay: true,
        speed: 400,
    });
}
init();
