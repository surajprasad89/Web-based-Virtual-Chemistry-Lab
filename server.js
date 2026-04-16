const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from Frontend directory
app.use(express.static(path.join(__dirname, 'Frontend')));
app.use(express.static(__dirname));

// API Routes

// Calculate Water Hardness by EDTA Method
app.post('/api/calculate/hardness', (req, res) => {
    try {
        const { edtaVolume, waterSampleVolume = 50, edtaMolarity = 0.01 } = req.body;

        if (!edtaVolume || edtaVolume <= 0) {
            return res.status(400).json({ error: 'Invalid EDTA volume' });
        }

        // Formula: Total Hardness (ppm of CaCO₃) = (Volume of EDTA × Molarity of EDTA × 1000 × 100) / Volume of water sample
        const hardness = (edtaVolume * edtaMolarity * 1000 * 100) / waterSampleVolume;

        res.json({
            success: true,
            hardness: parseFloat(hardness.toFixed(2)),
            unit: 'ppm of CaCO₃',
            formula: 'Hardness = (V_EDTA × M_EDTA × 1000 × 100) / V_water',
            calculation: {
                edtaVolume: edtaVolume,
                edtaMolarity: edtaMolarity,
                waterSampleVolume: waterSampleVolume,
                result: hardness.toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Calculation failed', message: error.message });
    }
});

// Calculate Acid Concentration from pH
app.post('/api/calculate/acid-concentration', (req, res) => {
    try {
        const { pH, acidType = 'strong' } = req.body;

        if (!pH || pH < 0 || pH > 14) {
            return res.status(400).json({ error: 'Invalid pH value' });
        }

        let concentration;
        if (acidType === 'strong') {
            // For strong acids: pH = -log[H⁺]
            concentration = Math.pow(10, -pH);
        } else {
            // For weak acids, would need Ka value (simplified for now)
            concentration = Math.pow(10, -pH);
        }

        res.json({
            success: true,
            concentration: parseFloat(concentration.toFixed(6)),
            unit: 'M',
            pH: pH,
            formula: '[H⁺] = 10^(-pH)'
        });
    } catch (error) {
        res.status(500).json({ error: 'Calculation failed', message: error.message });
    }
});

// Calculate Dissolved Oxygen (Winkler Method)
app.post('/api/calculate/dissolved-oxygen', (req, res) => {
    try {
        const { thiosulfateVolume, thiosulfateMolarity = 0.01, sampleVolume = 200 } = req.body;

        if (!thiosulfateVolume || thiosulfateVolume <= 0) {
            return res.status(400).json({ error: 'Invalid thiosulfate volume' });
        }

        // Winkler Method: DO (mg/L) = (V_Na2S2O3 × M_Na2S2O3 × 8 × 1000) / V_sample
        const dissolvedOxygen = (thiosulfateVolume * thiosulfateMolarity * 8 * 1000) / sampleVolume;

        res.json({
            success: true,
            dissolvedOxygen: parseFloat(dissolvedOxygen.toFixed(2)),
            unit: 'mg/L',
            formula: 'DO = (V_Na2S2O3 × M_Na2S2O3 × 8 × 1000) / V_sample'
        });
    } catch (error) {
        res.status(500).json({ error: 'Calculation failed', message: error.message });
    }
});

// Reaction Simulation Data
app.post('/api/reaction/simulate', (req, res) => {
    try {
        const { reactionType, reactants } = req.body;

        const reactions = {
            'edta-titration': {
                name: 'EDTA Titration',
                steps: [
                    { time: 0, description: 'Initial state: Wine-red solution with Mg²⁺-EBT complex' },
                    { time: 1, description: 'EDTA starts complexing with free Ca²⁺ and Mg²⁺ ions' },
                    { time: 2, description: 'Transition phase: Color begins to change' },
                    { time: 3, description: 'Near endpoint: Purple color observed' },
                    { time: 4, description: 'Endpoint reached: Blue color, all ions complexed' }
                ],
                products: ['[Ca-EDTA]²⁻', '[Mg-EDTA]²⁻', 'Free EBT (blue)']
            },
            'nylon-formation': {
                name: 'Nylon 6,6 Formation',
                steps: [
                    { time: 0, description: 'Hexamethylene diamine and adipic acid mixed' },
                    { time: 1, description: 'Nylon salt formation' },
                    { time: 2, description: 'Polymerization initiated by heating' },
                    { time: 3, description: 'Chain growth: Polymer chains forming' },
                    { time: 4, description: 'Nylon 6,6 polymer formed' }
                ],
                products: ['Nylon 6,6 polymer', 'Water (byproduct)']
            },
            'bakelite-formation': {
                name: 'Bakelite Formation',
                steps: [
                    { time: 0, description: 'Phenol and formaldehyde mixed with catalyst' },
                    { time: 1, description: 'Initial condensation: Resol formation' },
                    { time: 2, description: 'Network formation: Cross-linking begins' },
                    { time: 3, description: 'Curing: Hardening process' },
                    { time: 4, description: 'Bakelite resin formed' }
                ],
                products: ['Bakelite (phenolic resin)', 'Water (byproduct)']
            }
        };

        const reaction = reactions[reactionType] || reactions['edta-titration'];

        res.json({
            success: true,
            reaction: reaction,
            reactants: reactants,
            animationData: {
                duration: 10, // seconds
                steps: reaction.steps.length
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Simulation failed', message: error.message });
    }
});

// Get experiment data
app.get('/api/experiment/:name', (req, res) => {
    const experimentName = req.params.name;

    // This would typically fetch from a database
    // For now, return basic structure
    res.json({
        name: experimentName,
        available: true,
        has3DVisualization: true
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'PoornimaChem API is running' });
});

// Serve welcome page as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'welcome.html'));
});

// Serve main index page
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 PoornimaChem Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

