# PoornimaChem - 3D Visualization & Backend Setup

This document explains how to set up and use the 3D visualization features and Node.js backend for the PoornimaChem virtual lab.

## Features

### 🎨 3D Visualization (Three.js)
- **3D Beakers**: Interactive 3D beakers with liquid levels
- **3D Flasks**: Conical flasks with realistic rendering
- **3D Burettes**: Animated burettes for titration
- **Reaction Animations**: Color-changing reactions (e.g., EDTA titration)
- **Particle Systems**: Visual particle effects for chemical reactions
- **Interactive Controls**: Rotate, zoom, and pan the 3D scene

### 🔧 Backend API (Node.js)
- **Reaction Calculations**: Water hardness, acid concentration, dissolved oxygen
- **Reaction Simulation**: API endpoints for different reaction types
- **Data Handling**: Server-side processing for chemistry calculations

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Backend Dependencies

Navigate to the project root directory and install dependencies:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing

### Step 2: Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

You should see:
```
🚀 PoornimaChem Server running on http://localhost:3000
📡 API endpoints available at http://localhost:3000/api
```

### Step 3: Open the Frontend

Open `Frontend/virtual-lab.html` in your web browser, or use the backend server:

```
http://localhost:3000/virtual-lab.html
```

## Usage

### 3D Visualization

1. **Adding Items to Workbench**:
   - Drag items from the stockroom to the workbench
   - Or click the "+" button on items
   - Items will appear in both 2D list and 3D visualization

2. **Interacting with 3D Scene**:
   - **Rotate**: Click and drag with left mouse button
   - **Zoom**: Scroll wheel or pinch gesture
   - **Pan**: Right-click and drag (or middle mouse button)

3. **Viewing Reactions**:
   - Start a titration experiment
   - Watch as liquid levels change in 3D
   - See color transitions during reactions
   - Animated endpoints show completion

### Backend API Endpoints

#### Health Check
```
GET /api/health
```
Returns server status.

#### Calculate Water Hardness
```
POST /api/calculate/hardness
Body: {
  "edtaVolume": 12.5,
  "waterSampleVolume": 50,
  "edtaMolarity": 0.01
}
```

#### Calculate Acid Concentration
```
POST /api/calculate/acid-concentration
Body: {
  "pH": 3.5,
  "acidType": "strong"
}
```

#### Calculate Dissolved Oxygen
```
POST /api/calculate/dissolved-oxygen
Body: {
  "thiosulfateVolume": 8.5,
  "thiosulfateMolarity": 0.01,
  "sampleVolume": 200
}
```

#### Simulate Reaction
```
POST /api/reaction/simulate
Body: {
  "reactionType": "edta-titration",
  "reactants": ["EDTA", "Water Sample"]
}
```

#### Get Experiment Data
```
GET /api/experiment/:name
```

## File Structure

```
PoornimaChem/
├── server.js                 # Node.js backend server
├── package.json              # Backend dependencies
├── Frontend/
│   ├── virtual-lab.html      # Main lab interface
│   ├── virtual-lab.js        # Lab functionality
│   ├── threejs-viz.js        # 3D visualization module
│   ├── api-client.js         # Backend API client
│   └── ...
└── README_3D_SETUP.md        # This file
```

## Development

### Adding New 3D Objects

Edit `Frontend/threejs-viz.js` to add new 3D models:

```javascript
// Example: Create a new container type
createNewContainer(id, options) {
    // Implementation here
}
```

### Adding New API Endpoints

Edit `server.js` to add new endpoints:

```javascript
app.post('/api/new-endpoint', (req, res) => {
    // Handle request
    res.json({ success: true });
});
```

### Customizing Reactions

Edit the `animateReaction` method in `Frontend/threejs-viz.js` to add new reaction types:

```javascript
const colorTransitions = {
    'new-reaction': [
        { time: 0, color: 0xff0000 },
        { time: 1.0, color: 0x00ff00 }
    ]
};
```

## Troubleshooting

### 3D Visualization Not Showing

1. Check browser console for errors
2. Ensure Three.js library loaded correctly
3. Check that container element exists: `#viz-3d-container`

### Backend API Not Working

1. Ensure server is running: `npm start`
2. Check server logs for errors
3. Verify port 3000 is not in use
4. Check CORS settings if accessing from different origin

### OrbitControls Not Working

The Three.js OrbitControls should load automatically. If rotation/zoom doesn't work:
1. Check browser console for errors
2. Ensure OrbitControls script loaded after Three.js
3. Controls may be disabled in options

## Browser Compatibility

- Chrome/Edge: Full support ✅
- Firefox: Full support ✅
- Safari: Full support ✅
- Internet Explorer: Not supported ❌

## Notes

- The backend server must be running for API features
- Frontend will work without backend but with limited features
- 3D visualization requires WebGL support in browser
- For production, configure proper CORS and security settings

## Support

For issues or questions, check:
1. Browser console for errors
2. Server logs for backend issues
3. Three.js documentation: https://threejs.org/docs/
4. Express.js documentation: https://expressjs.com/

