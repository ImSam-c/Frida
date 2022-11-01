signInButton = document.querySelector(".nav-signin-button");
signUpButton = document.querySelector(".nav-signup-button");

signInButton.addEventListener("click", () => {
    location.href = "../sign-in/index.html";
})

signUpButton.addEventListener("click", () => {
    location.href = "../sign-up/index.html";
})