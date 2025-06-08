# Config Console

A draggable, resizable configuration panel for web applications with localStorage state persistence and embedded CSS styling.

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

<!-- Config Console Library -->
<script src="https://cdn.jsdelivr.net/gh/maxPalmira/config-console@main/config-console.js"></script>
```

### 2. Basic Usage

```javascript
// Create and initialize config console
const configConsole = new ConfigConsole({
    title: 'My Config Panel',
    position: { x: 100, y: 100 },
    size: { width: 350, height: 450 }
}).init();

// Add some content
configConsole.addLog('Application started', 'info');
configConsole.addConfigButton('Save Settings', () => {
    console.log('Settings saved!');
});
configConsole.addCheckbox('Enable debug mode', false, (checked) => {
    console.log('Debug mode:', checked);
});
configConsole.addMetric('Memory Usage', '2.1 GB');
```

## Installation

### 🚀 Option 1: jsDelivr CDN (Recommended - No Installation Required!)
Load directly from jsDelivr CDN (serves proper MIME types):

```html
<!-- Load via jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/gh/maxPalmira/config-console@main/config-console.js"></script>
<script>
    const configConsole = new ConfigConsole().init();
    configConsole.addLog('Loaded from jsDelivr CDN! 🎉', 'info');
</script>
```

**Or with dynamic loading:**
```javascript
async function loadConfigConsole() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/maxPalmira/config-console@main/config-console.js';
    
    return new Promise((resolve, reject) => {
        script.onload = () => resolve(window.ConfigConsole);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

const ConfigConsole = await loadConfigConsole();
const configConsole = new ConfigConsole().init();
```

### Option 2: Use the Loader Utility
Copy `config-console-loader.js` to your project for easier management:

```html
<script src="config-console-loader.js"></script>
<script>
    // Quick setup
    const ConfigConsole = await ConfigConsoleLoader.quickLoad('maxPalmira');
    const configConsole = new ConfigConsole().init();
</script>
```

### Option 3: Direct Download
Download `config-console.js` and include it in your project.

## API Reference

### Constructor

```javascript
const configConsole = new ConfigConsole(options);
```

**Options:**
- `title` (string) - Window title (default: 'Config Console')
- `position` (object) - Initial position `{x, y}` (default: `{x: 100, y: 100}`)
- `size` (object) - Initial size `{width, height}` (default: `{width: 300, height: 400}`)
- `visible` (boolean) - Initial visibility (default: `true`)
- `storageKey` (string) - localStorage key for state persistence (default: 'configConsole')

### Core Methods

```javascript
// Initialize and show the config console
configConsole.init();

// Visibility controls
configConsole.show();
configConsole.hide();
configConsole.toggle();

// Destroy the window
configConsole.destroy();
```

### UI Element Methods

```javascript
// Add log entries
configConsole.addLog('Message', 'info');    // 'info', 'warning', 'error'
configConsole.clearLogs();

// Add interactive buttons
configConsole.addConfigButton('Button Text', onClick, options);

// Add checkboxes
configConsole.addCheckbox('Label', checked, onChange, options);

// Add radio button groups
configConsole.addRadioGroup('Group Name', options, onChange);

// Add metrics display
configConsole.addMetric('Label', 'Value', options);
configConsole.updateMetric('Label', 'New Value');

// Add text inputs
configConsole.addTextInput('Label', 'Default Value', onChange, options);
```

### State Management

```javascript
// Save/load state
configConsole.saveState();
configConsole.loadState();
configConsole.clearState();
configConsole.resetToDefaults();

// Get current state
const state = configConsole.getState();
```

### Utility Methods

```javascript
// Window controls
configConsole.setTitle('New Title');
configConsole.setPosition(x, y);
configConsole.setSize(width, height);
configConsole.clear();

// Demo content
configConsole.addDemoContent();

// Access DOM element
const element = configConsole.getElement();
const isHidden = configConsole.isHidden();
```

## Examples

### Basic Configuration Panel

```javascript
const configPanel = new ConfigConsole({ title: 'App Settings' }).init();

configPanel.addLog('Settings panel loaded', 'info');

// Add configuration options
configPanel.addCheckbox('Enable notifications', true, (checked) => {
    console.log('Notifications:', checked);
});

configPanel.addRadioGroup('Theme', [
    { label: 'Light', value: 'light', checked: true },
    { label: 'Dark', value: 'dark' },
    { label: 'Auto', value: 'auto' }
], (value) => {
    console.log('Theme:', value);
});

configPanel.addConfigButton('Save Settings', () => {
    configPanel.addLog('Settings saved!', 'info');
});
```

### Developer Console

```javascript
const devConsole = new ConfigConsole({ 
    title: '👩‍💻 Developer Console',
    size: { width: 450, height: 550 }
}).init();

// Add development metrics
devConsole.addMetric('Environment', 'Development');
devConsole.addMetric('Build Tool', 'Vite 4.0.0');
devConsole.addMetric('Hot Reload', 'Enabled');

// Add development controls
devConsole.addConfigButton('Build Project', () => {
    devConsole.addLog('Building...', 'info');
    // Build logic here
});

devConsole.addCheckbox('Source Maps', true, (enabled) => {
    devConsole.addLog(`Source maps: ${enabled ? 'ON' : 'OFF'}`, 'info');
});
```

### System Monitor

```javascript
const monitor = new ConfigConsole({ 
    title: '📊 System Monitor',
    position: { x: 50, y: 50 }
}).init();

// Update metrics periodically
setInterval(() => {
    monitor.updateMetric('Memory', `${Math.random() * 100 | 0}%`);
    monitor.updateMetric('CPU', `${Math.random() * 50 | 0}%`);
    monitor.updateMetric('Network', `${Math.random() * 10 | 0} Mbps`);
}, 2000);

monitor.addLog('System monitoring started', 'info');
```

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';

function useConfigConsole(options = {}) {
    const consoleRef = useRef(null);
    
    useEffect(() => {
        if (window.ConfigConsole && !consoleRef.current) {
            consoleRef.current = new window.ConfigConsole(options).init();
        }
        
        return () => {
            if (consoleRef.current) {
                consoleRef.current.destroy();
            }
        };
    }, []);
    
    return consoleRef.current;
}

// Usage in component
function MyComponent() {
    const configConsole = useConfigConsole({ title: 'React Config' });
    
    useEffect(() => {
        if (configConsole) {
            configConsole.addLog('React component mounted', 'info');
        }
    }, [configConsole]);
    
    return <div>My App</div>;
}
```

### Vue.js

```javascript
export default {
    data() {
        return {
            configConsole: null
        };
    },
    
    mounted() {
        this.configConsole = new window.ConfigConsole({
            title: 'Vue Config Panel'
        }).init();
        
        this.configConsole.addLog('Vue component mounted', 'info');
    },
    
    beforeDestroy() {
        if (this.configConsole) {
            this.configConsole.destroy();
        }
    }
};
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- **Moveable.js** - Required for drag and resize functionality
- **Modern browser** with ES6+ support

## License

MIT License - feel free to use in any project!

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Changelog

### v1.0.2
- Renamed from DebugWindow to ConfigConsole
- Updated all references and documentation
- Improved configuration-focused terminology
- Enhanced jsDelivr CDN integration

### v1.0.1
- Added text input fields
- Improved collapsible functionality
- Enhanced state persistence

### v1.0.0
- Initial release
- Basic drag and resize functionality
- localStorage state persistence
- Multiple UI element types 