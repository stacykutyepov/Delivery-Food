"use strict";
// GET ITEMS DOM
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
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

// modalAuth.classList.add("hello");
// console.log(modalAuth.classList.contains('hello'));
// modalAuth.classList.remove('modal-auth');

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

        if (login.trim()) {
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
function createCardRestaurant() {
    const card = `
    <a class="card card-restaurant">
    <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
    <div class="card-text">
        <div class="card-heading">
            <h3 class="card-title">Пицца плюс</h3>
            <span class="card-tag tag">50 мин</span>
        </div>
        <div class="card-info">
            <div class="rating">
                4.5
            </div>
            <div class="price">От 900 ₽</div>
            <div class="category">Пицца</div>
        </div>
    </div>
</a>
    `;

    cardsRestaurants.insertAdjacentHTML("beforeend", card);
}
// Crete Cards for Items
function createCardGood() {
    const card = document.createElement("div");
    card.className = "card";

    card.insertAdjacentHTML(
        "beforeend",
        `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
    <div class="card-text">
        <div class="card-heading">
            <h3 class="card-title card-title-reg">Пицца Классика</h3>
        </div>
        <div class="card-info">
            <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
                грибы.
            </div>
        </div>
        <div class="card-buttons">
            <button class="button button-primary button-add-cart">
                <span class="button-card-text">В корзину</span>
                <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">510 ₽</strong>
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

        if(login){
            cardsMenu.textContent = "";
            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");
            createCardGood();
            createCardGood();
            createCardGood();
        }else {
            toggleModalAuth();
        }

    }
}

logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
});


cardsRestaurants.addEventListener("click", openGoods);


cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
// work with restaurant cards


checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

