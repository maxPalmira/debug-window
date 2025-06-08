/*!
 * Config Console Loader - Load config console component from GitHub
 * Copy this script to any project to easily load the config console
 * Version: 1.0.0
 */

(function(global) {
    'use strict';

    const ConfigConsoleLoader = {
        // Default configuration
        config: {
            username: null,
            repo: 'config-console',
            branch: 'main',
            filename: 'config-console.js',
            retryAttempts: 3,
            retryDelay: 1000,
            fallbackToLocal: false,
            localPath: './config-console.js',
            moveableUrl: 'https://daybrush.com/moveable/release/latest/dist/moveable.min.js'
        },

        // Load dependencies
        async loadMoveable() {
            return new Promise((resolve, reject) => {
                if (typeof Moveable !== 'undefined') {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = this.config.moveableUrl;
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load Moveable.js'));
                document.head.appendChild(script);
            });
        },

        // Load the config console component
        async loadConfigConsole(username, options = {}) {
            const config = { ...this.config, ...options, username };
            
            if (!username) {
                throw new Error('GitHub username is required');
            }

            // Load Moveable first
            await this.loadMoveable();

            const urls = [
                `https://cdn.jsdelivr.net/gh/${username}/${config.repo}@${config.branch}/${config.filename}`,
                `https://raw.githubusercontent.com/${username}/${config.repo}/${config.branch}/${config.filename}`
            ];

            if (config.fallbackToLocal) {
                urls.push(config.localPath);
            }

            let lastError;
            
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                
                for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
                    try {
                        await this.loadScript(url);
                        console.log(`✅ Config Console loaded from: ${url}`);
                        return global.ConfigConsole;
                    } catch (error) {
                        lastError = error;
                        console.warn(`⚠️ Attempt ${attempt}/${config.retryAttempts} failed for ${url}:`, error.message);
                        
                        if (attempt < config.retryAttempts) {
                            await this.delay(config.retryDelay);
                        }
                    }
                }
            }

            // If all attempts failed, provide fallback
            console.error('🚫 Failed to load Config Console after all attempts:', lastError.message);
            console.log('🔧 Providing graceful fallback...');
            
            this.createFallback();
            return global.ConfigConsole;
        },

        // Load a script with Promise
        loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => {
                    if (typeof global.ConfigConsole !== 'undefined') {
                        resolve();
                    } else {
                        reject(new Error('ConfigConsole not found after loading script'));
                    }
                };
                script.onerror = () => reject(new Error(`Failed to load: ${url}`));
                document.head.appendChild(script);
            });
        },

        // Utility delay function
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // Create mock config console for graceful fallback
        createFallback() {
            global.ConfigConsole = class {
                constructor(options = {}) {
                    this.options = options;
                    console.warn('⚠️ Using Config Console fallback mode');
                }
                
                init() {
                    console.log('📝 Config Console fallback initialized');
                    return this;
                }
                
                addLog(message, type) {
                    console.log(`[${type?.toUpperCase() || 'INFO'}] ${message}`);
                    return this;
                }
                
                addMetric(label, value) {
                    console.log(`📊 ${label}: ${value}`);
                    return this;
                }
                
                show() { console.log('👁️ Config Console shown'); return this; }
                hide() { console.log('🙈 Config Console hidden'); return this; }
                destroy() { console.log('💥 Config Console destroyed'); return this; }
                
                // Stub methods
                addConfigButton() { return this; }
                addCheckbox() { return this; }
                addRadioGroup() { return this; }
                addTextInput() { return this; }
                updateMetric() { return this; }
                setTitle() { return this; }
                clear() { return this; }
            };
        },

        // Quick setup method
        async quickLoad(username, options = {}) {
            try {
                await this.loadConfigConsole(username, options);
                return global.ConfigConsole;
            } catch (error) {
                console.error('❌ Quick load failed:', error);
                this.createFallback();
                return global.ConfigConsole;
            }
        }
    };

    // Export to global scope
    global.ConfigConsoleLoader = ConfigConsoleLoader;

    // Auto-load if username is provided via data attribute
    document.addEventListener('DOMContentLoaded', () => {
        const loaderScript = document.querySelector('script[data-config-console-username]');
        if (loaderScript) {
            const username = loaderScript.getAttribute('data-config-console-username');
            const autoLoad = loaderScript.getAttribute('data-auto-load') !== 'false';
            
            if (username && autoLoad) {
                ConfigConsoleLoader.quickLoad(username)
                    .then(() => console.log('🎉 Config Console auto-loaded successfully'))
                    .catch(error => console.error('❌ Auto-load failed:', error));
            }
        }
    });

})(typeof window !== 'undefined' ? window : global); 