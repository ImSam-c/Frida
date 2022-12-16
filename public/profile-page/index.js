import { checkJwtInCookies, getPayloadJwt } from "../helpers/jwtFunctions.js";

const d = document,
  openedOptionContainer = d.querySelector(".opened-option-container"),
  fragment = d.createDocumentFragment();

let jwt = checkJwtInCookies();

if (!jwt) location.replace("../sign-in");

let user = getPayloadJwt(jwt);

const publicProfileHTML = `<h2>Public Profile</h2>
      <p>Edit your public information</p>
      <article class="inputs">
        <label for="inputName"><input type="text" name="name" id="inputName" class="input-profile"></label>

        <label for="inputArea"><input type="text" id="inputArea" class="input-profile" disabled></label>
      </article>
      <button class="button save-button" type="button" disabled>Save</button>`;

const detailsAccountHTML = `<h2>Details of your account</h2>
      <p>Edit your private information</p>
      <article class="inputs">
        <label for="inputEmail"><input type="text" name="email" value="${user.email}" id="inputEmail" class="input-profile"></label>

        <label for="inputArea"><input type="password" id="inputPassword" class="input-profile">
          <small><br>New password | Min. 6 characters</small></label>
      </article>
      <button class="button save-button" type="button" disabled>Save</button>`;

const addAPhotographyHTML = `<h2>Change your photography</h2>
      <p>Edit your public photo</p>
      <article class="inputs">
        <form method="post" action="https://frida.up.railway.app//api/upload/" enctype="multipart/form-data">
          <label class="imgLabelProfile" for="inputPhoto">
            <img class="profile-opened-image" src="../img/no-image-profile.png" alt="profile-img">
            <input type="file" accept="image/jpeg, image/png" name="file" id="inputPhoto">
            <small class="small-photo"><br>Click on the photo.</small>
          </label>
          <button class="button save-button" type="submit" disabled>Save</button>

        </form>
      </article>`;

const deleteAccountHTML = `<h2>Delete your account</h2>
      <p>Remove your account from the platform.</p>
      <small class="becareful">Be careful. This is an irreversible action.</small>
      <button type="button" class="button button-remove">Remove</button>`;

const setValuesSessionStorage = (img) => {
  let publicAndPrivateUserInformation;

  if (img) {
    publicAndPrivateUserInformation = {
      email: user.email,
      name: user.name,
      src: img,
    };
  } else {
    publicAndPrivateUserInformation = {
      email: user.email,
      name: user.name,
    };
  }

  sessionStorage.setItem(
    "publicAndPrivateUserInformation",
    JSON.stringify(publicAndPrivateUserInformation)
  );
};

const loadExams = async () => {
  if (user.area && sessionStorage.getItem("actualSelectedPage") === "public") {
    const res = await fetch(
      `https://frida.up.railway.app//api/exams/byTeacher/${user.id}`,
      {
        headers: { authorization: "Bearer " + jwt },
      }
    );
    const { exams } = await res.json();

    if (exams.length > 0) {
      exams.forEach((exam) => {
        let newArticle = d.createElement("article");
        newArticle.dataset.v_id = exam._id;
        newArticle.classList.add("examProfile");
        newArticle.innerHTML = `
        <div class="exam-sec1">
          <h2>Computer Science Exam</h2>
          <div class="comments-container">
            <p class="exam-comments">Comments: ${exam.comments}</p>
          </div>
          <p>Questions: ${exam.questions.length}</p>
        </div>
        <div class="exam-sec2">
          <i id="btn-delete-exam" class="fa-solid fa-trash"></i>
          <h3 class="exam-madeby"><span>Made by:</span><br>${exam.byTeacher.fullname}</h3>
        </div>`;
        fragment.append(newArticle);
      });
      openedOptionContainer.append(fragment);
    } else {
      const noExams = d.createElement("p");
      noExams.textContent = "You haven't exams";
      noExams.classList.add("no-exams-user");
      openedOptionContainer.append(noExams);
    }
  }
};

const initialPublicProfileValues = () => {
  const inputArea = d.getElementById("inputArea"),
    inputName = d.getElementById("inputName");

  inputName.value = user.name;
  inputArea.value = user.area || "No subject.";
  d.getElementById("userName").textContent = user.name;

  if (user.img) d.querySelector(".img-profile").src = user.img;

  const userInfo = {
    email: user.email,
    name: user.name,
    src: user.img,
  };

  sessionStorage.setItem(
    "publicAndPrivateUserInformation",
    JSON.stringify(userInfo)
  );

  sessionStorage.setItem("actualSelectedPage", "public");
  loadExams();
};

const handleErrors = (id) => {
  switch (id) {
    case "ic":
      ic_paragraph.classList.add("inc-credentials");
      break;

    case "userdx":
      Swal.fire({
        title: "This user doesn't exist",
        html: "<p class='modal-font'>Please verify your credentials, especially your email address.</p>",
        icon: "error",
        customClass: {
          title: "modal-font",
        },
        confirmButtonColor: "var(--incorrect-color)",
      });
      break;

    case "uEmail":
      Swal.fire({
        title: "This email is already registered.",
        html: "<p>Please use another.</p>",
        icon: "error",
        confirmButtonColor: "var(--incorrect-color)",
      });
      break;

    default:
      Swal.fire({
        title: "Something went wrong, try again.",
        icon: "error",
        customClass: {
          title: "modal-font",
        },
      });
      break;
  }
};

const updateUserProfile = async (origin) => {
  switch (origin) {
    case "public":
      const fullname = d.getElementById("inputName").value.trim();

      await fetch(
        `https://frida.up.railway.app//api/users/updateUser/${user.id}`,
        {
          method: "PUT",
          headers: {
            authorization: "Bearer " + jwt,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullname }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.errors) {
            if (JSON.parse(res.errors[0].msg).id)
              handleErrors(JSON.parse(res.errors[0].msg).id);
          }

          Swal.fire({
            icon: "success",
            title: "Profile updated",
            text: "Your profile has been updated.",
            preConfirm: () => {
              jwt = getPayloadJwt(res.jwt);

              if (jwt) {
                document.cookie = `XSRF-TOKEN=${res.jwt};expires=${jwt.exp};samesite=strict;path=/`;
                setValuesSessionStorage();
                location.reload();
              }
            },
            customClass: {
              confirmButton: "confirmButton",
            },
            allowEscapeKey: false,
            allowOutsideClick: false,
          });
        });

      break;

    case "details":
      const email = d.getElementById("inputEmail").value.trim();
      const password = d.getElementById("inputPassword");
      const lastEmailSaved = JSON.parse(
        sessionStorage.getItem("publicAndPrivateUserInformation")
      ).email;

      let dataUser;
      if (password.value && email !== lastEmailSaved) {
        dataUser = {
          email,
          password,
        };
      } else if (password.value) dataUser = { password: password.value };
      else dataUser = { email };

      await fetch(
        `https://frida.up.railway.app//api/users/updateUser/${user.id}`,
        {
          method: "PUT",
          headers: {
            authorization: "Bearer " + jwt,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataUser),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.errors) {
            if (JSON.parse(res.errors[0].msg).id)
              handleErrors(JSON.parse(res.errors[0].msg).id);
          }

          Swal.fire({
            icon: "success",
            title: "Profile updated",
            text: "Your profile has been updated.",
            preConfirm: () => {
              jwt = getPayloadJwt(res.jwt);

              if (jwt) {
                document.cookie = `XSRF-TOKEN=${res.jwt};expires=${jwt.exp};samesite=strict;path=/`;
                setValuesSessionStorage();
                location.reload();
              }
            },
            customClass: {
              confirmButton: "confirmButton",
            },
            allowEscapeKey: false,
            allowOutsideClick: false,
          });
        });
      break;

    case "delete":
      Swal.fire({
        title: "Are you sure?",
        showLoaderOnConfirm: true,
        showCancelButton: true,
        customClass: {
          confirmButton: "confirmButton",
          cancelButton: "cancelButton",
        },
        preConfirm: async () => {
          await fetch(`https://frida.up.railway.app//api/users/${user.id}`, {
            method: "DELETE",
            headers: {
              authorization: "Bearer " + jwt,
            },
          });

          Swal.fire({
            title: "User removed!",
            text: "Good luck!",
            icon: "success",
            customClass: {
              confirmButton: "confirmButton",
              cancelButton: "cancelButton",
            },
            allowEscapeKey: false,
            allowOutsideClick: false,
            preConfirm: () => {
              document.cookie = `XSRF-TOKEN=nt;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
              location.replace("../");
              sessionStorage.removeItem("publicAndPrivateUserInformation");
              sessionStorage.removeItem("actualSelectedPage");
            },
          });
        },
      });

      break;

    default:
      break;
  }
};

function validateEmail(emailInput) {
  const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailInput.match(mailRegex)) {
    return true;
  } else {
    return false;
  }
}

d.addEventListener("change", (e) => {
  if (e.target.matches("#inputPhoto")) {
    const imgElement = d.querySelector(".profile-opened-image");
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
      imgElement.src = e.target.result;
      imgElement.value = e.target.result;
    });
    reader.readAsDataURL(file);
  }
});

d.addEventListener("click", async (e) => {
  if (e.target.matches("#publicProfileOption")) {
    openedOptionContainer.innerHTML = publicProfileHTML;
    sessionStorage.setItem("actualSelectedPage", "public");
    initialPublicProfileValues();
  }

  if (e.target.matches("#detailsAccountOption")) {
    openedOptionContainer.innerHTML = detailsAccountHTML;
    sessionStorage.setItem("actualSelectedPage", "details");
  }

  if (e.target.matches("#addPhotographyOption")) {
    openedOptionContainer.innerHTML = addAPhotographyHTML;
    sessionStorage.setItem("actualSelectedPage", "photography");

    const lastUserInfoSaved = JSON.parse(
      sessionStorage.getItem("publicAndPrivateUserInformation")
    );

    let lastProfileImgSrc = d.querySelector(".profile-opened-image").src;

    if (lastUserInfoSaved.src)
      d.querySelector(".profile-opened-image").src = lastUserInfoSaved.src;
    else lastUserInfoSaved.src = lastProfileImgSrc;

    sessionStorage.setItem(
      "publicAndPrivateUserInformation",
      JSON.stringify(lastUserInfoSaved)
    );
  }

  if (e.target.matches("#deleteAccountOption")) {
    openedOptionContainer.innerHTML = deleteAccountHTML;
    sessionStorage.setItem("actualSelectedPage", "delete");
  }

  if (e.target.matches(".save-button, .button-remove")) {
    const origin = sessionStorage.getItem("actualSelectedPage");
    updateUserProfile(origin);
  }

  if (e.target.matches("#btn-delete-exam")) {
    const id = e.target.parentElement.parentElement.dataset.v_id;
    if (!id) {
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      customClass: {
        confirmButton: "confirmButton",
      },
      preConfirm: async () => {
        Swal.showLoading();
        await fetch(
          "https://frida.up.railway.app//api/exams/deleteExam/" + id,
          {
            method: "DELETE",
            headers: {
              authorization: "Bearer " + jwt,
            },
          }
        );
        Swal.close();
        location.reload();
      },
    });
  }

  if (
    e.target.matches(".examProfile, .examProfile *") &&
    !e.target.matches("#btn-delete-exam")
  ) {
    const id = e.target.closest(".examProfile").dataset.v_id;

    Swal.fire({
      title: "Searching exam...",
      didOpen: async () => {
        Swal.showLoading();
        const res = await fetch(
          `https://frida.up.railway.app//api/exams/${id}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          }
        );

        const { exam } = await res.json();
        let questionsText = "<br><br>";

        exam.questions.forEach((question, i) => {
          questionsText += `${i + 1}. ${question.statement}<br><br>`;
        });

        Swal.fire({
          title: "<h2>Exam details: </h2>",
          width: "900px",
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: "Close",
          customClass: {
            cancelButton: "cancelButton",
            title: "title",
          },
          html: `
          <h4 class="exam-info">Subject: ${exam.area}</h4><br>
          <h4 class="exam-info">Created by: ${exam.byTeacher.fullname}</h4><br>
          <h4 class="exam-info">Comments: ${exam.comments}</h4><br>
          <h4 class="exam-info">Number of questions: ${exam.nQuestions}</h4><br>
          <div style="text-align: left;">Questions: ${questionsText}</div>`,
        });
      },
    });
  }
});

d.addEventListener("input", (e) => {
  const editedInputName = e.target.name;
  let actualInputValue;

  const saveButton = d.querySelector(".save-button");

  if (e.target.type !== "file") actualInputValue = e.target.value.trim();
  else actualInputValue = e.target.src;

  if (e.target.type === "password") {
    e.target.value.length >= 6
      ? (saveButton.disabled = false)
      : (saveButton.disabled = true);
  } else {
    const lastUserInfoSaved = JSON.parse(
      sessionStorage.getItem("publicAndPrivateUserInformation")
    );

    actualInputValue !== lastUserInfoSaved[editedInputName]
      ? (saveButton.disabled = false)
      : (saveButton.disabled = true);

    if (e.target.name === "email") {
      let color = validateEmail(e.target.value) ? "green" : "red";
      e.target.style.border = "2px solid " + color;
      validateEmail(e.target.value)
        ? (saveButton.disabled = false)
        : (saveButton.disabled = true);
    }

    if (
      e.target.name === "email" &&
      actualInputValue === lastUserInfoSaved[editedInputName] &&
      e.target.parentElement.nextElementSibling.children[0].value.length !== 0
    ) {
      saveButton.disabled = false;
    }
  }
});

d.addEventListener("submit", async (e) => {
  e.preventDefault();

  Swal.fire({
    title: "Are you sure?",
    showLoaderOnConfirm: true,
    showCancelButton: true,
    customClass: {
      confirmButton: "confirmButton",
      cancelButton: "cancelButton",
    },
    preConfirm: async () => {
      const formData = new FormData(e.target);
      formData.entries().next().value[0] = "file";

      const res = await fetch("https://frida.up.railway.app//api/upload", {
        method: "POST",
        body: formData,
        headers: {
          authorization: "Bearer " + jwt,
        },
      });

      const { jwt: newJwt } = await res.json();

      const newPayload = getPayloadJwt(newJwt);

      Swal.fire({
        title: "Image updated!",
        icon: "success",
        customClass: {
          confirmButton: "confirmButton",
          cancelButton: "cancelButton",
        },
        allowEscapeKey: false,
        allowOutsideClick: false,
        preConfirm: () => {
          if (newJwt) {
            document.cookie = `XSRF-TOKEN=${newJwt};expires=${newPayload.exp};samesite=strict;path=/`;
            setValuesSessionStorage(user.img);
            location.reload();
          }
        },
      });
    },
  });
});

d.addEventListener("DOMContentLoaded", initialPublicProfileValues);
