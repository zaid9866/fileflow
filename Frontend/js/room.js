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
let textFieldCount = document.querySelectorAll(".text-field").length;
const chatInput = document.getElementById("chat-input");
const hamburgerDiv = document.getElementById("hamburger-div");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("nav-menu");
const cancelHamburgerDiv = document.getElementById("cancel-hamburger-div");
const cancelHamburger = document.getElementById("cancel-hamburger");
const showToFeature = document.querySelectorAll(".show-to-feature");
const showToAbout = document.querySelectorAll(".show-to-about");
const showToWork = document.querySelectorAll(".show-to-work");
const feature = document.getElementById("feature");
const about = document.getElementById("about");
const work = document.getElementById("work");
const mobileViewFeature = document.getElementById("mobile-view-feature");
const mobileViewAbout = document.getElementById("mobile-view-about");
const mobileViewWork = document.getElementById("mobile-view-work");
const closeWork = document.getElementById("close-work");
const closeFeature = document.getElementById("close-feature");
const closeAbout = document.getElementById("close-about");
const hide = document.querySelectorAll(".hide");
const container = document.getElementById("user-container");
const userRole = sessionStorage.setItem("role","Host");

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
    [cancelHamburger, mobileViewFeature, mobileViewAbout, mobileViewWork],
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

function startCountdown(hours, minutes, seconds) {
    function updateTime() {
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
        } else {
            document.getElementById("time-remaining").innerText = "00:00:00";
            console.log("Time Over!");
            return;
        }
        let formattedTime =
            String(hours).padStart(2, '0') + ":" +
            String(minutes).padStart(2, '0') + ":" +
            String(seconds).padStart(2, '0');
        document.getElementById("time-remaining").innerText = formattedTime;
        setTimeout(updateTime, 1000);
    }
    updateTime();
}

startCountdown(1, 0, 0);

document.querySelectorAll("#share-file, #share-text").forEach((btn) => {
    btn.addEventListener("click", function () {
        document.querySelectorAll("#share-file, #share-text").forEach((el) => {
            el.classList.remove("bg-slate-900", "border", "rounded-t-lg", "border-b-0");
        });

        this.classList.add("bg-slate-900", "border", "rounded-t-lg", "border-b-0");

        if (this.id === "share-file") {
            document.getElementById("file-section").classList.remove("hidden");
            document.getElementById("text-section").classList.add("hidden");
        } else {
            document.getElementById("file-section").classList.add("hidden");
            document.getElementById("text-section").classList.remove("hidden");
        }
    });
});

function formatSize(size) {
    if (size < 1024) return size + " B";
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    else return (size / (1024 * 1024)).toFixed(2) + " MB";
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds} sec ago`;
    else if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    else return `${Math.floor(seconds / 3600)} hr ago`;
}

function updateTimeDisplay() {
    document.querySelectorAll(".file-time").forEach((el, index) => {
        let uploadTime = filesArray[index].uploadTime;
        let elapsedTime = Math.floor((Date.now() - uploadTime) / 1000);
        el.textContent = formatTime(elapsedTime);
    });
}

function updateFileDisplay() {
    fileList.innerHTML = "";
    let totalSize = filesArray.reduce((sum, file) => sum + file.size, 0);

    filesArray.forEach((file, index) => {
        const fileItem = document.createElement("div");
        fileItem.className = "flex flex-wrap justify-between items-center bg-gray-700 p-2 rounded-lg gap-2";
        fileItem.innerHTML = `
            <span class="truncate">${file.name}</span>
            <div class="flex flex-wrap gap-3 items-center">
                <span class="text-sm text-gray-400 file-time">${formatTime(Math.floor((Date.now() - file.uploadTime) / 1000))}</span>
                <button class="text-emerald-500 hover:text-emerald-600" onclick="downloadFile(${index})">
                    <i class="fa-solid fa-download"></i>
                </button>
                <span class="text-sm">${formatSize(file.size)}</span>
                <button onclick="removeFile(${index})" class="text-red-500 hover:text-red-600">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        fileList.appendChild(fileItem);
    });

    fileLimitDisplay.textContent = `Max Files: ${maxFiles}, Added: ${filesArray.length}/${maxFiles} | Max Total Size: 500MB, Used: ${formatSize(totalSize)}`;

    if (filesArray.length > 0) {
        dropzone.classList.add("hidden");
        fileListContainer.classList.remove("hidden");
    } else {
        dropzone.classList.remove("hidden");
        fileListContainer.classList.add("hidden");
    }
}

function removeFile(index) {
    if (confirm("Are you sure you want to delete this file?")) {
        filesArray.splice(index, 1);
        updateFileDisplay();
    }
}

function downloadFile(index) {
    const file = filesArray[index];
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleFileUpload(input) {
    let newFiles = Array.from(input.files);

    let availableSlots = maxFiles - filesArray.length;
    let currentTotalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
    let validFiles = [];

    if (newFiles.length > availableSlots) {
        alert(`Only ${availableSlots} more files can be uploaded.`);
        showMessage(`Only ${availableSlots} more files can be uploaded.`);
        newFiles = newFiles.slice(0, availableSlots);
    }

    newFiles.forEach(file => {
        let isDuplicate = filesArray.some(existingFile => existingFile.name === file.name && existingFile.size === file.size);
        if (isDuplicate) {
            alert(`"${file.name}" is already added.`);
            showMessage(`"${file.name}" is already added.`);
        } else if (currentTotalSize + file.size > maxTotalSize) {
            alert(`Adding "${file.name}" exceeds the 500MB total size limit.`);
            showMessage(`Adding "${file.name}" exceeds the 500MB total size limit.`);
        } else {
            file.uploadTime = Date.now();
            validFiles.push(file);
            currentTotalSize += file.size;
        }
    });

    if (validFiles.length > 0) {
        filesArray.push(...validFiles);
        updateFileDisplay();
    }
}

fileInput.addEventListener("change", () => handleFileUpload(fileInput));
moreFileInput.addEventListener("change", () => handleFileUpload(moreFileInput));
dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("bg-gray-600");
});
dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("bg-gray-600");
});
dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("bg-gray-600");
    handleFileUpload(event.dataTransfer);
});
addMoreBtn.addEventListener("click", () => moreFileInput.click());

setInterval(updateTimeDisplay, 1000);

document.getElementById("add-text").addEventListener("click", function () {
    if (textFieldCount >= 5) {
        this.classList.add("hidden");
        return;
    }

    textFieldCount++;

    const textContainer = document.getElementById("text-container");
    const newTextField = document.createElement("div");

    newTextField.className = "w-full rounded-lg border p-4 min-h-[400px] relative text-field";
    newTextField.setAttribute("id", `text-field-${textFieldCount}`);
    newTextField.innerHTML = `
        <div class="remove-text absolute top-3 right-4 cursor-pointer">
            <i class="fa-solid fa-times"></i>
        </div>
        <div class="flex flex-wrap gap-x-4 gap-3 mt-4 mb-3">
            <input type="text" id="title-input-${textFieldCount}" placeholder="Enter file name" class="text-name border p-2 min-w-28 rounded w-full sm:w-auto flex-1 bg-gray-800">
            <select id="format-select-${textFieldCount}" class="format-select select2 border p-2 rounded bg-gray-800">
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
            <button id="download-btn-${textFieldCount}" class="text-emerald-500 hover:text-emerald-600">
                <i class="fa-solid fa-download download"></i>
            </button>
        </div>
        <div class="relative">
            <textarea id="text-box-${textFieldCount}" rows="10" placeholder="Enter text here..." class="text-box w-full p-2 border rounded resize-none bg-gray-800"></textarea>
        </div>
        <div class="flex flex-wrap justify-center gap-2 mt-2">
            <button class="bg-emerald-600 px-4 py-2 rounded flex items-center gap-2 copy-btn">
                <i class="fa-solid fa-copy"></i> Copy Text
            </button>
            <button class="bg-red-600 px-4 py-2 rounded flex items-center gap-2 clear-btn">
                <i class="fa-solid fa-delete-left"></i> Clear Text
            </button>
        </div>
    `;

    textContainer.appendChild(newTextField);

    updateRemoveIcons();

    if (textFieldCount === 5) {
        document.getElementById("add-text").classList.add("hidden");
    }
});

$(document).ready(function () {
    function applySelect2() {
        $(".format-select").each(function () {
            if (!$(this).hasClass("select2-applied")) {
                $(this).select2({
                    placeholder: "Select File Format",
                    allowClear: true
                }).addClass("select2-applied");
            }
        });
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
            let confirmDelete = confirm("Are you sure you want to delete this text field?");
            if (confirmDelete) {
                e.target.closest(".text-field").remove();
                textFieldCount--;

                updateRemoveIcons();

                document.getElementById("add-text").classList.remove("hidden");
            }
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
    }
});

function showMessage(text) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = text;
    messageDiv.classList.remove("hidden");
    setTimeout(() => {
        messageDiv.classList.add("hidden");
    }, 5000);
}

document.addEventListener("click", function (e) {
    if (e.target.closest(".download")) {
        downloadFile(e.target.closest(".download"));
    }
});

function downloadFile(button) {
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

document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.querySelector(".fa-paper-plane").parentElement;
    const chatBox = document.getElementById("chats-box");

    sendButton.addEventListener("click", async function () {
        const message = chatInput.value.trim();
        if (!message) return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
        chatBox.appendChild(createSentMessage(message, formattedTime));
        chatInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
        // try {
        //     const response = await fetch("http://localhost:3000/chats", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ message }),
        //     });

        //     if (response.ok) {
        //         chatBox.appendChild(createSentMessage(message, formattedTime));
        //         chatInput.value = "";
        //         chatBox.scrollTop = chatBox.scrollHeight;
        //     } else {
        //         showMessage("Message not sent! Please try again.");
        //     }
        // } catch (error) {
        //     console.error("Error sending message:", error);
        // }
    });
});

function createSentMessage(message, time) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex flex-col items-end";

    messageDiv.innerHTML = `
        <div class="bg-emerald-600 p-3 rounded-lg max-w-[80%] sm:max-w-xs w-fit">
            <p>${message}</p>
            <span class="text-xs block text-right mt-1">${time}</span>
        </div>
    `;

    return messageDiv;
}


function createReceivedMessage(name, message, time) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex flex-col";
    messageDiv.innerHTML = `
        <span class="text-sm font-semibold">${name}</span>
        <div class="bg-gray-800 p-3 rounded-lg max-w-[80%] sm:max-w-xs w-fit">
            <p>${message}</p>
            <span class="text-xs block text-right mt-1">${time}</span>
        </div>
    `;
    return messageDiv;
}

const users = [
    { name: "Zaid Kotimbire", role: "Host" },
    { name: "Khalid Khilji", role: "Guest" },
    { name: "Izhar Khan", role: "Guest" },
    { name: "Rizwan Khan", role: "Guest" }
];

users.forEach(user => {
    const userRole = sessionStorage.getItem("role");
    const card = document.createElement("div");
    card.className = `w-60 bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 flex justify-between items-center ${user.role === "Host" ? "border-emerald-500" : "border-cyan-600"
        }`;

    const userInfo = `
        <div>
            <h3 class="text-lg font-semibold">${user.name}</h3>
            <p class="text-sm ${user.role === "Host" ? "text-emerald-400" : "text-cyan-400"}">${user.role}</p>
        </div>`;

    const removeIcon = user.role === "Guest" && userRole !== "Guest"
        ? `<i class="fa-solid fa-times text-red-500 text-lg cursor-pointer hover:text-red-400"></i>`
        : "";

    card.innerHTML = userInfo + removeIcon;
    container.appendChild(card);
});