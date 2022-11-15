const button = document.querySelector(".button");
const email = document.querySelector("input[name='email']");
const message = document.getElementById("message");


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
