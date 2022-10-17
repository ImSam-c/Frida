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
    "http://localhost:5000/api/users/recoverPassword",
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
      alert("Recovery email link sent. Check your inbox.");
    })
    .catch((error) => {
      alert("Something went wrong, try again.");
      console.log(error);
    });
}

button.addEventListener("click", () => {
  if (validateEmail(email.value)) {
    sendData(email.value);
    console.log("Send password reset email");
  } else {
    //some alert like sweetAlert2
  }
});
