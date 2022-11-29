import { checkJwtInCookies } from "./helpers/jwtFunctions.js";
import { getPayloadJwt } from "./helpers/jwtFunctions.js";

const toggleElements = document.querySelectorAll(".toggle-log");
var mobileNav = document.querySelector(".mobile-nav");
var backdrop = document.querySelector(".backdrop");

document.addEventListener("click", event => {
  if(event.target.matches(".nav-signin-button")){
    location.href = "../sign-in/index.html";
  }
  if(event.target.matches(".nav-signup-button")){
    location.href = "../sign-up/index.html";
  }
  if(event.target.matches(".nav-signout-button")){
    document.cookie = `XSRF-TOKEN=nt;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    location.replace("../");
  }
  if(event.target.matches(".toggle-button")){
    mobileNav.classList.add("open");
    backdrop.style.display = "block";
    setTimeout(function () {
      backdrop.classList.add("open");
    }, 10);
  }
  if(event.target.matches(".backdrop")){
    mobileNav.classList.remove("open");
    backdrop.classList.remove("open");
    setTimeout(function () {
      backdrop.style.display = "none";
    }, 200);
  }
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