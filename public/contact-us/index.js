const button = document.querySelector(".button");
const username = document.querySelector("input[name='name']");
const email = document.querySelector("input[name='email']");
const message = document.getElementById("message");
const inputs = document.querySelectorAll("input");

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
    //some alert like sweetAlert2
  }
});
