/*!
 * DebugWindow - A draggable, resizable debug panel for web applications
 * Version: 1.0.2
 * Updated: Added text input fields and collapsible window functionality
 * Features: Draggable by icon, resizable, localStorage state persistence, multiple UI elements, collapsible
 * Dependencies: Moveable.js (must be loaded separately)
 * Usage: const debugWindow = new DebugWindow(options).init();
 */

(function(global) {
    'use strict';

    // Inject CSS styles if not already present
    function injectStyles() {
        if (document.getElementById('debug-window-styles')) {
            return; // Styles already injected
        }

        const style = document.createElement('style');
        style.id = 'debug-window-styles';
        style.textContent = `
/* DebugWindow Embedded Styles - Compact Version */
.debug-window {
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

.debug-header {
    background: #404040;
    padding: 6px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #555;
    flex-shrink: 0;
}

.debug-title {
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 12px;
}

.drag-icon {
    cursor: move;
    color: #cccccc;
    font-size: 16px;
    font-weight: bold;
    padding: 4px 6px;
    border-radius: 4px;
    transition: all 0.2s;
    line-height: 1;
    letter-spacing: -2px;
}

.drag-icon:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: scale(1.1);
}

.debug-controls {
    display: flex;
    gap: 4px;
}

.debug-btn {
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

.debug-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

.debug-content {
    flex: 1;
    padding: 8px;
    overflow-y: auto;
    max-height: calc(100% - 40px);
}

/* Sections */
.debug-section {
    margin-bottom: 12px;
}

.debug-section:last-child {
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

/* Collapsed State */
.debug-window.collapsed .debug-content {
    display: none;
}

.debug-window.collapsed {
    height: auto !important;
    min-height: auto !important;
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
.debug-content::-webkit-scrollbar {
    width: 6px;
}

.debug-content::-webkit-scrollbar-track {
    background: #1a1a1a;
}

.debug-content::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
}

.debug-content::-webkit-scrollbar-thumb:hover {
    background: #666;
}

/* Hidden State */
.debug-window.hidden {
    display: none;
}
`;

        document.head.appendChild(style);
    }

    class DebugWindow {
        constructor(options = {}) {
            this.options = {
                title: options.title || 'Debug Info',
                position: options.position || { x: 100, y: 100 },
                size: options.size || { width: 300, height: 400 },
                visible: options.visible !== false,
                collapsed: options.collapsed || false,
                storageKey: options.storageKey || 'debugWindow'
            };
            
            this.defaultOptions = { ...this.options };
            this.window = null;
            this.moveable = null;
            this.isVisible = this.options.visible;
            this.isCollapsed = this.options.collapsed;
            this.sections = new Map();
            this.logCount = 0;
            this.radioGroups = new Map();
            
            // Inject styles when creating instance
            injectStyles();
            
            this.generateHTML();
        }
        
        generateHTML() {
            // Create main window element
            this.window = document.createElement('div');
            this.window.className = 'debug-window';
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
            
            // Create header
            const header = document.createElement('div');
            header.className = 'debug-header';
            
            const titleContainer = document.createElement('div');
            titleContainer.className = 'debug-title';
            
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
            controls.className = 'debug-controls';
            
            // Minimize/collapse button
            const minimizeBtn = document.createElement('button');
            minimizeBtn.className = 'debug-btn';
            minimizeBtn.innerHTML = '−';
            minimizeBtn.title = 'Minimize';
            minimizeBtn.addEventListener('click', () => this.toggleCollapse());
            
            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'debug-btn';
            closeBtn.innerHTML = '×';
            closeBtn.title = 'Close';
            closeBtn.addEventListener('click', () => this.hide());
            
            controls.appendChild(minimizeBtn);
            controls.appendChild(closeBtn);
            
            header.appendChild(titleContainer);
            header.appendChild(controls);
            
            // Create content area
            const content = document.createElement('div');
            content.className = 'debug-content';
            
            this.window.appendChild(header);
            this.window.appendChild(content);
            
            // Store references
            this.header = header;
            this.content = content;
            this.dragIcon = dragIcon;
            this.minimizeBtn = minimizeBtn;
        }
        
        init() {
            // Check for Moveable dependency
            if (typeof Moveable === 'undefined') {
                console.error('DebugWindow requires Moveable.js library. Please include it before initializing DebugWindow.');
                console.error('Add this to your HTML: <script src="https://daybrush.com/moveable/release/latest/dist/moveable.min.js"></script>');
                return this;
            }
            
            // Load saved state before adding to DOM
            this.loadState();
            
            // Add to DOM
            document.body.appendChild(this.window);
            
            // Setup Moveable
            this.setupMoveable();
            
            // Auto-save state on position/size changes
            this.setupAutoSave();
            
            return this;
        }
        
        setupMoveable() {
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
            });
            
            // Handle resize events
            this.moveable.on("resize", ({ target, width, height }) => {
                const minWidth = 250;
                const minHeight = 200;
                
                const newWidth = Math.max(width, minWidth);
                const newHeight = Math.max(height, minHeight);
                
                target.style.width = `${newWidth}px`;
                target.style.height = `${newHeight}px`;
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
                sections: Array.from(this.sections.keys()),
                logCount: this.logCount
            };
        }
        
        show() {
            this.isVisible = true;
            this.window.classList.remove('hidden');
            
            // Update moveable target visibility
            if (this.moveable) {
                this.moveable.updateTarget();
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
                this.window.classList.add('collapsed');
            } else {
                this.window.classList.remove('collapsed');
            }
            
            // Auto-save collapsed state
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
            section.className = 'debug-section';
            
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
        
        addConfigButton(text, onClick, options = {}) {
            const sectionName = options.section || 'Controls';
            const section = this.getOrCreateSection(sectionName);
            
            const button = document.createElement('button');
            button.className = 'config-button';
            button.textContent = text;
            button.addEventListener('click', onClick);
            
            section.appendChild(button);
            
            return this;
        }
        
        addCheckbox(label, checked = false, onChange, options = {}) {
            const sectionName = options.section || 'Settings';
            const section = this.getOrCreateSection(sectionName);
            
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
            
            section.appendChild(container);
            
            return this;
        }
        
        addRadioGroup(groupName, options, onChange) {
            const section = this.getOrCreateSection('Settings');
            
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
            
            section.appendChild(groupContainer);
            this.radioGroups.set(groupName, groupContainer);
            
            return this;
        }
        
        addMetric(label, value, options = {}) {
            const sectionName = options.section || 'Metrics';
            const section = this.getOrCreateSection(sectionName);
            
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
            
            section.appendChild(metric);
            
            return this;
        }
        
        addTextInput(label, value = '', onChange, options = {}) {
            const sectionName = options.section || 'Inputs';
            const section = this.getOrCreateSection(sectionName);
            
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
            
            section.appendChild(container);
            
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
            
            return this;
        }
        
        setSize(width, height) {
            this.window.style.width = `${width}px`;
            this.window.style.height = `${height}px`;
            this.options.size = { width, height };
            
            return this;
        }
        
        clear() {
            this.content.innerHTML = '';
            this.sections.clear();
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
    }

    // Export to global scope
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DebugWindow;
    } else {
        global.DebugWindow = DebugWindow;
    }

})(typeof window !== 'undefined' ? window : global); 