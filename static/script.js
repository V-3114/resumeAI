// ===== DATA STRUCTURES =====
let personalInfo = {};
let workExperiences = [];
let currentWorkExperience = {};
let educationHistory = [];
let currentEducationEntry = {};
let certifications = [];
let currentCertificate = {}; // FIXED — was missing

const technicalSkillsList = ["JavaScript", "Python", "C++", "React", "Node.js"];
const interestsList = ["AI", "Gaming", "Travel", "Music"];
const softSkillsList = ["Teamwork", "Communication", "Leadership", "Adaptability"];

let selectedTechnologies = [];
let selectedInterests = [];
let selectedSoftSkills = [];

let technologiesStr = "";
let interestsStr = "";
let softSkillsStr = "";

let currentStep = 0;

// ===== ELEMENTS =====
const inputEl = document.getElementById("user-input");
const toggleContainer = document.getElementById("toggle-container");

// ===== STEPS =====
const steps = [
    { group: "personal", key: "fullName", prompt: "Enter your full name:", dataType: "text" },
    { group: "personal", key: "email", prompt: "Enter your email:", dataType: "email" },
    { group: "personal", key: "phone", prompt: "Enter your phone number:", dataType: "tel" },
    { group: "personal", key: "location", prompt: "Enter your location (city, country):", dataType: "text" },

    { group: "experience", key: "company", prompt: "Enter company name:", dataType: "text" },
    { group: "experience", key: "dates", prompt: "Enter dates worked:", dataType: "text" },
    { group: "experience", key: "role", prompt: "Enter your role:", dataType: "text" },
    { group: "experience", key: "office", prompt: "Enter office location:", dataType: "text" },
    { group: "experience", key: "description", prompt: "Enter company description:", dataType: "text" },
    { group: "experience", key: "responsibility", prompt: "Enter main responsibility:", dataType: "text" },
    { group: "experience", key: "achievement", prompt: "List achievements (';' separated):", dataType: "text" },

    { group: "education", key: "instituteName", prompt: "Enter university/school name:", dataType: "text" },
    { group: "education", key: "instituteLocation", prompt: "Enter location:", dataType: "text" },
    { group: "education", key: "degreeTitle", prompt: "Enter your degree:", dataType: "text" },
    { group: "education", key: "graduationYear", prompt: "Enter graduation year:", dataType: "text" },
    { group: "education", key: "majorSubject", prompt: "Enter major subject:", dataType: "text" },
    { group: "education", key: "minorSubject", prompt: "Enter minor subjects:", dataType: "text" },
    { group: "education", key: "highlight", prompt: "Any highlights?", dataType: "text" },

    { group: "certificate", key: "title", prompt: "Enter certificate title:", dataType: "text" },
    { group: "certificate", key: "issuer", prompt: "Enter issuing organization:", dataType: "text" },
    { group: "certificate", key: "date", prompt: "Enter completion date:", dataType: "text" },
    { group: "certificate", key: "courses", prompt: "Related courses (comma separated):", dataType: "text" },

    { group: "skills", key: "technical", prompt: "Select your technical skills:", dataType: "toggle" },
    { group: "softSkills", key: "softSkills", prompt: "Select your soft skills:", dataType: "toggle" },
    { group: "interests", key: "personalInterests", prompt: "Select your interests:", dataType: "toggle" },
];

// ===== EVENT LISTENER =====
document.getElementById("send-btn").addEventListener("click", handleStep);

// ===== TOGGLE RENDER =====
function renderToggleButtons(list, selectedArray) {
    toggleContainer.innerHTML = "";
    toggleContainer.style.display = "flex";
    inputEl.style.display = "none";

    list.forEach(item => {
        const btn = document.createElement("button");
        btn.innerText = item;

        if (selectedArray.includes(item)) btn.classList.add("selected");

        btn.addEventListener("click", () => {
            btn.classList.toggle("selected");
            const index = selectedArray.indexOf(item);
            if (index > -1) selectedArray.splice(index, 1);
            else selectedArray.push(item);
        });

        toggleContainer.appendChild(btn);
    });
}

function hideToggleButtons() {
    toggleContainer.style.display = "none";
    inputEl.style.display = "inline-block";
}

// ===== STEP HANDLER =====
function handleStep() {
    const step = steps[currentStep];
    if (!step) return;

    let value = inputEl.value.trim();

    // For toggle groups, use the selected arrays
    if (step.group === "skills") value = selectedTechnologies.join(", ");
    if (step.group === "interests") value = selectedInterests.join(", ");
    if (step.group === "softSkills") value = selectedSoftSkills.join(", ");

    // Block empty input for text fields, allow empty for toggles
    if (!value && !["skills", "interests", "softSkills"].includes(step.group)) {
        return;
    }

    // Store Values
    switch(step.group) {
        case "personal": personalInfo[step.key] = value; break;
        case "experience": currentWorkExperience[step.key] = value; break;
        case "education": currentEducationEntry[step.key] = value; break;
        case "certificate": currentCertificate[step.key] = value; break;
        case "skills": technologiesStr = value; break;
        case "interests": interestsStr = value; break;
        case "softSkills": softSkillsStr = value; break;
    }

    inputEl.value = "";
    currentStep++;

    // Group finalization
    if (step.group === "experience" && isGroupComplete("experience")) finalizeWorkExperience();
    if (step.group === "education" && isGroupComplete("education")) finalizeEducationEntry();
    if (step.group === "certificate" && isGroupComplete("certificate")) finalizeCertificateEntry();

    // Move to next prompt
    if (currentStep < steps.length) {
        const next = steps[currentStep];
        document.getElementById("prompt-label").innerText = next.prompt;

        if (next.group === "skills") renderToggleButtons(technicalSkillsList, selectedTechnologies);
        else if (next.group === "interests") renderToggleButtons(interestsList, selectedInterests);
        else if (next.group === "softSkills") renderToggleButtons(softSkillsList, selectedSoftSkills);
        else {
            hideToggleButtons();
            inputEl.type = next.dataType;
        }

    } else {
        sendToBackend();
    }
}

// ===== HELPERS =====
function isGroupComplete(groupName) {
    const groupKeys = steps
        .filter((s, idx) => s.group === groupName && idx <= currentStep)
        .map(s => s.key);

    const buffer =
        groupName === "experience" ? currentWorkExperience :
        groupName === "education" ? currentEducationEntry :
        groupName === "certificate" ? currentCertificate : {};

    return groupKeys.every(k => buffer[k]);
}

function finalizeWorkExperience() {
    if (currentWorkExperience.achievement)
        currentWorkExperience.achievement = currentWorkExperience.achievement.split(";").map(s => s.trim());

    workExperiences.push(currentWorkExperience);
    currentWorkExperience = {};
}

function finalizeEducationEntry() {
    educationHistory.push(currentEducationEntry);
    currentEducationEntry = {};
}

function finalizeCertificateEntry() {
    if (currentCertificate.courses)
        currentCertificate.courses = currentCertificate.courses.split(",").map(c => c.trim());
    else currentCertificate.courses = [];

    certifications.push(currentCertificate);
    currentCertificate = {};
}

// ===== SEND DATA =====
function sendToBackend() {
    const payload = {
        personalInfo,
        workExperiences,
        educationHistory,
        certifications,
        technology: technologiesStr,
        softSkills: softSkillsStr,
        interest: interestsStr,
    };

    fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("response").innerText = data.message;
        document.getElementById("prompt-label").innerText = "Resume Built Successfully";
    })
    .catch(err => console.error(err));
}