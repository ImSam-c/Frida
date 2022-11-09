const signInButtons = document.querySelectorAll(".nav-signin-button");
const signUpButtons = document.querySelectorAll(".nav-signup-button");
const signOutButtons = document.querySelectorAll(".nav-signout-button");
var toggleButton = document.querySelector(".toggle-button");
var mobileNav = document.querySelector(".mobile-nav");
var backdrop = document.querySelector(".backdrop");


signInButtons.forEach(signInButton => {
    signInButton.addEventListener("click", () => {
        location.href = "../sign-in/index.html";
    });
});

signUpButtons.forEach(signUpButton =>{
    signUpButton.addEventListener("click", () => {
        location.href = "../sign-up/index.html";
    });
});


signOutButtons.forEach(signOutButton =>{
    signOutButton.addEventListener("click", () => {
        localStorage.removeItem("XSRF-TOKEN");
        location.replace("../home/index.html");
    });
});

toggleButton.addEventListener("click", function() {
    mobileNav.classList.add("open");
    backdrop.style.display = "block";
    setTimeout(function() {
      backdrop.classList.add("open");
    }, 10);
});

backdrop.addEventListener("click", function() {
    mobileNav.classList.remove("open");
    backdrop.classList.remove("open");
    setTimeout(function() {
        backdrop.style.display = "none";
    }, 200);
});

function isLoggedIn() {
    if (localStorage.getItem("XSRF-TOKEN")){
        signInButtons.forEach(signInButton => {
            signInButton.parentElement.classList.toggle("hide");
        });
        
        signUpButtons.forEach(signUpButton =>{
            signUpButton.parentElement.classList.toggle("hide");
        });
        
        signOutButtons.forEach(signOutButton =>{
            signOutButton.parentElement.classList.toggle("hide");
        });
    }
}
  
document.addEventListener("DOMContentLoaded", isLoggedIn);