const teacherImage =
  "https://apicms.thestar.com.my/uploads/images/2022/05/15/1585587.jpg";
const studentImage =
  "https://assets-homepages-learning.3plearning.net/wp-content/uploads/2020/06/blog-20-student-engagement-strategies-captivating-classroom.png";


const studentRadio = document.getElementById("student");
const teacherRadio = document.getElementById("teacher");
const image = document.querySelector(".image");
const subjectContainer = document.querySelector(".subject-container");


studentRadio.addEventListener("change", (e) => {
  image.style.backgroundImage = `url(${studentImage})`;
  subjectContainer.style.display = "none";
});


teacherRadio.addEventListener("change", (e) => {
  image.style.backgroundImage = `url(${teacherImage})`;
  subjectContainer.style.display = "block";
});
