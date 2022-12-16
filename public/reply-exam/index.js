import { checkJwtInCookies } from "../helpers/jwtFunctions.js";

const d = document,
  jwtInCookies = checkJwtInCookies(),
  idExam = new URLSearchParams(location.search).get("idExam"),
  examContainer = d.getElementById("exam-container");

if (!jwtInCookies) location.replace("../sign-in/");

let questions = "";

let exam;

const appearQuestions = async () => {
  exam = await (
    await fetch(`frida.up.railway.app/api/exams/${idExam}`, {
      method: "GET",
      headers: {
        authorization: "Bearer " + jwtInCookies,
      },
    })
  ).json();
  const questionsContainer = d.createElement("section");

  exam.exam.questions.forEach(({ statement, options }, i) => {
    questions += `<article class="question" id='qt${i + 1}'>${
      i + 1
    }. ${statement}<br><br>
      <label>
        <input type="radio" value="${options[0]}" name="answerQ${i + 1}">${
      options[0]
    }<br>
      </label>
      <label>
        <input type="radio" value="${options[1]}" name="answerQ${i + 1}">${
      options[1]
    }<br>
      </label>
      <label>
        <input type="radio" value="${options[2]}" name="answerQ${i + 1}">${
      options[2]
    }<br>
      </label>
      <label>
        <input type="radio" value="${options[3]}" name="answerQ${i + 1}">${
      options[3]
    }</label></article>`;
  });
  questionsContainer.innerHTML = questions;
  const sendButton = '<button type="button" class="sendButton">Send</button>';
  examContainer.append(questionsContainer);
  examContainer.innerHTML += sendButton;
};

const sendAnswersAndShowResult = async () => {
  let answers = [];
  d.querySelectorAll("input[type=radio]:checked").forEach(({ value }) => {
    answers.push(value);
  });

  const examQuestions = d.querySelectorAll(".question");

  if (answers.length !== examQuestions.length) {
    Swal.fire({
      title: "Hey!",
      html: "<p>Answer all the questions.</p>",
      icon: "error",
      confirmButtonColor: "var(--incorrect-color)",
    });
    return;
  }

  const req = await fetch(
    "frida.up.railway.app/api/exams/verifyExam/" + idExam,
    {
      method: "POST",
      headers: {
        authorization: "Bearer " + jwtInCookies,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers,
      }),
    }
  );
  const { result } = await req.json();
  const numberOfValidAnswers = result.filter((answer) => answer).length;

  let resultText = "";

  exam.exam.questions.forEach(({ statement }, i) => {
    if (result[i])
      resultText += `<h4 class="exam-info">${
        i + 1
      }. ${statement}<br><br> - Your answer: ${
        answers[i]
      } - <span class="valid-answer">Correct!</span></h4><br>`;
    else
      resultText += `<h4 class="exam-info">${
        i + 1
      }. ${statement}<br><br> - Your answer: ${
        answers[i]
      } - <span class="incorrect-answer">Incorrect!</span></h4><br>`;
  });

  Swal.fire({
    title: `Result: ${numberOfValidAnswers}/${result.length}`,
    html: resultText,
    width: "1100px",
    confirmButtonColor: "var(--header-color)",
    allowEscapeKey: false,
    allowOutsideClick: false,
    preConfirm: () => location.replace("../view-exams"),
  });
};

document.addEventListener("DOMContentLoaded", () => {
  appearQuestions();
});

d.addEventListener("click", async (event) => {
  if (event.target.matches(".sendButton")) {
    sendAnswersAndShowResult();
  }
});
