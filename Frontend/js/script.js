const hamburgerDiv = document.getElementById("hamburger-div");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("nav-menu");
const cancelHamburgerDiv = document.getElementById("cancel-hamburger-div");
const cancelHamburger = document.getElementById("cancel-hamburger");
const scrollToFeature = document.querySelectorAll(".scroll-to-feature");
const feature = document.getElementById("features");
const mobileViewFeature = document.getElementById("mobile-view-feature");

hamburger.addEventListener("click", () => {
    mobileNav.classList.remove("hidden");
    hamburgerDiv.classList.add("hidden");
    cancelHamburgerDiv.classList.remove("hidden");
    cancelHamburgerDiv.classList.add("flex");
});

cancelHamburger.addEventListener("click", mobileNavbar);
mobileViewFeature.addEventListener("click", mobileNavbar);

function mobileNavbar() {
    mobileNav.classList.add("hidden");
    hamburgerDiv.classList.remove("hidden");
    cancelHamburgerDiv.classList.add("hidden");
    cancelHamburgerDiv.classList.remove("flex");
}

document.querySelectorAll('.feature-item').forEach(item => {
    let info = item.querySelector('.feature-info');
    let arrow = item.querySelector('i');
    let btn = item.querySelector('.toggle-btn');

    btn.addEventListener('click', () => {
        if (info.style.maxHeight) {
            info.style.maxHeight = null;
            info.style.opacity = "0";
            arrow.style.transform = "rotate(0deg)";
        } else {
            document.querySelectorAll('.feature-info').forEach(el => {
                el.style.maxHeight = null;
                el.style.opacity = "0";
            });
            document.querySelectorAll('.feature-item i').forEach(el => {
                el.style.transform = "rotate(0deg)";
            });

            info.style.maxHeight = info.scrollHeight + "px";
            info.style.opacity = "1";
            arrow.style.transform = "rotate(90deg)";
        }
    });
});

scrollToFeature.forEach((e) => {
    e.addEventListener("click", () => {
        feature.scrollIntoView({ behavior: "smooth" });
    });
});