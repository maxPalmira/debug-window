/*!
 * ConfigConsole - A draggable, resizable configuration panel for web applications
 * Version: 1.0.2
 * Updated: Added text input fields and collapsible window functionality
 * Features: Draggable by icon, resizable, localStorage state persistence, multiple UI elements, collapsible
 * Dependencies: Moveable.js (must be loaded separately)
 * Usage: const configConsole = new ConfigConsole(options).init();
 */

(function(global) {
    'use strict';

    // Inject CSS styles if not already present
    function injectStyles() {
        if (document.getElementById('config-console-styles')) {
            return; // Styles already injected
        }

        const style = document.createElement('style');
        style.id = 'config-console-styles';
        style.textContent = `
/* ConfigConsole Embedded Styles - High Specificity Version */
.config-console {
    position: absolute;
    background: #2d2d2d;
    border: 1px solid #555;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    min-width: 250px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #ffffff;
}

.config-console .config-header {
    background: #404040 !important;
    padding: 6px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #555;
    flex-shrink: 0;
}

.config-console .config-title {
    font-size: 12px !important;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 12px;
}

.config-console .drag-icon {
    cursor: move !important;
    color: #cccccc;
    font-size: 16px;
    font-weight: bold;
    padding: 4px 6px;
    border-radius: 4px;
    transition: all 0.2s;
    line-height: 1;
    letter-spacing: -2px;
}

.config-console .drag-icon:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    color: #ffffff;
    transform: scale(1.1);
}

.config-controls {
    display: flex;
    gap: 4px;
}

.config-btn {
    background: transparent;
    border: none;
    color: #cccccc;
    font-size: 12px;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 3px;
    transition: all 0.2s;
    font-weight: bold;
}

.config-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

.config-btn.pin-btn {
    color: #cccccc;
}

.config-console.pinned .config-btn.pin-btn {
    color: #007acc;
}

.config-console.pinned {
    z-index: 10000;
}

/* Zoom Controls */
.zoom-controls {
    display: flex;
    gap: 2px;
    margin-right: 4px;
}

.zoom-btn {
    min-width: 24px;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #cccccc;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 3px;
    transition: all 0.2s;
    font-weight: bold;
}

.zoom-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transform: translateY(-1px);
}

/* Zoom transform application */
.config-console.zoomed {
    transform-origin: top left;
    transition: transform 0.2s ease-out;
}

.config-content {
    flex: 1;
    padding: 8px;
    overflow-y: auto;
    max-height: calc(100% - 40px);
}

/* Sections */
.config-section {
    margin-bottom: 12px;
}

.config-section:last-child {
    margin-bottom: 0;
}

.section-title {
    font-size: 10px;
    color: #aaaaaa;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #444;
    padding-bottom: 3px;
}

/* Custom Groups */
.config-console .config-group {
    background: #353535;
    border: 1px solid #555;
    border-radius: 6px;
    margin-bottom: 12px;
    overflow: hidden;
}

.config-console .config-group.collapsed .group-content {
    display: none !important;
}

.config-console .group-header {
    background: #404040;
    padding: 8px 12px;
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid #555;
}

.config-console .group-header:hover {
    background: #454545 !important;
}

.config-console .group-title {
    font-size: 11px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.config-console .group-toggle {
    color: #cccccc;
    font-size: 12px;
    transition: transform 0.2s;
}

.config-console .config-group.collapsed .group-toggle {
    transform: rotate(-90deg);
}

.config-console .group-content {
    padding: 10px 12px;
}

.config-console .group-content > * {
    margin-bottom: 8px;
}

.config-console .group-content > *:last-child {
    margin-bottom: 0;
}

.config-console .group-description {
    font-size: 9px !important;
    color: #aaaaaa !important;
    margin-bottom: 10px !important;
    line-height: 1.4;
}

/* Logs */
.log-container {
    max-height: 150px;
    overflow-y: auto;
    background: #1a1a1a;
    border: 1px solid #444;
    border-radius: 4px;
    padding: 8px;
}

.log-item {
    font-size: 9px;
    font-family: 'Courier New', monospace;
    margin-bottom: 4px;
    padding: 2px 4px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.log-item:last-child {
    margin-bottom: 0;
}

.log-timestamp {
    color: #666666;
    flex-shrink: 0;
}

.log-info {
    color: #87ceeb;
    background: rgba(135, 206, 235, 0.1);
}

.log-warning {
    color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
}

.log-error {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

.log-actions {
    margin-top: 8px;
}

.clear-logs-btn {
    background: #ff4444;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 8px;
    cursor: pointer;
    transition: background 0.2s;
}

.clear-logs-btn:hover {
    background: #ff6666;
}

/* Config Buttons */
.config-button {
    background: #404040;
    color: #ffffff;
    border: 1px solid #555;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.2s;
    width: 100%;
    margin-bottom: 4px;
}

.config-button:hover {
    background: #505050;
    border-color: #007acc;
}

.config-button:active {
    background: #353535;
}

.config-button:last-child {
    margin-bottom: 0;
}

/* Checkboxes */
.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    margin-bottom: 3px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.checkbox-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.checkbox-item input[type="checkbox"] {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #1a1a1a;
    border: 1px solid #555;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    margin: 0;
}

.checkbox-item input[type="checkbox"]:checked {
    background: #007acc;
    border-color: #007acc;
}

.checkbox-item input[type="checkbox"]:checked::before {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 10px;
    font-weight: bold;
}

.checkbox-label {
    font-size: 10px;
    color: #cccccc;
    cursor: pointer;
    flex: 1;
}

/* Radio Groups */
.radio-group {
    margin-bottom: 6px;
}

.radio-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    margin-bottom: 3px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.radio-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.radio-item input[type="radio"] {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #1a1a1a;
    border: 1px solid #555;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    margin: 0;
}

.radio-item input[type="radio"]:checked {
    border-color: #007acc;
}

.radio-item input[type="radio"]:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: #007acc;
    border-radius: 50%;
}

.radio-label {
    font-size: 10px;
    color: #cccccc;
    cursor: pointer;
    flex: 1;
}

/* Metrics */
.metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 6px;
    background: #3a3a3a;
    border-radius: 4px;
    margin-bottom: 3px;
    font-size: 10px;
}

.metric-item:last-child {
    margin-bottom: 0;
}

.metric-label {
    color: #cccccc;
    font-weight: 500;
}

.metric-value {
    color: #87ceeb;
    font-family: 'Courier New', monospace;
    font-weight: bold;
}

/* Text Inputs */
.input-item {
    margin-bottom: 6px;
}

.input-label {
    display: block;
    font-size: 10px;
    color: #aaaaaa;
    margin-bottom: 4px;
    font-weight: 500;
}

.text-input {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 10px;
    color: #ffffff;
    font-family: 'Courier New', monospace;
    transition: border-color 0.2s, background-color 0.2s;
    box-sizing: border-box;
}

.text-input:focus {
    outline: none;
    border-color: #007acc;
    background: #2a2a2a;
}

.text-input::placeholder {
    color: #666666;
    font-style: italic;
}

/* Range Sliders */
.range-slider-control {
    margin-bottom: 6px;
}

.control-label {
    display: block;
    font-size: 10px;
    color: #aaaaaa;
    margin-bottom: 4px;
    font-weight: 500;
}

.range-slider-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.range-slider {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    background: #1a1a1a;
    border-radius: 2px;
    outline: none;
    border: 1px solid #555;
    transition: background 0.2s;
}

.range-slider:hover {
    background: #2a2a2a;
}

.range-slider:focus {
    border-color: #007acc;
}

.range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #007acc;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.range-slider::-webkit-slider-thumb:hover {
    background: #0099ff;
    transform: scale(1.1);
}

.range-slider::-webkit-slider-thumb:active {
    background: #005a9e;
    transform: scale(0.95);
}

.range-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #007acc;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.range-slider::-moz-range-thumb:hover {
    background: #0099ff;
    transform: scale(1.1);
}

.range-slider::-moz-range-thumb:active {
    background: #005a9e;
    transform: scale(0.95);
}

.range-slider::-moz-range-track {
    height: 4px;
    background: #1a1a1a;
    border-radius: 2px;
    border: 1px solid #555;
}

.range-value {
    min-width: 40px;
    font-size: 10px;
    color: #87ceeb;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    text-align: right;
    padding: 2px 4px;
    background: #1a1a1a;
    border: 1px solid #555;
    border-radius: 3px;
}

.range-slider:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.range-slider:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
    background: #666666;
}

.range-slider:disabled::-moz-range-thumb {
    cursor: not-allowed;
    background: #666666;
}

/* Moveable.js Styling */
.moveable-control-box .moveable-control {
    background: transparent !important;
    border: none !important;
}

.moveable-control-box .moveable-control.moveable-se {
    width: 12px !important;
    height: 12px !important;
    background: transparent !important;
    border: none !important;
    margin-right: 0px !important;
    margin-bottom: 0px !important;
    opacity: 0 !important;
}

.moveable-control-box .moveable-control.moveable-se:hover {
    opacity: 0 !important;
}

.moveable-line {
    display: none !important;
}

/* Scrollbar Styling */
.config-content::-webkit-scrollbar {
    width: 6px;
}

.config-content::-webkit-scrollbar-track {
    background: #1a1a1a;
}

.config-content::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
}

.config-content::-webkit-scrollbar-thumb:hover {
    background: #666;
}

/* Hidden State */
.config-console.hidden {
    display: none;
}

/* Collapsed State */
.config-console.collapsed {
    min-height: auto !important;
}

.config-console.collapsed .config-content {
    display: none !important;
}
`;

        document.head.appendChild(style);
    }

    class ConfigConsole {
        constructor(options = {}) {
            this.options = {
                title: options.title || 'Config Console',
                position: options.position || { x: 100, y: 100 },
                size: options.size || { width: 300, height: 400 },
                visible: options.visible !== false,
                collapsed: options.collapsed || false,
                pinned: options.pinned || false,
                storageKey: options.storageKey || 'configConsole',
                zoomLevel: options.zoomLevel || 100,
                minZoom: options.minZoom || 50,
                maxZoom: options.maxZoom || 200,
                zoomStep: options.zoomStep || 10
            };
            
            this.defaultOptions = { ...this.options };
            this.window = null;
            this.moveable = null;
            this.isVisible = this.options.visible;
            this.isCollapsed = this.options.collapsed;
            this.isPinned = this.options.pinned;
            this.zoomLevel = this.options.zoomLevel;
            this.minZoom = this.options.minZoom;
            this.maxZoom = this.options.maxZoom;
            this.zoomStep = this.options.zoomStep;
            this.sections = new Map();
            this.groups = new Map();
            this.logCount = 0;
            this.radioGroups = new Map();
            
            // Inject styles when creating instance
            injectStyles();
            
            this.generateHTML();
        }
        
        getPinIcon() {
            // Simple SVG pin icons for pinned and unpinned states
            if (this.isPinned) {
                // Angled/tilted pin (pinned state)
                return `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="m9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-.42.195-.615 0-.195-.195-.195-.42 0-.615L5.322 9.475l-2.829-2.828a.5.5 0 0 1 0-.707c.688-.688 1.673-.766 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133c-.021-.126-.039-.284-.039-.461 0-.431.108-1.023.589-1.503a.5.5 0 0 1 .353-.146"/>
                </svg>`;
            } else {
                // Upright pin (unpinned state)
                return `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z"/>
                </svg>`;
            }
        }
        
        getZoomOutIcon() {
            return `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                <path d="M4 6.5h4a.5.5 0 0 1 0 1H4a.5.5 0 0 1 0-1z"/>
            </svg>`;
        }
        
        getZoomResetIcon() {
            return `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                <path d="M8.146 4.646a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708-.708L8.793 6.5H6a.5.5 0 0 1 0-1h2.793L8.146 4.854a.5.5 0 0 1 0-.708z"/>
            </svg>`;
        }
        
        getZoomInIcon() {
            return `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                <path d="M6.5 6V4.5a.5.5 0 0 1 1 0V6h1.5a.5.5 0 0 1 0 1H7.5v1.5a.5.5 0 0 1-1 0V7H5a.5.5 0 0 1 0-1h1.5z"/>
            </svg>`;
        }
        
        generateHTML() {
            // Create main window element
            this.window = document.createElement('div');
            this.window.className = 'config-console';
            this.window.style.position = this.isPinned ? 'fixed' : 'absolute';
            this.window.style.left = `${this.options.position.x}px`;
            this.window.style.top = `${this.options.position.y}px`;
            this.window.style.width = `${this.options.size.width}px`;
            this.window.style.height = `${this.options.size.height}px`;
            
            if (!this.isVisible) {
                this.window.classList.add('hidden');
            }
            
            if (this.isCollapsed) {
                this.window.classList.add('collapsed');
            }
            
            if (this.isPinned) {
                this.window.classList.add('pinned');
            }
            
            // Apply initial zoom if not default
            if (this.zoomLevel !== 100) {
                this.window.style.transform = `scale(${this.zoomLevel / 100})`;
                this.window.classList.add('zoomed');
            }
            
            // Create header
            const header = document.createElement('div');
            header.className = 'config-header';
            
            const titleContainer = document.createElement('div');
            titleContainer.className = 'config-title';
            
            const dragIcon = document.createElement('span');
            dragIcon.className = 'drag-icon';
            dragIcon.innerHTML = '⋮⋮';
            dragIcon.title = 'Drag to move';
            
            const title = document.createElement('span');
            title.className = 'title-text';
            title.textContent = this.options.title;
            
            titleContainer.appendChild(dragIcon);
            titleContainer.appendChild(title);
            
            const controls = document.createElement('div');
            controls.className = 'config-controls';
            
            // Pin button
            const pinBtn = document.createElement('button');
            pinBtn.className = 'config-btn pin-btn';
            pinBtn.innerHTML = this.getPinIcon();
            pinBtn.title = 'Pin/Unpin window';
            
            // Zoom controls group
            const zoomControls = document.createElement('div');
            zoomControls.className = 'zoom-controls';
            
            // Zoom out button
            const zoomOutBtn = document.createElement('button');
            zoomOutBtn.className = 'config-btn zoom-btn zoom-out';
            zoomOutBtn.innerHTML = this.getZoomOutIcon();
            zoomOutBtn.title = 'Zoom Out';
            
            // Zoom reset button
            const zoomResetBtn = document.createElement('button');
            zoomResetBtn.className = 'config-btn zoom-btn zoom-reset';
            zoomResetBtn.innerHTML = this.getZoomResetIcon();
            zoomResetBtn.title = 'Reset Zoom';
            
            // Zoom in button
            const zoomInBtn = document.createElement('button');
            zoomInBtn.className = 'config-btn zoom-btn zoom-in';
            zoomInBtn.innerHTML = this.getZoomInIcon();
            zoomInBtn.title = 'Zoom In';
            
            zoomControls.appendChild(zoomOutBtn);
            zoomControls.appendChild(zoomResetBtn);
            zoomControls.appendChild(zoomInBtn);
            
            // Minimize/collapse button
            const minimizeBtn = document.createElement('button');
            minimizeBtn.className = 'config-btn minimize-btn';
            minimizeBtn.innerHTML = '−';
            minimizeBtn.title = 'Minimize';
            
            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'config-btn close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.title = 'Close';
            
            controls.appendChild(pinBtn);
            controls.appendChild(zoomControls);
            controls.appendChild(minimizeBtn);
            controls.appendChild(closeBtn);
            
            header.appendChild(titleContainer);
            header.appendChild(controls);
            
            // Create content area
            const content = document.createElement('div');
            content.className = 'config-content';
            
            this.window.appendChild(header);
            this.window.appendChild(content);
            
            // Store references
            this.header = header;
            this.content = content;
            this.dragIcon = dragIcon;
            this.pinBtn = pinBtn;
            this.minimizeBtn = minimizeBtn;
        }
        
        init() {
            // Check for Moveable dependency
            if (typeof Moveable === 'undefined') {
                console.error('ConfigConsole requires Moveable.js library. Please include it before initializing ConfigConsole.');
                console.error('Add this to your HTML: <script src="https://daybrush.com/moveable/release/latest/dist/moveable.min.js"></script>');
                return this;
            }
            
            // Load saved state before adding to DOM
            this.loadState();
            
            // Add to DOM
            document.body.appendChild(this.window);
            
            // Setup event delegation for header controls
            this.setupEventDelegation();
            
            // Setup Moveable
            this.setupMoveable();
            
            // Auto-save state on position/size changes
            this.setupAutoSave();
            
            return this;
        }
        
        refreshMoveable() {
            // Refresh Moveable instance to fix any sync issues
            if (this.moveable && this.window) {
                this.setupMoveable();
                this.setupAutoSave();
            }
            return this;
        }
        
        setupEventDelegation() {
            // Use event delegation for header controls to ensure they always work
            this.window.addEventListener('click', (e) => {
                // Handle pin button
                if (e.target.classList.contains('pin-btn') || e.target.closest('.pin-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.togglePin();
                }
                
                // Handle minimize button
                if (e.target.classList.contains('minimize-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleCollapse();
                }
                
                // Handle close button  
                if (e.target.classList.contains('close-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.hide();
                }
                
                // Handle zoom buttons
                if (e.target.classList.contains('zoom-out') || e.target.closest('.zoom-out')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.zoomOut();
                }
                
                if (e.target.classList.contains('zoom-reset') || e.target.closest('.zoom-reset')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.resetZoom();
                }
                
                if (e.target.classList.contains('zoom-in') || e.target.closest('.zoom-in')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.zoomIn();
                }
                
                // Handle group header clicks
                if (e.target.classList.contains('group-header') || e.target.parentElement?.classList.contains('group-header')) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Find the group container
                    let groupContainer = e.target.closest('.config-group');
                    if (groupContainer) {
                        groupContainer.classList.toggle('collapsed');
                    }
                }
            });
        }
        
        setupMoveable() {
            // Destroy existing moveable if it exists
            if (this.moveable) {
                this.moveable.destroy();
            }
            
            this.moveable = new Moveable(document.body, {
                target: this.window,
                draggable: true,
                resizable: true,
                keepRatio: false,
                throttleDrag: 0,
                throttleResize: 0,
                dragArea: false,
                origin: false,
                zoom: 1,
                edge: false,
                
                // Only show bottom-right resize handle
                renderDirections: ["se"],
                
                // Drag only from drag icon
                dragTarget: this.dragIcon
            });
            
            // Handle drag events
            this.moveable.on("drag", ({ target, left, top }) => {
                target.style.left = `${left}px`;
                target.style.top = `${top}px`;
                this.options.position = { x: left, y: top };
            });
            
            // Handle resize events
            this.moveable.on("resize", ({ target, width, height }) => {
                const minWidth = 250;
                const minHeight = 200;
                
                const newWidth = Math.max(width, minWidth);
                const newHeight = Math.max(height, minHeight);
                
                target.style.width = `${newWidth}px`;
                target.style.height = `${newHeight}px`;
                this.options.size = { width: newWidth, height: newHeight };
            });
        }
        
        setupAutoSave() {
            // Auto-save on drag end
            this.moveable.on("dragEnd", () => {
                this.saveState();
            });
            
            // Auto-save on resize end
            this.moveable.on("resizeEnd", () => {
                this.saveState();
            });
        }
        
        // State Management Methods
        saveState() {
            const state = {
                title: this.options.title,
                position: {
                    x: parseInt(this.window.style.left),
                    y: parseInt(this.window.style.top)
                },
                size: {
                    width: parseInt(this.window.style.width),
                    height: parseInt(this.window.style.height)
                },
                visible: this.isVisible,
                collapsed: this.isCollapsed,
                pinned: this.isPinned,
                zoomLevel: this.zoomLevel,
                timestamp: Date.now()
            };
            
            try {
                localStorage.setItem(this.options.storageKey, JSON.stringify(state));
            } catch (error) {
                console.warn('Failed to save debug window state:', error);
            }
            
            return this;
        }
        
        loadState() {
            try {
                const savedState = localStorage.getItem(this.options.storageKey);
                if (!savedState) return this;
                
                const state = JSON.parse(savedState);
                
                // Apply saved state
                if (state.position) {
                    this.setPosition(state.position.x, state.position.y);
                }
                
                if (state.size) {
                    this.setSize(state.size.width, state.size.height);
                }
                
                if (state.title) {
                    this.setTitle(state.title);
                }
                
                if (typeof state.visible === 'boolean') {
                    this.isVisible = state.visible;
                    if (this.isVisible) {
                        this.window.classList.remove('hidden');
                    } else {
                        this.window.classList.add('hidden');
                    }
                }
                
                if (typeof state.collapsed === 'boolean') {
                    this.isCollapsed = state.collapsed;
                    if (this.isCollapsed) {
                        this.window.classList.add('collapsed');
                    } else {
                        this.window.classList.remove('collapsed');
                    }
                }
                
                if (typeof state.pinned === 'boolean') {
                    this.isPinned = state.pinned;
                    if (this.isPinned) {
                        this.window.style.position = 'fixed';
                        this.window.classList.add('pinned');
                    } else {
                        this.window.style.position = 'absolute';
                        this.window.classList.remove('pinned');
                    }
                    // Update pin button icon if it exists
                    if (this.pinBtn) {
                        this.pinBtn.innerHTML = this.getPinIcon();
                    }
                }
                
                if (typeof state.zoomLevel === 'number') {
                    this.setZoom(state.zoomLevel);
                }
            } catch (error) {
                console.warn('Failed to load debug window state:', error);
            }
            
            return this;
        }
        
        clearState() {
            try {
                localStorage.removeItem(this.options.storageKey);
            } catch (error) {
                console.warn('Failed to clear debug window state:', error);
            }
            
            return this;
        }
        
        resetToDefaults() {
            this.options = { ...this.defaultOptions };
            this.setTitle(this.options.title);
            this.setPosition(this.options.position.x, this.options.position.y);
            this.setSize(this.options.size.width, this.options.size.height);
            
            if (this.options.visible) {
                this.show();
            } else {
                this.hide();
            }
            
            // Reset pin state
            this.isPinned = this.options.pinned;
            if (this.isPinned) {
                this.window.style.position = 'fixed';
                this.window.classList.add('pinned');
            } else {
                this.window.style.position = 'absolute';
                this.window.classList.remove('pinned');
            }
            if (this.pinBtn) {
                this.pinBtn.innerHTML = this.getPinIcon();
            }
            
            // Reset zoom level
            this.zoomLevel = this.defaultOptions.zoomLevel;
            this.setZoom(this.zoomLevel);
            
            this.clearState();
            
            return this;
        }
        
        getState() {
            return {
                title: this.options.title,
                position: {
                    x: parseInt(this.window.style.left),
                    y: parseInt(this.window.style.top)
                },
                size: {
                    width: parseInt(this.window.style.width),
                    height: parseInt(this.window.style.height)
                },
                visible: this.isVisible,
                collapsed: this.isCollapsed,
                pinned: this.isPinned,
                zoomLevel: this.zoomLevel,
                sections: Array.from(this.sections.keys()),
                logCount: this.logCount
            };
        }
        
        show() {
            this.isVisible = true;
            this.window.classList.remove('hidden');
            
            // Update moveable target visibility with small delay to ensure DOM is ready
            if (this.moveable) {
                setTimeout(() => {
                    this.moveable.updateTarget();
                }, 10);
            }
            
            // Auto-save visibility state
            this.saveState();
            
            return this;
        }
        
        hide() {
            this.isVisible = false;
            this.window.classList.add('hidden');
            
            // Update moveable target visibility
            if (this.moveable) {
                this.moveable.updateTarget();
            }
            
            // Auto-save visibility state
            this.saveState();
            
            return this;
        }
        
        toggle() {
            return this.isVisible ? this.hide() : this.show();
        }
        
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            
            if (this.isCollapsed) {
                // Store current height before collapsing (use options.size.height, not style)
                this._originalHeight = this.options.size.height;
                
                // Get header height before adding collapsed class
                const headerHeight = this.header.offsetHeight || 40; // fallback to 40px
                
                this.window.classList.add('collapsed');
                this.window.style.height = `${headerHeight}px`;
                this.window.style.minHeight = `${headerHeight}px`;
                
                // Force layout recalculation
                this.window.offsetHeight;
                // Don't update options.size.height when collapsed - keep the intended size
            } else {
                this.window.classList.remove('collapsed');
                
                // Restore to the stored height (which may have been updated by setSize while collapsed)
                const restoreHeight = this._originalHeight || this.defaultOptions.size.height;
                this.window.style.height = `${restoreHeight}px`;
                this.window.style.minHeight = '200px'; // restore default min-height
                this.options.size.height = restoreHeight;
            }
            
            // Update moveable to recognize the size change
            if (this.moveable) {
                this.moveable.updateTarget();
            }
            
            // Auto-save collapsed state
            this.saveState();
            
            return this;
        }
        
        togglePin() {
            this.isPinned = !this.isPinned;
            
            if (this.isPinned) {
                this.window.style.position = 'fixed';
                this.window.classList.add('pinned');
            } else {
                this.window.style.position = 'absolute';
                this.window.classList.remove('pinned');
            }
            
            // Update pin button icon
            if (this.pinBtn) {
                this.pinBtn.innerHTML = this.getPinIcon();
            }
            
            // Auto-save pin state
            this.saveState();
            
            return this;
        }
        
        // Zoom control methods
        zoomIn() {
            if (this.zoomLevel < this.maxZoom) {
                this.setZoom(this.zoomLevel + this.zoomStep);
            }
            return this;
        }
        
        zoomOut() {
            if (this.zoomLevel > this.minZoom) {
                this.setZoom(this.zoomLevel - this.zoomStep);
            }
            return this;
        }
        
        resetZoom() {
            this.setZoom(100);
            return this;
        }
        
        setZoom(level) {
            // Validate input
            if (typeof level !== 'number' || isNaN(level) || level <= 0) {
                return this;
            }
            
            // Clamp to min/max bounds
            this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, level));
            
            // Apply CSS transform
            this.window.style.transform = `scale(${this.zoomLevel / 100})`;
            this.window.classList.add('zoomed');
            
            // Log zoom change
            this.addLog(`Zoom level: ${this.zoomLevel}%`, 'info');
            
            // Save state
            this.saveState();
            
            return this;
        }
        
        destroy() {
            if (this.moveable) {
                this.moveable.destroy();
                this.moveable = null;
            }
            
            if (this.window && this.window.parentNode) {
                this.window.parentNode.removeChild(this.window);
            }
            
            this.sections.clear();
            this.radioGroups.clear();
            
            return this;
        }
        
        getOrCreateSection(name) {
            if (this.sections.has(name)) {
                return this.sections.get(name);
            }
            
            const section = document.createElement('div');
            section.className = 'config-section';
            
            const title = document.createElement('div');
            title.className = 'section-title';
            title.textContent = name;
            
            const container = document.createElement('div');
            
            section.appendChild(title);
            section.appendChild(container);
            
            this.content.appendChild(section);
            this.sections.set(name, container);
            
            return container;
        }
        
        addLog(message, type = 'info') {
            const section = this.getOrCreateSection('Logs');
            
            // Create log container if it doesn't exist
            let logContainer = section.querySelector('.log-container');
            if (!logContainer) {
                logContainer = document.createElement('div');
                logContainer.className = 'log-container';
                
                const actions = document.createElement('div');
                actions.className = 'log-actions';
                
                const clearBtn = document.createElement('button');
                clearBtn.className = 'clear-logs-btn';
                clearBtn.textContent = 'Clear Logs';
                clearBtn.addEventListener('click', () => this.clearLogs());
                
                actions.appendChild(clearBtn);
                
                section.appendChild(logContainer);
                section.appendChild(actions);
            }
            
            const logItem = document.createElement('div');
            logItem.className = `log-item log-${type}`;
            
            const timestamp = document.createElement('span');
            timestamp.className = 'log-timestamp';
            timestamp.textContent = new Date().toLocaleTimeString();
            
            const content = document.createElement('span');
            content.textContent = message;
            
            logItem.appendChild(timestamp);
            logItem.appendChild(content);
            
            logContainer.appendChild(logItem);
            logContainer.scrollTop = logContainer.scrollHeight;
            
            this.logCount++;
            
            return this;
        }
        
        clearLogs() {
            const section = this.sections.get('Logs');
            if (section) {
                const logContainer = section.querySelector('.log-container');
                if (logContainer) {
                    logContainer.innerHTML = '';
                    this.logCount = 0;
                }
            }
            
                    return this;
    }

    // Custom Group Methods
    addGroup(groupName, options = {}) {
        const {
            description = '',
            collapsed = false,
            section = 'Groups'
        } = options;

        const sectionContainer = this.getOrCreateSection(section);
        
        // Create group container
        const groupContainer = document.createElement('div');
        groupContainer.className = 'config-group';
        if (collapsed) {
            groupContainer.classList.add('collapsed');
        }
        
        // Create group header
        const header = document.createElement('div');
        header.className = 'group-header';
        
        const title = document.createElement('div');
        title.className = 'group-title';
        title.textContent = groupName;
        
        const toggle = document.createElement('div');
        toggle.className = 'group-toggle';
        toggle.innerHTML = '▼';
        
        header.appendChild(title);
        header.appendChild(toggle);
        
        // Create group content
        const content = document.createElement('div');
        content.className = 'group-content';
        
        // Add description if provided
        if (description) {
            const desc = document.createElement('div');
            desc.className = 'group-description';
            desc.textContent = description;
            content.appendChild(desc);
        }
        
        // Collapse/expand functionality is handled by event delegation in setupEventDelegation()
        
        groupContainer.appendChild(header);
        groupContainer.appendChild(content);
        sectionContainer.appendChild(groupContainer);
        
        // Store group reference
        this.groups.set(groupName, {
            container: groupContainer,
            content: content,
            collapsed: collapsed
        });
        
        return this;
    }

    getGroup(groupName) {
        return this.groups.get(groupName);
    }

    addToGroup(groupName, element) {
        const group = this.getGroup(groupName);
        if (group) {
            group.content.appendChild(element);
        } else {
            console.warn(`Group "${groupName}" not found. Creating default group.`);
            this.addGroup(groupName);
            this.addToGroup(groupName, element);
        }
        return this;
    }

    addConfigButton(text, onClick, options = {}) {
            const button = document.createElement('button');
            button.className = 'config-button';
            button.textContent = text;
            button.addEventListener('click', onClick);
            
            if (options.group) {
                this.addToGroup(options.group, button);
            } else {
                const sectionName = options.section || 'Controls';
                const section = this.getOrCreateSection(sectionName);
                section.appendChild(button);
            }
            
            return this;
        }
        
        addCheckbox(label, checked = false, onChange, options = {}) {
            const container = document.createElement('div');
            container.className = 'checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checked;
            checkbox.addEventListener('change', (e) => {
                if (onChange) {
                    onChange(e.target.checked, e);
                }
            });
            
            const labelElement = document.createElement('label');
            labelElement.className = 'checkbox-label';
            labelElement.textContent = label;
            labelElement.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            });
            
            container.appendChild(checkbox);
            container.appendChild(labelElement);
            
            if (options.group) {
                this.addToGroup(options.group, container);
            } else {
                const sectionName = options.section || 'Settings';
                const section = this.getOrCreateSection(sectionName);
                section.appendChild(container);
            }
            
            return this;
        }
        
        addRadioGroup(groupName, options, onChange, groupOptions = {}) {
            const groupContainer = document.createElement('div');
            groupContainer.className = 'radio-group';
            
            const groupTitle = document.createElement('div');
            groupTitle.className = 'section-title';
            groupTitle.textContent = groupName;
            groupContainer.appendChild(groupTitle);
            
            options.forEach((option, index) => {
                const container = document.createElement('div');
                container.className = 'radio-item';
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = groupName;
                radio.value = option.value;
                radio.checked = option.checked || false;
                radio.addEventListener('change', (e) => {
                    if (e.target.checked && onChange) {
                        onChange(option.value, e);
                    }
                });
                
                const labelElement = document.createElement('label');
                labelElement.className = 'radio-label';
                labelElement.textContent = option.label;
                labelElement.addEventListener('click', () => {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                });
                
                container.appendChild(radio);
                container.appendChild(labelElement);
                groupContainer.appendChild(container);
            });
            
            if (groupOptions.group) {
                this.addToGroup(groupOptions.group, groupContainer);
            } else {
                const section = this.getOrCreateSection('Settings');
                section.appendChild(groupContainer);
            }
            
            this.radioGroups.set(groupName, groupContainer);
            
            return this;
        }
        
        addMetric(label, value, options = {}) {
            const metric = document.createElement('div');
            metric.className = 'metric-item';
            metric.dataset.label = label;
            
            const labelElement = document.createElement('span');
            labelElement.className = 'metric-label';
            labelElement.textContent = label;
            
            const valueElement = document.createElement('span');
            valueElement.className = 'metric-value';
            valueElement.textContent = value;
            
            metric.appendChild(labelElement);
            metric.appendChild(valueElement);
            
            if (options.group) {
                this.addToGroup(options.group, metric);
            } else {
                const sectionName = options.section || 'Metrics';
                const section = this.getOrCreateSection(sectionName);
                section.appendChild(metric);
            }
            
            return this;
        }
        
        addTextInput(label, value = '', onChange, options = {}) {
            const container = document.createElement('div');
            container.className = 'input-item';
            
            const labelElement = document.createElement('label');
            labelElement.className = 'input-label';
            labelElement.textContent = label;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'text-input';
            input.value = value;
            input.placeholder = options.placeholder || '';
            
            if (onChange) {
                input.addEventListener('input', (e) => {
                    onChange(e.target.value, e);
                });
                
                input.addEventListener('change', (e) => {
                    onChange(e.target.value, e);
                });
            }
            
            container.appendChild(labelElement);
            container.appendChild(input);
            
            if (options.group) {
                this.addToGroup(options.group, container);
            } else {
                const sectionName = options.section || 'Inputs';
                const section = this.getOrCreateSection(sectionName);
                section.appendChild(container);
            }
            
            return this;
        }

        addRangeSlider(label, options = {}, onChange = null) {
            // Set default options
            const sliderOptions = {
                min: 0,
                max: 100,
                step: 1,
                value: 50,
                formatter: null,
                showValue: true,
                group: null,
                suffix: '',
                disabled: false,
                ...options
            };
            
            // Ensure value is within bounds
            sliderOptions.value = Math.max(sliderOptions.min, Math.min(sliderOptions.max, sliderOptions.value));
            
            // Create container
            const container = document.createElement('div');
            container.className = 'range-slider-control';
            
            // Create label
            const labelElement = document.createElement('label');
            labelElement.className = 'control-label';
            labelElement.textContent = label;
            
            // Create slider wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'range-slider-wrapper';
            
            // Create range input
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'range-slider';
            slider.min = sliderOptions.min;
            slider.max = sliderOptions.max;
            slider.step = sliderOptions.step;
            slider.value = sliderOptions.value;
            slider.disabled = sliderOptions.disabled;
            
            // Create value display
            const valueDisplay = document.createElement('div');
            valueDisplay.className = 'range-value';
            
            // Function to format and update value display
            const updateValueDisplay = (value) => {
                let displayValue = value;
                if (sliderOptions.formatter && typeof sliderOptions.formatter === 'function') {
                    displayValue = sliderOptions.formatter(parseFloat(value));
                } else {
                    displayValue = value + sliderOptions.suffix;
                }
                valueDisplay.textContent = displayValue;
            };
            
            // Initialize value display
            updateValueDisplay(sliderOptions.value);
            
            // Add event listeners
            const handleInput = (e) => {
                const value = parseFloat(e.target.value);
                updateValueDisplay(value);
                if (onChange) {
                    onChange(value, e);
                }
            };
            
            const handleChange = (e) => {
                const value = parseFloat(e.target.value);
                if (onChange) {
                    onChange(value, e);
                }
            };
            
            slider.addEventListener('input', handleInput);
            slider.addEventListener('change', handleChange);
            
            // Add keyboard support
            slider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const newValue = Math.max(sliderOptions.min, parseFloat(slider.value) - parseFloat(sliderOptions.step));
                    slider.value = newValue;
                    handleInput({ target: slider });
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const newValue = Math.min(sliderOptions.max, parseFloat(slider.value) + parseFloat(sliderOptions.step));
                    slider.value = newValue;
                    handleInput({ target: slider });
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    slider.value = sliderOptions.min;
                    handleInput({ target: slider });
                } else if (e.key === 'End') {
                    e.preventDefault();
                    slider.value = sliderOptions.max;
                    handleInput({ target: slider });
                }
            });
            
            // Assemble the component
            wrapper.appendChild(slider);
            if (sliderOptions.showValue) {
                wrapper.appendChild(valueDisplay);
            }
            
            container.appendChild(labelElement);
            container.appendChild(wrapper);
            
            // Add to group or section
            if (sliderOptions.group) {
                this.addToGroup(sliderOptions.group, container);
            } else {
                const sectionName = sliderOptions.section || 'Controls';
                const section = this.getOrCreateSection(sectionName);
                section.appendChild(container);
            }
            
            return this;
        }
        
        updateMetric(label, newValue) {
            const metrics = this.window.querySelectorAll('.metric-item');
            for (const metric of metrics) {
                if (metric.dataset.label === label) {
                    const valueElement = metric.querySelector('.metric-value');
                    if (valueElement) {
                        valueElement.textContent = newValue;
                        break;
                    }
                }
            }
            
            return this;
        }
        
        setTitle(title) {
            this.options.title = title;
            const titleElement = this.header.querySelector('.title-text');
            if (titleElement) {
                titleElement.textContent = title;
            }
            
            return this;
        }
        
        setPosition(x, y) {
            this.window.style.left = `${x}px`;
            this.window.style.top = `${y}px`;
            this.options.position = { x, y };
            
            // Update Moveable if it exists
            if (this.moveable) {
                this.moveable.updateTarget();
            }
            
            return this;
        }
        
        setSize(width, height) {
            this.options.size = { width, height };
            
            // Always update width
            this.window.style.width = `${width}px`;
            
            if (this.isCollapsed) {
                // If collapsed, update the stored height but don't change visual height
                this._originalHeight = height;
            } else {
                // If not collapsed, update visual height immediately
                this.window.style.height = `${height}px`;
            }
            
            // Update Moveable if it exists
            if (this.moveable) {
                this.moveable.updateTarget();
            }
            
            return this;
        }
        
        clear() {
            this.content.innerHTML = '';
            this.sections.clear();
            this.groups.clear();
            this.radioGroups.clear();
            this.logCount = 0;
            
            return this;
        }
        
        addDemoContent() {
            this.clear();
            
            // Add sample logs
            this.addLog('Application started successfully', 'info');
            this.addLog('Loading configuration...', 'info');
            this.addLog('Warning: High memory usage detected', 'warning');
            this.addLog('Failed to connect to server', 'error');
            this.addLog('Retrying connection...', 'info');
            
            // Add config buttons
            this.addConfigButton('Save Settings', () => {
                this.addLog('Settings saved', 'info');
            });
            
            this.addConfigButton('Reset to Defaults', () => {
                this.addLog('Settings reset to defaults', 'warning');
            });
            
            this.addConfigButton('Export Data', () => {
                this.addLog('Data exported successfully', 'info');
            });
            
            // Add checkboxes
            this.addCheckbox('Enable Debug Mode', false, (checked) => {
                this.addLog(`Debug mode ${checked ? 'enabled' : 'disabled'}`, 'info');
            });
            
            this.addCheckbox('Auto-save', true, (checked) => {
                this.addLog(`Auto-save ${checked ? 'enabled' : 'disabled'}`, 'info');
            });
            
            this.addCheckbox('Show Tooltips', true, (checked) => {
                this.addLog(`Tooltips ${checked ? 'enabled' : 'disabled'}`, 'info');
            });
            
            // Add radio groups
            this.addRadioGroup('Theme', [
                { label: 'Dark', value: 'dark', checked: true },
                { label: 'Light', value: 'light' },
                { label: 'Auto', value: 'auto' }
            ], (value) => {
                this.addLog(`Theme changed to ${value}`, 'info');
            });
            
            this.addRadioGroup('Language', [
                { label: 'English', value: 'en', checked: true },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' }
            ], (value) => {
                this.addLog(`Language changed to ${value}`, 'info');
            });
            
            // Add metrics
            this.addMetric('CPU Usage', '45%');
            this.addMetric('Memory', '2.1 GB');
            this.addMetric('Uptime', '2h 34m');
            this.addMetric('Active Users', '127');
            this.addMetric('Network I/O', '1.2 MB/s');
            
            // Add text inputs
            this.addTextInput('Server URL', 'https://api.example.com', (value) => {
                this.addLog(`Server URL updated to: ${value}`, 'info');
            }, { placeholder: 'Enter server URL...' });
            
            this.addTextInput('API Key', '', (value) => {
                this.addLog(`API Key ${value ? 'updated' : 'cleared'}`, 'info');
            }, { placeholder: 'Enter your API key...' });
            
            this.addTextInput('Username', 'admin', (value) => {
                this.addLog(`Username changed to: ${value}`, 'info');
            });
            
            this.addTextInput('Timeout (ms)', '5000', (value) => {
                if (!isNaN(value) && value > 0) {
                    this.addLog(`Timeout set to ${value}ms`, 'info');
                } else if (value) {
                    this.addLog('Invalid timeout value', 'warning');
                }
            }, { placeholder: 'Enter timeout in milliseconds...' });
            
            // Add range sliders
            this.addRangeSlider('Volume', {
                min: 0,
                max: 100,
                value: 75,
                step: 5,
                suffix: '%'
            }, (value) => {
                this.addLog(`Volume set to ${value}%`, 'info');
            });
            
            this.addRangeSlider('Opacity', {
                min: 0,
                max: 1,
                value: 0.8,
                step: 0.1,
                formatter: (val) => `${Math.round(val * 100)}%`
            }, (value) => {
                this.addLog(`Opacity set to ${Math.round(value * 100)}%`, 'info');
            });
            
            this.addRangeSlider('Quality', {
                min: 1,
                max: 10,
                value: 7,
                step: 1
            }, (value) => {
                this.addLog(`Quality set to ${value}`, 'info');
            });
            
            this.addRangeSlider('Temperature', {
                min: -20,
                max: 50,
                value: 22,
                step: 1,
                suffix: '°C'
            }, (value) => {
                this.addLog(`Temperature set to ${value}°C`, 'info');
            });
            
            // Simulate real-time metric updates
            let cpuUsage = 45;
            let memoryUsage = 2.1;
            let uptime = 154; // minutes
            
            setInterval(() => {
                cpuUsage = Math.max(5, Math.min(95, cpuUsage + (Math.random() - 0.5) * 10));
                memoryUsage = Math.max(0.5, Math.min(8.0, memoryUsage + (Math.random() - 0.5) * 0.2));
                uptime++;
                
                this.updateMetric('CPU Usage', `${Math.round(cpuUsage)}%`);
                this.updateMetric('Memory', `${memoryUsage.toFixed(1)} GB`);
                this.updateMetric('Uptime', `${Math.floor(uptime / 60)}h ${uptime % 60}m`);
            }, 2000);
            
            return this;
        }
        
        getElement() {
            return this.window;
        }
        
        isHidden() {
            return !this.isVisible;
        }
        
        // Test/Debug method to verify functionality
        testControls() {
            console.log('Testing Config Console controls...');
            console.log('Minimize button:', this.window.querySelector('.minimize-btn'));
            console.log('Close button:', this.window.querySelector('.close-btn'));
            console.log('Moveable instance:', this.moveable);
            console.log('Current position:', this.options.position);
            console.log('Current size:', this.options.size);
            return this;
        }
    }

    // Export to global scope
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ConfigConsole;
    } else {
        global.ConfigConsole = ConfigConsole;
    }

})(typeof window !== 'undefined' ? window : global); 