const button = document.querySelector(".button");
const email = document.querySelector("input[name='email']");

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

async function sendData(email) {
  // fetch url may change.
  const response = await fetch(
    "https://frida-tm.vercel.app/api/users/recoverPassword",
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  response
    .json()
    .then(() => {
      Swal.close();
      Swal.fire({
        title: "Nice!",
        icon: "success",
        html: `<p class="modal-font">Recovery email link sent. Check your inbox and spam.</p>`,
        confirmButtonText: '<a class="modal-sign-up" href="../">Ok!</a> ',
        confirmButtonColor: "var(--btn-color)",
        customClass: {
          title: "modal-font",
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Something went wrong, try again.",
        icon: "error",
        customClass: {
          title: "model-font",
        },
      });
      console.log(error);
    });
}

button.addEventListener("click", () => {
  if (validateEmail(email.value)) {
    Swal.fire({
      icon: "info",
      title: "Sending mail",
      customClass: {
        title: "modal-font",
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });
    sendData(email.value);
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
