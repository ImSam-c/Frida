const button = document.querySelector(".button");
const newPassword = document.querySelector("input[name='new-password']");
const verifyPassword = document.querySelector("input[name='verify-password']");
const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    color = validatePassword(e.target.value) ? "green" : "red";
    e.target.style.border = "2px solid " + color;
  });
});

function validatePassword(passwordInput) {
  const passwordRegex =
    /[0-9a-zA-Z~`!@#$%^&*()\-+={}[\]|\:;"'<>\\,.?\/ _]{6,50}/;
  if (passwordInput.match(passwordRegex)) {
    return true;
  } else {
    return false;
  }
}

async function sendData(password, jwt) {
  // todo: recive jwt and confirm auth header name.
  const response = await fetch("http://localhost:5000/api/users/updateUser", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Auth": jwt
    },
    body: JSON.stringify({
      password
    }),
  });

  response
    .json()
    .then(() => {
      alert("Password successfully reset.")
      location.redirect("../sign-in/index.html");
    })
    .catch((error) => {
      alert("Something went wrong, try again.");
      console.log(error);
    });
}

function verifyPasswords(firstPassword, secondPassword){
  if(firstPassword === secondPassword){
      return true;
  } else{
      alert("Passwords don't match.");
      return false;
  }
}

button.addEventListener("click", () => {
  if (validatePassword(newPassword.value) &&
      validatePassword(verifyPassword.value) &&
      verifyPasswords(newPassword.value, verifyPassword.value)){
        // still working in sendData function
        // sendData(newPassword.value, e8tg35k353l1example);
        console.log("Reset password");
  } else {
      //some alert like sweetAlert2
  }
});
