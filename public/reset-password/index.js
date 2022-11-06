const button = document.querySelector(".button");
const newPassword = document.querySelector("input[name='new-password']");
const verifyPassword = document.querySelector("input[name='verify-password']");
const inputs = document.querySelectorAll("input");
const [, jwtToken] = new URLSearchParams(location.search).toString().split("=");

if (!jwtToken) location.replace("../home/index.html");

const base64Url = jwtToken.split(".")[1];
const base64 = base64Url.replace("-", "+").replace("_", "/");
const token = JSON.parse(window.atob(base64));

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

async function sendData(password) {
  const response = await fetch(
    `http://localhost:5000/api/users/updateUser/${token.id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        password,
      }),
    }
  );

  /*
  Tipos de errores:
    ic: Incorrect Credentials - Credenciales incorrectas.
    userdx: User doesn't exist - No existe un usuario con estas credenciales.
    it: Invalid token - El token es inválido, comprobar caducidad.
*/
  console.log(response);
  response
    .json()
    .then((data) => {
      if (data.msg) throw data;
      Swal.fire({
        title: "Nice!",
        icon: "success",
        html: `<p class="modal-font">Password reset.</p>`,
        confirmButtonText:
          '<a class="modal-sign-up" href="../sign-in/index.html">Ok!</a> ',
        confirmButtonColor: "var(--btn-color)",
        customClass: {
          title: "modal-font",
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    })
    .catch((error) => {
      switch (error.id) {
        case "userdx":
          Swal.fire({
            title: "This user doesn't exist",
            html: "<p class='modal-font'>Please verify your email address.</p>",
            icon: "error",
            customClass: {
              title: "modal-font",
            },
            confirmButtonColor: "var(--incorrect-color)",
          });
          break;

        case "it":
          Swal.fire({
            title: "The secret key expired. Please use another.",
            icon: "error",
            customClass: {
              title: "modal-font",
            },
          });
          break;

        default:
          Swal.fire({
            title: "Something went wrong, try again.",
            icon: "error",
            customClass: {
              title: "modal-font",
            },
          });
          break;
      }
      console.log(error);
    });
}

function verifyPasswords(firstPassword, secondPassword) {
  if (firstPassword === secondPassword) {
    return true;
  } else {
    return false;
  }
}

button.addEventListener("click", () => {
  if (
    validatePassword(newPassword.value) &&
    validatePassword(verifyPassword.value) &&
    verifyPasswords(newPassword.value, verifyPassword.value)
  ) {
    sendData(newPassword.value, token);
  } else {
    Swal.fire({
      title: "Hey!",
      html: `<p class="modal-font">Passwords aren't the same. Please correct the fields.</p>`,
      icon: "error",
      customClass: {
        title: "modal-font",
      },
      confirmButtonColor: "var(--incorrect-color)",
    });
  }
});
