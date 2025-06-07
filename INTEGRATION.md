# 🚀 Debug Window - GitHub Raw File Integration

Use the Debug Window component directly from GitHub in any project without installation!

## 📋 Quick Start

### Method 1: Direct Script Tag (Simplest)

```html
<!-- Load directly from GitHub -->
<script src="https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js"></script>
<script>
    const debugWindow = new DebugWindow().init();
    debugWindow.addLog('Hello World!', 'info');
</script>
```

### Method 2: Dynamic Loading (Recommended)

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

// Usage
const DebugWindow = await loadDebugWindow();
const debugWindow = new DebugWindow({
    title: 'My Debug Panel',
    position: { x: 100, y: 100 }
}).init();
```

### Method 3: ES6 Import (Modern Browsers)

```javascript
// Dynamic import from GitHub
import('https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js')
    .then(() => {
        const debugWindow = new window.DebugWindow().init();
    });
```

## 🎯 Real-World Examples

### React Integration

```jsx
import { useEffect, useState } from 'react';

function MyApp() {
    const [debugWindow, setDebugWindow] = useState(null);

    useEffect(() => {
        // Load debug window from GitHub
        const loadDebugWindow = async () => {
            const script = document.createElement('script');
            script.src = 'https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js';
            
            script.onload = () => {
                const dw = new window.DebugWindow({
                    title: 'React App Debug',
                    position: { x: 50, y: 50 }
                }).init();
                
                setDebugWindow(dw);
                dw.addLog('React app loaded', 'info');
            };
            
            document.head.appendChild(script);
        };

        loadDebugWindow();
    }, []);

    const handleApiCall = async () => {
        debugWindow?.addLog('API call started', 'info');
        try {
            const response = await fetch('/api/data');
            debugWindow?.addLog('API call successful', 'info');
        } catch (error) {
            debugWindow?.addLog(`API error: ${error.message}`, 'error');
        }
    };

    return (
        <div>
            <button onClick={handleApiCall}>Make API Call</button>
        </div>
    );
}
```

### Node.js/Express Integration

```javascript
// In your Express app
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>My App</title></head>
        <body>
            <h1>My Application</h1>
            
            <!-- Debug Window from GitHub -->
            <script src="https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js"></script>
            <script>
                const debugWindow = new DebugWindow({
                    title: 'Server Debug',
                    position: { x: 20, y: 20 }
                }).init();
                
                debugWindow.addLog('Page loaded from Express server', 'info');
                debugWindow.addMetric('Server Time', '${new Date().toISOString()}');
            </script>
        </body>
        </html>
    `);
});
```

### WordPress Plugin Integration

```php
<?php
// In your WordPress plugin or theme
function add_debug_window() {
    ?>
    <script src="https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const debugWindow = new DebugWindow({
                title: 'WordPress Debug',
                position: { x: 30, y: 30 }
            }).init();
            
            debugWindow.addLog('WordPress site loaded', 'info');
            debugWindow.addMetric('PHP Version', '<?php echo PHP_VERSION; ?>');
            debugWindow.addMetric('WP Version', '<?php echo get_bloginfo("version"); ?>');
        });
    </script>
    <?php
}
add_action('wp_footer', 'add_debug_window');
?>
```

## 🔧 Advanced Usage

### Load Specific Version/Commit

```javascript
// Load from specific commit (recommended for production)
const COMMIT_HASH = 'abc123def456'; // Your commit hash
const script = document.createElement('script');
script.src = `https://raw.githubusercontent.com/maxPalmira/debug-window/${COMMIT_HASH}/debug-window.js`;
```

### Error Handling

```javascript
async function safeLoadDebugWindow() {
    try {
        const script = document.createElement('script');
        script.src = 'https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js';
        
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load debug window'));
            document.head.appendChild(script);
            
            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('Load timeout')), 10000);
        });
        
        return window.DebugWindow;
    } catch (error) {
        console.warn('Debug window not available:', error.message);
        // Return a mock object to prevent errors
        return class MockDebugWindow {
            init() { return this; }
            addLog() { return this; }
            addMetric() { return this; }
            destroy() { return this; }
        };
    }
}
```

### CDN Fallback

```javascript
async function loadDebugWindowWithFallback() {
    const sources = [
        'https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js',
        './local-debug-window.js', // Local fallback
        'https://cdn.jsdelivr.net/gh/maxPalmira/debug-window@main/debug-window.js' // JSDelivr CDN
    ];
    
    for (const src of sources) {
        try {
            const script = document.createElement('script');
            script.src = src;
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
            
            if (window.DebugWindow) {
                return window.DebugWindow;
            }
        } catch (error) {
            console.warn(`Failed to load from ${src}`);
        }
    }
    
    throw new Error('All debug window sources failed');
}
```

## 🛠️ Configuration Options

```javascript
const debugWindow = new DebugWindow({
    // Window settings
    title: 'My Debug Panel',
    position: { x: 100, y: 100 },
    size: { width: 400, height: 300 },
    
    // Behavior
    autoSave: true,           // Save state to localStorage
    collapsed: false,         // Start collapsed
    
    // Styling
    className: 'my-debug-window',
    
    // Storage key for persistence
    storageKey: 'my-app-debug-state'
}).init();
```

## 📦 Complete Integration Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App with Debug Window</title>
</head>
<body>
    <div id="app">
        <h1>My Application</h1>
        <button id="test-btn">Test Action</button>
    </div>

    <script>
        // Load debug window from GitHub
        (async function() {
            try {
                const script = document.createElement('script');
                script.src = 'https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js';
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });

                // Initialize debug window
                const debugWindow = new DebugWindow({
                    title: 'My App Debug',
                    position: { x: 50, y: 50 }
                }).init();

                // Add initial content
                debugWindow.addLog('Application started', 'info');
                debugWindow.addMetric('Load Time', `${Date.now() - performance.navigationStart}ms`);

                // Set up event logging
                document.getElementById('test-btn').addEventListener('click', () => {
                    debugWindow.addLog('Test button clicked', 'info');
                });

                // Make debug window globally accessible
                window.debugWindow = debugWindow;
                
            } catch (error) {
                console.warn('Debug window failed to load:', error);
            }
        })();
    </script>
</body>
</html>
```

## 🔄 Updates & Versioning

When you update the debug-window component:

1. **Automatic Updates**: Projects using `main` branch get updates automatically
2. **Pinned Versions**: Use commit hashes for stability
3. **Cache Busting**: Add `?v=${Date.now()}` for immediate updates during development

```javascript
// Development (always latest)
const devSrc = 'https://raw.githubusercontent.com/maxPalmira/debug-window/main/debug-window.js';

// Production (pinned version)
const prodSrc = 'https://raw.githubusercontent.com/maxPalmira/debug-window/v1.2.0/debug-window.js';

// With cache busting
const cacheBustedSrc = `${devSrc}?v=${Date.now()}`;
```

## ⚡ Performance Tips

- Load the component only when needed (development/debugging)
- Use specific commit hashes in production for caching
- Consider lazy loading for better initial page performance
- Remove debug windows in production builds

```javascript
// Only load in development
if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    loadDebugWindow();
}
```

---

**🎉 That's it!** Your debug window is now accessible from any project without installation. Just reference the GitHub raw file and you're ready to go! 