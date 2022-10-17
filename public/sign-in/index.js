const button = document.querySelector(".button");
const email = document.querySelector("input[name='email']");
const password = document.querySelector("input[name='password']");
const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    switch (e.target.name) {
      case "email":
        color = validateEmail(e.target.value) ? "green" : "red";
        e.target.style.border = "2px solid " + color;
        break;
      case "password":
        color = validatePassword(e.target.value) ? "green" : "red";
        e.target.style.border = "2px solid " + color;
        break;
      default:
        break;
    }
  });
});

function validateEmail(emailInput) {
  const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailInput.match(mailRegex)) {
    return true;
  } else {
    return false;
  }
}

function validatePassword(passwordInput) {
  const passwordRegex =
    /[0-9a-zA-Z~`!@#$%^&*()\-+={}[\]|\:;"'<>\\,.?\/ _]{6,50}/;
  if (passwordInput.match(passwordRegex)) {
    return true;
  } else {
    return false;
  }
}

async function sendData(email, password) {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  response
    .json()
    .then(() => {
      location.replace("../home/index.html");
    })
    .catch((error) => {
      alert("Something went wrong, try again.");
      console.log(error);
    });
}

button.addEventListener("click", () => {
  if (
    validateEmail(email.value) &&
    validatePassword(password.value)
  ) {
    sendData(email.value, password.value);
  } else {
    //some alert like sweetAlert2
  }
});
