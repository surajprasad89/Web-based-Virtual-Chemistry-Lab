// API Client for Backend Communication
// Handles all API calls to the Node.js backend

const API_BASE_URL = 'http://localhost:3000/api';

class APIClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    // Generic fetch method
    async fetch(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Calculate water hardness
    async calculateHardness(edtaVolume, waterSampleVolume = 50, edtaMolarity = 0.01) {
        return await this.fetch('/calculate/hardness', {
            method: 'POST',
            body: JSON.stringify({
                edtaVolume,
                waterSampleVolume,
                edtaMolarity
            })
        });
    }

    // Calculate acid concentration from pH
    async calculateAcidConcentration(pH, acidType = 'strong') {
        return await this.fetch('/calculate/acid-concentration', {
            method: 'POST',
            body: JSON.stringify({
                pH,
                acidType
            })
        });
    }

    // Calculate dissolved oxygen
    async calculateDissolvedOxygen(thiosulfateVolume, thiosulfateMolarity = 0.01, sampleVolume = 200) {
        return await this.fetch('/calculate/dissolved-oxygen', {
            method: 'POST',
            body: JSON.stringify({
                thiosulfateVolume,
                thiosulfateMolarity,
                sampleVolume
            })
        });
    }

    // Simulate reaction
    async simulateReaction(reactionType, reactants = []) {
        return await this.fetch('/reaction/simulate', {
            method: 'POST',
            body: JSON.stringify({
                reactionType,
                reactants
            })
        });
    }

    // Get experiment data
    async getExperiment(experimentName) {
        return await this.fetch(`/experiment/${encodeURIComponent(experimentName)}`);
    }

    // Health check
    async healthCheck() {
        return await this.fetch('/health');
    }
}

// Create global API client instance
const apiClient = new APIClient();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}

