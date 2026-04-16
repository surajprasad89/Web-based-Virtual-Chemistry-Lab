const quizData = [
    // 1. Hardness of Water – EDTA
    {
        q: "EDTA is mainly used to determine __ in water.",
        a: ["Total hardness", "pH", "Turbidity", "Chloride"],
        correct: 0
    },
    {
        q: "Which indicator is used in EDTA hardness test?",
        a: ["Eriochrome Black T", "Phenolphthalein", "Methyl Orange", "Starch"],
        correct: 0
    },

    // 2. Residual Chlorine
    {
        q: "Residual chlorine in water is measured using __ method.",
        a: ["DPD method", "EDTA method", "Turbidity method", "Hardness method"],
        correct: 0
    },

    // 3. Dissolved Oxygen (DO)
    {
        q: "DO in water is measured using __ method.",
        a: ["Winkler's method", "DPD method", "EDTA method", "Colorimeter"],
        correct: 0
    },

    // 4. TDS
    {
        q: "TDS stands for __.",
        a: ["Total Dissolved Solids", "Total Density Solids", "Total Dual Salt", "Total Diluted Solids"],
        correct: 0
    },

    // 5. pH Meter
    {
        q: "pH value ranges from __.",
        a: ["0 to 14", "-10 to 10", "1 to 100", "0 to 7"],
        correct: 0
    },

    // 6. Electrical Conductivity
    {
        q: "EC of water is measured in __.",
        a: ["µS/cm", "mg/L", "ppm", "mol/L"],
        correct: 0
    },

    // 7. FAS Strength
    {
        q: "FAS is mainly used in titrations involving __.",
        a: ["K₂Cr₂O₇", "AgNO₃", "NaCl", "KMnO₄"],
        correct: 0
    },

    // 8. Coal Analysis
    {
        q: "Proximate analysis of coal includes __.",
        a: ["Moisture, ash, volatile matter", "pH & EC", "DO & TDS", "Viscosity"],
        correct: 0
    },

    // 9. Flash & Fire Point
    {
        q: "Flash point of oil is determined using __.",
        a: ["Pensky-Martens apparatus", "Viscometer", "pH meter", "Bomb calorimeter"],
        correct: 0
    },

    // 10. Viscosity
    {
        q: "Kinematic viscosity is measured using __.",
        a: ["Redwood Viscometer", "U-Tube Manometer", "Pycnometer", "Conductivity Cell"],
        correct: 0
    },

    // 11. Nylon & Bakelite
    {
        q: "Nylon 6,6 is prepared by reaction between hexamethylene diamine and __.",
        a: ["Adipic acid", "Acetic acid", "Citric acid", "Sulfuric acid"],
        correct: 0
    }
];

let index = 0;
let score = 0;

const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

function loadQuestion() {
    let q = quizData[index];
    questionBox.innerHTML = q.q;
    optionsBox.innerHTML = "";
    nextBtn.disabled = true;

    q.a.forEach((option, i) => {
        let div = document.createElement("div");
        div.classList.add("option");
        div.innerText = option;
        div.onclick = () => selectAnswer(i, div);
        optionsBox.appendChild(div);
    });
}

function selectAnswer(i, element) {
    let correctIndex = quizData[index].correct;
    let options = document.querySelectorAll(".option");

    options.forEach(opt => opt.style.pointerEvents = "none");

    if (i === correctIndex) {
        element.classList.add("correct");
        score++;
    } else {
        element.classList.add("wrong");
        options[correctIndex].classList.add("correct");
    }

    nextBtn.disabled = false;
}

function nextQuestion() {
    index++;

    if (index >= quizData.length) {
        showResult();
    } else {
        loadQuestion();
    }
}

function showResult() {
    document.getElementById("quiz-box").style.display = "none";
    document.getElementById("result-box").classList.remove("hidden");

    document.getElementById("scoreText").innerHTML =
        `You scored <b>${score}</b> out of <b>${quizData.length}</b>`;
}

function restartQuiz() {
    index = 0;
    score = 0;
    document.getElementById("quiz-box").style.display = "block";
    document.getElementById("result-box").classList.add("hidden");
    loadQuestion();
}

loadQuestion();
