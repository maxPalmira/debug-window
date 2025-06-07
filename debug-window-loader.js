/*!
 * Debug Window Loader - Load debug window component from GitHub
 * Copy this script to any project to easily load the debug window
 */

(function(global) {
    'use strict';

    const DebugWindowLoader = {
        // Configuration
        config: {
            githubUser: 'maxPalmira',
            repo: 'debug-window',
            branch: 'main',
            file: 'debug-window.js',
            timeout: 10000,
            retries: 3
        },

        // Set custom configuration
        setConfig(options) {
            this.config = { ...this.config, ...options };
            return this;
        },

        // Generate GitHub raw URL
        getUrl(version = null) {
            const { githubUser, repo, file } = this.config;
            const ref = version || this.config.branch;
            return `https://raw.githubusercontent.com/${githubUser}/${repo}/${ref}/${file}`;
        },

        // Load the debug window component
        async load(options = {}) {
            const config = { ...this.config, ...options };
            
            // Return existing instance if already loaded
            if (global.DebugWindow) {
                return global.DebugWindow;
            }

            let lastError;
            for (let attempt = 1; attempt <= config.retries; attempt++) {
                try {
                    const url = this.getUrl(config.version);
                    
                    // Add cache busting for development
                    const finalUrl = config.cacheBust ? 
                        `${url}?v=${Date.now()}` : url;

                    await this._loadScript(finalUrl, config.timeout);
                    
                    if (global.DebugWindow) {
                        console.log(`✅ Debug Window loaded from: ${finalUrl}`);
                        return global.DebugWindow;
                    } else {
                        throw new Error('DebugWindow not found on global scope');
                    }
                } catch (error) {
                    lastError = error;
                    console.warn(`❌ Attempt ${attempt} failed:`, error.message);
                    
                    if (attempt < config.retries) {
                        await this._delay(1000 * attempt); // Exponential backoff
                    }
                }
            }

            // If all attempts failed, return mock object to prevent errors
            console.error('🚫 Failed to load Debug Window after all attempts:', lastError.message);
            return this._createMockDebugWindow();
        },

        // Load script with timeout
        _loadScript(url, timeout) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                
                const timeoutId = setTimeout(() => {
                    cleanup();
                    reject(new Error(`Script load timeout (${timeout}ms)`));
                }, timeout);

                const cleanup = () => {
                    clearTimeout(timeoutId);
                    script.removeEventListener('load', onLoad);
                    script.removeEventListener('error', onError);
                };

                const onLoad = () => {
                    cleanup();
                    resolve();
                };

                const onError = () => {
                    cleanup();
                    reject(new Error(`Failed to load script: ${url}`));
                };

                script.addEventListener('load', onLoad);
                script.addEventListener('error', onError);
                
                document.head.appendChild(script);
            });
        },

        // Delay utility
        _delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // Create mock debug window for graceful fallback
        _createMockDebugWindow() {
            return class MockDebugWindow {
                constructor() {
                    console.warn('🔧 Using mock DebugWindow - original failed to load');
                }
                init() { return this; }
                addLog(message, type) { 
                    console.log(`[${type?.toUpperCase() || 'LOG'}] ${message}`);
                    return this; 
                }
                addMetric() { return this; }
                addConfigButton() { return this; }
                addCheckbox() { return this; }
                addRadioGroup() { return this; }
                addTextInput() { return this; }
                updateMetric() { return this; }
                clear() { return this; }
                show() { return this; }
                hide() { return this; }
                toggle() { return this; }
                destroy() { return this; }
                setTitle() { return this; }
                setPosition() { return this; }
                setSize() { return this; }
            };
        },

        // Quick setup methods
        quickLoad(githubUser, repo = 'debug-window') {
            return this.setConfig({ githubUser, repo }).load();
        },

        // Load with specific version/commit
        loadVersion(version, options = {}) {
            return this.load({ ...options, version });
        },

        // Load for development (with cache busting)
        loadDev(options = {}) {
            return this.load({ ...options, cacheBust: true });
        }
    };

    // Export to global scope
    global.DebugWindowLoader = DebugWindowLoader;

    // Auto-load if configuration is provided
    if (global.DEBUG_WINDOW_AUTO_LOAD) {
        const config = global.DEBUG_WINDOW_AUTO_LOAD;
        DebugWindowLoader.setConfig(config).load().then((DebugWindow) => {
            if (config.autoInit !== false) {
                global.debugWindow = new DebugWindow(config.initOptions || {}).init();
            }
        });
    }

})(typeof window !== 'undefined' ? window : global);

/*
 * Usage Examples:
 * 
 * // Basic usage
 * const DebugWindow = await DebugWindowLoader.quickLoad('your-username');
 * const debugWindow = new DebugWindow().init();
 * 
 * // With custom configuration
 * DebugWindowLoader.setConfig({
 *     githubUser: 'your-username',
 *     repo: 'debug-window',
 *     branch: 'main'
 * });
 * const DebugWindow = await DebugWindowLoader.load();
 * 
 * // Load specific version
 * const DebugWindow = await DebugWindowLoader.loadVersion('v1.2.0');
 * 
 * // Development mode (with cache busting)
 * const DebugWindow = await DebugWindowLoader.loadDev();
 * 
 * // Auto-load configuration (place before loader script)
 * window.DEBUG_WINDOW_AUTO_LOAD = {
 *     githubUser: 'your-username',
 *     repo: 'debug-window',
 *     autoInit: true,
 *     initOptions: {
 *         title: 'My App Debug',
 *         position: { x: 50, y: 50 }
 *     }
 * };
 */ 