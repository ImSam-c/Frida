const TEACHER_IMAGE =
  "https://apicms.thestar.com.my/uploads/images/2022/05/15/1585587.jpg";
const STUDENT_IMAGE =
  "https://assets-homepages-learning.3plearning.net/wp-content/uploads/2020/06/blog-20-student-engagement-strategies-captivating-classroom.png";

const studentRadio = document.getElementById("student");
const teacherRadio = document.getElementById("teacher");
const image = document.querySelector(".image");
const subjectContainer = document.querySelector(".subject-container");
const comboBox = document.getElementById("subject-select");
const button = document.querySelector(".button");
let chkboxSelection;

if (!sessionStorage.getItem("tmpReg")) {
  location.replace("../sign-up/index.html");
}

studentRadio.addEventListener("change", () => {
  image.style.backgroundImage = `url(${STUDENT_IMAGE})`;
  subjectContainer.style.display = "none";
  comboBox.value = null;
});

teacherRadio.addEventListener("change", () => {
  image.style.backgroundImage = `url(${TEACHER_IMAGE})`;
  subjectContainer.style.display = "block";
});

async function sendData(name, lastname, email, password, area) {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      lastname,
      email,
      password,
      area,
    }),
  });

  response
    .json()
    .then(() => {
      Swal.fire({
        title: "Nice!",
        icon: "success",
        html: `<p class="modal-font">Successfully registered.</p>`,
        confirmButtonText:
          '<a class="modal-sign-up" href="../home/index.html">Ok!</a> ',
        confirmButtonColor: "var(--btn-color)",
        customClass: {
          title: "modal-font",
        },
      });
      sessionStorage.removeItem("tmpReg");
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
  const area = comboBox.value;
  const tmpReg = JSON.parse(sessionStorage.getItem("tmpReg"));
  sendData(...tmpReg, area);
});
