# DebugWindow

A draggable, resizable debug panel for web applications with localStorage state persistence and embedded CSS styling.

## Features

✨ **Self-contained** - Single JavaScript file with embedded CSS  
🎯 **Drag by icon only** - Clean dragging interaction using the ⋮⋮ icon  
📏 **Single resize handle** - Bottom-right corner resize only  
💾 **localStorage persistence** - Automatically saves position, size, and visibility  
📦 **Multiple UI elements** - Logs, buttons, checkboxes, radio groups, metrics  
🎨 **Dark theme** - Professional dark styling built-in  
📱 **Responsive** - Scrollable content when it doesn't fit  

## Quick Start

### 1. Include Dependencies

```html
<!-- Required: Moveable.js -->
<script src="https://daybrush.com/moveable/release/latest/dist/moveable.min.js"></script>

<!-- DebugWindow Library -->
<script src="debug-window.js"></script>
```

### 2. Basic Usage

```javascript
// Create and initialize debug window
const debugWindow = new DebugWindow({
    title: 'My Debug Panel',
    position: { x: 100, y: 100 },
    size: { width: 350, height: 450 }
}).init();

// Add some content
debugWindow.addLog('Application started', 'info');
debugWindow.addConfigButton('Save Settings', () => {
    console.log('Settings saved!');
});
debugWindow.addCheckbox('Enable debug mode', false, (checked) => {
    console.log('Debug mode:', checked);
});
debugWindow.addMetric('Memory Usage', '2.1 GB');
```

## Installation

### 🚀 Option 1: GitHub Raw File (Recommended - No Installation Required!)
Load directly from GitHub in any project:

```html
<!-- Load directly from GitHub -->
<script src="https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js"></script>
<script>
    const debugWindow = new DebugWindow().init();
    debugWindow.addLog('Loaded from GitHub! 🎉', 'info');
</script>
```

**Or with dynamic loading:**
```javascript
async function loadDebugWindow() {
    const script = document.createElement('script');
    script.src = 'https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js';
    
    return new Promise((resolve, reject) => {
        script.onload = () => resolve(window.DebugWindow);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

const DebugWindow = await loadDebugWindow();
const debugWindow = new DebugWindow().init();
```

**📖 See [INTEGRATION.md](INTEGRATION.md) for complete GitHub raw file usage guide**

### Option 2: Use the Loader Utility
Copy `debug-window-loader.js` to your project for easier management:

```html
<script src="debug-window-loader.js"></script>
<script>
    // Quick setup
    const DebugWindow = await DebugWindowLoader.quickLoad('your-username');
    const debugWindow = new DebugWindow().init();
</script>
```

### Option 3: Direct Download
Download `debug-window.js` and include it in your project.

### Option 4: CDN (when available)
```html
<script src="https://cdn.jsdelivr.net/npm/debug-window@1.0.0/debug-window.js"></script>
```

### Option 5: NPM (when published)
```bash
npm install debug-window
```

## API Reference

### Constructor

```javascript
const debugWindow = new DebugWindow(options);
```

**Options:**
- `title` (string) - Window title (default: 'Debug Window')
- `position` (object) - Initial position `{x, y}` (default: `{x: 100, y: 100}`)
- `size` (object) - Initial size `{width, height}` (default: `{width: 300, height: 400}`)
- `visible` (boolean) - Initial visibility (default: `true`)
- `storageKey` (string) - localStorage key for state persistence (default: 'debugWindow')

### Core Methods

```javascript
// Initialize and show the debug window
debugWindow.init();

// Visibility controls
debugWindow.show();
debugWindow.hide();
debugWindow.toggle();

// Destroy the window
debugWindow.destroy();
```

### UI Element Methods

```javascript
// Add log entries
debugWindow.addLog('Message', 'info');    // 'info', 'warning', 'error'
debugWindow.clearLogs();

// Add interactive buttons
debugWindow.addConfigButton('Button Text', onClick, options);

// Add checkboxes
debugWindow.addCheckbox('Label', checked, onChange, options);

// Add radio button groups
debugWindow.addRadioGroup('Group Name', options, onChange);

// Add metrics display
debugWindow.addMetric('Label', 'Value', options);
debugWindow.updateMetric('Label', 'New Value');
```

### State Management

```javascript
// Save/load state
debugWindow.saveState();
debugWindow.loadState();
debugWindow.clearState();
debugWindow.resetToDefaults();

// Get current state
const state = debugWindow.getState();
```

### Utility Methods

```javascript
// Window controls
debugWindow.setTitle('New Title');
debugWindow.setPosition(x, y);
debugWindow.setSize(width, height);
debugWindow.clear();

// Demo content
debugWindow.addDemoContent();

// Access DOM element
const element = debugWindow.getElement();
const isHidden = debugWindow.isHidden();
```

## Examples

### Basic Logging Panel

```javascript
const logger = new DebugWindow({ title: 'Logger' }).init();

logger.addLog('App started', 'info');
logger.addLog('Warning: High CPU usage', 'warning');
logger.addLog('Connection failed', 'error');
```

### Settings Panel

```javascript
const settings = new DebugWindow({ title: 'Settings' }).init();

settings.addCheckbox('Dark mode', true, (checked) => {
    document.body.classList.toggle('dark-mode', checked);
});

settings.addRadioGroup('Language', [
    { label: 'English', value: 'en', checked: true },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' }
], (value) => {
    console.log('Language changed to:', value);
});
```

### Real-time Metrics

```javascript
const metrics = new DebugWindow({ title: 'System Metrics' }).init();

metrics.addMetric('CPU Usage', '0%');
metrics.addMetric('Memory', '0 MB');

// Update metrics every second
setInterval(() => {
    const cpu = Math.random() * 100;
    const memory = Math.random() * 1000;
    
    metrics.updateMetric('CPU Usage', `${cpu.toFixed(1)}%`);
    metrics.updateMetric('Memory', `${memory.toFixed(0)} MB`);
}, 1000);
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- **Moveable.js** (0.30.0+) - Required for drag and resize functionality

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

### v1.0.0
- Initial release
- Single file library with embedded CSS
- Drag by icon only functionality
- localStorage state persistence
- Multiple UI element types
- Comprehensive API 