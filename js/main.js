// day1
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
    console.log("Authorized");

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
        localStorage.setItem("gloDelivery", login);

        if (login.trim()) {
            // removes spaces
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

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
// work with restaurant cards

checkAuth();
