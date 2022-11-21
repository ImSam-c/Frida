import { checkJwtInCookies } from "./helpers/jwtFunctions.js";
import { getPayloadJwt } from "./helpers/jwtFunctions.js";

const signInButtons = document.querySelectorAll(".nav-signin-button");
const signUpButtons = document.querySelectorAll(".nav-signup-button");
const signOutButtons = document.querySelectorAll(".nav-signout-button");
const toggleElements = document.querySelectorAll(".toggle-log");
var toggleButton = document.querySelector(".toggle-button");
var mobileNav = document.querySelector(".mobile-nav");
var backdrop = document.querySelector(".backdrop");

signInButtons.forEach((signInButton) => {
  signInButton.addEventListener("click", () => {
    location.href = "../sign-in/index.html";
  });
});

signUpButtons.forEach((signUpButton) => {
  signUpButton.addEventListener("click", () => {
    location.href = "../sign-up/index.html";
  });
});

signOutButtons.forEach((signOutButton) => {
  signOutButton.addEventListener("click", () => {
    document.cookie = `XSRF-TOKEN=nt;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    location.replace("../");
  });
});

toggleButton.addEventListener("click", function () {
  mobileNav.classList.add("open");
  backdrop.style.display = "block";
  setTimeout(function () {
    backdrop.classList.add("open");
  }, 10);
});

backdrop.addEventListener("click", function () {
  mobileNav.classList.remove("open");
  backdrop.classList.remove("open");
  setTimeout(function () {
    backdrop.style.display = "none";
  }, 200);
});

function isLoggedIn() {
  if (checkJwtInCookies()) {
    const payload = getPayloadJwt(checkJwtInCookies());
    toggleElements.forEach((element) => {
      element.parentElement.classList.toggle("hide");
      if (!payload.area && element.classList.contains("tch")) {
        element.parentElement.classList.toggle("hide");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", isLoggedIn);
