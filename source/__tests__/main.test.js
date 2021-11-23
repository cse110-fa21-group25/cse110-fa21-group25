/**
 * @jest-environment jsdom
 */
const functions = require('../assets/scripts/main.js');

// formatTime testing
const testCases = {
    'PT1HR': '1 hr', 
    'PT11HR': '11 hrs', 
    'PT30M': '30 mins', 
    'PT5H30M': '5 hrs 30 mins', 
    'PT10H10M': '10 hrs 10 mins', 
    'PT12H5M': '12+ hrs 5 mins'
};
for (const testCase in testCases) {
    test(`formatTime on ${testCase}`, () => {
        expect(functions.formatTime(testCase)).toBe(testCases[testCase]);
    });
}