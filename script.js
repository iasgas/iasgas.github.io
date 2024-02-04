const title = document.querySelector(".title");
const navMenu = document.querySelector(".nav-menu");
const navProjectMenu = document.querySelector(".nav-project-menu");
const items = document.getElementsByClassName("item");
const header = document.getElementsByTagName("header")[0];

title.addEventListener("click", () => {
    title.classList.toggle("active")
    navMenu.classList.toggle("active")
    navProjectMenu.classList.toggle("active")
    header.classList.toggle("active")
})

for (let i = 0; i < items.length; i++) {
    items[i].addEventListener("click", () => {
        items[i].classList.toggle("zoom")
        header.classList.toggle("hidden")
    })

}


document.querySelectorAll(".column").forEach(column=>{
    column.style.paddingLeft = Math.floor(Math.random() * 6) + 3+ "%"
    column.style.paddingRight = Math.floor(Math.random() * 6) + 3 + "%"
  })