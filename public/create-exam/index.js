const createButtons = document.querySelectorAll(".create-button");
const questionsBox = document.querySelector(".questions-box");
let questionNumber = 1;

function createQuestion(n){
  const nqbContainer = createNqbContainer(n);
  const answersContainer = createAnswersContainer(n);
  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question-container");
  questionContainer.setAttribute("id", `qc${n}`);
  questionContainer.appendChild(nqbContainer);
  questionContainer.appendChild(answersContainer);
  questionsBox.appendChild(questionContainer);
}

function getAnswers(){
  const answersContainer = document.querySelector(".answers-container");
  const answers = answersContainer.querySelectorAll("input[type='text']");
  const correctAnswer = answersContainer.querySelectorAll("input[type='radio']");

  const answersText = Array.from(answers, (answer) => {
    return answer.value;
  });

  const correctAnswerArray = Array.from(correctAnswer, (radioBtn) => {
    return radioBtn.checked;
  });

  const questions = [
    {
      question: "first one",
      answersText: answersText,
      correctAnswer: correctAnswerArray   
    },
  ];

  return questions;
}

createButtons.forEach(createButton => {
  createButton.addEventListener("click", () => {
    questionNumber++;
    createQuestion(questionNumber);
    window.scrollTo(0, document.body.scrollHeight);
  });
});

function deleteContent(n){
  textArea = document.querySelector(`textarea[name="question${n}"]`);
  textArea.value = "";
  const questionContainer = document.getElementById(`qc${n}`);
  const answersContainer = questionContainer.querySelector(".answers-container");
  const inputTexts = answersContainer.querySelectorAll("input[type='text']");
  const radioButtons = answersContainer.querySelectorAll("input[type='radio']");
  inputTexts.forEach(inputText => {
    inputText.value = "";
  });
  radioButtons.forEach(radioButton => {
    radioButton.checked = false;
  });  
}

function createNqbContainer(n){
  const questionNumber = document.createElement("p");
  questionNumber.classList.add("question-number");
  questionNumber.textContent = n + ".-";

  const textArea = document.createElement("textarea");
  textArea.setAttribute("rows", "3");
  textArea.setAttribute("name", "question" + n);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("onclick", `deleteContent(${n})`);
  deleteButton.textContent = "Delete";

  const nqbContainer = document.createElement("div");
  nqbContainer.classList.add("nqb-container");
  nqbContainer.appendChild(questionNumber);
  nqbContainer.appendChild(textArea);
  nqbContainer.appendChild(deleteButton);

  return nqbContainer;
}

function createAnswersContainer(n){
  const answersContainer = document.createElement("div");
  answersContainer.classList.add("answers-container");
  for(let i = 0; i < 4; i++){
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