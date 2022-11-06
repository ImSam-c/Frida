const button = document.querySelector(".button");
const firstName = document.querySelector("input[name='first-name']");
const lastName = document.querySelector("input[name='last-name']");
const email = document.querySelector("input[name='email']");
const password = document.querySelector("input[name='password']");
const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    switch (e.target.name) {
      case "first-name":
        color = validateName(e.target.value) ? "green" : "red";
        e.target.style.border = "2px solid " + color;
        break;
      case "last-name":
        color = validateName(e.target.value) ? "green" : "red";
        e.target.style.border = "2px solid " + color;
        break;
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

function validateName(nameInput) {
  const nameRegex = /^[a-zA-Z]{1,50}(?: ?[a-zA-Z]){1,50}$/;
  if (nameInput.match(nameRegex)) {
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

button.addEventListener("click", () => {
  if (
    validateName(firstName.value) &&
    validateName(lastName.value) &&
    validateEmail(email.value) &&
    validatePassword(password.value)
  ) {
    //persist data temporarily between page change
    const tmpData = JSON.stringify([
      firstName.value,
      lastName.value,
      email.value,
      password.value,
    ]);
    sessionStorage.setItem("tmpReg", tmpData);
    Swal.fire({
      title: "Perfect!",
      html: `<p class="modal-font">Now, let's see if you are a student or not.</p>`,
      confirmButtonText:
        '<a class="modal-sign-up" href="../choose-grade/index.html">Next →</a> ',
      confirmButtonColor: "var(--btn-color)",
      customClass: {
        title: "modal-font",
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
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
