const hamburgerDiv = document.getElementById("hamburger-div");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("nav-menu");
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

document.querySelectorAll(".hover-video").forEach(video => {
    let source = video.querySelector("source");
    let skeleton = video.closest(".relative").querySelector(".animate-pulse");
    let thumbnail = video.closest(".relative").querySelector(".video-thumbnail");

    if (!source || !source.src) {
        return;
    }

    video.src = source.src;
    video.load();

    video.addEventListener("loadeddata", () => {
        skeleton.classList.add("hidden"); 
    });

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

    video.closest(".relative").addEventListener("mouseenter", playVideo);
    video.closest(".relative").addEventListener("mouseleave", stopVideo);
    video.closest(".relative").addEventListener("touchstart", playVideo);
    video.closest(".relative").addEventListener("touchend", stopVideo);
});
