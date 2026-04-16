// State Management
let draggedItem = null;
let workbenchItems = [];
let nextId = 1;
const workbenchArea = document.getElementById('workbench-area');
const contextMenu = document.getElementById('context-menu');
let selectedItemId = null;




// Experiment State
let experimentActive = false;
let currentExperimentName = "Hardness of Water by EDTA Method"; // Default for now
let experimentData = {
    titrantVolume: 0,
    startTime: null
};

class ExperimentManager {
    static updateStatus(msg, type = 'info') {
        const pan = document.getElementById('experiment-status');
        if (pan) pan.classList.remove('hidden');

        const step = document.getElementById('step-instruction');
        if (step) step.innerText = msg;

        const msgEl = document.getElementById('validation-msg');
        if (msgEl) {
            msgEl.innerText = msg;
            msgEl.className = 'validation-msg ' + type;
            msgEl.style.display = 'block';
            setTimeout(() => { if (type !== 'error') msgEl.style.display = 'none'; }, 3000);
        }
    }

    static updateDisplay(titrantVol, conc) {
        const pan = document.getElementById('experiment-status');
        if (pan) pan.classList.remove('hidden');

        const display = document.getElementById('data-display');
        display.innerHTML = `
            <div class="data-row"><span class="data-label">Titrant Added:</span><span class="data-value">${titrantVol.toFixed(2)} mL</span></div>
            <div class="data-row"><span class="data-label">Approx. Conc.:</span><span class="data-value">${conc.toFixed(4)} M</span></div>
        `;
    }

    static checkReaction(container) {
        if (!container.contents || container.contents.length === 0) return null;

        // Hardness of Water Logic
        // For simplicity, let's allow 'HardWater' and 'EDTA' interaction
        let volWater = 0;
        let hasBuffer = false;
        let hasEBT = false;
        let volEDTA = 0;

        container.contents.forEach(c => {
            if (c.name === 'Hard Water' || c.type === 'HardWater') volWater += c.amount;
            if (c.type === 'Buffer') hasBuffer = true;
            if (c.type === 'EBT') hasEBT = true;
            if (c.type === 'EDTA') volEDTA += c.amount;
        });

        if (volWater > 0) {
            // Step 1: Just Water -> Clear
            // If only water, no change needed usually, but let's be explicit

            // Step 2: Buffer Added -> Clear
            // Buffer doesn't change color usually

            // Step 3: EBT Added -> Wine Red (Complex)
            if (hasBuffer && hasEBT) {
                // Determine Ratio
                // Assume 100mL sample, 0.01M
                // Moles Metal = 0.1 * 0.01 = 0.001 moles
                const molesMetal = volWater * 0.01;
                const molesEDTA = volEDTA * 0.01;

                const ratio = molesEDTA / molesMetal;

                // Update UI data if titrating
                if (volEDTA > 0) {
                    ExperimentManager.updateDisplay(volEDTA, (molesEDTA / volWater));
                } else {
                    ExperimentManager.updateStatus("Solution is Wine Red. Add EDTA to Titrate.", "info");
                }

                if (ratio < 0.90) {
                    return 'rgba(139, 0, 0, 0.8)'; // Wine Red
                } else if (ratio < 1.00) {
                    ExperimentManager.updateStatus("Approaching End Point...", "warning");

                    // Linear Interpolation: Wine Red (139,0,0) -> Steel Blue (70,130,180)
                    const factor = (ratio - 0.90) / 0.10; // 0 to 1
                    const r = Math.round(139 + (70 - 139) * factor);
                    const g = Math.round(0 + (130 - 0) * factor);
                    const b = Math.round(0 + (180 - 0) * factor);

                    return `rgba(${r}, ${g}, ${b}, 0.8)`;
                } else if (ratio < 1.05) {
                    ExperimentManager.updateStatus("End Point Reached! (Steel Blue)", "success");
                    return 'rgba(70, 130, 180, 0.8)'; // Steel Blue
                } else {
                    ExperimentManager.updateStatus("Warning: Excess Titrant Added! (Overshoot)", "error");
                    return 'rgba(0, 0, 255, 0.9)'; // Deep Blue (Overshot)
                }
            } else if (hasEBT && !hasBuffer) {
                ExperimentManager.updateStatus("Warning: Buffer not added! pH incorrect.", "error");
                return 'rgba(100, 0, 0, 0.5)'; // Muddy/Incorrect
            }
        }
        return null;
    }
}


// Lab Object Class with Interaction Logic
class LabObject {
    constructor(id, type, name, imgSrc, x, y) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.imgSrc = imgSrc;
        this.x = x;
        this.y = y;
        this.contents = []; // { name: 'Water', amount: 100, color: 'rgba(100, 149, 237, 0.5)' }
        this.capacity = this.getCapacity(type);
    }

    getCapacity(type) {
        if (type.includes('600')) return 600;
        if (type.includes('1000')) return 1000;
        if (type.includes('100')) return 100;
        if (type.includes('500')) return 500;
        if (type.includes('50')) return 50;
        if (type.includes('25')) return 25;
        return 10000; // Unlimited for sources like H2O bottle
    }

    addContent(item) {
        if (this.capacity > 0) {
            const currentVol = this.contents.reduce((acc, c) => acc + c.amount, 0);
            if (currentVol >= this.capacity) return false;

            let addedAmount = 0;
            let addedName = item.name;
            let resultMsg = "";

            // Logic to add content from another item or source
            // Check if source is Stock Item (simulated by having type/name but no contents/id usually, or flag)
            // The DragDrop logic sends a simple object {type, name...}. It doesn't have 'contents'.
            // Existing items have 'contents'.

            if (!item.contents || item.source === 'stockroom') {
                // Adding from Stock
                if (item.type === 'H2O' || item.type === 'HardWater') {
                    addedAmount = 100;
                    this.contents.push({ name: item.name, type: item.type, amount: addedAmount, color: 'rgba(173, 216, 230, 0.4)' });
                } else if (item.type === 'Buffer') {
                    addedAmount = 5;
                    this.contents.push({ name: item.name, type: item.type, amount: addedAmount, color: 'rgba(255, 255, 255, 0)' });
                } else if (item.type === 'EBT') {
                    addedAmount = 1;
                    this.contents.push({ name: item.name, type: item.type, amount: addedAmount, color: 'black' });
                } else if (item.type === 'EDTA') {
                    // If adding to a Burette, fill it. If adding to flask, add small amount?
                    // Usually we fill Burette.
                    if (this.type.includes('Burette')) {
                        addedAmount = 50;
                        this.contents.push({ name: item.name, type: 'EDTA', amount: addedAmount, color: 'rgba(255, 255, 255, 0.2)' });
                    } else {
                        addedAmount = 10;
                        this.contents.push({ name: item.name, type: 'EDTA', amount: addedAmount, color: 'rgba(255, 255, 255, 0.2)' });
                    }
                } else {
                    addedAmount = 10;
                    this.contents.push({ name: item.name, type: item.type || 'Unknown', amount: addedAmount, color: '#aaa', type: 'solid' });
                }
                resultMsg = `Added ${item.name}`;

            } else if (item.contents && item.contents.length > 0) {
                // Transfer from another vessel
                // Logic: If Burette, dropwise (1mL). If Beaker, pour (50mL).
                let isBurette = item.type && item.type.includes('Burette');
                let amt = isBurette ? 2.0 : 50;

                amt = Math.min(amt, item.contents[0].amount);

                const contentToTransfer = { ...item.contents[0], amount: amt };
                this.contents.push(contentToTransfer);
                item.contents[0].amount -= amt;
                if (item.contents[0].amount <= 0.1) item.contents.shift(); // Clear if empty

                addedAmount = amt;
                addedName = contentToTransfer.name;
                resultMsg = `Poured ${amt.toFixed(1)}mL`;
            }

            if (addedAmount > 0) {
                console.log(`Added ${addedAmount} of ${item.name} (${item.type}). Checking reaction...`);

                // Check Reaction
                const reactionColor = ExperimentManager.checkReaction(this);
                if (reactionColor) {
                    console.log(`Reaction Triggered! New Color: ${reactionColor}`);
                    this.reactionColor = reactionColor;
                } else {
                    console.log("No reaction change.");
                }
                return resultMsg;
            }
        }
        return false;
    }
}

// Tab Switching Logic
function switchTab(tabName) {
    document.querySelectorAll('.item-list').forEach(list => list.classList.add('hidden'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    const selectedList = document.getElementById(tabName + '-list');
    if (selectedList) selectedList.classList.remove('hidden');

    const tabs = document.querySelectorAll('.tab');
    if (tabName === 'solutions') tabs[0].classList.add('active');
    if (tabName === 'glassware') tabs[1].classList.add('active');
    if (tabName === 'tools') tabs[2].classList.add('active');
}

// Drag and Drop Logic for Stockroom Items
const stockItems = document.querySelectorAll('.stock-item');
stockItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: item.dataset.type,
            name: item.dataset.name,
            imgSrc: item.dataset.img,
            source: 'stockroom'
        }));
        e.dataTransfer.effectAllowed = 'copy';
    });
});

// Workbench Drag Over / Drop
workbenchArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

workbenchArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const dataString = e.dataTransfer.getData('text/plain');
    if (!dataString) return;

    let data;
    try { data = JSON.parse(dataString); } catch (err) { return; }

    const rect = workbenchArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Check if dropped ONTO another item
    const targetEl = e.target.closest('.wb-item');
    if (targetEl) {
        const targetId = parseInt(targetEl.dataset.id);
        const targetItem = workbenchItems.find(i => i.id === targetId);

        if (data.source === 'stockroom' && targetItem) {
            // Create temporary object to simulate source
            const tempSource = { type: data.type, name: data.name, contents: [] };
            const resultMsg = targetItem.addContent(tempSource); // Use the new addContent logic
            if (resultMsg) {
                updateItemVisuals(targetItem);
                showFloatingText(targetEl, resultMsg);
                return;
            }
        }
    }

    // Normal Placement Logic for Stockroom Items
    x -= 30; // Centering offset
    y -= 30;

    if (data.source === 'stockroom') {
        createWorkbenchItem(data.type, data.name, data.imgSrc, x, y);
    }
});

function updateItemVisuals(item) {
    const el = document.getElementById(`wb-item-${item.id}`);
    if (!el) return;

    // Check for existing fluid div
    let fluid = el.querySelector('.fluid-level');
    if (!fluid) {
        fluid = document.createElement('div');
        fluid.classList.add('fluid-level');
        el.appendChild(fluid);
    }

    // Calculate total volume or solid presence
    const totalVol = item.contents.reduce((acc, c) => c.type !== 'solid' ? acc + c.amount : acc, 0);
    const hasSolid = item.contents.some(c => c.type === 'solid');

    if (totalVol > 0 || hasSolid) {
        // Simple visual: height based on % capacity
        const pct = Math.min((totalVol / item.capacity) * 100, 100);
        fluid.style.height = `${pct * 0.7}%`; // Max 70% height

        // Color Logic: Use Reaction Color if exists, else Mix or Top Color
        if (item.reactionColor) {
            fluid.style.backgroundColor = item.reactionColor;
        } else {
            // Default to last added liquid's color
            const lastLiquid = [...item.contents].reverse().find(c => c.type !== 'solid');
            fluid.style.backgroundColor = lastLiquid ? lastLiquid.color : 'rgba(100,100,255,0.5)';
        }

        fluid.style.display = 'block';

        // Tooltip update
        el.title = `Vol: ${totalVol.toFixed(1)}mL\nContents: ${item.contents.map(c => c.name).join(', ')}`;

    } else {
        fluid.style.display = 'none';
        el.title = item.name;
    }
}

function showFloatingText(element, text) {
    const float = document.createElement('div');
    float.classList.add('floating-text');
    float.innerText = text;
    element.appendChild(float);
    setTimeout(() => float.remove(), 2000);
}


// Create Item on Workbench
function createWorkbenchItem(type, name, imgSrc, x, y) {
    const id = nextId++;
    const newItem = new LabObject(id, type, name, imgSrc, x, y);
    workbenchItems.push(newItem);

    const el = document.createElement('div');
    el.classList.add('wb-item');
    el.id = `wb-item-${id}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.draggable = true;
    el.dataset.id = id;

    // Image
    const img = document.createElement('img');
    img.src = imgSrc;
    img.draggable = false; // Prevent default image drag
    el.appendChild(img);

    // Label
    const label = document.createElement('div');
    label.classList.add('wb-item-label');
    label.innerText = name;
    el.appendChild(label);

    // Delete Button
    const delBtn = document.createElement('div');
    delBtn.classList.add('wb-delete-btn');
    delBtn.innerHTML = '<i class="fas fa-times"></i>'; // FontAwesome X icon
    delBtn.title = 'Remove Item';
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteWorkbenchItem(id);
    });
    el.appendChild(delBtn);

    // Interaction Logic (Click to Select)
    el.addEventListener('mousedown', (e) => {
        // Only select if left click
        if (e.button !== 0) return;

        e.stopPropagation(); // Prevent workbench click (clearing)
        selectItem(id);

        // Start Dragging Logic
        startDragging(e, el, id);
    });

    // Context Menu
    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectItem(id);
        showContextMenu(e.clientX, e.clientY);
    });

    workbenchArea.appendChild(el);

    // Hide instruction overlay
    const overlay = document.querySelector('.instruction-overlay');
    if (overlay) overlay.style.display = 'none';
}

// Selection Helper
function selectItem(id) {
    selectedItemId = id;
    document.querySelectorAll('.wb-item').forEach(i => i.classList.remove('selected'));
    const el = document.getElementById(`wb-item-${id}`);
    if (el) el.classList.add('selected');
    contextMenu.classList.add('hidden');
}

// Mouse Dragging Logic
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let currentDragEl = null;
let currentDragId = null;

function startDragging(e, el, id) {
    isDragging = true;
    currentDragEl = el;
    currentDragId = id;

    // Calculate offset from item top-left
    const rect = el.getBoundingClientRect();
    const parentRect = workbenchArea.getBoundingClientRect();

    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    el.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
}

document.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentDragEl) return;

    e.preventDefault();

    const parentRect = workbenchArea.getBoundingClientRect();

    // Calculate new position relative to workbench
    let newX = e.clientX - parentRect.left - dragOffset.x;
    let newY = e.clientY - parentRect.top - dragOffset.y;

    // Constrain to workbench bounds
    newX = Math.max(0, Math.min(newX, parentRect.width - currentDragEl.offsetWidth));
    newY = Math.max(0, Math.min(newY, parentRect.height - currentDragEl.offsetHeight));

    // Update DOM
    currentDragEl.style.left = `${newX}px`;
    currentDragEl.style.top = `${newY}px`;

    // Update Data Object
    const itemObj = workbenchItems.find(i => i.id === currentDragId);
    if (itemObj) {
        itemObj.x = newX;
        itemObj.y = newY;
    }
});

document.addEventListener('mouseup', (e) => {
    if (isDragging && currentDragEl) {
        currentDragEl.classList.remove('dragging');
        currentDragEl = null;
        currentDragId = null;
        isDragging = false;
        document.body.style.cursor = 'default';

        // Check for interaction (drop on another item)
        // Simple overlap check
        checkDropInteraction(e);
    }
});

function checkDropInteraction(e) {
    // This is a simplified interaction check compared to DnD API drop
    // We check if the mouse released OVER another wb-item
    const releaseElement = document.elementFromPoint(e.clientX, e.clientY);
    const targetEl = releaseElement ? releaseElement.closest('.wb-item') : null;

    if (targetEl && selectedItemId) {
        const targetId = parseInt(targetEl.dataset.id);
        // Don't interact with self
        if (targetId !== selectedItemId) {
            const sourceItem = workbenchItems.find(i => i.id === selectedItemId);
            const targetItem = workbenchItems.find(i => i.id === targetId);

            if (sourceItem && targetItem) {
                const result = targetItem.addContent(sourceItem);
                if (result) {
                    updateItemVisuals(targetItem);
                    updateItemVisuals(sourceItem);
                    showFloatingText(targetEl, result);
                }
            }
        }
    }
}

// Delete Item Helper
function deleteWorkbenchItem(id) {
    const el = document.getElementById(`wb-item-${id}`);
    if (el) el.remove();
    workbenchItems = workbenchItems.filter(i => i.id !== id);
    selectedItemId = null;
    contextMenu.classList.add('hidden');

    // Show instruction if empty
    if (workbenchItems.length === 0) {
        const ol = document.querySelector('.instruction-overlay');
        if (ol) ol.style.display = 'block';
    }
}

// Global Key Listener for Delete
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItemId) {
        deleteWorkbenchItem(selectedItemId);
    }
});

// Deselect on empty area click
workbenchArea.addEventListener('mousedown', (e) => {
    if (e.target === workbenchArea) {
        selectedItemId = null;
        document.querySelectorAll('.wb-item').forEach(i => i.classList.remove('selected'));
    }
});

// Context Menu Logic
function showContextMenu(mx, my) {
    contextMenu.style.left = `${mx}px`;
    contextMenu.style.top = `${my}px`;
    contextMenu.classList.remove('hidden');
}

document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.classList.add('hidden');
    }
});

// Menu Actions
document.getElementById('menu-remove').addEventListener('click', () => {
    if (selectedItemId) {
        const el = document.getElementById(`wb-item-${selectedItemId}`);
        if (el) el.remove();
        workbenchItems = workbenchItems.filter(i => i.id !== selectedItemId);
        selectedItemId = null;
        contextMenu.classList.add('hidden');
    }
});

document.getElementById('menu-inspect').addEventListener('click', () => {
    if (selectedItemId) {
        const item = workbenchItems.find(i => i.id === selectedItemId);
        alert(`Inspecting ${item.name}\nType: ${item.type}\nCapacity: ${item.capacity}mL\nContents: ${item.contents.length > 0 ? JSON.stringify(item.contents) : 'Empty'}`);
        contextMenu.classList.add('hidden');
    }
});

document.getElementById('menu-rename').addEventListener('click', () => {
    if (selectedItemId) {
        const item = workbenchItems.find(i => i.id === selectedItemId);
        const newName = prompt("Rename item:", item.name);
        if (newName) {
            item.name = newName;
            const el = document.getElementById(`wb-item-${selectedItemId}`);
            el.querySelector('.wb-item-label').innerText = newName;
        }
        contextMenu.classList.add('hidden');
    }
});


// Initialize Experiment from Storage
document.addEventListener('DOMContentLoaded', () => {
    let currentExperiment = sessionStorage.getItem('currentExperiment');

    // Default to Hardness of Water if not set (for testing/direct access)
    if (!currentExperiment) {
        currentExperiment = "Hardness of Water by EDTA Method";
        sessionStorage.setItem('currentExperiment', currentExperiment);
    }

    if (currentExperiment) {
        const titleEl = document.querySelector('.problem-title');
        if (titleEl) {
            titleEl.textContent = currentExperiment;
            document.title = `${currentExperiment} - Virtual Lab`;
        }
        loadExperimentResources(currentExperiment);
    }

    // Initial listeners for pre-existing items
    document.querySelectorAll('.stock-item').forEach(item => attachStockItemListeners(item));
});

// Helper to attach listeners to stock items
function attachStockItemListeners(item) {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: item.dataset.type,
            name: item.dataset.name,
            imgSrc: item.dataset.img,
            source: 'stockroom'
        }));
        e.dataTransfer.effectAllowed = 'copy';
    });

    const addBtn = item.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = item.dataset.type;
            const name = item.dataset.name;
            const img = item.dataset.img;

            // Spawn in random position
            const rect = workbenchArea.getBoundingClientRect();
            const x = (rect.width / 2) - 30 + (Math.random() * 40 - 20);
            const y = (rect.height / 2) - 30 + (Math.random() * 40 - 20);

            createWorkbenchItem(type, name, img, x, y);
        });
    }
}

// Experiment Configurations
const experimentConfigs = {
    "Hardness of Water by EDTA Method": {
        solutions: [
            { type: 'HardWater', name: 'Hard Water', img: '../stockroom/solidBottle.svg', desc: 'Sample' },
            { type: 'Buffer', name: 'Ammonia Buffer', img: '../stockroom/solidBottle.svg', desc: 'pH 10' },
            { type: 'EBT', name: 'EBT Indicator', img: '../stockroom/solidBottle.svg', desc: 'Indicator' },
            { type: 'EDTA', name: 'EDTA Solution', img: '../stockroom/solidBottle.svg', desc: 'Titrant' }
        ]
    },
    "Acid Concentration using pH Meter": {
        solutions: [
            { type: 'AcidSample', name: 'Acid Sample', img: '../stockroom/solidBottle.svg', desc: 'Unknown Conc.' },
            { type: 'Buffer4', name: 'Buffer pH 4', img: '../stockroom/solidBottle.svg', desc: 'Calibration' },
            { type: 'Buffer7', name: 'Buffer pH 7', img: '../stockroom/solidBottle.svg', desc: 'Calibration' }
        ],
        tools: [
            { type: 'pHMeter', name: 'pH Meter', img: '../stockroom/tools.svg', desc: 'Digital' }
        ]
    },
    "Determination of Residual Chlorine": {
        solutions: [
            { type: 'ChlorineWater', name: 'Water Sample', img: '../stockroom/solidBottle.svg', desc: 'Sample' },
            { type: 'Chlorotex', name: 'Chlorotex Reagent', img: '../stockroom/solidBottle.svg', desc: 'Indicator' }
        ]
    },
    "Determination of FAS using K2Cr2O7": {
        solutions: [
            { type: 'FAS', name: 'FAS Solution', img: '../stockroom/solidBottle.svg', desc: 'Analyte' },
            { type: 'H2SO4', name: 'Dilute H2SO4', img: '../stockroom/solidBottle.svg', desc: 'Acid Medium' },
            { type: 'NPA', name: 'N-Phenyl Anthranilic Acid', img: '../stockroom/solidBottle.svg', desc: 'Indicator' },
            { type: 'K2Cr2O7', name: 'Potassium Dichromate', img: '../stockroom/solidBottle.svg', desc: 'Titrant' }
        ]
    },
    "Determination of Dissolved Oxygen (Winkler’s Method)": {
        solutions: [
            { type: 'DOSample', name: 'Water Sample', img: '../stockroom/solidBottle.svg', desc: 'Sample' },
            { type: 'MnSO4', name: 'MnSO4 Solution', img: '../stockroom/solidBottle.svg', desc: ' reagent A' },
            { type: 'AlkKI', name: 'Alkaline KI', img: '../stockroom/solidBottle.svg', desc: 'Reagent B' },
            { type: 'H2SO4Conc', name: 'Conc. H2SO4', img: '../stockroom/solidBottle.svg', desc: 'Acid' },
            { type: 'Starch', name: 'Starch Indicator', img: '../stockroom/solidBottle.svg', desc: 'Indicator' },
            { type: 'Thio', name: 'Sodium Thiosulphate', img: '../stockroom/solidBottle.svg', desc: 'Titrant' }
        ]
    }
};

function loadExperimentResources(name) {
    currentExperimentName = name; // Update global state
    ExperimentManager.updateStatus(`Experiment Loaded: ${name}`);

    // --- Custom Simulation View Logic ---
    const workbenchArea = document.getElementById('workbench-area');
    const simView = document.getElementById('simulation-view');
    const exp1 = document.getElementById('sim-exp1');
    const exp2 = document.getElementById('sim-exp2');
    const exp3 = document.getElementById('sim-exp3');
    
    if (simView && workbenchArea) {
        // Hide all specialized sim views first
        if (exp1) exp1.classList.remove('active');
        if (exp2) exp2.classList.remove('active');
        if (exp3) exp3.classList.remove('active');
        
        if (name === "Hardness of Water by EDTA Method") {
            workbenchArea.style.display = 'none';
            simView.classList.add('active');
            if (exp1) exp1.classList.add('active');
        } else if (name === "Residual Chlorine in Water" || name === "Determination of Residual Chlorine") {
            workbenchArea.style.display = 'none';
            simView.classList.add('active');
            if (exp2) exp2.classList.add('active');
        } else if (name === "Determination of FAS using K2Cr2O7" || name.includes("Strength of FAS using K₂Cr₂O₇")) {
            workbenchArea.style.display = 'none';
            simView.classList.add('active');
            if (exp3) exp3.classList.add('active');
        } else {
            workbenchArea.style.display = ''; // revert to default
            simView.classList.remove('active');
        }
    }

    const config = experimentConfigs[name];
    if (!config) return;

    // Update Solutions
    if (config.solutions) {
        const list = document.getElementById('solutions-list');
        list.innerHTML = ''; // Clear default
        config.solutions.forEach(item => {
            list.appendChild(createStockItemElement(item));
        });
    }

    // Update Glassware if specified (otherwise keep default)
    if (config.glassware) {
        const list = document.getElementById('glassware-list');
        list.innerHTML = '';
        config.glassware.forEach(item => {
            list.appendChild(createStockItemElement(item));
        });
    }

    // Update Tools if specified
    if (config.tools) {
        const list = document.getElementById('tools-list');
        list.innerHTML = '';
        config.tools.forEach(item => {
            list.appendChild(createStockItemElement(item));
        });
    }
}

function createStockItemElement(item) {
    const div = document.createElement('div');
    div.className = 'stock-item';
    div.draggable = true;
    div.dataset.type = item.type;
    div.dataset.name = item.name;
    div.dataset.img = item.img;

    div.innerHTML = `
        <img src="${item.img}" class="item-icon">
        <div class="item-details">
            <span class="item-name">${item.name}</span>
            <span class="item-desc">${item.desc}</span>
        </div>
        <button class="add-btn"><i class="fas fa-plus"></i></button>
    `;

    attachStockItemListeners(div);
    return div;
}

// Reset Workbench Function
function resetWorkbench() {
    if (confirm("Clear workbench?")) {
        document.querySelectorAll('.wb-item').forEach(e => e.remove());
        workbenchItems = [];
        nextId = 1;
        selectedItemId = null;

        // Reset Experiment State
        experimentData.titrantVolume = 0;
        ExperimentManager.updateStatus("Select an experiment to begin.");
        const display = document.getElementById('data-display');
        if (display) display.innerHTML = '';
        const statusPanel = document.getElementById('experiment-status');
        if (statusPanel) statusPanel.classList.add('hidden');

        const ol = document.querySelector('.instruction-overlay');
        if (ol) ol.style.display = 'block';
    }
}
