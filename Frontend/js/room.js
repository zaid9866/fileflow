const removeOverflow = document.getElementById("remove-overflow");
const head = document.getElementById("head");
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileListContainer = document.getElementById("file-list-container");
const fileList = document.getElementById("file-list");
const fileLimitDisplay = document.getElementById("file-limit-display");
const addMoreBtn = document.getElementById("addMoreBtn");
const moreFileInput = document.getElementById("moreFileInput");
let filesArray = [];
const maxFiles = 20;
const maxTotalSize = 500 * 1024 * 1024;
let textFieldCount = 0;
const chatInput = document.getElementById("chat-input");
const hamburgerDiv = document.getElementById("hamburger-div");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("nav-menu");
const cancelHamburgerDiv = document.getElementById("cancel-hamburger-div");
const cancelHamburger = document.getElementById("cancel-hamburger");
const showToFeature = document.querySelectorAll(".show-to-feature");
const showToAbout = document.querySelectorAll(".show-to-about");
const showToWork = document.querySelectorAll(".show-to-work");
const shareRoom = document.querySelectorAll(".share-room");
const OpenLeaveRoom = document.querySelectorAll(".openLeaveRoom");
const feature = document.getElementById("feature");
const about = document.getElementById("about");
const work = document.getElementById("work");
const mobileViewFeature = document.getElementById("mobile-view-feature");
const mobileViewAbout = document.getElementById("mobile-view-about");
const mobileViewWork = document.getElementById("mobile-view-work");
const mobileViewLeave = document.getElementById("mobile-view-leave");
const mobileViewShare = document.getElementById("mobile-view-share");
const closeWork = document.getElementById("close-work");
const closeFeature = document.getElementById("close-feature");
const closeAbout = document.getElementById("close-about");
const hide = document.querySelectorAll(".hide");
const container = document.getElementById("user-container");
const fileSection = document.getElementById("file-section");
const textSection = document.getElementById("text-section");
const roomInfo = document.getElementById("room-info");
const roomShare = document.getElementById("room-share");
const roomChat = document.getElementById("chat-section");
const moon = document.querySelectorAll(".fa-moon");
const change = document.querySelectorAll(".change");
const warn = document.getElementById("warn");
const restrictMode = document.getElementById("restrict-mode");
const toggleRestrict = document.getElementById("toggle-restrict");
const requestBox = document.getElementById("request-container");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const removeGuest = document.getElementById("removeGuest");
const blockGuest = document.getElementById("blockGuest");
const leaveRoom = document.getElementById("leaveRoom");
const leave = document.getElementById("leave");
const cancel = document.getElementById("cancel");
const modalText = leaveRoom.querySelector("p");
let guestName = "";
let roomData = JSON.parse(sessionStorage.getItem('roomData'));
let userData = JSON.parse(sessionStorage.getItem('userData'));
let UserName = document.querySelectorAll(".username");
localStorage.setItem("roomMode", "dark");

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }
    addNewTextField();
    displayValue();
    applyThemeClasses();
    getUser();
    fetchChatMessages();
    getText();
    getFile();
});

moon.forEach((element) => {
    element.addEventListener("click", () => {
        if (element.classList.contains("fa-regular")) {
            element.classList.remove("fa-regular");
            element.classList.add("fa-solid");
            localStorage.setItem("roomMode", "dark");
            darkMode();
        } else {
            element.classList.remove("fa-solid");
            element.classList.add("fa-regular");
            localStorage.setItem("roomMode", "light");
            lightMode();
        }
    });
});

function lightMode() {
    let hasRegularClass = Array.from(moon).some(icon => icon.classList.contains("fa-regular"));
    if (hasRegularClass) {
        document.body.classList.remove("text-white");
        document.body.classList.add("text-black");
        document.body.classList.remove("bg-zinc-900");
        document.body.classList.add("bg-gray-300");
        mobileNav.classList.remove("bg-zinc-900");
        mobileNav.classList.add("bg-gray-300");
        roomInfo.classList.remove("bg-zinc-950");
        roomInfo.classList.add("bg-gray-700");
        roomInfo.classList.remove("border-white");
        roomInfo.classList.add("border-black");
        roomShare.classList.remove("bg-zinc-950");
        roomShare.classList.add("bg-gray-700");
        roomShare.classList.remove("border-white");
        roomShare.classList.add("border-black");
        fileSection.classList.remove("bg-slate-900");
        fileSection.classList.add("bg-gray-200");
        dropzone.classList.remove("bg-gray-800");
        dropzone.classList.add("bg-gray-400");
        dropzone.classList.remove("hover:bg-gray-700");
        dropzone.classList.add("hover:bg-gray-300");
        textSection.classList.remove("bg-slate-900");
        textSection.classList.add("bg-gray-200");
        roomChat.classList.remove("bg-slate-900");
        roomChat.classList.add("bg-gray-200");
        feature.classList.remove("bg-zinc-950");
        feature.classList.add("bg-gray-300");
        work.classList.remove("bg-stone-950");
        work.classList.add("bg-gray-200");
        about.classList.remove("bg-stone-950");
        about.classList.add("bg-gray-200");
        warn.classList.remove("bg-zinc-950");
        warn.classList.add("bg-white");
        requestBox.classList.remove("bg-slate-950");
        requestBox.classList.add("bg-gray-200");
        modal.firstElementChild.classList.remove("bg-slate-900");
        modal.firstElementChild.classList.add("bg-gray-200");
        leaveRoom.firstElementChild.classList.remove("bg-slate-900");
        leaveRoom.firstElementChild.classList.add("bg-gray-200");
        document.getElementById("showURL").firstElementChild.classList.remove("bg-slate-900");
        document.getElementById("showURL").firstElementChild.classList.add("bg-gray-100");
        change.forEach((element) => {
            element.classList.remove("bg-zinc-900");
            element.classList.add("bg-gray-200");
        });
        setTimeout(() => {
            const changeFile = document.querySelectorAll(".change-file");
            changeFile.forEach((element) => {
                element.classList.remove("bg-gray-700");
                element.classList.add("bg-white");
            });
            const changeText = document.querySelectorAll(".change-text");
            changeText.forEach((element) => {
                element.classList.remove("bg-gray-800");
                element.classList.add("bg-white");
            });
            const changeChat = document.querySelectorAll(".change-chat");
            changeChat.forEach((element) => {
                element.classList.remove("border-white");
                element.classList.add("border-black");
                element.classList.remove("text-black");
                element.classList.add("text-white");
            });
            const changeRole = document.querySelectorAll(".change-role");
            changeRole.forEach((element) => {
                element.classList.remove("bg-gray-800");
                element.classList.add("bg-white");
            });
            const changeBorder = document.querySelectorAll(".change-border");
            changeBorder.forEach((element) => {
                element.classList.remove("border-white");
                element.classList.add("border-black");
            });
            const changeRequest = document.querySelectorAll(".change-request");
            changeRequest.forEach((element) => {
                element.classList.remove("bg-gray-900");
                element.classList.add("bg-white");
            });
            applyTheme();
            applyThemeClasses();
        }, 100);
        document.querySelectorAll(".dark-theme").forEach((element) => {
            element.classList.remove("dark-theme");
            element.classList.add("light-theme");
        });
        showToAbout.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
        showToFeature.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
        showToWork.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
        shareRoom.forEach((element) => {
            element.classList.remove("hover:text-gray-400");
            element.classList.add("hover:text-white");
        });
        OpenLeaveRoom.forEach((element) => {
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
        document.body.classList.remove("text-black");
        document.body.classList.add("text-white");
        document.body.classList.remove("bg-gray-300");
        document.body.classList.add("bg-zinc-900");
        mobileNav.classList.remove("bg-gray-300");
        mobileNav.classList.add("bg-zinc-900");
        roomInfo.classList.remove("bg-gray-700");
        roomInfo.classList.add("bg-zinc-950");
        roomInfo.classList.remove("border-black");
        roomInfo.classList.add("border-white");
        roomShare.classList.remove("bg-gray-700");
        roomShare.classList.add("bg-zinc-950");
        roomShare.classList.remove("border-black");
        roomShare.classList.add("border-white");
        fileSection.classList.remove("bg-gray-200");
        fileSection.classList.add("bg-slate-900");
        dropzone.classList.remove("bg-gray-400");
        dropzone.classList.add("bg-gray-800");
        dropzone.classList.remove("hover:bg-gray-300");
        dropzone.classList.add("hover:bg-gray-700");
        textSection.classList.remove("bg-gray-200");
        textSection.classList.add("bg-slate-900");
        roomChat.classList.remove("bg-gray-200");
        roomChat.classList.add("bg-slate-900");
        feature.classList.remove("bg-gray-300");
        feature.classList.add("bg-zinc-950");
        work.classList.remove("bg-gray-200");
        work.classList.add("bg-stone-950");
        about.classList.remove("bg-gray-200");
        about.classList.add("bg-stone-950");
        warn.classList.remove("bg-white");
        warn.classList.add("bg-zinc-950");
        requestBox.classList.remove("bg-gray-200");
        requestBox.classList.add("bg-slate-950");
        modal.firstElementChild.classList.remove("bg-gray-200");
        modal.firstElementChild.classList.add("bg-slate-900");
        leaveRoom.firstElementChild.classList.remove("bg-gray-200");
        leaveRoom.firstElementChild.classList.add("bg-slate-900");
        document.getElementById("showURL").firstElementChild.classList.remove("bg-gray-100");
        document.getElementById("showURL").firstElementChild.classList.add("bg-slate-900");
        change.forEach((element) => {
            element.classList.remove("bg-gray-200");
            element.classList.add("bg-zinc-900");
        });
        setTimeout(() => {
            const changeFile = document.querySelectorAll(".change-file");
            changeFile.forEach((element) => {
                element.classList.remove("bg-white");
                element.classList.add("bg-gray-700");
            });
            const changeText = document.querySelectorAll(".change-text");
            changeText.forEach((element) => {
                element.classList.remove("bg-white");
                element.classList.add("bg-gray-800");
            });
            const changeChat = document.querySelectorAll(".change-chat");
            changeChat.forEach((element) => {
                element.classList.remove("border-black");
                element.classList.add("border-white");
                element.classList.remove("text-black");
                element.classList.add("text-white");
            });
            const changeRole = document.querySelectorAll(".change-role");
            changeRole.forEach((element) => {
                element.classList.remove("bg-white");
                element.classList.add("bg-gray-800");
            });
            const changeBorder = document.querySelectorAll(".change-border");
            changeBorder.forEach((element) => {
                element.classList.remove("border-black");
                element.classList.add("border-white");
            });
            const changeRequest = document.querySelectorAll(".change-request");
            changeRequest.forEach((element) => {
                element.classList.remove("bg-white");
                element.classList.add("bg-gray-900");
            });
            applyTheme();
            applyThemeClasses();
        }, 100);
        document.querySelectorAll(".dark-theme").forEach((element) => {
            element.classList.remove("light-theme");
            element.classList.add("dark-theme");
        });
        showToAbout.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
        showToFeature.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
        showToWork.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
        shareRoom.forEach((element) => {
            element.classList.remove("hover:text-white");
            element.classList.add("hover:text-gray-400");
        });
        OpenLeaveRoom.forEach((element) => {
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
    [cancelHamburger, mobileViewFeature, mobileViewAbout, mobileViewWork, mobileViewLeave, mobileViewShare],
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

function show(triggerElements, targetElement) {
    triggerElements.forEach((element) => {
        element.addEventListener("click", () => {
            hide.forEach((e) => {
                e.classList.add("hidden");
            });
            targetElement.classList.remove("hidden");
        });
    });
}

[showToAbout, showToFeature, showToWork].forEach((element) => {
    if (element === showToFeature) {
        show(element, feature);
    } else if (element === showToAbout) {
        show(element, about);
    } else {
        show(element, work);
    }
});

[closeAbout, closeFeature, closeWork].forEach((element) => {
    element.addEventListener("click", () => {
        hide.forEach((e) => {
            e.classList.remove("hidden");
        });
        if (element === closeAbout) {
            about.classList.add("hidden");
        } else if (element === closeFeature) {
            feature.classList.add("hidden");
        } else {
            work.classList.add("hidden");
        }
        mobileNav.classList.add("hidden");
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

removeOverflow.addEventListener("click", () => {
    if (removeOverflow.style.transform === "rotate(0deg)") {
        head.classList.remove("overflow-hidden");
        head.classList.add("h-fit");
        removeOverflow.style.transform = "rotate(180deg)";
    } else {
        head.classList.remove("h-fit");
        head.classList.add("overflow-hidden");
        removeOverflow.style.transform = "rotate(0deg)";
    }
});

function checkOverflow() {
    if (head.scrollHeight > head.clientHeight) {
        removeOverflow.parentElement.classList.remove("hidden");
        head.classList.add("pr-10");
    } else {
        removeOverflow.parentElement.classList.add("hidden");
        head.classList.remove("pr-10");
    }
}

window.addEventListener("load", checkOverflow);
window.addEventListener("resize", checkOverflow);

document.addEventListener("DOMContentLoaded", function () {
    const role = userData.role;

    if (role === "Host") {
        document.getElementById("edit-user").classList.remove("hidden");
        document.getElementById("edit-time").classList.remove("hidden");
    }

    restrictMode.classList.remove("hidden");
    restrictMode.classList.add("flex");
    document.querySelectorAll("div[id^='edit-']").forEach(editBtn => {
        editBtn.addEventListener("click", function () {
            const parentDiv = editBtn.closest("div.flex");
            const span = parentDiv.querySelector("span");
            let value = span.innerText.trim().replace(/^: /, "");
            span.classList.add("hidden");
            editBtn.classList.add("hidden");
            const wrapperDiv = document.createElement("div");
            wrapperDiv.classList.add("flex", "items-center", "gap-2", "ml-3");
            const inputStyles = "border px-2 h-8 w-36 rounded focus:ring focus:outline-none";
            const selectStylesUser = "border px-2 h-8 w-16 rounded focus:ring focus:outline-none";
            const selectStylesTime = "border px-2 h-8 w-24 rounded focus:ring focus:outline-none";
            const checkIcon = document.createElement("i");
            checkIcon.classList.add("fa-solid", "fa-check", "cursor-pointer");
            if (editBtn.id === "edit-name") {
                const input = document.createElement("input");
                input.type = "text";
                input.value = value.trim().replace(/\s+/g, ' ');
                input.id = "name-input";
                input.name = "username";
                input.autocomplete = "off";
                input.classList.add(...inputStyles.split(" "));
                input.maxLength = 16;
                input.addEventListener("input", function () {
                    let value = input.value.replace(/[^a-zA-Z0-9 ]/g, "");
                    input.value = value.replace(/\s{2,}/g, ' ');
                });
                wrapperDiv.appendChild(input);
                wrapperDiv.appendChild(checkIcon);
                parentDiv.appendChild(wrapperDiv);
                checkIcon.addEventListener("click", function () {
                    const newName = input.value.trim().replace(/\s+/g, ' ');
                    span.innerText = `: ${newName}`;
                    span.classList.remove("hidden");
                    editBtn.classList.remove("hidden");
                    wrapperDiv.remove();
                    changeUsername(newName);
                });
            } else if (editBtn.id === "edit-user") {
                const [current, max] = value.split("/").map(Number);
                if (current === 10) {
                    showError("Cannot change total users. Room is already full!");
                    span.classList.remove("hidden");
                    editBtn.classList.remove("hidden");
                    return;
                }
                let options = "";
                for (let i = current; i <= 10; i++) {
                    options += `<option value="${i}" class="bg-gray-800 text-white">${i}</option>`;
                }
                const select = document.createElement("select");
                select.innerHTML = options;
                select.classList.add(...selectStylesUser.split(" "));
                select.id = "user-select";
                select.name = "total-users";
                wrapperDiv.appendChild(select);
                wrapperDiv.appendChild(checkIcon);
                parentDiv.appendChild(wrapperDiv);
                checkIcon.addEventListener("click", function () {
                    span.innerText = `: ${current}/${select.value}`;
                    span.classList.remove("hidden");
                    editBtn.classList.remove("hidden");
                    wrapperDiv.remove();
                    changeNoOfParticipants(select.value);
                });
            } else if (editBtn.id === "edit-time") {
                const timeOptions = [
                    { text: "30 min", value: "0 30 0" },
                    { text: "1 hour", value: "1 0 0" },
                    { text: "1 hour 30 min", value: "1 30 0" },
                    { text: "2 hours", value: "2 0 0" },
                    { text: "2 hours 30 min", value: "2 30 0" },
                    { text: "3 hours", value: "3 0 0" }
                ];
                let options = timeOptions.map(opt =>
                    `<option value="${opt.value}" class="bg-gray-800 text-white">${opt.text}</option>`
                ).join("");
                const select = document.createElement("select");
                select.innerHTML = options;
                select.classList.add(...selectStylesTime.split(" "));
                select.id = "time-select";
                select.name = "remaining-time";
                wrapperDiv.appendChild(select);
                wrapperDiv.appendChild(checkIcon);
                parentDiv.appendChild(wrapperDiv);
                checkIcon.addEventListener("click", function () {
                    const selectedText = select.selectedOptions[0].text;
                    const [hour, minute, second] = select.value.split(" ").map(Number);
                    span.innerText = `: ${selectedText}`;
                    span.classList.remove("hidden");
                    editBtn.classList.remove("hidden");
                    wrapperDiv.remove();
                    startCountdown(hour, minute, second);
                    let newTime = `${hour}:${minute}:${second}`;
                    changeRoomTime(newTime);
                });
            }
            parentDiv.insertBefore(wrapperDiv, editBtn);
        });
    });
});

let countdownInterval;

function startCountdown(hours, minutes, seconds) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    let now = new Date();
    let currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    let inputSeconds = hours * 3600 + minutes * 60 + seconds;

    if (inputSeconds <= currentSeconds) {
        inputSeconds += 24 * 3600;
    }

    let remainingSeconds = inputSeconds - currentSeconds;

    let warnedTimes = [60, 30, 10, 5, 0];

    function showWarningMessage(timeLeft) {
        if (timeLeft === 60) {
            showMessage("The room will close in 1 minute.");
        } else if (timeLeft === 30) {
            showMessage("The room will close in 30 seconds.");
        } else if (timeLeft === 10) {
            showMessage("The room will close in 10 seconds.");
        } else if (timeLeft === 5) {
            showMessage("The room will close in 5 seconds.");
        }
    }

    function updateTime() {
        if (remainingSeconds <= 0) {
            document.getElementById("time-remaining").innerText = "00:00:00";
            showMessage("The room is closing now.");
            closeRoom();
            clearInterval(countdownInterval);
            return;
        }

        let h = Math.floor(remainingSeconds / 3600);
        let m = Math.floor((remainingSeconds % 3600) / 60);
        let s = remainingSeconds % 60;

        document.getElementById("time-remaining").innerText =
            String(h).padStart(2, '0') + ":" +
            String(m).padStart(2, '0') + ":" +
            String(s).padStart(2, '0');

        if (warnedTimes.includes(remainingSeconds)) {
            showWarningMessage(remainingSeconds);
        }

        remainingSeconds--;
    }

    updateTime();
    countdownInterval = setInterval(updateTime, 1000);
}


function applyThemeClasses() {
    const roomMode = localStorage.getItem("roomMode");
    document.querySelectorAll("#share-file, #share-text, #share-chat").forEach((el) => {
        el.classList.remove("bg-slate-900", "bg-gray-200", "border", "rounded-t-lg", "border-b-0", "text-white", "text-black", "border-r-0");
        if (el.classList.contains("open")) {
            el.classList.add("border", "rounded-t-lg", "border-b-0", "outline-0");
            el.classList.add("border-b");
            if (roomMode === "dark") {
                el.classList.remove("border-black");
                el.classList.add("border-slate-900", "bg-slate-900", "text-white", "border-white");
            } else {
                el.classList.remove("border-white");
                el.classList.add("border-gray-200", "bg-gray-200", "text-black", "border-black");
            }
            if (el.id === "share-file") {
                el.classList.add("border-l-0", "rounded-tl-none");
            }
            if (el.id === "share-chat") {
                el.classList.add("border-r-0", "rounded-tr-none");
            }
        } else {
            el.classList.add("border-b");
            if (roomMode === "dark") {
                el.classList.remove("border-black");
                el.classList.add("border-white", "text-white");
            } else {
                el.classList.remove("border-white");
                el.classList.add("border-black", "text-white");
            }
        }
    });
}

function toggleShareType(activeId) {
    document.querySelectorAll("#share-file, #share-text,#share-chat").forEach((el) => {
        el.classList.remove("open");
    });

    const activeBtn = document.getElementById(activeId);
    activeBtn.classList.add("open");

    document.getElementById("file-section").classList.toggle("hidden", activeId !== "share-file");
    document.getElementById("text-section").classList.toggle("hidden", activeId !== "share-text");
    document.getElementById("chat-section").classList.toggle("hidden", activeId !== "share-chat");

    applyThemeClasses();
}

document.querySelectorAll("#share-file, #share-text,#share-chat").forEach((btn) => {
    btn.addEventListener("click", function () {
        toggleShareType(this.id);
    });
});

function formatSize(size) {
    if (size < 1024) return size + " B";
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    else return (size / (1024 * 1024)).toFixed(2) + " MB";
}

async function updateFileDisplay() {
    let totalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
    alert("File display 1")
    filesArray.forEach((file, index) => {
        if (![...fileList.children].some(el => el.dataset.fileName === file.name)) {
            const fileItem = document.createElement("div");
            fileItem.dataset.fileName = file.name;
            fileItem.className = "flex justify-between w-full items-center bg-gray-700 p-3 rounded-lg gap-2 border-l-4 border-cyan-500 border change-file";

            fileItem.innerHTML = `
                <div class="flex flex-col gap-2 items-start w-[70%]">
                    <span class="text-sm sm:text-base font-medium truncate w-full overflow-hidden whitespace-nowrap text-ellipsis">${file.name}</span>
                    <span class="text-xs sm:text-sm">You</span>
                </div>
                <div class="flex flex-col gap-2 items-center justify-center">
                    <div class="flex gap-3 items-center">
                        <button class="text-emerald-500 hover:text-emerald-600 text-xs sm:text-sm" onclick="downloadFile(${index})">
                            <i class="fa-solid fa-download"></i>
                        </button>
                        <button onclick="removeFile(event, ${index})" id="${file.name}" class="text-red-500 hover:text-red-600 text-xs sm:text-sm">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <span class="text-[10px] sm:text-sm">${formatSize(file.size)}</span>
                </div>
            `;

            fileList.appendChild(fileItem);
        }
        alert("File display end")
    });

    fileLimitDisplay.textContent = `Max Files: ${maxFiles}, Added: ${filesArray.length}/${maxFiles} | Max Total Size: 500MB, Used: ${formatSize(totalSize)}`;

    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }

    if (filesArray.length > 0) {
        dropzone.classList.add("hidden");
        fileListContainer.classList.remove("hidden");
    } else {
        dropzone.classList.remove("hidden");
        fileListContainer.classList.add("hidden");
    }
}

function removeFile(event, index) {
    const fileName = event.currentTarget.id
    if (confirm("Are you sure you want to delete this file?")) {
        let fileId = roomData.code + `_${fileName}`;
        deleteFile(fileId);
        filesArray.splice(index, 1);
        updateFileDisplay();
    }
}

function downloadFile(index) {
    const file = filesArray[index];

    if (file.url) {
        fetch(file.url)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch(error => console.error("Download failed:", error));
    } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

function handleFileUpload(input, event) {
    alert("Inside file 1")

    if (event) {
        event.preventDefault();
        event.stopPropagation(); // Also stop propagation
    }

    let newFiles = Array.from(input.files);
    alert("Inside file 2")
    let availableSlots = maxFiles - filesArray.length;
    let currentTotalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
    let validFiles = [];

    alert("Inside file 3")

    if (newFiles.length > availableSlots) {
        showMessage(`Only ${availableSlots} more files can be uploaded.`);
        newFiles = newFiles.slice(0, availableSlots);
    }

    alert("INside file 4")

    newFiles.forEach(file => {
        alert("file looo 1")
        let isDuplicate = filesArray.some(existingFile =>
            existingFile.name === file.name && existingFile.size === file.size
        );
        alert("Fle loop 2")
        let isAlreadyDisplayed = [...fileList.children].some(fileItem => {
            let fileName = fileItem.querySelector("span").textContent.trim();
            let fileSizeElement = fileItem.querySelector("span[class*='text-'][class*='sm:text-sm']");

            alert("File loop 3")
            if (!fileSizeElement) return false;

            let fileSize = fileSizeElement.textContent.trim();
            return fileName === file.name && fileSize === formatSize(file.size);
        });
        alert("File loop 4")
        if (isDuplicate || isAlreadyDisplayed) {
            showMessage(`"${file.name}" is already added.`);
        } else if (currentTotalSize + file.size > maxTotalSize) {
            showMessage(`Adding "${file.name}" exceeds the 500MB total size limit.`);
        } else {
            file.uploadTime = Date.now();
            validFiles.push(file);
            currentTotalSize += file.size;
        }
    });

    alert("Inside file 5")
    if (validFiles.length > 0) {
        filesArray.push(...validFiles);
        updateFileDisplay();
        alert("file loop 8")
        const alp = "Ola"
        console.log(event)
        processFiles(validFiles)
        showMessage("Sharing File...");
    }
}

function processFiles(files) {

    files.forEach(file => uploadFile(file));
}

fileInput.addEventListener("change", (e) => {
    e.preventDefault();
    alert("File 1")
    handleFileUpload(fileInput,e);
    return false;
});
moreFileInput.addEventListener("change", (e) => {
    e.preventDefault();
    alert("File  2")
    handleFileUpload(moreFileInput,e);
    return false;
});
dropzone.addEventListener("click", (e) => {
    fileInput.click();
});

dropzone.removeEventListener("dragover", preventDefault);
dropzone.removeEventListener("dragleave", removeDragStyle);
dropzone.removeEventListener("drop", handleDrop);

dropzone.addEventListener("dragover", preventDefault);
dropzone.addEventListener("dragleave", removeDragStyle);
dropzone.addEventListener("drop", handleDrop);

function preventDefault(event) {
    event.preventDefault();
    dropzone.classList.add("bg-gray-600");
}

function removeDragStyle() {
    dropzone.classList.remove("bg-gray-600");
}

function handleDrop(event) {
    event.preventDefault();
    dropzone.classList.remove("bg-gray-600");
    handleFileUpload(event.dataTransfer, event);
    return false;
}

addMoreBtn.addEventListener("click", () => moreFileInput.click());

document.getElementById("add-text").addEventListener("click", addNewTextField);

function addNewTextField() {
    if (textFieldCount >= 5) {
        this.classList.add("hidden");
        return;
    }

    textFieldCount++;

    const textContainer = document.getElementById("text-container");
    const newTextField = document.createElement("div");

    newTextField.className = "w-full rounded-lg border p-4 min-h-[380px] relative text-field";
    newTextField.setAttribute("id", `text-field-${textFieldCount}`);
    newTextField.innerHTML = `
            <div class="hidden remove-text">
                <i class="fa-solid fa-times absolute top-3 left-3 text-red-600"></i>
            </div>
            <div class="share-text">
                <i class="fa-solid fa-check absolute top-3 right-3 text-emerald-400"></i>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-3 mt-4 mb-3">
               <input type="text" id="title-input-${textFieldCount}" placeholder="Enter file name"
                    class="text-name border p-3 rounded min-w-48 sm:w-auto flex-1 change-text bg-gray-800">
                <div class="flex justify-start">
                <select id="format-select-${textFieldCount}" class="format-select w-36 select2 border p-2 rounded bg-gray-800">
                        <option value="txt">TXT (.txt)</option>
                        <option value="pdf">PDF (.pdf)</option>
                        <option value="docx">Word (.docx)</option>
                        <option value="md">Markdown (.md)</option>
                        <option value="rtf">Rich Text (.rtf)</option>
                        <option value="html">HTML (.html)</option>
                        <option value="css">CSS (.css)</option>
                        <option value="js">JavaScript (.js)</option>
                        <option value="ts">TypeScript (.ts)</option>
                        <option value="php">PHP (.php)</option>
                        <option value="py">Python (.py)</option>
                        <option value="java">Java (.java)</option>
                        <option value="c">C (.c)</option>
                        <option value="cpp">C++ (.cpp)</option>
                        <option value="cs">C# (.cs)</option>
                        <option value="sql">SQL (.sql)</option>
                        <option value="json">JSON (.json)</option>
                        <option value="xml">XML (.xml)</option>
                        <option value="yaml">YAML (.yaml)</option>
                        <option value="csv">CSV (.csv)</option>
                        <option value="bat">Batch File (.bat)</option>
                        <option value="sh">Shell Script (.sh)</option>
                        <option value="swift">Swift (.swift)</option>
                        <option value="kt">Kotlin (.kt)</option>
                        <option value="rb">Ruby (.rb)</option>
                        <option value="go">Go (.go)</option>
                        <option value="rs">Rust (.rs)</option>
                        <option value="dart">Dart (.dart)</option>
                        <option value="lua">Lua (.lua)</option>
                        <option value="perl">Perl (.pl)</option>
                    </select>
                    <button id="download-btn-${textFieldCount}" class="text-emerald-500 hover:text-emerald-600 mx-3">
                        <i class="fa-solid fa-download download text-lg sm:text-xl"></i>
                    </button>
                    </div>
                </div>
                <div class="relative">
                    <textarea id="text-box-${textFieldCount}" rows="10" placeholder="Enter text here..."
                        class="text-box w-full p-3 border rounded resize-none change-text bg-gray-800"></textarea>
                </div>
                <div class="flex justify-around sm:justify-center gap-1 sm:gap-2 mt-2">
                    <button
                        class="bg-emerald-600 border text-xs sm:text-sm text-white change-border px-3 sm:px-4 py-2 rounded-md flex items-center gap-1 sm:gap-2 copy-btn">
                            <i class="fa-solid fa-copy"></i> Copy Text
                      </button>
                    <button
                        class="bg-red-600 border text-xs sm:text-sm text-white change-border px-3 sm:px-4 py-2 rounded-md flex items-center gap-1 sm:gap-2 clear-btn">
                            <i class="fa-solid fa-delete-left"></i> Clear Text
                    </button>
                </div>
    `;
    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }
    textContainer.appendChild(newTextField);
    updateRemoveIcons();
    if (textFieldCount === 5) {
        document.getElementById("add-text").classList.add("hidden");
    }
    if (textFieldCount > 1) {
        increaseTextField(`text-field-${textFieldCount}`);
    }
}

$(document).ready(function () {
    window.applyTheme = function () {
        const isDarkMode = localStorage.getItem("roomMode") === "dark";
        const select2Style = document.documentElement.style;
        if (isDarkMode) {
            select2Style.setProperty("--select2-bg", "#1f2937");
            select2Style.setProperty("--select2-border", "white");
            select2Style.setProperty("--select2-text", "white");
            select2Style.setProperty("--select2-highlight", "#4a5568");
        } else {
            select2Style.setProperty("--select2-bg", "white");
            select2Style.setProperty("--select2-border", "black");
            select2Style.setProperty("--select2-text", "black");
            select2Style.setProperty("--select2-highlight", "#ddd");
        }
    };

    function applySelect2() {
        $(".format-select").each(function () {
            if (!$(this).hasClass("select2-applied")) {
                $(this).select2({
                    placeholder: "Select File Format",
                    allowClear: true
                }).addClass("select2-applied");
            }
        });
        applyTheme();
    }
    applySelect2();
    $(document).on("click", "#add-text", function () {
        setTimeout(() => {
            applySelect2();
        }, 100);
    });
});

document.addEventListener("click", function (e) {
    if (e.target.closest(".remove-text")) {
        if (textFieldCount > 1) {
            let textField = e.target.closest(".text-field");
            let textFieldId = textField.getAttribute("id");
            let confirmDelete = confirm("Are you sure you want to delete this text field?");
            if (confirmDelete) {
                textField.remove();
                decreaseField(textFieldId);
                textFieldCount--;
                updateRemoveIcons();
                document.getElementById("add-text").classList.remove("hidden");
            }
        }
    }
    if (e.target.closest(".share-text")) {
        let textField = e.target.closest(".text-field");
        let textFieldId = textField.getAttribute("id");
        let textFieldNumber = textFieldId.split("-").pop();
        let textArea = document.getElementById(`text-box-${textFieldNumber}`);
        let text = textArea.value.trim();
        if (text) {
            sendTextToBackend(textFieldId, text);
        }
    }
});

function updateRemoveIcons() {
    let removeIcons = document.querySelectorAll(".remove-text");
    if (textFieldCount > 1) {
        removeIcons.forEach(el => el.classList.remove("hidden"));
    } else {
        removeIcons.forEach(el => el.classList.add("hidden"));
    }
}

window.addEventListener("load", updateRemoveIcons);

function copyText(textAreaId) {
    const textArea = document.getElementById(textAreaId);
    if (textArea) {
        navigator.clipboard.writeText(textArea.value)
            .then(() => {
                showMessage("Text copied successfully!");
            })
            .catch(() => {
                showMessage("Failed to copy text!");
            });
    }
}

function clearText(textAreaId) {
    const textArea = document.getElementById(textAreaId);
    let confirmClear = confirm("Are you sure you want to clear this text?");
    if (confirmClear) {
        textArea.value = "";
        showMessage("Text clear successfully!");
    } else {
        showMessage("Failed to clear Text!");
    }
}

document.addEventListener("click", function (e) {
    if (e.target.closest(".copy-btn")) {
        const textAreaId = e.target.closest(".text-field").querySelector("textarea").id;
        copyText(textAreaId);
    }
    if (e.target.closest(".clear-btn")) {
        const textAreaId = e.target.closest(".text-field").querySelector("textarea").id;
        clearText(textAreaId);
        let textField = e.target.closest(".text-field");
        let textFieldId = textField.getAttribute("id");
        removeText(textFieldId);
    }
});

function showMessage(text) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = text;
    messageDiv.classList.remove("hidden");
    setTimeout(() => {
        messageDiv.classList.add("hidden");
    }, 3000);
}

function showError(text) {
    const errorDiv = document.getElementById("error");
    errorDiv.textContent = text;
    errorDiv.classList.remove("hidden");
    setTimeout(() => {
        errorDiv.classList.add("hidden");
    }, 5000);
}

document.addEventListener("click", function (e) {
    if (e.target.closest(".download")) {
        downloadTextAsFile(e.target.closest(".download"));
    }
});

function downloadTextAsFile(button) {
    let textField = button.closest(".text-field");

    let fileName = textField.querySelector(".text-name").value.trim();
    let fileFormat = textField.querySelector(".format-select").value;
    let fileContent = textField.querySelector(".text-box").value;

    if (!fileName) {
        alert("Please enter a file name.");
        return;
    }

    if (!fileContent) {
        alert("File content is empty!");
        return;
    }

    let mimeType = "text/plain";
    let blobData = fileContent;

    switch (fileFormat) {
        case "html":
            mimeType = "text/html";
            blobData = `<!DOCTYPE html>\n<html>\n<head>\n<title>${fileName}</title>\n</head>\n<body>\n${fileContent}\n</body>\n</html>`;
            break;
        case "css":
            mimeType = "text/css";
            break;
        case "js":
            mimeType = "application/javascript";
            break;
        case "ts":
            mimeType = "application/typescript";
            break;
        case "json":
            mimeType = "application/json";
            blobData = JSON.stringify(JSON.parse(fileContent), null, 2);
            break;
        case "xml":
            mimeType = "application/xml";
            break;
        case "yaml":
            mimeType = "text/yaml";
            break;
        case "csv":
            mimeType = "text/csv";
            break;
        case "md":
            mimeType = "text/markdown";
            break;
        case "rtf":
            mimeType = "application/rtf";
            break;
        case "sql":
            mimeType = "application/sql";
            break;
        case "sh":
            mimeType = "application/x-sh";
            break;
        case "bat":
            mimeType = "application/x-bat";
            break;
        case "py":
            mimeType = "application/x-python";
            break;
        case "php":
            mimeType = "application/x-php";
            break;
        case "java":
            mimeType = "text/x-java-source";
            break;
        case "c":
        case "cpp":
            mimeType = "text/x-c";
            break;
        case "cs":
            mimeType = "text/x-csharp";
            break;
        case "swift":
            mimeType = "application/x-swift";
            break;
        case "kt":
            mimeType = "text/x-kotlin";
            break;
        case "rb":
            mimeType = "application/x-ruby";
            break;
        case "go":
            mimeType = "text/x-go";
            break;
        case "rs":
            mimeType = "text/rust";
            break;
        case "dart":
            mimeType = "application/dart";
            break;
        case "lua":
            mimeType = "text/x-lua";
            break;
        case "perl":
            mimeType = "application/x-perl";
            break;
        case "docx":
            createDocx(fileContent, fileName);
            return;
        case "pdf":
            createPDF(fileContent, fileName);
            return;
    }

    let blob = new Blob([blobData], { type: mimeType });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${fileFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function createDocx(content, fileName) {
    let doc = new docx.Document({
        sections: [
            {
                properties: {},
                children: [
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun(content),
                        ],
                    }),
                ],
            },
        ],
    });

    docx.Packer.toBlob(doc).then((blob) => {
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

function createPDF(content, fileName) {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    doc.text(content, 10, 10);
    doc.save(`${fileName}.pdf`);
}

chatInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});

const chatBox = document.getElementById("chats-box");
document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.querySelector(".fa-paper-plane").parentElement;

    sendButton.addEventListener("click", async function () {
        const message = chatInput.value.trim();
        if (!message) return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
        chatInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
        let userData = JSON.parse(sessionStorage.getItem('userData'));
        try {
            const response = await fetch("http://127.0.0.1:8000/chat/addChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: roomData.code, sender: userData.username, message: message, timing: formattedTime }),
            });

            if (response.ok) {
                chatBox.appendChild(createSentMessage(message, formattedTime));
                chatInput.value = "";
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                showMessage("Message not sent! Please try again.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
});

function createSentMessage(message, time) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex flex-col items-end";

    messageDiv.innerHTML = `
        <span class="text-sm font-semibold">You</span>
        <div class="bg-emerald-600 change-chat p-3 rounded-lg max-w-[80%] sm:max-w-xs w-fit border">
            <p>${message}</p>
            <span class="text-xs block text-right mt-1">${time}</span>
        </div>
    `;
    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }
    return messageDiv;
}


function createReceivedMessage(name, message, time) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex flex-col";
    messageDiv.innerHTML = `
        <span class="text-sm font-semibold username">${name}</span>
        <div class="bg-cyan-600 change-chat p-3 rounded-lg max-w-[80%] sm:max-w-xs w-fit border">
            <p>${message}</p>
            <span class="text-xs block text-right mt-1">${time}</span>
        </div>
    `;
    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }
    return messageDiv;
}

function addUsers(usersArray) {
    const container = document.getElementById("user-container");
    container.innerHTML = "";
    const userCountElement = document.getElementById("no-of-user");
    let [currentUsers, maxUsers] = userCountElement.textContent.split("/").map(num => parseInt(num.trim(), 10) || 0);
    usersArray.forEach(user => {
        if (currentUsers >= maxUsers) return;
        const card = document.createElement("div");
        card.className = `w-60 bg-gray-800 change-role p-4 rounded-lg shadow-lg border-l-4 border flex justify-between items-center ${user.role === "Host" ? "border-emerald-500" : "border-cyan-500"}`;
        const userInfo = `
            <div>
                <h3 class="text-sm sm:text-base font-semibold username">${user.name}</h3>
                <p class="text-xs sm:text-sm ${user.role === "Host" ? "text-emerald-500" : "text-cyan-500"}">${user.role}</p>
            </div>`;
        const removeIcon = user.role === "Guest" && userData.role !== "Guest"
            ? `<i class="fa-solid fa-times openModal text-red-500 text-lg cursor-pointer hover:text-red-400 remove-guests"></i>`
            : "";
        card.innerHTML = userInfo + removeIcon;
        container.appendChild(card);
        currentUsers++;
        if (userData.username === user.name) {
            showMessage("You joined the room.");
        } else {
            showMessage(`${user.name} joined the room.`);
        }
    });
    userCountElement.textContent = `${currentUsers}/${maxUsers}`;
    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }
}

restrictMode.addEventListener("click", () => {
    if (userData.role === "Host") {
        if (toggleRestrict.classList.contains("fa-house")) {
            toggleRestrict.classList.remove("fa-house");
            toggleRestrict.classList.add("fa-house-lock");
            requestBox.classList.remove("hidden");
            updateRoomRestriction(true);
        } else {
            toggleRestrict.classList.remove("fa-house-lock");
            toggleRestrict.classList.add("fa-house");
            requestBox.classList.add("hidden");
            updateRoomRestriction(false);
        }
    }
});

function showJoinRequest(username) {
    const requestContainer = document.getElementById("request");
    const userCountElement = document.getElementById("no-of-user");
    let [currentUsers, maxUsers] = userCountElement.textContent.trim().split("/").map(num => parseInt(num.trim(), 10) || 0);

    if (currentUsers >= maxUsers) {
        showError(`Room is full! Cannot add ${username}.`);
        return;
    }

    if (toggleRestrict.classList.contains("fa-house")) {
        userCountElement.textContent = `${currentUsers + 1}/${maxUsers}`;
        showMessage(`${username} added successfully!`);
        return;
    }

    if (userData.role === "Host") {
        requestBox.classList.remove("hidden");
        const inviteCard = document.createElement("div");
        inviteCard.className = `relative bg-gray-900 change-request border-l-4 border-cyan-500 p-2 rounded-lg shadow-lg flex items-center gap-2 
        w-[200px] h-[60px] justify-between border transition-all hover:scale-105 duration-200`;

        const userInfo = document.createElement("div");
        userInfo.className = "flex-grow";
        userInfo.innerHTML = `
        <h3 class="text-sm sm:text-base font-semibold">${username}</h3>
        <p class="text-xs sm:text-sm text-cyan-400 mt-1">Requesting to Join</p>
    `;

        const timerAndActions = document.createElement("div");
        timerAndActions.className = "flex flex-col items-center justify-center gap-2 absolute top-2 right-2";

        const timer = document.createElement("span");
        timer.className = "text-xs sm:text-sm font-mono w-14 text-center";
        let timeLeft = 120;
        timer.textContent = `${timeLeft}s`;

        const countdown = setInterval(() => {
            timeLeft--;
            timer.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                inviteCard.remove();
                showMessage(`${username}'s request expired.`);
                hideRequestBoxIfEmpty();
            }
        }, 1000);

        const actions = document.createElement("div");
        actions.className = "flex gap-3";

        const acceptIcon = document.createElement("i");
        acceptIcon.className = "fa-solid fa-check text-green-400 text-xs sm:text-sm cursor-pointer transition-transform transform hover:scale-125 hover:text-green-300";
        acceptIcon.addEventListener("click", () => {
            let [updatedUsers, maxUsers] = userCountElement.textContent.split("/").map(num => parseInt(num.trim(), 10) || 0);
            if (updatedUsers >= maxUsers) {
                showError(`Room is full! Cannot add ${username}.`);
                return;
            }
            clearInterval(countdown);
            approveUser(username, roomData.code);
            inviteCard.remove();
            showMessage(`${username} added successfully!`);
            hideRequestBoxIfEmpty();
        });

        const rejectIcon = document.createElement("i");
        rejectIcon.className = "fa-solid fa-times text-red-400 text-xs sm:text-sm cursor-pointer transition-transform transform hover:scale-125 hover:text-red-300";
        rejectIcon.addEventListener("click", () => {
            clearInterval(countdown);
            rejectUser(username, roomData.code);
            inviteCard.remove();
            showMessage(`${username} request declined.`);
            hideRequestBoxIfEmpty();
        });

        actions.appendChild(acceptIcon);
        actions.appendChild(rejectIcon);

        timerAndActions.appendChild(timer);
        if (userData.role === "Host") {
            timerAndActions.appendChild(actions);
        }

        inviteCard.appendChild(userInfo);
        inviteCard.appendChild(timerAndActions);
        requestContainer.appendChild(inviteCard);
    }

    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }
}


function hideRequestBoxIfEmpty() {
    const requestContainer = document.getElementById("request");
    if (requestContainer.childElementCount === 0) {
        requestBox.classList.add("hidden");
    }
}

function displayValue() {
    let roomData = JSON.parse(sessionStorage.getItem('roomData'));
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    if (roomData && userData) {
        document.getElementById('room-code').textContent = roomData.code;
        document.getElementById('username').innerHTML = userData.username;
        document.getElementById('user-role').textContent = userData.role;
        document.getElementById('no-of-user').textContent = `: ${roomData.current_participants}/${roomData.max_participants}`;
        let timeParts = roomData.time.split(":");
        let hours = parseInt(timeParts[0], 10);
        let minutes = parseInt(timeParts[1], 10);
        let seconds = parseInt(timeParts[2], 10);
        startCountdown(hours, minutes, seconds);
        let restrictToggle = document.getElementById('toggle-restrict');
        if (roomData.restrict === true) {
            restrictToggle.classList.remove('fa-house');
            restrictToggle.classList.add('fa-house-lock');
        } else {
            restrictToggle.classList.remove('fa-house-lock');
            restrictToggle.classList.add('fa-house');
        }
    } else {
        console.error('No room data found in localStorage.');
    }
}

const encodedUsername = encodeURIComponent(userData.username);
const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomData.code}/${encodedUsername}`);

socket.addEventListener("message", (event) => {
    let receivedData = JSON.parse(event.data);
    switch (receivedData.type) {
        case "chat":
            updateChat(receivedData.data);
            break;
        case "user":
            updateUser(receivedData.data);
            break;
        case "file":
            if (receivedData.data.shared_by !== userData.username) {
                showMessage(`${receivedData.data.shared_by} shared file`);
                handleReceivedFileUpload(receivedData.data);
            } else {
                showMessage("Shared File successfully");
            }
            break;
        case "text":
            if (receivedData.data.username === userData.username) {
                showMessage(`You shared text`)
            } else {
                showMessage(`${receivedData.data.username} shared text`)
                updateTextArea(receivedData.data.text_id, receivedData.data.text_content);
            }
            break;
        case "removeUser":
            updateRemovedUser(receivedData.data, "removed");
            break;
        case "userLeft":
            updateRemovedUser(receivedData.data, "left");
            break;
        case "roomClosed":
            updateRemovedUser(receivedData.data, "closed");
            break;
        case "joinRequest":
            showJoinRequest(receivedData.data.username);
            break;
        case "increaseField":
            if (receivedData.data.username === userData.username) {
                showMessage(`You added new text field`);
            } else {
                addNewTextFieldWithId(receivedData.data.text_id);
                showMessage(`${receivedData.data.username} added new text field`);
            }
            break;
        case "decreaseField":
            if (receivedData.data.username === userData.username) {
                showMessage(`You remove text field`);
            } else {
                removeTextFieldById(receivedData.data.text_id);
                showMessage(`${receivedData.data.username} removed text field`);
            }
            break;
        case "removeText":
            if (receivedData.data.username === userData.username) {
                showMessage(`You clear text`);
            } else {
                let textFieldId = receivedData.data.text_id;
                let textFieldNumber = textFieldId.split("-").pop();
                let textArea = document.getElementById(`text-box-${textFieldNumber}`);
                textArea.value = "";
                showMessage(`${receivedData.data.username} clear text`);
            }
            break;
        case "changeUsername":
            updateUsername(receivedData.data);
            showMessage(`${receivedData.data.oldUsername} changed name to ${receivedData.data.newUsername}`);
            break;
        case "changeNoOfUsers":
            updateParticipants(receivedData.data);
            showMessage(`Max No of guests change from ${receivedData.data.old_max_participants} to ${receivedData.data.max_participants}`);
            break;
        case "changeEndTime":
            updateEndTime(receivedData.data);
            showMessage("Room time is changed")
            break;
        case "changeRestriction":
            updateRestriction(receivedData.data);
            break;
        case "closeRoom":
            showMessage("The room time has expired. Closing the room now.")
            setTimeout(window.location.href = "./index.html", 5000)
        case "block":
            if (receivedData.data.blocked_username === userData.username) {
                blockedUser();
                removeUserFromRoom();
                updateRemovedUser(receivedData.data.blocked_username, "blocked");
            } else {
                const userCards = document.querySelectorAll("#user-container .change-role");
                userCards.forEach(card => {
                    const userNameElement = card.querySelector("h3");
                    if (userNameElement && userNameElement.textContent === receivedData.data.blocked_username) {
                        card.remove();
                    }
                });
                showMessage(receivedData.data.message);
                let roomData = JSON.parse(sessionStorage.getItem('roomData')) || {};
                roomData.current_participants = receivedData.data.current_participants;
                sessionStorage.setItem('roomData', JSON.stringify(roomData));
                displayValue();
            }
            break;
    }
});

function updateUser(data) {
    let roomData = JSON.parse(sessionStorage.getItem('roomData')) || {};
    roomData.current_participants = data.current_participants;
    sessionStorage.setItem('roomData', JSON.stringify(roomData));
    displayValue();
    getUser();
}

function updateRemovedUser(data, str) {
    if (str === "closed") {
        showMessage(data.message);
        window.location.href = "./index.html";
        return;
    }
    if (data.username === userData.username) {
        if (str === "remove") {
            showMessage("You have been removed from the room");
        } else if (str === "left") {
            showMessage("You have left the room");
        } else {
            showMessage("You has been blocked");
        }
        window.location.href = "./index.html";
        return;
    }
    const userCards = document.querySelectorAll("#user-container .change-role");
    userCards.forEach(card => {
        const userNameElement = card.querySelector("h3");
        if (userNameElement && userNameElement.textContent === data.username) {
            card.remove();
        }
    });
    showMessage(data.message);
    let roomData = JSON.parse(sessionStorage.getItem('roomData')) || {};
    roomData.current_participants = data.current_participants;
    sessionStorage.setItem('roomData', JSON.stringify(roomData));
    displayValue();
}

function updateChat(data) {
    if (data.sender === userData.username) {
        return
    } else {
        chatBox.appendChild(createReceivedMessage(data.sender, data.message, data.timing));
        showMessage(`${data.sender} sent a chat.`);
    }
    chatInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getUser() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/user/getUser?code=${roomData.code}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        addUsers(data.data);
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

async function fetchChatMessages() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/chat/getChat?code=${roomData.code}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const chatData = await response.json();
        if (chatData.error) {
            console.error("Error fetching chats:", chatData.error);
            return [];
        }
        sortChats(chatData);
    } catch (error) {
        console.error("Failed to fetch chats:", error);
        return [];
    }
}

function sortChats(data) {
    data.forEach((chat) => {
        if (chat.sender === userData.username) {
            chatBox.appendChild(createSentMessage(chat.message, chat.timing));
        } else {
            chatBox.appendChild(createReceivedMessage(chat.sender, chat.message, chat.timing));
        }
        chatInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    })
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("openModal")) {
        const card = event.target.closest(".change-role");
        if (card) {
            guestName = card.querySelector("h3").textContent.trim();
        }
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.overflow = "hidden";
    }
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
});

removeGuest.addEventListener("click", async () => {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/user/removeUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: roomData.code, username: userData.username, guestName: guestName, userId: userData.userId, role: userData.role }),
        });
        const result = await response.json();
        modal.classList.remove("flex");
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";
        if (response.ok) {
            return
        } else {
            console.error("Error removing user:", result.message);
        }
    } catch (error) {
        console.error("Request failed:", error);
    }
});

document.querySelectorAll(".openLeaveRoom").forEach((btn) => {
    btn.addEventListener("click", () => {
        leaveRoom.classList.remove("hidden");
        leaveRoom.classList.add("flex");
        document.body.style.overflow = "hidden";

        if (userData.role === "Host") {
            modalText.textContent = "Do you want to Close this room?\nAll users will be removed from the room and all data will be lost.";
        } else {
            modalText.textContent = "Do you want to leave this room?";
        }
    });
});

cancel.addEventListener("click", () => {
    leaveRoom.classList.remove("flex");
    leaveRoom.classList.add("hidden");
    document.body.style.overflow = "auto";
});

async function removeUserFromRoom() {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/room/leaveRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: roomData.code,
                username: userData.username,
                userId: userData.userId,
                role: userData.role
            }),
        });

        const result = await response.json();

        if (response.ok) {
            return;
        } else {
            console.error("Error removing user:", result.message);
            return;
        }
    } catch (error) {
        console.error("Request failed:", error);
        return false;
    }
}

leave.addEventListener("click", async () => {
    const success = await removeUserFromRoom();

    if (success) {
        leaveRoom.classList.remove("flex");
        leaveRoom.classList.add("hidden");
        document.body.style.overflow = "auto";
    }
});


async function approveUser(username, code) {
    await fetch("http://127.0.0.1:8000/room/approveUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, username: username, hostName: userData.username, userId: userData.userId })
    });
}

async function rejectUser(username, code) {
    await fetch("http://127.0.0.1:8000/room/rejectUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, username: username, hostName: userData.username, userId: userData.userId })
    });
}

async function changeUsername(username) {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    const requestData = {
        code: roomData.code,
        username: userData.username,
        newUsername: username,
        userId: userData.userId
    };

    try {
        const response = await fetch("http://localhost:8000/user/changeUsername", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (response.ok) {
            return;
        } else {
            alert("Failed to change username: " + data.detail);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
    }
}

function updateUsername(data) {
    let isUpdated = false;
    document.querySelectorAll(".username").forEach((name) => {
        let currentText = name.innerText.trim();
        if (currentText === data.oldUsername) {
            if (!isUpdated) {
                let userData = JSON.parse(sessionStorage.getItem('userData')) || {};
                if (userData.username === currentText) {
                    userData.username = data.newUsername;
                    sessionStorage.setItem('userData', JSON.stringify(userData));
                    isUpdated = true;
                }
            }
            name.innerText = data.newUsername;
        }
    });
}

async function changeNoOfParticipants(newMaxParticipant) {
    try {
        let userData = JSON.parse(sessionStorage.getItem('userData'));
        const response = await fetch("http://127.0.0.1:8000/room/changeNoOfParticipant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: roomData.code,
                username: userData.username,
                user_id: userData.userId,
                new_max_participant: Number(newMaxParticipant)
            })
        });

        const data = await response.json();
        if (response.ok) {
            return;
        } else {
            alert(`Error: ${data.detail}`);
        }
    } catch (error) {
        console.error("Error updating participants:", error);
        alert("Failed to update participants.");
    }
}

function updateParticipants(data) {
    let roomData = JSON.parse(sessionStorage.getItem('roomData')) || {};
    roomData.max_participants = data.max_participants;
    sessionStorage.setItem('roomData', JSON.stringify(roomData));
    displayValue();
}

async function changeRoomTime(time) {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    const requestData = {
        code: roomData.code,
        username: userData.username,
        user_id: userData.userId,
        new_time: time
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/room/changeRoomTime", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        if (response.ok) {
            return;
        } else {
            alert(`Error: ${data.detail}`);
        }
    } catch (error) {
        console.error("Request failed:", error);
        alert("Failed to update room time.");
    }
}

function updateEndTime(data) {
    if (data && data.end_time) {
        let timeParts = data.end_time.split(":").map(Number);
        if (timeParts.length === 3) {
            startCountdown(timeParts[0], timeParts[1], timeParts[2]);
            let roomData = JSON.parse(sessionStorage.getItem('roomData')) || {};
            roomData.time = data.end_time;
            sessionStorage.setItem('roomData', JSON.stringify(roomData));
            displayValue();
        } else {
            console.error("Invalid time format received:", data.end_time);
        }
    } else {
        console.error("No valid end_time received.");
    }
}

async function updateRoomRestriction(value) {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch('http://127.0.0.1:8000/room/changeRestriction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: roomData.code,
                username: userData.username,
                user_id: userData.userId,
                new_restrict: Boolean(value)
            })
        });

        const data = await response.json();

        if (response.ok) {
            return;
        } else {
            console.error('Error:', data.detail || 'Unknown error');
        }
    } catch (error) {
        console.error('Error in updating room restrict:', error);
    }
}

function updateRestriction(data) {
    let roomData = JSON.parse(sessionStorage.getItem('roomData')) || {};
    roomData.restrict = data.restrict;
    sessionStorage.setItem('roomData', JSON.stringify(roomData));
    displayValue();
}

async function closeRoom() {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    const requestData = {
        code: roomData.code,
        username: userData.username,
        user_id: userData.userId
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/room/closeRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            return;
        } else {
            const errorData = await response.json();
            alert(errorData.detail || "Failed to close the room.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while closing the room.");
    }
}

async function uploadFile(file) {
    
    alert("upload file 1")
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    const formData = new FormData();
    formData.append("room_code", roomData.code);
    formData.append("user_id", userData.userId);
    formData.append("username", userData.username);
    formData.append("file", file);
    alert("upload file 2")
    try {
        const response = await fetch("http://127.0.0.1:8000/file/uploadFile", {
            method: "POST",
            body: formData
        });

       return
    } catch (error) {
        return;
    }
}

async function increaseTextField(id) {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/text/increaseField", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text_id: id,
                room_code: roomData.code,
                username: userData.username,
                user_id: userData.userId,
            })
        });

        const result = await response.json();
        if (result.ok) {
            return;
        }
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

function addNewTextFieldWithId(textFieldId) {
    if (textFieldCount >= 5) {
        document.getElementById("add-text").classList.add("hidden");
        return;
    }

    textFieldCount++;

    let textFieldNumber = textFieldId.split("-").pop();
    const textContainer = document.getElementById("text-container");
    const newTextField = document.createElement("div");

    newTextField.className = "w-full rounded-lg border p-4 min-h-[380px] relative text-field";
    newTextField.setAttribute("id", textFieldId);
    newTextField.innerHTML = `
            <div class="hidden remove-text">
                <i class="fa-solid fa-times absolute top-3 left-3 text-red-600"></i>
            </div>
            <div class="share-text">
                <i class="fa-solid fa-check absolute top-3 right-3 text-emerald-400"></i>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-3 mt-4 mb-3">
               <input type="text" id="title-input-${textFieldNumber}" placeholder="Enter file name"
                    class="text-name border p-3 rounded min-w-48 sm:w-auto flex-1 change-text bg-gray-800">
                <div class="flex justify-start">
                <select id="format-select-${textFieldNumber}" class="format-select w-36 select2 border p-2 rounded bg-gray-800">
                        <option value="txt">TXT (.txt)</option>
                        <option value="pdf">PDF (.pdf)</option>
                        <option value="docx">Word (.docx)</option>
                        <option value="md">Markdown (.md)</option>
                        <option value="rtf">Rich Text (.rtf)</option>
                        <option value="html">HTML (.html)</option>
                        <option value="css">CSS (.css)</option>
                        <option value="js">JavaScript (.js)</option>
                        <option value="ts">TypeScript (.ts)</option>
                        <option value="php">PHP (.php)</option>
                        <option value="py">Python (.py)</option>
                        <option value="java">Java (.java)</option>
                        <option value="c">C (.c)</option>
                        <option value="cpp">C++ (.cpp)</option>
                        <option value="cs">C# (.cs)</option>
                        <option value="sql">SQL (.sql)</option>
                        <option value="json">JSON (.json)</option>
                        <option value="xml">XML (.xml)</option>
                        <option value="yaml">YAML (.yaml)</option>
                        <option value="csv">CSV (.csv)</option>
                        <option value="bat">Batch File (.bat)</option>
                        <option value="sh">Shell Script (.sh)</option>
                        <option value="swift">Swift (.swift)</option>
                        <option value="kt">Kotlin (.kt)</option>
                        <option value="rb">Ruby (.rb)</option>
                        <option value="go">Go (.go)</option>
                        <option value="rs">Rust (.rs)</option>
                        <option value="dart">Dart (.dart)</option>
                        <option value="lua">Lua (.lua)</option>
                        <option value="perl">Perl (.pl)</option>
                    </select>
                    <button id="download-btn-${textFieldNumber}" class="text-emerald-500 hover:text-emerald-600 mx-3">
                        <i class="fa-solid fa-download download text-lg sm:text-xl"></i>
                    </button>
                    </div>
                </div>
                <div class="relative">
                    <textarea id="text-box-${textFieldNumber}" rows="10" placeholder="Enter text here..."
                        class="text-box w-full p-3 border rounded resize-none change-text bg-gray-800"></textarea>
                </div>
                <div class="flex justify-around sm:justify-center gap-1 sm:gap-2 mt-2">
                    <button
                        class="bg-emerald-600 border text-xs sm:text-sm text-white change-border px-3 sm:px-4 py-2 rounded-md flex items-center gap-1 sm:gap-2 copy-btn">
                            <i class="fa-solid fa-copy"></i> Copy Text
                      </button>
                    <button
                        class="bg-red-600 border text-xs sm:text-sm text-white change-border px-3 sm:px-4 py-2 rounded-md flex items-center gap-1 sm:gap-2 clear-btn">
                            <i class="fa-solid fa-delete-left"></i> Clear Text
                    </button>
                </div>
    `;

    if (localStorage.getItem("roomMode") === "dark") {
        darkMode();
    } else {
        lightMode();
    }

    textContainer.appendChild(newTextField);
    updateRemoveIcons();

    if (textFieldCount === 5) {
        document.getElementById("add-text").classList.add("hidden");
    }
}

async function decreaseField(id) {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/text/decreaseField", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text_id: id,
                room_code: roomData.code,
                username: userData.username,
                user_id: userData.userId,
            })
        });

        const result = await response.json();
        if (result.ok) {
            return;
        }
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

function removeTextFieldById(textFieldId) {
    let textField = document.getElementById(textFieldId);
    if (textField) {
        textField.remove();
        textFieldCount--;
        updateRemoveIcons();
        document.getElementById("add-text").classList.remove("hidden");
    } else {
        console.log("Text field not found:", textFieldId);
    }
}

async function sendTextToBackend(id, text) {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/text/addText", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text_id: id,
                text_content: text,
                room_code: roomData.code,
                username: userData.username,
                user_id: userData.userId
            })
        });

        const result = await response.json();
        if (result.ok) {
            return;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function updateTextArea(id, text) {
    let textField = document.getElementById(id);
    if (!textField && id === "text-field-1") {
        console.error("Text field not found!");
        return;
    }

    let textFieldNumber = id.split("-").pop();
    let textArea = document.getElementById(`text-box-${textFieldNumber}`);

    if (textArea) {
        textArea.value = text;
    } else {
        console.error("Text area not found!");
    }
}

async function removeText(id) {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/text/removeText", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text_id: id,
                room_code: roomData.code,
                username: userData.username,
                user_id: userData.userId,
            })
        });

        const result = await response.json();
        if (result.ok) {
            return;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getText() {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/text/getText", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                room_code: roomData.code,
                username: userData.username,
                user_id: userData.userId
            })
        });

        const data = await response.json();

        if (data?.data) {
            let n = data.data.textField;
            if (typeof n === "number" && n > 0) {
                for (let i = 2; i <= n; i++) {
                    addNewTextFieldWithId(`text-field-${i}`);
                }
            }
            if (data.data.texts?.length > 0) {
                data.data.texts.forEach((item) => {
                    updateTextArea(item.text_id, item.text_content);
                });
            }

        }
    } catch (error) {
        console.error("Error fetching texts:", error);
    }
}

const url = `http://127.0.0.1:5500/Frontend/html/index.html?room_code=${roomData.code}`;
new QRCode(document.getElementById("qrcode"), {
    text: url,
    width: 200,
    height: 200
});

document.querySelectorAll(".share-room").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.getElementById("showURL").classList.remove("hidden");
        document.getElementById("showURL").classList.add("flex");
    });
});

document.getElementById("close-share-room").addEventListener("click", hideModal);

function hideModal() {
    document.getElementById("showURL").classList.remove("flex");
    document.getElementById("showURL").classList.add("hidden");
}

document.getElementById("qrcode").addEventListener("click", copyURL);

function copyURL() {
    navigator.clipboard.writeText(url).then(() => {
        showMessage("URL copied to clipboard!")
    }).catch(err => {
        showError("Failed to copy URL");
    });
}

function enableUnloadWarning() {
    window.addEventListener("beforeunload", function (event) {
        event.preventDefault();
        event.returnValue = '';

        if (!sessionStorage.getItem("redirectHandled")) {
            sessionStorage.setItem("redirectToIndex", "true");
        }
    });
}

document.addEventListener("click", enableUnloadWarning);
document.addEventListener("keydown", enableUnloadWarning);

window.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem("redirectToIndex") === "true" && sessionStorage.getItem("redirectHandled") !== "true") {
        sessionStorage.setItem("redirectHandled", "true");

        if (typeof userData !== "undefined" && userData.role === "Host") {
            closeRoom();
        } else {
            removeUserFromRoom();
        }

        sessionStorage.removeItem("redirectToIndex");

        setTimeout(() => {
            window.location.href = "./index.html";
        }, 100);
    } else {
        sessionStorage.removeItem("redirectHandled");
    }

    if (!sessionStorage.getItem("firstVisit")) {
        sessionStorage.setItem("firstVisit", "true");
        sessionStorage.removeItem("redirectToIndex");
    }
});

async function blockUser() {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/room/blockUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: roomData.code,
                username: userData.username,
                user_id: userData.userId,
                role: userData.role,
                block: guestName
            })
        });

        const data = await response.json();

        if (response.ok) {
            return;
        } else {
            console.error("Failed to block user:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

blockGuest.addEventListener("click", () => {
    blockUser();
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
});

async function blockedUser() {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch("http://127.0.0.1:8000/room/blocked", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                room_code: roomData.code,
                username: userData.username,
                user_id: userData.userId,
                user_role: userData.role
            })
        });

        const data = await response.json();

        if (response.ok) {
            return;
        } else {
            console.error("Failed to store blocked IP:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function handleReceivedFileUpload(data) {
    let fileName = data.file_name;
    let fileSize = data.file_size;
    let fileUrl = data.file_url;
    let fileId = data.file_id;

    let availableSlots = maxFiles - filesArray.length;
    let currentTotalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
    let validFiles = [];

    if (availableSlots <= 0) {
        showMessage("File limit reached. Cannot add more files.");
        return;
    }

    let isDuplicate = filesArray.some(file => file.name === fileName && file.size === fileSize);
    let isAlreadyDisplayed = [...fileList.children].some(fileItem => {
        let displayedName = fileItem.querySelector("span").textContent.trim();
        let fileSizeElement = fileItem.querySelector("span[class*='text-'][class*='sm:text-sm']");

        if (!fileSizeElement) return false;

        let displayedSize = fileSizeElement.textContent.trim();
        return displayedName === fileName && displayedSize === formatSize(fileSize);
    });

    if (isDuplicate || isAlreadyDisplayed) {
        showMessage(`"${fileName}" is already added.`);
    } else if (currentTotalSize + fileSize > maxTotalSize) {
        showMessage(`Adding "${fileName}" exceeds the 500MB total size limit.`);
    } else {
        let newFile = { name: fileName, size: fileSize, url: fileUrl, uploadTime: Date.now() };
        validFiles.push(newFile);
        currentTotalSize += fileSize;
    }

    if (validFiles.length > 0) {
        filesArray.push(...validFiles);
        updateFileDisplay(data);
    }
}

async function getFile() {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch(`http://127.0.0.1:8000/file/getFile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                room_code: roomData.code,
                username: userData.username,
                user_id: userData.userId
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.data.files) && data.data.files.length > 0) {
            data.data.files.forEach((item) => {
                handleReceivedFileUpload(item);
            });
        }
    } catch (error) {
        console.error("Error fetching file:", error);
        return null;
    }
}

async function deleteFile(fileId) {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    try {
        const response = await fetch(`http://127.0.0.1:8000/file/deleteFile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                room_code: roomData.code,
                username: userData.username,
                user_id: userData.userId,
                file_id: fileId
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error("Error fetching file:", error);
        return null;
    }
}
