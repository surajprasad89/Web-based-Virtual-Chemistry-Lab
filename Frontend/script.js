// Accordion Logic
const items = document.querySelectorAll(".accordion .item");

items.forEach(item => {
    item.querySelector(".title").addEventListener("click", () => {
        const panel = item.querySelector(".panel");
        panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
});

// Experiment theory data
const experimentTheory = {
    "Hardness of Water by EDTA Method": {
        title: "Hardness of Water by EDTA Method",
        theory: `
            <h2>Theory: Hardness of Water by EDTA Method</h2>
            
            <h3>Introduction</h3>
            <p>Water hardness is a measure of the amount of calcium and magnesium ions present in water. Hardness is expressed in terms of parts per million (ppm) of calcium carbonate (CaCO₃). EDTA (Ethylenediaminetetraacetic acid) titration is a widely used method to determine water hardness due to its accuracy and simplicity.</p>
            
            <h3>Principle</h3>
            <p>EDTA forms stable complexes with metal ions, particularly Ca²⁺ and Mg²⁺ ions. When EDTA is added to hard water, it chelates these ions. Eriochrome Black T (EBT) is used as an indicator, which forms a wine-red complex with Mg²⁺ ions at pH 10. When EDTA is added during titration, it first complexes with free Ca²⁺ and Mg²⁺ ions, then displaces Mg²⁺ from the EBT-Mg²⁺ complex, causing a color change from wine-red to blue, indicating the endpoint.</p>
            
            <h3>Chemical Reactions</h3>
            <ul>
                <li><strong>Complexation with Ca²⁺:</strong> Ca²⁺ + EDTA⁴⁻ → [Ca-EDTA]²⁻</li>
                <li><strong>Complexation with Mg²⁺:</strong> Mg²⁺ + EDTA⁴⁻ → [Mg-EDTA]²⁻</li>
                <li><strong>Indicator reaction:</strong> Mg²⁺ + EBT → [Mg-EBT] (wine-red)</li>
                <li><strong>At endpoint:</strong> [Mg-EBT] + EDTA⁴⁻ → [Mg-EDTA]²⁻ + EBT (blue)</li>
            </ul>
            
            <h3>Requirements</h3>
            <ul>
                <li>EDTA solution (0.01 M)</li>
                <li>Eriochrome Black T indicator</li>
                <li>Ammonia buffer solution (pH 10)</li>
                <li>Hard water sample</li>
                <li>Burette, pipette, conical flask</li>
            </ul>
            
            <h3>Procedure</h3>
            <ol>
                <li>Take 50 mL of hard water sample in a conical flask.</li>
                <li>Add 2 mL of ammonia buffer solution to maintain pH 10.</li>
                <li>Add 2-3 drops of Eriochrome Black T indicator.</li>
                <li>The solution will turn wine-red in color.</li>
                <li>Titrate with standard EDTA solution (0.01 M) until the color changes from wine-red to blue.</li>
                <li>Note the burette reading and repeat the titration for concordant values.</li>
            </ol>
            
            <h3>Calculations</h3>
            <p><strong>Total Hardness (ppm of CaCO₃) = (Volume of EDTA × Molarity of EDTA × 1000 × 100) / Volume of water sample</strong></p>
            
            <h3>Significance</h3>
            <p>Hard water can cause scaling in pipes, reduce soap efficiency, and affect industrial processes. Determining water hardness helps in water treatment and quality assessment.</p>
        `
    },
    "Residual Chlorine in Water": {
        title: "Residual Chlorine in Water",
        theory: `
            <h2>Theory: Residual Chlorine in Water</h2>
            
            <h3>Introduction</h3>
            <p>Residual chlorine refers to the amount of chlorine remaining in water after the disinfection process. It is measured to ensure effective water treatment and safety.</p>
            
            <h3>Principle</h3>
            <p>The DPD (N,N-Diethyl-p-phenylenediamine) method is commonly used to determine residual chlorine. DPD reacts with free chlorine to form a pink-colored complex, the intensity of which is proportional to the chlorine concentration.</p>
            
            <h3>Procedure</h3>
            <ol>
                <li>Take a known volume of water sample.</li>
                <li>Add DPD indicator solution.</li>
                <li>Measure the intensity of pink color using a colorimeter or spectrophotometer.</li>
                <li>Compare with standard calibration curve.</li>
            </ol>
            
            <h3>Significance</h3>
            <p>Maintaining adequate residual chlorine ensures water remains safe from microbial contamination during distribution.</p>
        `
    },
    "Dissolved Oxygen (DO) in Water": {
        title: "Dissolved Oxygen (DO) in Water",
        theory: `
            <h2>Theory: Dissolved Oxygen (DO) in Water</h2>
            
            <h3>Introduction</h3>
            <p>Dissolved oxygen (DO) is the amount of oxygen gas dissolved in water, typically expressed in mg/L or ppm.</p>
            
            <h3>Principle</h3>
            <p>The Winkler method is a standard technique for DO determination. Manganese(II) hydroxide is formed and oxidized by dissolved oxygen to manganese(III) hydroxide, which then oxidizes iodide to iodine. The liberated iodine is titrated with sodium thiosulfate.</p>
            
            <h3>Procedure</h3>
            <ol>
                <li>Fix the sample immediately after collection by adding MnSO₄ and alkaline KI solution.</li>
                <li>Acidify the sample to liberate iodine.</li>
                <li>Titrate with standard sodium thiosulfate solution using starch as indicator.</li>
                <li>Calculate DO from the titration data.</li>
            </ol>
            
            <h3>Significance</h3>
            <p>DO levels indicate water quality and aquatic ecosystem health. Low DO can harm aquatic life.</p>
        `
    },
    "Equilibrium": {
        title: "Equilibrium",
        theory: `
            <h2>Theory: Chemical Equilibrium</h2>
            
            <h3>Introduction</h3>
            <p>Chemical equilibrium is a state where the rate of forward reaction equals the rate of reverse reaction, resulting in constant concentrations of reactants and products.</p>
            
            <h3>Principle</h3>
            <p>At equilibrium, the concentrations remain constant, but reactions continue at equal rates. The equilibrium constant (K) quantifies the relationship between reactants and products.</p>
            
            <h3>Le Chatelier's Principle</h3>
            <p>When a system at equilibrium is disturbed, it shifts to counteract the change and restore equilibrium.</p>
            
            <h3>Significance</h3>
            <p>Understanding equilibrium is crucial for optimizing chemical reactions, industrial processes, and understanding reaction mechanisms.</p>
        `
    },
    "Total Dissolved Solids (TDS) and Total Solids in Water": {
        title: "Total Dissolved Solids (TDS) and Total Solids in Water",
        theory: `
            <h2>Theory: Total Dissolved Solids (TDS) and Total Solids in Water</h2>
            
            <h3>Introduction</h3>
            <p>TDS represents the total concentration of dissolved substances in water, including salts, minerals, and organic matter.</p>
            
            <h3>Principle</h3>
            <p>TDS is determined by evaporating a filtered water sample and weighing the residue. Total solids include both dissolved and suspended solids.</p>
            
            <h3>Procedure</h3>
            <ol>
                <li>Filter the water sample to separate suspended solids.</li>
                <li>Evaporate the filtrate to dryness.</li>
                <li>Weigh the residue to determine TDS.</li>
                <li>For total solids, evaporate unfiltered sample.</li>
            </ol>
            
            <h3>Significance</h3>
            <p>TDS levels affect water taste, suitability for various uses, and can indicate contamination.</p>
        `
    },
    "Acid Concentration using pH Meter": {
        title: "Acid Concentration using pH Meter",
        theory: `
            <h2>Theory: Acid Concentration using pH Meter</h2>
            
            <h3>Introduction</h3>
            <p>pH meters measure the hydrogen ion concentration in solutions, providing a direct method to determine acidity or basicity.</p>
            
            <h3>Principle</h3>
            <p>pH is the negative logarithm of hydrogen ion concentration. For strong acids, pH can be directly related to acid concentration using the formula: pH = -log[H⁺].</p>
            
            <h3>Procedure</h3>
            <ol>
                <li>Calibrate the pH meter using standard buffer solutions.</li>
                <li>Rinse the electrode with distilled water.</li>
                <li>Immerse the electrode in the acid solution.</li>
                <li>Record the pH reading.</li>
                <li>Calculate concentration from pH value.</li>
            </ol>
            
            <h3>Significance</h3>
            <p>Accurate pH measurement is essential in chemistry, biology, environmental science, and industrial processes.</p>
        `
    },
    "Electrical Conductivity (EC) of Water Sample": {
        title: "Electrical Conductivity (EC) of Water Sample",
        theory: `
            <h2>Theory: Electrical Conductivity (EC) of Water Sample</h2>
            
            <h3>Introduction</h3>
            <p>Electrical conductivity measures the ability of water to conduct electric current, indicating the presence of dissolved ions.</p>
            
            <h3>Principle</h3>
            <p>Pure water has low conductivity. The presence of dissolved salts increases conductivity. EC is measured using a conductivity meter with electrodes.</p>
            
            <h3>Procedure</h3>
            <ol>
                <li>Calibrate the conductivity meter.</li>
                <li>Rinse the electrode with distilled water.</li>
                <li>Immerse the electrode in the water sample.</li>
                <li>Record the conductivity reading (µS/cm or mS/cm).</li>
            </ol>
            
            <h3>Significance</h3>
            <p>EC is used to assess water quality, monitor pollution, and estimate TDS levels.</p>
        `
    },
    "Strength of FAS using K₂Cr₂O₇ and DPA Indicator": {
        title: "Strength of FAS using K₂Cr₂O₇ and DPA Indicator",
        theory: `
            <h2>Theory: Strength of FAS using K₂Cr₂O₇ and DPA Indicator</h2>
            
            <h3>Introduction</h3>
            <p>Ferrous Ammonium Sulfate (FAS) is a reducing agent commonly standardized using potassium dichromate (K₂Cr₂O₇).</p>
            
            <h3>Principle</h3>
            <p>K₂Cr₂O₇ oxidizes Fe²⁺ to Fe³⁺. Diphenylamine (DPA) serves as an internal indicator, changing from colorless to violet-blue at the endpoint.</p>
            
            <h3>Procedure</h3>
            <ol>
                <li>Prepare standard K₂Cr₂O₇ solution.</li>
                <li>Titrate FAS solution with K₂Cr₂O₇.</li>
                <li>Add DPA indicator near the endpoint.</li>
                <li>Note the volume at color change.</li>
                <li>Calculate FAS strength.</li>
            </ol>
            
            <h3>Significance</h3>
            <p>Standardized FAS is used in various analytical determinations, particularly in COD (Chemical Oxygen Demand) testing.</p>
        `
    },
    "Proximate Analysis of Coal": {
        title: "Proximate Analysis of Coal",
        theory: `
            <h2>Theory: Proximate Analysis of Coal</h2>
            
            <h3>Introduction</h3>
            <p>Proximate analysis determines the moisture, ash, volatile matter, and fixed carbon content of coal, providing essential quality parameters.</p>
            
            <h3>Components Determined</h3>
            <ul>
                <li><strong>Moisture:</strong> Water content in coal</li>
                <li><strong>Ash:</strong> Incombustible residue</li>
                <li><strong>Volatile Matter:</strong> Gases released on heating</li>
                <li><strong>Fixed Carbon:</strong> Carbonaceous material after volatile removal</li>
            </ul>
            
            <h3>Procedure</h3>
            <ol>
                <li>Determine moisture by heating at 105°C.</li>
                <li>Determine volatile matter by heating at 950°C in absence of air.</li>
                <li>Determine ash by burning the residue.</li>
                <li>Calculate fixed carbon by difference.</li>
            </ol>
            
            <h3>Significance</h3>
            <p>Proximate analysis is crucial for coal classification, pricing, and determining its suitability for various applications.</p>
        `
    },
    "Flash Point, Fire Point, Cloud and Pour Point of Lubricating Oil": {
        title: "Flash Point, Fire Point, Cloud and Pour Point of Lubricating Oil",
        theory: `
            <h2>Theory: Flash Point, Fire Point, Cloud and Pour Point of Lubricating Oil</h2>
            
            <h3>Introduction</h3>
            <p>These properties are critical for assessing lubricating oil quality and safety. Flash point is the lowest temperature at which vapors ignite, fire point is when sustained burning occurs, cloud point is when wax begins to crystallize, and pour point is the lowest temperature at which oil flows.</p>
            
            <h3>Determination Methods</h3>
            <ul>
                <li><strong>Flash/Fire Point:</strong> Pensky-Martens closed cup tester</li>
                <li><strong>Cloud Point:</strong> Cool oil and observe first cloud appearance</li>
                <li><strong>Pour Point:</strong> Cool oil in steps and test flow characteristics</li>
            </ul>
            
            <h3>Significance</h3>
            <p>These properties indicate oil performance at different temperatures, safety during handling, and suitability for specific applications.</p>
        `
    },
    "Kinematic Viscosity of Lubricating Oil (Redwood Viscometer No. 1)": {
        title: "Kinematic Viscosity of Lubricating Oil (Redwood Viscometer No. 1)",
        theory: `
            <h2>Theory: Kinematic Viscosity of Lubricating Oil (Redwood Viscometer No. 1)</h2>
            
            <h3>Introduction</h3>
            <p>Viscosity is a measure of a fluid's resistance to flow. Kinematic viscosity is the ratio of dynamic viscosity to density.</p>
            
            <h3>Principle</h3>
            <p>The Redwood Viscometer measures the time taken for a fixed volume of oil to flow through a standard orifice under controlled conditions.</p>
            
            <h3>Procedure</h3>
            <ol>
                <li>Fill the viscometer with oil sample.</li>
                <li>Heat to the specified test temperature.</li>
                <li>Measure the time for 50 mL of oil to flow out.</li>
                <li>Convert Redwood seconds to kinematic viscosity using conversion tables.</li>
            </ol>
            
            <h3>Significance</h3>
            <p>Viscosity determines lubricating effectiveness, flow characteristics, and is critical for selecting appropriate oils for machinery.</p>
        `
    },
    "Preparation of Nylon 6,6 and Bakelite": {
        title: "Preparation of Nylon 6,6 and Bakelite",
        theory: `
            <h2>Theory: Preparation of Nylon 6,6 and Bakelite</h2>
            
            <h3>Nylon 6,6</h3>
            <h4>Introduction</h4>
            <p>Nylon 6,6 is a polyamide formed by condensation polymerization of hexamethylene diamine and adipic acid.</p>
            
            <h4>Reaction</h4>
            <p>n H₂N(CH₂)₆NH₂ + n HOOC(CH₂)₄COOH → [HN(CH₂)₆NHCO(CH₂)₄CO]n + n H₂O</p>
            
            <h4>Procedure</h4>
            <ol>
                <li>Prepare nylon salt from hexamethylene diamine and adipic acid.</li>
                <li>Heat the salt to initiate polymerization.</li>
                <li>Extract and form the polymer fiber.</li>
            </ol>
            
            <h3>Bakelite</h3>
            <h4>Introduction</h4>
            <p>Bakelite is the first synthetic plastic, formed by the reaction of phenol and formaldehyde.</p>
            
            <h4>Reaction</h4>
            <p>Phenol + Formaldehyde → Bakelite (phenolic resin)</p>
            
            <h4>Procedure</h4>
            <ol>
                <li>Mix phenol and formaldehyde with a catalyst.</li>
                <li>Heat to form the initial resin.</li>
                <li>Mold and cure to form the final product.</li>
            </ol>
            
            <h3>Significance</h3>
            <p>These polymers have wide applications in textiles, engineering plastics, and electrical insulation.</p>
        `
    }
};

// Books data
const booksData = [
    {
        title: "Engineering Chemistry: Fundamentals and Applications",
        author: "Shikha Agarwal",
        publisher: "Cambridge",
        edition: "Second Edition",
        image: "../books/book1.jpg"
    },
    {
        title: "Engineering Chemistry Volume-1",
        author: "Dr. Anindita Basak",
        publisher: "",
        edition: "",
        image: "../books/book2.jpg"
    },
    {
        title: "Engineering Chemistry",
        author: "Dr. A. Ravikrishnan",
        publisher: "Sri Krishna Books Publishing Company",
        edition: "Revised Edition 2020-2025",
        image: "../books/book3.jpg"
    },
    {
        title: "A Textbook of Engineering Chemistry",
        author: "S.S. Dara & S.S. Umare",
        publisher: "S. Chand",
        edition: "",
        image: "../books/book4.jpg"
    }
];

// Videos data
const videosData = [
    {
        title: "Hardness of Water by EDTA Method - Estimation",
        description: "Learn how to estimate the total hardness of water using the EDTA titration method.",
        videoSrc: "assets/videos/hardness_test_tutorial.mp4"
    }
    // Add more video objects here in the future
];

// Function to display tutorials
function displayTutorials() {
    document.getElementById('experiment-title').textContent = "Tutorials";

    let tutorialsHtml = `
        <div class="videos-container">
            <h2>Video Tutorials</h2>
            <p>Watch step-by-step video guides for chemistry experiments:</p>
            <div class="videos-gallery">
    `;

    videosData.forEach((video, index) => {
        tutorialsHtml += `
            <div class="video-card">
                <div class="video-player-wrapper">
                    <video controls preload="metadata">
                        <source src="${video.videoSrc}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                </div>
            </div>
        `;
    });

    tutorialsHtml += `
            </div>
        </div>
    `;

    document.getElementById('theory-content').innerHTML = tutorialsHtml;

    // Scroll to top of content
    document.querySelector('.content').scrollTop = 0;
}

// Function to display books
function displayBooks() {
    document.getElementById('experiment-title').textContent = "Books";

    let booksHtml = `
        <div class="books-container">
            <h2>Engineering Chemistry Textbooks</h2>
            <p>Explore our collection of recommended engineering chemistry textbooks:</p>
            <div class="books-gallery">
    `;

    booksData.forEach((book, index) => {
        booksHtml += `
            <div class="book-card">
                <div class="book-cover">
                    <img src="${book.image}" alt="${book.title}" onerror="this.src='../books/placeholder.jpg'">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author"><strong>Author:</strong> ${book.author}</p>
                    ${book.publisher ? `<p class="book-publisher"><strong>Publisher:</strong> ${book.publisher}</p>` : ''}
                    ${book.edition ? `<p class="book-edition"><strong>Edition:</strong> ${book.edition}</p>` : ''}
                </div>
            </div>
        `;
    });

    booksHtml += `
            </div>
        </div>
    `;

    document.getElementById('theory-content').innerHTML = booksHtml;

    // Scroll to top of content
    document.querySelector('.content').scrollTop = 0;
}

// Function to display experiment theory
function displayExperimentTheory(experimentName) {
    const experimentData = experimentTheory[experimentName];

    if (!experimentData) {
        // Default content if experiment not found
        document.getElementById('experiment-title').textContent = experimentName;
        document.getElementById('theory-content').innerHTML = `
            <div class="theory-content-placeholder">
                <p>Theory content for "${experimentName}" will be added soon.</p>
            </div>
        `;
        return;
    }

    // Update title
    document.getElementById('experiment-title').textContent = experimentData.title;

    // Update theory content with Lab button at the top and bottom
    const labButtonHtml = `
        <div style="margin-bottom: 20px; text-align: right;">
            <button class="lab-button" onclick="openVirtualLab('${experimentData.title}')">
                🧪 Start Experiment
            </button>
        </div>
    `;

    const labButtonHtmlBottom = `
        <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 2px solid #e0e0e0;">
            <button class="lab-button" onclick="openVirtualLab('${experimentData.title}')">
                🧪 Open Virtual Lab
            </button>
        </div>
    `;

    document.getElementById('theory-content').innerHTML = labButtonHtml + experimentData.theory + labButtonHtmlBottom;

    // Scroll to top of content
    document.querySelector('.content').scrollTop = 0;
}

// Function to open Virtual Lab page
function openVirtualLab(experimentName) {
    // Store experiment name in sessionStorage to pass to lab page
    sessionStorage.setItem('currentExperiment', experimentName);
    // Open virtual lab page
    window.location.href = 'workbench.html';
}

// Add click handlers to experiment boxes
document.addEventListener('DOMContentLoaded', function () {
    // Get all experiment boxes in the LAB TOPIC section
    const experimentBoxes = document.querySelectorAll('.sidebar h3:first-of-type + .experiment-boxes .experiment-box');

    experimentBoxes.forEach(box => {
        box.addEventListener('click', function () {
            // Remove active class from all boxes
            experimentBoxes.forEach(b => b.classList.remove('active'));

            // Add active class to clicked box
            this.classList.add('active');

            // Get experiment name from box text
            const experimentName = this.textContent.trim();

            // Display the theory
            displayExperimentTheory(experimentName);
        });
    });

    // Load default experiment on page load
    const defaultExperiment = "Hardness of Water by EDTA Method";
    const defaultBox = Array.from(experimentBoxes).find(box => box.textContent.trim() === defaultExperiment);
    if (defaultBox) {
        defaultBox.classList.add('active');
        displayExperimentTheory(defaultExperiment);
    }

    // Get all resource boxes (Virtual Labs, Tutorials, Books, ChemQuiz)
    const resourceBoxes = document.querySelectorAll('.sidebar h3:last-of-type + .experiment-boxes .experiment-box');

    resourceBoxes.forEach(box => {
        box.addEventListener('click', function (e) {
            // Don't handle if it's a link (ChemQuiz)
            if (this.tagName === 'A') {
                return;
            }

            const resourceName = this.textContent.trim();

            // Remove active class from all resource boxes
            resourceBoxes.forEach(b => {
                if (b.tagName !== 'A') {
                    b.classList.remove('active');
                }
            });

            // Remove active class from experiment boxes
            experimentBoxes.forEach(b => b.classList.remove('active'));

            // Add active class to clicked resource box
            this.classList.add('active');

            // Handle Books click
            if (resourceName === 'Books') {
                displayBooks();
            } else if (resourceName === 'Tutorials') {
                displayTutorials();
            } else if (resourceName === 'Virtual Labs') {
                // Handle other resources if needed
                document.getElementById('experiment-title').textContent = resourceName;
                document.getElementById('theory-content').innerHTML = `
                    <div class="theory-content-placeholder">
                        <p>Content for "${resourceName}" will be added soon.</p>
                    </div>
                `;
            }
        });
    });

    // --- Mobile Navigation Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navWrapper = document.getElementById('nav-wrapper');
    if (navToggle && navWrapper) {
        navToggle.addEventListener('click', function() {
            navWrapper.classList.toggle('open');
            // Animate hamburger
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.children[0].style.transform = 'none';
                this.children[1].style.opacity = '1';
                this.children[2].style.transform = 'none';
            } else {
                this.classList.add('active');
                this.children[0].style.transform = 'translateY(8px) rotate(45deg)';
                this.children[1].style.opacity = '0';
                this.children[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            }
        });
    }

    // --- Sidebar Toggle for Mobile ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
});