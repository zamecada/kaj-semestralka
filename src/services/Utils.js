/**
 * Utility functions for the form builder application
 */

/**
 * Generate a random ID string
 * @returns {string} - A random ID
 */
export function generateID() {
    /**
     * Math.random() generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
     * .toString(36) converts this number to a base-36 string, which includes digits (0-9) and letters (a-z).
     * .substring(2, 15) extracts a substring from the base-36 string, starting from the 3rd character (index 2) to the 15th character (index 14). This removes the "0." prefix that appears in the base-36 string representation of a number less than 1.
     */
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
    if (!input) return '';
    
    // Create a temporary div element
    const temp = document.createElement('div');
    temp.textContent = input;
    
    // Return the sanitized value
    return temp.innerHTML;
}

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {boolean} - Success or failure
 */
export function copyToClipboard(text) {
    // Modern approach using navigator.clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text successfully copied to clipboard');
            return true;
        }).catch(err => {
            console.error('Could not copy text: ', err);
            return false;
        });
        return true;
    }
    
    // Fallback for older browsers (suggested by AI)
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return successful;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Check if a string is empty (null, undefined, or only whitespace)
 * @param {string} str - The string to check
 * @returns {boolean} - True if the string is empty
 */
export function isEmpty(str) {
    return !str || str.trim() === '';
}

/**
 * Get URL query parameters
 * @returns {Object} - Object with query parameters
 */
export function getQueryParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    
    return params;
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if the email is valid
 */
export function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Create a chart from data (placeholder for future implementation)
 * @param {string} elementId - The ID of the element to render the chart in
 * @param {Array} data - The data for the chart
 * @param {string} type - The type of chart
 */
export function createChart(elementId, data, type = 'bar') {
    // This is a placeholder function for future chart implementation
    // When implementing, we could use a library like Chart.js
    console.log(`Chart would be created in ${elementId} with data:`, data);
    
    // For now, create a simple text representation
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `<div class="chart-placeholder">
        <p>Graf by zde zobrazil následující data:</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
    </div>`;
}