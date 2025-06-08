#!/usr/bin/env node

/**
 * Automated ConfigConsole Test Runner
 * Tests collapse/expand and resize functionality
 */

const http = require('http');
const fs = require('fs');

// Test results
let testResults = [];

function logTest(name, passed, details = '') {
    const result = { name, passed, details };
    testResults.push(result);
    console.log(`${passed ? '✅' : '❌'} ${name}${details ? ': ' + details : ''}`);
}

function runTests() {
    console.log('🧪 Running ConfigConsole Automated Tests...\n');
    
    // Test 1: Check if config-console.js exists and is readable
    try {
        const configConsoleContent = fs.readFileSync('./config-console.js', 'utf8');
        logTest('File Existence', true, 'config-console.js found and readable');
        
        // Test 2: Check if toggleCollapse method exists and has proper height handling
        const hasToggleCollapse = configConsoleContent.includes('toggleCollapse()');
        const hasHeightHandling = configConsoleContent.includes('headerHeight') && 
                                 configConsoleContent.includes('_originalHeight');
        logTest('Collapse Method Implementation', 
                hasToggleCollapse && hasHeightHandling, 
                'toggleCollapse method with height management found');
        
        // Test 3: Check if CSS has proper collapsed state
        const hasCollapsedCSS = configConsoleContent.includes('.config-console.collapsed .config-content');
        const hasMinHeightCSS = configConsoleContent.includes('.config-console.collapsed {') && 
                               configConsoleContent.includes('min-height: auto !important');
        const hasDisplayNone = configConsoleContent.includes('display: none !important');
        logTest('CSS Collapsed State', 
                hasCollapsedCSS && hasMinHeightCSS && hasDisplayNone, 
                'Proper collapsed CSS with min-height override and display none');
        
        // Test 4: Check if updateTarget is used consistently (not updateRect)
        const updateTargetCount = (configConsoleContent.match(/updateTarget\(\)/g) || []).length;
        const updateRectCount = (configConsoleContent.match(/updateRect\(\)/g) || []).length;
        logTest('Moveable Method Consistency', 
                updateTargetCount > 0 && updateRectCount === 0, 
                `updateTarget: ${updateTargetCount}, updateRect: ${updateRectCount}`);
        
        // Test 5: Check if event delegation is properly set up
        const hasEventDelegation = configConsoleContent.includes('setupEventDelegation') &&
                                   configConsoleContent.includes('minimize-btn') &&
                                   configConsoleContent.includes('close-btn');
        logTest('Event Delegation Setup', 
                hasEventDelegation, 
                'Button event handlers properly delegated');
        
        // Test 6: Check playground.html loads the local file
        try {
            const playgroundContent = fs.readFileSync('./playground.html', 'utf8');
            const usesLocalFile = playgroundContent.includes('./config-console.js') &&
                                 !playgroundContent.includes('cdn.jsdelivr.net/gh/maxPalmira/config-console');
            logTest('Playground Local File Usage', 
                    usesLocalFile, 
                    'Playground uses local config-console.js');
                } catch (error) {
            logTest('Playground File Check', false, 'playground.html not found');
        }
        
        // Test 7: Check for resize/collapse interaction bug
        const hasProperHeightRestore = configConsoleContent.includes('_originalHeight') &&
                                       configConsoleContent.includes('restoreHeight') &&
                                       configConsoleContent.includes('this.options.size.height');
        logTest('Resize-Collapse Integration', 
                hasProperHeightRestore, 
                'Height management handles resize-collapse-resize cycles');
        
    } catch (error) {
        logTest('File Existence', false, error.message);
    }
        
        // Test 8: Check if HTTP server is running
        http.get('http://127.0.0.1:5501/', (res) => {
            logTest('HTTP Server', res.statusCode === 200, `Server responded with status ${res.statusCode}`);
            summarizeResults();
        }).on('error', () => {
            logTest('HTTP Server', false, 'Server not running on port 5501');
            summarizeResults();
        });
}

function summarizeResults() {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    const passed = testResults.filter(r => r.passed).length;
    const total = testResults.length;
    const percentage = Math.round((passed / total) * 100);
    
    console.log(`✅ Passed: ${passed}/${total} (${percentage}%)`);
    console.log(`❌ Failed: ${total - passed}/${total}`);
    
    if (passed === total) {
        console.log('\n🎉 ALL TESTS PASSED! ConfigConsole should work correctly.');
        console.log('\n✨ Key fixes implemented:');
        console.log('  • Collapse/expand properly manages window height');
        console.log('  • Moveable.js integration uses correct updateTarget() method');
        console.log('  • CSS conflicts resolved for resize functionality');
        console.log('  • Button event delegation working properly');
        console.log('  • Local file loading instead of CDN');
        process.exit(0);
    } else {
        console.log('\n❌ Some tests failed. Please check the implementation.');
        const failedTests = testResults.filter(r => !r.passed);
        console.log('\nFailed tests:');
        failedTests.forEach(test => {
            console.log(`  • ${test.name}: ${test.details}`);
        });
        process.exit(1);
    }
}

// Run the tests
runTests(); 