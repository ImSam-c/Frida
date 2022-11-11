const button = document.querySelector(".button");
const username = document.querySelector("input[name='name']");
const email = document.querySelector("input[name='email']");
const message = document.getElementById("message");
const inputs = document.querySelectorAll("input");
const toggleElements = document.querySelectorAll(".toggle-log");
const quickAccess = document.querySelector(".quick-access-logo");
const littleNavbar = document.querySelector(".little-navbar");


email.addEventListener("change", (e) => {
  color = validateEmail(e.target.value) ? "green" : "red";
  e.target.style.border = "2px solid " + color;
});

function validateEmail(emailInput) {
  const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailInput.match(mailRegex)) {
    return true;
  } else {
    return false;
  }
}

button.addEventListener("click", () => {
  if (validateEmail(email.value)) {
    const email = "noreply.frida@gmail.com";
    location.href = "mailto:" + email + "?body=" + message.value;
  } else {
    Swal.fire({
      title: "Hey!",
      html: '<p class="modal-font">Please correct the fields.</p>',
      icon: "error",
      customClass: {
        title: "modal-font",
      },
      confirmButtonColor: "var(--incorrect-color)",
    });
  }
});

quickAccess.addEventListener("mouseenter", () => {
  littleNavbar.style.transform = "translateX(0)";
});

document.body.addEventListener("click", e => {
  if (e.target.className !== "quick-access-logo"){
    littleNavbar.style.transform = "translateX(100vw)";
  }
});

function isLoggedIn() {
  if (localStorage.getItem("XSRF-TOKEN")){
      toggleElements.forEach(element => {
          element.parentElement.classList.toggle("hide");
      });
  }
}

document.addEventListener("DOMContentLoaded", isLoggedIn);