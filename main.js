let index = 0;
displayImages();
function displayImages() {
  let i;
  const images = document.getElementsByClassName("image");
  for (i = 0; i < images.length; i++) {
    images[i].style.display = "none";
  }
  index++;
  if (index > images.length) {
    index = 1;
  }
  images[index-1].style.display = "block";
  setTimeout(displayImages, 5000); 
}

const header = document.querySelector("header");
const footer = document.querySelector("footer");
const contact = document.querySelector(".contact");
const contactdrop= document.querySelector(".contact-drop");
const contactclose= document.querySelector(".contact-close");
const Menu = document.querySelector(".menu");
const MenuDrop= document.querySelector(".menu-drop");
const Name= document.querySelector(".name");
const Block= document.querySelector(".headerblock");
const Dot= document.querySelector(".dot");
const Link= document.querySelector(".menu-link");

Name.addEventListener("click", () => {
    contact.classList.toggle("active")
    contactdrop.classList.toggle("active") 
})

contactclose.addEventListener("click", () => {
    contact.classList.toggle("active")
    contactdrop.classList.toggle("active")
})

footer.addEventListener("click", () => {
    Menu.classList.toggle("active")
    MenuDrop.classList.toggle("active")
    header.classList.toggle("active")
    Name.classList.toggle("active")
    Block.classList.toggle("active")
})


