// ===== DATA STRUCTURES =====
let personalInfo = {};
let workExperiences = [];
let currentWorkExperience = {};
let educationHistory = [];
let currentEducationEntry = {};
let certifications = [];
let currentCertificate = {};

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
    // PERSONAL
    { group: "personal", key: "fullName", prompt: "Your Full Name", placeholder: "John Peter", dataType: "text" },
    { group: "personal", key: "email", prompt: "Your Work Email Address", placeholder: "john.peter@company.com", dataType: "email" },
    { group: "personal", key: "phone", prompt: "Your Contact Number", placeholder: "+1 555 123 9876", dataType: "tel" },
    { group: "personal", key: "location", prompt: "Your Region (city, country)", placeholder: "California, USA", dataType: "text" },

    // EXPERIENCE
    { group: "experience", key: "company", prompt: "Company Name", placeholder: "Google LLC", dataType: "text" },
    { group: "experience", key: "office", prompt: "Office Location", placeholder: "San Francisco, CA", dataType: "text" },
    { group: "experience", key: "joinDate", prompt: "Join Date (month, year)", placeholder: "Jan, 2021", dataType: "text" },
    { group: "experience", key: "exitDate", prompt: "Relieve Date (month, year)", placeholder: "Dec, 2022", dataType: "text" },
    { group: "experience", key: "role", prompt: "Your Job Role", placeholder: "Product Designer", dataType: "text" },

    // New AI-driven questions for work experience
    {
        group: "experience",
        key: "description",
        prompt: "Do an independent research on your own for the [Company] and prepare a 50-60 words company overview.",
        placeholder: "Company description will be AI-generated.",
        dataType: "text",
        AI: true
    },
    {
        group: "experience",
        key: "responsibility",
        prompt: "What were your primary day-to-day responsibilities or core duties in this role? Please include any specific tasks or areas you focused on.",
        placeholder: "Describe in your own words.",
        dataType: "textarea",
        AI: true
    },
    {
        group: "experience",
        key: "achievements",
        prompt: "Can you share any high-level numbers, results, or achievements from this role? For example, key metrics, performance improvements, projects completed, or notable contributions.",
        placeholder: "You can be conversational, as if speaking to someone.",
        dataType: "textarea",
        AI: true
    },
    {
        group: "experience",
        key: "tools",
        prompt: "What specific tools, software, or technologies did you use regularly in this role? For example, platforms, systems, or automation tools that supported your work.",
        placeholder: "Don't worry about sentence structures.",
        dataType: "text",
        AI: true
    },
    {
        group: "experience",
        key: "projects",
        prompt: "Are there any notable clients, projects, initiatives, or accomplishments from this role that you want to highlight?",
        placeholder: "keep your responses detailed. AI will handle the rest.",
        dataType: "textarea",
        AI: true
    },

    // EDUCATION
    { group: "education", key: "instituteName", prompt: "Your University/School Name:", placeholder: "Harvard University", dataType: "text" },
    { group: "education", key: "instituteLocation", prompt: "University/School Location", placeholder: "Cambridge, MA", dataType: "text" },
    { group: "education", key: "degreeTitle", prompt: "Degree Title", placeholder: "B.Sc. in Computer Science", dataType: "text" },
    { group: "education", key: "graduationYear", prompt: "Graduation/Passing Year", placeholder: "2023", dataType: "text" },
    { group: "education", key: "majorSubject", prompt: "Major Subject", placeholder: "Computer Science", dataType: "text" },
    { group: "education", key: "minorSubject", prompt: "Minor Subject", placeholder: "Mathematics, Design", dataType: "text" },
    { group: "education", key: "highlight", prompt: "Any highlights?", placeholder: "Dean's List; Robotics Club Captain", dataType: "text" },

    // CERTIFICATE
    { group: "certificate", key: "title", prompt: "Certificate Title:", placeholder: "Google UX Design Certification", dataType: "text" },
    { group: "certificate", key: "issuer", prompt: "Institute Name", placeholder: "Coursera", dataType: "text" },
    { group: "certificate", key: "date", prompt: "Completion Date", placeholder: "Aug, 2024", dataType: "text" },
    { group: "certificate", key: "courses", prompt: "Included Courses", placeholder: "UI Design", dataType: "text" },

    // TOGGLES
    { group: "skills", key: "technical", prompt: "Select Your Technical Skils", dataType: "toggle" },
    { group: "softSkills", key: "softSkills", prompt: "Select Your Soft Skills", dataType: "toggle" },
    { group: "interests", key: "personalInterests", prompt: "Your Interests", dataType: "text" },
];

// ===== DEBUG PLACEHOLDERS =====
const DEBUG_AI = true;
const DEBUG_PLACEHOLDERS = {
    "description": "<<start>>Alphabet Inc., Google's parent company, is a global technology leader with a market capitalization around $3.86 trillion as of December 2025. It generated $348 billion in revenue in 2024, employs over 190,000 people, and dominates digital advertising, operating key platforms including Google Search, YouTube, and Android.<<end>>",
    "responsibility": "<<start>>Lead product development, collaborate with teams, handle customer queries daily.<<end>>",
    "achievements": "<<start>>Achieved 150% of targets, improved response rate by 20%, recognized as Employee of the Month.<<end>>",
    "tools": "<<start>>CRM systems, ticketing platforms, chat automation tools.<<end>>",
    "projects": "<<start>>Contributed to onboarding project for key clients, led process improvement initiatives.<<end>>"
};

// ===== EVENT LISTENERS =====
document.getElementById("send-btn").addEventListener("click", handleStep);
document.getElementById("skip-btn").addEventListener("click", handleSkip);

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
async function handleStep() {
    const step = steps[currentStep];
    if (!step) return;

    let value = inputEl.value.trim();
    if (step.group === "skills") value = selectedTechnologies.join(", ");
    if (step.group === "interests") value = selectedInterests.join(", ");
    if (step.group === "softSkills") value = selectedSoftSkills.join(", ");

    if (!value && !["skills","interests","softSkills"].includes(step.group)) return;

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

    if (step.group === "experience" && isGroupComplete("experience")) await finalizeWorkExperience();
    if (step.group === "education" && isGroupComplete("education")) finalizeEducationEntry();
    if (step.group === "certificate" && isGroupComplete("certificate")) finalizeCertificateEntry();

    if (currentStep < steps.length) {
        const next = steps[currentStep];
        document.getElementById("prompt-label").innerText = next.prompt;
        document.getElementById("user-input").placeholder = next.placeholder;

        if (next.group === "skills") renderToggleButtons(technicalSkillsList, selectedTechnologies);
        else if (next.group === "interests") renderToggleButtons(interestsList, selectedInterests);
        else if (next.group === "softSkills") renderToggleButtons(softSkillsList, selectedSoftSkills);
        else {
            hideToggleButtons();
            inputEl.type = next.dataType;
        }
    } else sendToBackend();
}

// ===== SKIP HANDLER =====
function handleSkip() {
    currentStep++;
    if (currentStep < steps.length) {
        const next = steps[currentStep];
        document.getElementById("prompt-label").innerText = next.prompt;
        document.getElementById("user-input").placeholder = next.placeholder;

        if (next.group === "skills") renderToggleButtons(technicalSkillsList, selectedTechnologies);
        else if (next.group === "interests") renderToggleButtons(interestsList, selectedInterests);
        else if (next.group === "softSkills") renderToggleButtons(softSkillsList, selectedSoftSkills);
        else {
            hideToggleButtons();
            inputEl.type = next.dataType;
        }
    } else sendToBackend();
}

// ===== HELPERS =====
function isGroupComplete(groupName) {
    const groupKeys = steps.filter((s, idx) => s.group===groupName && idx<=currentStep).map(s=>s.key);
    const buffer = groupName==="experience"?currentWorkExperience:groupName==="education"?currentEducationEntry:groupName==="certificate"?currentCertificate:{};
    return groupKeys.every(k=>buffer[k]);
}

// ===== FINALIZE WORK EXPERIENCE =====
async function finalizeWorkExperience() {
    const aiFields = steps.filter(s=>s.group==="experience" && s.AI).map(s=>s.key);
    if (aiFields.length>0) {
        const aiPayload = aiFields.map(key=>({
            key,
            prompt: steps.find(s=>s.key===key).prompt,
            userInput: currentWorkExperience[key]||"",
            rules: "Clear start/end markers for AI parsing."
        }));

        try {
            const aiResponse = await fetch("/api/ai", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({fields: aiPayload})
            });
            const aiResult = await aiResponse.json();

            aiFields.forEach(key=>{
                if(aiResult[key]) currentWorkExperience[key] = aiResult[key];
            });
        } catch(err) {
            console.error("AI generation failed:", err);
        }
    }

    workExperiences.push(currentWorkExperience);
    currentWorkExperience={};
}

// ===== FINALIZE OTHER GROUPS =====
function finalizeEducationEntry() {
    educationHistory.push(currentEducationEntry);
    currentEducationEntry={};
}
function finalizeCertificateEntry() {
    if(currentCertificate.courses) currentCertificate.courses=currentCertificate.courses.split(",").map(c=>c.trim());
    else currentCertificate.courses=[];
    certifications.push(currentCertificate);
    currentCertificate={};
}

// ===== SEND DATA =====
function sendToBackend() {
    const payload={personalInfo, workExperiences, educationHistory, certifications, technology:technologiesStr, softSkills:softSkillsStr, interest:interestsStr};
    fetch("/api/compile", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
    }).then(res=>res.json())
    .then(data=>{
        document.getElementById("response").innerText = "Resume Built Successfully";
        document.getElementById("prompt-label").innerText = "Resume Built Successfully";
    }).catch(err=>console.error(err));
}
