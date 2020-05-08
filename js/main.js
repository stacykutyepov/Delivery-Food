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

/* ****************************************************** */
// Authorized
function authorized() {
    function logOut() {
        login = null;

        localStorage.removeItem("gloDelivery");
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

        console.log(passwordInput.value)

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

function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
}

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
function createCardGood({ description, image, name, price }) {

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
            <button class="button button-primary button-add-cart">
                <span class="button-card-text">Add to Cart</span>
                <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">${price} ₽</strong>
        </div>
    </div>
</div>
    `
    );

    cardsMenu.insertAdjacentElement("beforeend", card);
    // document.getElementsByClassName('restaurant-title')[0].innerHTML = restaurant.name;

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

            getData(`./db/${restaurant.products}`).then(function (
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

    // Add Search by Name and Restaurant
    inputSearch.addEventListener('keydown', function (event) {
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
                    const products = data.map(function (item) {
                        return item.products;
                    })

                    products.forEach(function (product) {
                        getData(`./db/${product}`)
                            .then(function (data) {
                                goods.push(...data);

                                const searchGoods = goods.filter(function (item) {
                                    return item.name.toLowerCase().includes(value);
                                })

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
                            .then(function (data) {
                                data.forEach(createCardGood);
                            })
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
}

init();
