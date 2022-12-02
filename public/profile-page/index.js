import { checkJwtInCookies, getPayloadJwt } from "../helpers/jwtFunctions.js";

const d = document,
  saveButton = d.querySelector(".save-button"),
  inputArea = d.getElementById("inputArea"),
  inputName = d.getElementById("inputName"),
  jwt = checkJwtInCookies();

if (!jwt) location.replace("../sign-in");
const user = getPayloadJwt(jwt);
console.log(user);

const publicProfileHTML = `<h2>Public Profile</h2>
      <p>Add information about you</p>
      <article class="inputs">
        <label for="inputName"><input type="text" id="inputName" class="input-profile" value="Sam Tito"></label>

        <label for="inputArea"><input type="text" id="inputArea" class="input-profile" value="Mathematics"
            disabled></label>
      </article>
      <button class="button save-button" type="button" disabled>Save</button>`;

let detailsAccountHTML, photographyHTML, deleteAccountHTML;

const initialPublicProfileValues = async () => {
  inputName.value = user.name;
  inputArea.value = user.area;
};

initialPublicProfileValues();
