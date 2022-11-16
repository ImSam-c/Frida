import { checkJwtInCookies } from "../helpers/jwtFunctions.js";

//HTML
const d = document,
  examsContainer = d.getElementById("exams"),
  fragment = d.createDocumentFragment(),
  button = d.querySelector(".filter"),
  jwtToken = checkJwtInCookies();

if (!jwtToken) location.replace("../sign-in/");

const getExams = () => {
  let selectedSubject = d.getElementById("select-subject").value,
    selectedNQuestions = d.getElementById("select-nquestions").value,
    loader = d.getElementById("loader");

  fetch(
    `http://localhost:8080/api/exams?subject=${selectedSubject}&nQuestions=${selectedNQuestions}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((exams) => {
      exams.forEach((exam) => {
        let newArticle = d.createElement("article");
        newArticle.classList.add("exam");
        newArticle.innerHTML = `
        <div class="exam-sec1">
          <h2>${exam.area} Exam</h2>
          <p class="exam-comments">Comments: ${exam.comments}</p>
          <p>Questions: ${exam.questions.length}</p>
        </div>
        <div class="exam-sec2">
          <h3 class="exam-madeby">Made by:<br>${exam.byTeacher.fullname}</h3>
        </div>`;
        fragment.append(newArticle);
      });
      loader.style.display = "none";
      examsContainer.append(fragment);
      button.removeAttribute("disabled");
    })
    .catch((err) => console.log(err));
};

document.addEventListener("DOMContentLoaded", getExams);
document.addEventListener("click", (e) => {
  if (e.target.matches(".exam")) {
    //TODO: Redirect to full page exam
  }

  if (e.target.matches(".button")) {
    examsContainer.innerHTML =
      '<img src="../img/loader.svg" id="loader" alt="Loader">';
    getExams();
    e.target.disabled = "true";
  }
});
