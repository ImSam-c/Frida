const teacherImage =
  "https://apicms.thestar.com.my/uploads/images/2022/05/15/1585587.jpg";
const studentImage =
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

studentRadio.addEventListener("change", (e) => {
  image.style.backgroundImage = `url(${studentImage})`;
  subjectContainer.style.display = "none";
  comboBox.value = null;
});


teacherRadio.addEventListener("change", (e) => {
  image.style.backgroundImage = `url(${teacherImage})`;
  subjectContainer.style.display = "block";
  comboBox.value = "Geography";
});

async function sendData(name, lastname, email, password, area) {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: `{
      "name": ${name},
      "lastname": ${lastname},
      "email": ${email},
      "password": ${password},
      "area": ${area}
      }`,
  });

  response.json()
    .then(data => {
      alert("Registered successfully");
      sessionStorage.removeItem("tmpReg");
      // redirect to main page
    }).catch(error => {
      alert("Something went wrong, try again.");
    });
}

button.addEventListener("click", e => {
  const area = comboBox.value;
  const tmpReg = JSON.parse(sessionStorage.getItem("tmpReg"));
  sendData(...tmpReg, area);
});