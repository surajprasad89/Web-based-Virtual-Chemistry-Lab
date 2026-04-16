// Three.js 3D Visualization Module for Chemistry Lab
// Handles 3D rendering of beakers, flasks, reactions, and animations

class ChemistryVisualizer3D {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        // Default options
        this.options = {
            width: options.width || this.container.clientWidth || 800,
            height: options.height || this.container.clientHeight || 600,
            backgroundColor: options.backgroundColor || 0xf0f0f0,
            enableControls: options.enableControls !== false,
            antialias: options.antialias !== false
        };

        // Initialize Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.objects = {}; // Store 3D objects
        this.animationId = null;
        this.isAnimating = false;

        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.options.width / this.options.height,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: this.options.antialias
        });
        this.renderer.setSize(this.options.width, this.options.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Add orbit controls
        if (this.options.enableControls) {
            // Try to use OrbitControls (supports both module and global)
            if (typeof OrbitControls !== 'undefined') {
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            } else if (typeof THREE.OrbitControls !== 'undefined') {
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            } else {
                console.warn('OrbitControls not available, camera controls disabled');
            }
            
            if (this.controls) {
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.enableZoom = true;
                this.controls.enablePan = true;
            }
        }

        // Add lighting
        this.setupLighting();

        // Add grid and axes helper
        this.addHelpers();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun-like)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for better illumination
        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(-10, 10, -5);
        this.scene.add(pointLight);
    }

    addHelpers() {
        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
        this.scene.add(gridHelper);

        // Axes helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    // Create a beaker
    createBeaker(id, options = {}) {
        const {
            position = { x: 0, y: 0, z: 0 },
            height = 4,
            radius = 1,
            liquidLevel = 0.5,
            liquidColor = 0x4169E1,
            glassColor = 0xe8f4f8,
            opacity = 0.3
        } = options;

        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);

        // Glass beaker body (cylindrical)
        const glassGeometry = new THREE.CylinderGeometry(radius, radius * 0.9, height, 32);
        const glassMaterial = new THREE.MeshPhongMaterial({
            color: glassColor,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide
        });
        const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
        glassMesh.castShadow = true;
        glassMesh.receiveShadow = true;
        group.add(glassMesh);

        // Liquid inside beaker
        const liquidHeight = height * liquidLevel;
        const liquidGeometry = new THREE.CylinderGeometry(
            radius * 0.95,
            radius * 0.85,
            liquidHeight,
            32
        );
        const liquidMaterial = new THREE.MeshPhongMaterial({
            color: liquidColor,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
        liquidMesh.position.y = (liquidHeight - height) / 2;
        liquidMesh.receiveShadow = true;
        liquidMesh.userData = { type: 'liquid', level: liquidLevel };
        group.add(liquidMesh);

        // Beaker lip/rim
        const rimGeometry = new THREE.TorusGeometry(radius, 0.05, 16, 32);
        const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const rimMesh = new THREE.Mesh(rimGeometry, rimMaterial);
        rimMesh.position.y = height / 2;
        rimMesh.rotation.x = Math.PI / 2;
        group.add(rimMesh);

        // Store reference
        group.userData = {
            id: id,
            type: 'beaker',
            liquidMesh: liquidMesh,
            options: options
        };

        this.objects[id] = group;
        this.scene.add(group);

        return group;
    }

    // Create a flask (Erlenmeyer/conical flask)
    createFlask(id, options = {}) {
        const {
            position = { x: 0, y: 0, z: 0 },
            height = 3.5,
            radius = 1.2,
            liquidLevel = 0.6,
            liquidColor = 0x4169E1,
            glassColor = 0xe8f4f8,
            opacity = 0.3
        } = options;

        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);

        // Flask body (tapered cylinder - conical flask)
        const segments = 32;
        const flaskShape = new THREE.Shape();
        const topRadius = radius;
        const bottomRadius = radius * 1.2;

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const r = topRadius + (bottomRadius - topRadius) * (i / segments);
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            if (i === 0) {
                flaskShape.moveTo(x, y);
            } else {
                flaskShape.lineTo(x, y);
            }
        }

        const flaskGeometry = new THREE.LatheGeometry(
            Array.from({ length: segments + 1 }, (_, i) => {
                const y = (i / segments) * height - height / 2;
                const radius = topRadius - (topRadius - bottomRadius) * (i / segments);
                return new THREE.Vector2(radius, y);
            }),
            segments
        );

        const flaskMaterial = new THREE.MeshPhongMaterial({
            color: glassColor,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide
        });
        const flaskMesh = new THREE.Mesh(flaskGeometry, flaskMaterial);
        flaskMesh.castShadow = true;
        flaskMesh.receiveShadow = true;
        group.add(flaskMesh);

        // Liquid inside flask
        const liquidHeight = height * liquidLevel;
        const liquidGeometry = new THREE.ConeGeometry(
            radius * 0.95,
            liquidHeight,
            segments
        );
        const liquidMaterial = new THREE.MeshPhongMaterial({
            color: liquidColor,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
        liquidMesh.position.y = -height / 2 + liquidHeight / 2;
        liquidMesh.receiveShadow = true;
        liquidMesh.userData = { type: 'liquid', level: liquidLevel };
        group.add(liquidMesh);

        // Flask neck
        const neckGeometry = new THREE.CylinderGeometry(radius * 0.4, radius * 0.5, height * 0.3, 16);
        const neckMaterial = new THREE.MeshPhongMaterial({
            color: glassColor,
            transparent: true,
            opacity: opacity
        });
        const neckMesh = new THREE.Mesh(neckGeometry, neckMaterial);
        neckMesh.position.y = height / 2 + height * 0.15;
        group.add(neckMesh);

        // Store reference
        group.userData = {
            id: id,
            type: 'flask',
            liquidMesh: liquidMesh,
            options: options
        };

        this.objects[id] = group;
        this.scene.add(group);

        return group;
    }

    // Create a burette
    createBurette(id, options = {}) {
        const {
            position = { x: 0, y: 0, z: 0 },
            height = 5,
            radius = 0.3,
            liquidLevel = 0.8,
            liquidColor = 0x00ff00
        } = options;

        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);

        // Burette body (thin cylinder)
        const buretteGeometry = new THREE.CylinderGeometry(radius, radius, height, 16);
        const buretteMaterial = new THREE.MeshPhongMaterial({
            color: 0xe8f4f8,
            transparent: true,
            opacity: 0.5
        });
        const buretteMesh = new THREE.Mesh(buretteGeometry, buretteMaterial);
        group.add(buretteMesh);

        // Liquid in burette
        const liquidHeight = height * liquidLevel;
        const liquidGeometry = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, liquidHeight, 16);
        const liquidMaterial = new THREE.MeshPhongMaterial({
            color: liquidColor,
            transparent: true,
            opacity: 0.8
        });
        const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
        liquidMesh.position.y = (liquidHeight - height) / 2;
        liquidMesh.userData = { type: 'liquid', level: liquidLevel };
        group.add(liquidMesh);

        // Stopcock/tap
        const tapGeometry = new THREE.BoxGeometry(radius * 2, radius * 0.5, radius * 2);
        const tapMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
        const tapMesh = new THREE.Mesh(tapGeometry, tapMaterial);
        tapMesh.position.y = -height / 2;
        group.add(tapMesh);

        group.userData = {
            id: id,
            type: 'burette',
            liquidMesh: liquidMesh,
            options: options
        };

        this.objects[id] = group;
        this.scene.add(group);

        return group;
    }

    // Update liquid level in a container
    updateLiquidLevel(containerId, newLevel, color = null) {
        const container = this.objects[containerId];
        if (!container || !container.userData.liquidMesh) return;

        const liquidMesh = container.userData.liquidMesh;
        const options = container.userData.options;
        const height = options.height || 4;

        // Update liquid level
        const liquidHeight = height * newLevel;
        const currentGeometry = liquidMesh.geometry;

        // Create new geometry with updated height
        let newGeometry;
        if (container.userData.type === 'beaker') {
            const radius = options.radius || 1;
            newGeometry = new THREE.CylinderGeometry(
                radius * 0.95,
                radius * 0.85,
                liquidHeight,
                32
            );
            liquidMesh.position.y = (liquidHeight - height) / 2;
        } else if (container.userData.type === 'flask') {
            const radius = options.radius || 1.2;
            newGeometry = new THREE.ConeGeometry(radius * 0.95, liquidHeight, 32);
            liquidMesh.position.y = -height / 2 + liquidHeight / 2;
        } else if (container.userData.type === 'burette') {
            const radius = options.radius || 0.3;
            newGeometry = new THREE.CylinderGeometry(
                radius * 0.9,
                radius * 0.9,
                liquidHeight,
                16
            );
            liquidMesh.position.y = (liquidHeight - height) / 2;
        }

        if (newGeometry) {
            liquidMesh.geometry.dispose();
            liquidMesh.geometry = newGeometry;
        }

        // Update color if provided
        if (color !== null) {
            liquidMesh.material.color.setHex(color);
        }

        liquidMesh.userData.level = newLevel;
    }

    // Change liquid color (for reactions)
    changeLiquidColor(containerId, newColor, duration = 1000) {
        const container = this.objects[containerId];
        if (!container || !container.userData.liquidMesh) return;

        const liquidMesh = container.userData.liquidMesh;
        const startColor = new THREE.Color(liquidMesh.material.color.getHex());
        const endColor = new THREE.Color(newColor);

        const startTime = Date.now();

        const animateColor = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            liquidMesh.material.color.lerpColors(startColor, endColor, progress);

            if (progress < 1) {
                requestAnimationFrame(animateColor);
            }
        };

        animateColor();
    }

    // Animate pouring liquid from one container to another
    pourLiquid(fromId, toId, volume, duration = 2000, callback = null) {
        const fromContainer = this.objects[fromId];
        const toContainer = this.objects[toId];

        if (!fromContainer || !toContainer) return;

        const fromLevel = fromContainer.userData.liquidMesh.userData.level || 0.5;
        const toLevel = toContainer.userData.liquidMesh.userData.level || 0;
        const fromOptions = fromContainer.userData.options;
        const toOptions = toContainer.userData.options;

        // Calculate new levels (simplified - assuming same container sizes)
        const fromHeight = fromOptions.height || 4;
        const toHeight = toOptions.height || 4;
        const volumeRatio = volume / (Math.PI * Math.pow(fromOptions.radius || 1, 2) * fromHeight);

        const newFromLevel = Math.max(0, fromLevel - volumeRatio);
        const newToLevel = Math.min(1, toLevel + volumeRatio);

        const startTime = Date.now();
        const startFromLevel = fromLevel;
        const startToLevel = toLevel;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easedProgress = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            const currentFromLevel = startFromLevel - (startFromLevel - newFromLevel) * easedProgress;
            const currentToLevel = startToLevel + (newToLevel - startToLevel) * easedProgress;

            this.updateLiquidLevel(fromId, currentFromLevel);
            this.updateLiquidLevel(toId, currentToLevel);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };

        animate();
    }

    // Create particle system for reactions
    createParticles(id, options = {}) {
        const {
            position = { x: 0, y: 0, z: 0 },
            count = 100,
            color = 0xffffff,
            size = 0.1,
            speed = 0.02
        } = options;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const colorObj = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Random position
            positions[i3] = (Math.random() - 0.5) * 2;
            positions[i3 + 1] = Math.random() * 2;
            positions[i3 + 2] = (Math.random() - 0.5) * 2;

            // Color
            colors[i3] = colorObj.r;
            colors[i3 + 1] = colorObj.g;
            colors[i3 + 2] = colorObj.b;

            // Size
            sizes[i] = size;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    gl_FragColor = vec4(vColor, 1.0);
                }
            `,
            vertexColors: true,
            transparent: true
        });

        const particles = new THREE.Points(geometry, material);
        particles.position.set(position.x, position.y, position.z);

        particles.userData = {
            id: id,
            type: 'particles',
            speed: speed,
            material: material
        };

        this.objects[id] = particles;
        this.scene.add(particles);

        return particles;
    }

    // Animate reaction (color change with particles)
    animateReaction(containerId, reactionType, duration = 5000, callback = null) {
        const container = this.objects[containerId];
        if (!container) return;

        const colorTransitions = {
            'edta-titration': [
                { time: 0, color: 0x8B0000 },      // Wine-red
                { time: 0.3, color: 0xA52A2A },    // Dark Red
                { time: 0.5, color: 0x8B008B },    // Purple-Red
                { time: 0.7, color: 0x6A0DAD },    // Purple
                { time: 0.9, color: 0x4169E1 },    // Blue-Purple
                { time: 1.0, color: 0x0000FF }     // Blue
            ],
            'acid-base': [
                { time: 0, color: 0xff0000 },      // Red (acidic)
                { time: 0.5, color: 0xffff00 },    // Yellow (neutralizing)
                { time: 1.0, color: 0x00ff00 }     // Green (basic)
            ],
            'precipitation': [
                { time: 0, color: 0x4169E1 },      // Blue (clear)
                { time: 0.5, color: 0x808080 },    // Gray (cloudy)
                { time: 1.0, color: 0xffffff }     // White (precipitate)
            ]
        };

        const transitions = colorTransitions[reactionType] || colorTransitions['edta-titration'];
        const startTime = Date.now();

        let currentTransition = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            // Find current transition segment
            while (currentTransition < transitions.length - 1 &&
                   progress > transitions[currentTransition + 1].time) {
                currentTransition++;
            }

            if (currentTransition < transitions.length - 1) {
                const current = transitions[currentTransition];
                const next = transitions[currentTransition + 1];
                const segmentProgress = (progress - current.time) / (next.time - current.time);

                const startColor = new THREE.Color(current.color);
                const endColor = new THREE.Color(next.color);
                const interpolatedColor = new THREE.Color().lerpColors(startColor, endColor, segmentProgress);

                this.changeLiquidColor(containerId, interpolatedColor.getHex(), 100);
            } else {
                // Reaction complete
                const finalColor = transitions[transitions.length - 1].color;
                this.changeLiquidColor(containerId, finalColor, 100);
                if (callback) callback();
                return;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };

        animate();
    }

    // Remove an object
    removeObject(id) {
        const obj = this.objects[id];
        if (obj) {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
            delete this.objects[id];
        }
    }

    // Clear all objects
    clear() {
        Object.keys(this.objects).forEach(id => this.removeObject(id));
    }

    // Animation loop
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Animate particles
        Object.values(this.objects).forEach(obj => {
            if (obj.userData.type === 'particles') {
                obj.rotation.y += 0.01;
                if (obj.userData.material && obj.userData.material.uniforms) {
                    obj.userData.material.uniforms.time.value += 0.01;
                }
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    // Handle window resize
    onWindowResize() {
        if (!this.container) return;

        this.options.width = this.container.clientWidth || 800;
        this.options.height = this.container.clientHeight || 600;

        this.camera.aspect = this.options.width / this.options.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.options.width, this.options.height);
    }

    // Dispose resources
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.clear();

        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }

        if (this.controls) {
            this.controls.dispose();
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChemistryVisualizer3D;
}

