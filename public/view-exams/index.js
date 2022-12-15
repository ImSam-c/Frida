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
    `https://frida.rettouseisama.com/api/exams?subject=${selectedSubject}&nQuestions=${selectedNQuestions}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((exams) => {
      if (exams.length === 0) {
        const noExamsTitle = d.querySelector(".no-exams");
        loader.style.display = "none";
        noExamsTitle.classList.remove("hide");
      } else {
        exams.forEach((exam) => {
          let newArticle = d.createElement("article");
          newArticle.dataset.v_id = exam._id;
          newArticle.classList.add("exam");
          newArticle.innerHTML = `
        <div class="exam-sec1">
          <h2>${exam.area} Exam</h2>
          <div class="comments-container"><p class="exam-comments">Comments: ${exam.comments}</p></div>
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
      }
    })
    .catch((err) => console.log(err));
};

const getExam = async (id) => {
  Swal.fire({
    title: "Searching exam...",
    didOpen: async () => {
      Swal.showLoading();
      const res = await fetch(
        `https://frida.rettouseisama.com/api/exams/${id}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const { exam } = await res.json();
      let questionsText = "<br><br>";

      exam.questions.forEach((question, i) => {
        questionsText += `${i + 1}. ${question.statement}<br><br>`;
      });

      Swal.fire({
        title: '<h2 style="text-align: left;">Exam details: </h2>',
        width: "900px",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Reply",
        customClass: {
          confirmButton: "confirmButton",
          cancelButton: "cancelButton",
        },
        html: `
          <h4 class="exam-info">Subject: ${exam.area}</h4><br>
          <h4 class="exam-info">Created by: ${exam.byTeacher.fullname}</h4><br>
          <h4 class="exam-info">Comments: ${exam.comments}</h4><br>
          <h4 class="exam-info">Number of questions: ${exam.nQuestions}</h4><br>
          <div style="text-align: left;">Questions: ${questionsText}</div>`,
      }).then((response) => {
        if (response.isConfirmed)
          location.replace(`../reply-exam/index.html?idExam=${id}`);
      });
    },
  });
};

document.addEventListener("DOMContentLoaded", getExams);
document.addEventListener("click", async (e) => {
  if (e.target.matches(".exam, .exam *")) {
    let id;
    if (e.target.matches(".exam *"))
      id = e.target.closest(".exam").dataset.v_id;
    else id = e.target.dataset.v_id;

    getExam(id);
  }

  if (e.target.matches(".filter")) {
    let selectedSubject = d.getElementById("select-subject").value,
      selectedNQuestions = d.getElementById("select-nquestions").value;

    if (
      !selectedNQuestions &&
      !selectedSubject &&
      !examsContainer.children.length > 2
    )
      return;

    examsContainer.innerHTML =
      '<img src="../img/loader.svg" id="loader" alt="Loader">';
    getExams();
    e.target.disabled = "true";
  }
});
