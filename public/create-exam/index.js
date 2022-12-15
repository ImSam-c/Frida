import { checkJwtInCookies } from "../helpers/jwtFunctions.js";

const createButtons = document.querySelectorAll(".create-button");
const saveButtons = document.querySelectorAll(".save-button");
const questionsBox = document.querySelector(".questions-box");

let jwt;
checkJwtInCookies()
  ? (jwt = checkJwtInCookies())
  : location.replace("../sign-in/");

function createQuestion(n) {
  const nqbContainer = createNqbContainer(n);
  const answersContainer = createAnswersContainer(n);
  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question-container");
  questionContainer.setAttribute("id", `qc${n}`);
  questionContainer.appendChild(nqbContainer);
  questionContainer.appendChild(answersContainer);
  questionsBox.appendChild(questionContainer);
}

function getData() {
  const questions = [];
  const comments = document.querySelector(".comments").value;
  const questionsContainer = document.querySelectorAll(".question-container");
  questionsContainer.forEach((questionContainer) => {
    const statement = questionContainer.querySelector("textarea").value;
    // Skip blank questions.
    if (!statement.trim()) return;

    // Get answer options and correct answer from the input text and radio buttons.
    const answersContainer =
      questionContainer.querySelector(".answers-container");
    const answers = answersContainer.querySelectorAll("input[type='text']");
    const radioButtons = answersContainer.querySelectorAll(
      "input[type='radio']"
    );

    const options = Array.from(answers, (answer) => {
      return answer.value;
    });

    let correctAnswer = -1;
    for (const radioBtn of radioButtons.entries()) {
      if (radioBtn[1].checked) {
        correctAnswer = radioBtn[0];
        correctAnswer++;
        break;
      }
    }

    const questionData = {
      statement,
      options,
      correctAnswer,
    };

    questions.push(questionData);
  });

  return { questions, comments };
}

function areAllAnswersSelected(questions) {
  let result = true;
  questions.forEach(({ correctAnswer }) => {
    if (correctAnswer === -1) {
      result = false;
    }
  });
  return result;
}

async function sendData(questions, comments) {
  const response = await fetch(
    "https://frida.rettouseisama.com/api/exams/createExam",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        questions,
        nQuestions: questions.length,
        comments,
      }),
    }
  );

  response
    .json()
    .then(() => {
      Swal.fire({
        title: "Nice!",
        icon: "success",
        html: `<p class="modal-font">Exam created!</p>`,
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

createButtons.forEach((createButton) => {
  createButton.addEventListener("click", () => {
    createQuestion(questionsBox.children.length + 1);
    window.scrollTo(0, document.body.scrollHeight);
  });
});

saveButtons.forEach((saveButton) => {
  saveButton.addEventListener("click", () => {
    const { questions, comments } = getData();
    if (areAllAnswersSelected(questions) && questions.length > 0) {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
        showCancelButton: true,
        customClass: {
          title: "modal-font",
        },
        cancelButtonColor: "var(--incorrect-color)",
        confirmButtonColor: "var(--btn-color)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        result.isConfirmed ? sendData(questions, comments) : null;
      });
    } else {
      Swal.fire({
        title: "Hey!",
        html: '<p class="modal-font">Select a correct answer for each question.</p>',
        icon: "error",
        customClass: {
          title: "modal-font",
        },
        confirmButtonColor: "var(--incorrect-color)",
      });
    }
  });
});

// function deleteContent(n) {
//   textArea = document.querySelector(`textarea[name="question${n}"]`);
//   textArea.value = "";
//   const questionContainer = document.getElementById(`qc${n}`);
//   const answersContainer =
//     questionContainer.querySelector(".answers-container");
//   const inputTexts = answersContainer.querySelectorAll("input[type='text']");
//   const radioButtons = answersContainer.querySelectorAll("input[type='radio']");
//   inputTexts.forEach((inputText) => {
//     inputText.value = "";
//   });
//   radioButtons.forEach((radioButton) => {
//     radioButton.checked = false;
//   });
// }

function createNqbContainer(n) {
  const questionNumber = document.createElement("p");
  questionNumber.classList.add("question-number");
  questionNumber.textContent = n + ".-";

  const textArea = document.createElement("textarea");
  textArea.setAttribute("rows", "3");
  textArea.setAttribute("name", "question" + n);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.classList.add("button");
  deleteButton.setAttribute("type", "button");

  const deleteSpan = document.createElement("span");
  deleteSpan.textContent = "Delete";
  deleteButton.appendChild(deleteSpan);

  const nqbContainer = document.createElement("div");
  nqbContainer.classList.add("nqb-container");
  nqbContainer.appendChild(questionNumber);
  nqbContainer.appendChild(textArea);
  nqbContainer.appendChild(deleteButton);

  return nqbContainer;
}

function createAnswersContainer(n) {
  const answersContainer = document.createElement("div");
  answersContainer.classList.add("answers-container");
  for (let i = 0; i < 4; i++) {
    const radioButton = document.createElement("input");
    radioButton.setAttribute("type", "radio");
    radioButton.setAttribute("name", `answers${n}`);

    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");

    const container = document.createElement("div");

    container.appendChild(radioButton);
    container.appendChild(inputText);
    answersContainer.appendChild(container);
  }
  return answersContainer;
}

document.addEventListener("click", (e) => {
  if (
    e.target.matches(".delete-button") &&
    e.target.closest(".question-container").id !== "qc1"
  )
    e.target.closest(".question-container").remove();
});

window.matchMedia("(max-width: 950px)").addEventListener("change", (x) => {
  if (x.matches) {
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.textContent = "X";
    });
  } else {
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.textContent = "delete";
    });
  }
});
