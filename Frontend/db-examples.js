// Firestore Usage Examples for PoornimaChem
// This file demonstrates how to use Firestore in your application

// Wait for DOM and Firebase to be ready
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for Firebase to initialize
    setTimeout(async () => {
        await testFirestoreConnection();
        await loadExperimentsFromFirestore();
    }, 1000);
});

// ============================================
// 1. TEST FIRESTORE CONNECTION
// ============================================
async function testFirestoreConnection() {
    try {
        console.log('🧪 Testing Firestore connection...');
        
        // Test: Add a test document
        const testData = {
            message: 'Firestore is working!',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            test: true
        };
        
        await addDocument('test', testData);
        console.log('✅ Successfully wrote to Firestore!');
        
        // Test: Read it back
        const docs = await getAllDocuments('test');
        console.log('✅ Successfully read from Firestore!', docs);
        
        // Show success message on page (optional)
        showNotification('✅ Firestore connected successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Firestore connection error:', error);
        showNotification('❌ Firestore connection failed. Check console for details.', 'error');
    }
}

// ============================================
// 2. LOAD EXPERIMENTS FROM FIRESTORE
// ============================================
async function loadExperimentsFromFirestore() {
    try {
        console.log('📚 Loading experiments from Firestore...');
        
        // Try to load experiments from Firestore
        const experiments = await getAllDocuments('experiments');
        
        if (experiments.length > 0) {
            console.log(`✅ Loaded ${experiments.length} experiments from Firestore`);
            
            // Update the sidebar with Firestore data
            updateExperimentsSidebar(experiments);
        } else {
            console.log('ℹ️ No experiments in Firestore. Using default experiments.');
            // If no experiments in Firestore, you can initialize with default data
            await initializeDefaultExperiments();
        }
        
    } catch (error) {
        console.error('❌ Error loading experiments:', error);
        // Fall back to default experiments if Firestore fails
        console.log('Using default experiments as fallback');
    }
}

// ============================================
// 3. UPDATE EXPERIMENTS SIDEBAR
// ============================================
function updateExperimentsSidebar(experiments) {
    const experimentBoxes = document.querySelector('.sidebar .experiment-boxes');
    if (!experimentBoxes) return;
    
    // Clear existing boxes (optional - you might want to keep defaults)
    // experimentBoxes.innerHTML = '';
    
    // Add experiments from Firestore
    experiments.forEach(experiment => {
        const box = document.createElement('div');
        box.classList.add('experiment-box');
        box.textContent = experiment.title;
        box.dataset.experimentId = experiment.id;
        
        // Add click handler to load experiment details
        box.addEventListener('click', () => {
            loadExperimentDetails(experiment.id);
        });
        
        experimentBoxes.appendChild(box);
    });
}

// ============================================
// 4. LOAD EXPERIMENT DETAILS
// ============================================
async function loadExperimentDetails(experimentId) {
    try {
        const experiment = await getDocument('experiments', experimentId);
        if (experiment) {
            // Update main content area
            const contentArea = document.querySelector('.content h1 span');
            if (contentArea) {
                contentArea.textContent = experiment.title;
            }
            
            // You can add more content here
            console.log('Loaded experiment:', experiment);
        }
    } catch (error) {
        console.error('Error loading experiment details:', error);
    }
}

// ============================================
// 5. INITIALIZE DEFAULT EXPERIMENTS
// ============================================
async function initializeDefaultExperiments() {
    const defaultExperiments = [
        { title: 'Hardness of Water by EDTA Method', description: 'Determine water hardness using EDTA titration', category: 'Water Analysis' },
        { title: 'Residual Chlorine in Water', description: 'Measure residual chlorine using DPD method', category: 'Water Analysis' },
        { title: 'Dissolved Oxygen (DO) in Water', description: 'Measure dissolved oxygen using Winkler method', category: 'Water Analysis' },
        { title: 'Equilibrium', description: 'Study chemical equilibrium reactions', category: 'General Chemistry' },
        { title: 'Total Dissolved Solids (TDS) and Total Solids in Water', description: 'Measure total dissolved and suspended solids', category: 'Water Analysis' },
        { title: 'Acid Concentration using pH Meter', description: 'Determine acid concentration using pH measurements', category: 'Instrumentation' },
        { title: 'Electrical Conductivity (EC) of Water Sample', description: 'Measure electrical conductivity of water', category: 'Water Analysis' },
        { title: 'Strength of FAS using K₂Cr₂O₇ and DPA Indicator', description: 'Determine FAS strength by titration', category: 'Analytical Chemistry' },
        { title: 'Proximate Analysis of Coal', description: 'Analyze moisture, ash, and volatile matter in coal', category: 'Material Analysis' },
        { title: 'Flash Point, Fire Point, Cloud and Pour Point of Lubricating Oil', description: 'Determine various properties of lubricating oil', category: 'Material Analysis' },
        { title: 'Kinematic Viscosity of Lubricating Oil (Redwood Viscometer No. 1)', description: 'Measure viscosity using Redwood viscometer', category: 'Material Analysis' },
        { title: 'Preparation of Nylon 6,6 and Bakelite', description: 'Synthesize Nylon 6,6 and Bakelite polymers', category: 'Polymer Chemistry' }
    ];
    
    try {
        // Check if experiments already exist
        const existing = await getAllDocuments('experiments');
        if (existing.length === 0) {
            console.log('📝 Initializing default experiments to Firestore...');
            
            for (const exp of defaultExperiments) {
                await addExperiment(exp.title, exp.description, {
                    category: exp.category,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            console.log('✅ Default experiments initialized!');
            showNotification('✅ Default experiments loaded to Firestore!', 'success');
        }
    } catch (error) {
        console.error('Error initializing experiments:', error);
    }
}

// ============================================
// 6. SAVE QUIZ QUESTIONS TO FIRESTORE
// ============================================
async function saveQuizQuestionsToFirestore() {
    const quizData = [
        { q: "EDTA is mainly used to determine __ in water.", a: ["Total hardness", "pH", "Turbidity", "Chloride"], correct: 0 },
        { q: "Which indicator is used in EDTA hardness test?", a: ["Eriochrome Black T", "Phenolphthalein", "Methyl Orange", "Starch"], correct: 0 },
        { q: "Residual chlorine in water is measured using __ method.", a: ["DPD method", "EDTA method", "Turbidity method", "Hardness method"], correct: 0 },
        { q: "DO in water is measured using __ method.", a: ["Winkler's method", "DPD method", "EDTA method", "Colorimeter"], correct: 0 },
        { q: "TDS stands for __.", a: ["Total Dissolved Solids", "Total Density Solids", "Total Dual Salt", "Total Diluted Solids"], correct: 0 },
        { q: "pH value ranges from __.", a: ["0 to 14", "-10 to 10", "1 to 100", "0 to 7"], correct: 0 },
        { q: "EC of water is measured in __.", a: ["µS/cm", "mg/L", "ppm", "mol/L"], correct: 0 },
        { q: "FAS is mainly used in titrations involving __.", a: ["K₂Cr₂O₇", "AgNO₃", "NaCl", "KMnO₄"], correct: 0 },
        { q: "Proximate analysis of coal includes __.", a: ["Moisture, ash, volatile matter", "pH & EC", "DO & TDS", "Viscosity"], correct: 0 },
        { q: "Flash point of oil is determined using __.", a: ["Pensky-Martens apparatus", "Viscometer", "pH meter", "Bomb calorimeter"], correct: 0 },
        { q: "Kinematic viscosity is measured using __.", a: ["Redwood Viscometer", "U-Tube Manometer", "Pycnometer", "Conductivity Cell"], correct: 0 },
        { q: "Nylon 6,6 is prepared by reaction between hexamethylene diamine and __.", a: ["Adipic acid", "Acetic acid", "Citric acid", "Sulfuric acid"], correct: 0 }
    ];
    
    try {
        const existing = await getAllDocuments('quizQuestions');
        if (existing.length === 0) {
            console.log('📝 Saving quiz questions to Firestore...');
            
            for (const question of quizData) {
                await addQuizQuestion(question.q, question.a, question.correct);
            }
            
            console.log('✅ Quiz questions saved to Firestore!');
            showNotification('✅ Quiz questions saved to Firestore!', 'success');
        } else {
            console.log('ℹ️ Quiz questions already exist in Firestore');
        }
    } catch (error) {
        console.error('Error saving quiz questions:', error);
    }
}

// ============================================
// 7. LOAD QUIZ QUESTIONS FROM FIRESTORE
// ============================================
async function loadQuizQuestionsFromFirestore() {
    try {
        const questions = await getAllQuizQuestions();
        if (questions.length > 0) {
            console.log(`✅ Loaded ${questions.length} quiz questions from Firestore`);
            return questions.map(q => ({
                q: q.question,
                a: q.options,
                correct: q.correctAnswer
            }));
        }
        return null; // Return null to use default questions
    } catch (error) {
        console.error('Error loading quiz questions:', error);
        return null;
    }
}

// ============================================
// 8. ADD A NEW EXPERIMENT
// ============================================
async function addNewExperiment(title, description, category = 'General') {
    try {
        const id = await addExperiment(title, description, {
            category: category,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Experiment added with ID:', id);
        showNotification('✅ Experiment added successfully!', 'success');
        return id;
    } catch (error) {
        console.error('Error adding experiment:', error);
        showNotification('❌ Failed to add experiment', 'error');
        throw error;
    }
}

// ============================================
// 9. SEARCH EXPERIMENTS
// ============================================
async function searchExperiments(searchTerm) {
    try {
        // Note: Firestore doesn't support full-text search directly
        // This is a simple field-based query example
        const allExperiments = await getAllDocuments('experiments');
        const filtered = allExperiments.filter(exp => 
            exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exp.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filtered;
    } catch (error) {
        console.error('Error searching experiments:', error);
        return [];
    }
}

// ============================================
// 10. NOTIFICATION HELPER
// ============================================
function showNotification(message, type = 'info') {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// USAGE IN BROWSER CONSOLE
// ============================================
// You can use these functions in the browser console:
// 
// Add an experiment:
// await addNewExperiment('Test Experiment', 'This is a test description', 'Test Category')
//
// Load all experiments:
// const experiments = await getAllDocuments('experiments')
//
// Search experiments:
// const results = await searchExperiments('water')
//
// Save quiz questions:
// await saveQuizQuestionsToFirestore()
//
// Load quiz questions:
// const questions = await loadQuizQuestionsFromFirestore()

