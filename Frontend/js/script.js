const hamburgerDiv = document.getElementById("hamburger-div");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("nav-menu");
const navbar = document.getElementById("navbar");
const main = document.getElementById("main");
const cancelHamburgerDiv = document.getElementById("cancel-hamburger-div");
const cancelHamburger = document.getElementById("cancel-hamburger");
const scrollToFeature = document.querySelectorAll(".scroll-to-feature");
const scrollToAbout = document.querySelectorAll(".scroll-to-about");
const scrollToWork = document.querySelectorAll(".scroll-to-work");
const scrollToContact = document.querySelectorAll(".scroll-to-contact");
const feature = document.getElementById("feature");
const about = document.getElementById("about");
const work = document.getElementById("work");
const contact = document.getElementById("contact");
const mobileViewFeature = document.getElementById("mobile-view-feature");
const mobileViewAbout = document.getElementById("mobile-view-about");
const mobileViewWork = document.getElementById("mobile-view-work");
const mobileViewContact = document.getElementById("mobile-view-contact");
const displayForm = document.getElementById("display-form");
const form = document.getElementById("room-form");
const closeForm = document.getElementById("close-form");
const submitForm = document.getElementById("submit-form");
const overlay = document.getElementById("overlay");
const change = document.querySelectorAll(".change");
const changeContact = document.querySelectorAll(".change-contact");
const changeWhite = document.querySelectorAll(".change-white");
const changeForm = document.querySelectorAll(".change-form");
const changeButton = document.querySelectorAll(".change-button");
const homePageVideoDiv = document.getElementById("homepage-video-div");
const homePageVideo = document.getElementById("homepage-video");
const homePageSrc = document.getElementById("homepage-src");
const moon = document.querySelectorAll(".fa-moon");
localStorage.setItem("roomMode", "dark");

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }
});

moon.forEach((element) => {
    element.addEventListener("click", () => {
        if (element.classList.contains("fa-regular")) {
            element.classList.remove("fa-regular");
            element.classList.add("fa-solid");
            darkMode();
        } else {
            element.classList.remove("fa-solid");
            element.classList.add("fa-regular");
            lightMode();
        }
    });
});

function lightMode() {
    let hasRegularClass = Array.from(moon).some(icon => icon.classList.contains("fa-regular"));
    if (hasRegularClass) {
        homePageVideo.pause();
        homePageSrc.src = "../assets/Video/homepage-light.webm";
        homePageVideo.load();
        homePageVideo.classList.remove("homepage-dark-theme");
        homePageVideo.classList.add("homepage-light-theme");
        homePageVideoDiv.classList.remove("w-full");
        homePageVideoDiv.classList.remove("md:w-[75%]");
        homePageVideoDiv.classList.remove("lg:w-[55%]");
        homePageVideoDiv.classList.add("w-[70%]");
        homePageVideoDiv.classList.add("sm:w-[40%]");
        document.body.classList.remove("text-white");
        document.body.classList.add("text-black");
        navbar.classList.remove("bg-zinc-950");
        navbar.classList.add("bg-gray-300");
        mobileNav.classList.remove("bg-zinc-950");
        mobileNav.classList.add("bg-gray-300");
        main.classList.remove("bg-zinc-950");
        main.classList.add("bg-gray-300");
        document.getElementById("codeInput").classList.remove("bg-zinc-900");
        document.getElementById("codeInput").classList.add("bg-gray-200");
        feature.classList.remove("bg-zinc-950");
        feature.classList.add("bg-gray-300");
        contact.classList.remove("bg-zinc-950");
        contact.classList.add("bg-gray-300");
        work.classList.remove("bg-stone-950");
        work.classList.add("bg-gray-200");
        about.classList.remove("bg-stone-950");
        about.classList.add("bg-gray-200");
        change.forEach((element) => {
            element.classList.remove("bg-zinc-900");
            element.classList.add("bg-gray-200");
        });
        changeContact.forEach((element) => {
            element.classList.remove("bg-neutral-950");
            element.classList.add("bg-gray-200");
        });
        changeWhite.forEach((element) => {
            element.classList.remove("bg-black");
            element.classList.add("bg-gray-200");
        });
        changeForm.forEach((element) => {
            element.classList.remove("bg-gray-700");
            element.classList.add("bg-gray-200");
        });
        changeButton.forEach((element) => {
            element.classList.remove("hover:bg-zinc-700");
            element.classList.add("hover:bg-gray-100");
        });
        document.getElementById("form-div").classList.remove("bg-gray-800");
        document.getElementById("form-div").classList.add("bg-gray-300");
        document.getElementById("sharingOptions").classList.remove("bg-zinc-800");
        document.getElementById("sharingOptions").classList.add("bg-gray-200");
        document.querySelectorAll(".dark-theme").forEach((element) => {
            element.classList.remove("dark-theme");
            element.classList.add("light-theme");
        });
        scrollToAbout.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
        scrollToContact.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
        scrollToFeature.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
        scrollToWork.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
        moon.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
    }
}

function darkMode() {
    let hasSolidClass = Array.from(moon).some(icon => icon.classList.contains("fa-solid"));
    if (hasSolidClass) {
        homePageVideo.pause();
        homePageSrc.src = "../assets/Video/homepage-dark.webm";
        homePageVideo.load();
        homePageVideo.classList.remove("homepage-light-theme");
        homePageVideo.classList.add("homepage-dark-theme");
        homePageVideoDiv.classList.remove("w-[70%]");
        homePageVideoDiv.classList.remove("sm:w-[40%]");
        homePageVideoDiv.classList.add("w-full");
        homePageVideoDiv.classList.add("md:w-[75%]");
        homePageVideoDiv.classList.add("lg:w-[55%]");
        document.body.classList.remove("text-black");
        document.body.classList.add("text-white");
        navbar.classList.remove("bg-gray-300");
        navbar.classList.add("bg-zinc-950");
        mobileNav.classList.remove("bg-gray-300");
        mobileNav.classList.add("bg-zinc-950");
        main.classList.remove("bg-gray-300");
        main.classList.add("bg-zinc-950");
        document.getElementById("codeInput").classList.remove("bg-gray-200");
        document.getElementById("codeInput").classList.add("bg-zinc-900");
        feature.classList.remove("bg-gray-300");
        feature.classList.add("bg-zinc-950");
        contact.classList.remove("bg-gray-300");
        contact.classList.add("bg-zinc-950");
        work.classList.remove("bg-gray-200");
        work.classList.add("bg-stone-950");
        about.classList.remove("bg-gray-200");
        about.classList.add("bg-stone-950");
        change.forEach((element) => {
            element.classList.remove("bg-gray-200");
            element.classList.add("bg-zinc-900");
        });
        changeContact.forEach((element) => {
            element.classList.remove("bg-gray-200");
            element.classList.add("bg-neutral-950");
        });
        changeWhite.forEach((element) => {
            element.classList.remove("bg-gray-200");
            element.classList.add("bg-black");
        });
        changeForm.forEach((element) => {
            element.classList.remove("bg-gray-200");
            element.classList.add("bg-gray-700");
        });
        changeButton.forEach((element) => {
            element.classList.remove("hover:bg-gray-100");
            element.classList.add("hover:bg-zinc-700");
        });
        document.getElementById("form-div").classList.remove("bg-gray-300");
        document.getElementById("form-div").classList.add("bg-gray-800");
        document.getElementById("sharingOptions").classList.remove("bg-gray-200");
        document.getElementById("sharingOptions").classList.add("bg-zinc-800");
        document.querySelectorAll(".light-theme").forEach((element) => {
            element.classList.remove("light-theme");
            element.classList.add("dark-theme");
        });
        scrollToAbout.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
        scrollToContact.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
        scrollToFeature.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
        scrollToWork.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
        moon.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
    }
}

hamburger.addEventListener("click", () => {
    mobileNav.classList.remove("hidden");
    hamburgerDiv.classList.add("hidden");
    cancelHamburgerDiv.classList.remove("hidden");
    cancelHamburgerDiv.classList.add("flex");
    document.body.style.overflow = "hidden";
});

function addMobileNavEvents(elements, callback) {
    elements.forEach((element) => {
        element.addEventListener("click", callback);
    });
}

function mobileNavbar() {
    mobileNav.classList.add("hidden");
    hamburgerDiv.classList.remove("hidden");
    cancelHamburgerDiv.classList.add("hidden");
    cancelHamburgerDiv.classList.remove("flex");
    document.body.style.overflow = "auto";
}

addMobileNavEvents(
    [cancelHamburger, mobileViewFeature, mobileViewAbout, mobileViewWork, mobileViewContact],
    mobileNavbar
);

document.querySelectorAll('.feature-item').forEach(item => {
    let info = item.querySelector('.feature-info');
    let arrow = item.querySelector('i');
    let btn = item.querySelector('.toggle-btn');
    const showFeature = () => {
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
    };
    const hideFeature = () => {
        info.style.maxHeight = null;
        info.style.opacity = "0";
        arrow.style.transform = "rotate(0deg)";
    };
    btn.addEventListener('click', () => {
        if (info.style.maxHeight) {
            hideFeature();
        } else {
            showFeature();
        }
    });
    item.addEventListener('mouseenter', showFeature);
    item.addEventListener('mouseleave', hideFeature);
    item.addEventListener('touchstart', showFeature);
    item.addEventListener('touchend', hideFeature);
    item.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = item.getBoundingClientRect();
        if (!(touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom)) {
            hideFeature();
        }
    });
});

function addSmoothScroll(triggerElements, targetElement) {
    triggerElements.forEach((element) => {
        element.addEventListener("click", () => {
            targetElement.scrollIntoView({ behavior: "smooth" });
        });
    });
}

addSmoothScroll(scrollToFeature, feature);
addSmoothScroll(scrollToAbout, about);
addSmoothScroll(scrollToWork, work);
addSmoothScroll(scrollToContact, contact);

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img, video").forEach(el => {
        if (el.dataset.src) {
            el.src = el.dataset.src;
        }
    });
});

document.querySelectorAll(".hover-video").forEach(video => {
    let source = video.querySelector("source");
    let card = video.closest(".card");
    let thumbnail = card.querySelector(".video-thumbnail");
    if (!source || !source.src) {
        return;
    }
    video.src = source.src;
    video.load();
    function playVideo() {
        if (video.readyState >= 2) {
            video.currentTime = 0;
            video.loop = true;
            video.play().catch(err => console.warn("Autoplay blocked:", err));
            thumbnail.classList.add("hidden");
            video.classList.remove("opacity-0");
        }
    }
    function stopVideo() {
        video.pause();
        video.currentTime = 0;
        thumbnail.classList.remove("hidden");
        video.classList.add("opacity-0");
    }
    card.addEventListener("mouseenter", playVideo);
    card.addEventListener("mouseleave", stopVideo);
    card.addEventListener("touchstart", playVideo);
    card.addEventListener("touchend", stopVideo);
});

displayForm.addEventListener("click", () => {
    form.classList.remove("hidden");
    form.classList.add("flex");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";
    if (form) {
        form.style.pointerEvents = "auto";
    }
});

closeForm.addEventListener("click", () => {
    form.classList.remove("flex");
    form.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
});

document.getElementById("toggleCodeInput").addEventListener("click", function () {
    document.getElementById("toggleCodeInput").classList.add("hidden");
    document.getElementById("codeInput").classList.remove("hidden");
});

document.getElementById("startSharingBtn").addEventListener("click", function () {
    let menu = document.getElementById("sharingOptions");
    menu.classList.toggle("hidden");
});

document.addEventListener("click", function (event) {
    let dropdown = document.getElementById("sharingOptions");
    let button = document.getElementById("startSharingBtn");
    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.add("hidden");
    }
});

document.querySelectorAll("#sharingOptions button").forEach((option) => {
    option.addEventListener("click", function () {
        document.getElementById("sharingOptions").classList.add("hidden");
    });
});

function validateInput(inputElement) {
    inputElement.addEventListener("input", (e) => {
        let value = e.target.value;
        value = value.replace(/[^A-Za-z0-9]/g, "");
        if (value.length > 6) {
            value = value.slice(0, 6);
        }
        e.target.value = value;
    });
}

validateInput(document.getElementById("codeInput"));
validateInput(document.getElementById("room-code"));

document.getElementById("submit-form").addEventListener("click", (e) => {
    e.preventDefault();

    const roomform = document.querySelector("#room-form form");
    const formData = new FormData(roomform);

    fetch("http://localhost:3000/room", {
        method: "POST",
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            alert("Response: " + data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    form.classList.remove("flex");
    form.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
});
