/**
 * Storage module for handling data persistence using localStorage
 */

/**
 * Save data to localStorage
 * @param {string} key - The key to store data under
 * @param {any} value - The data to store (will be JSON stringified)
 */
export function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        return false;
    }
}

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve data from
 * @returns {any} - The parsed data or null if not found
 */
export function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving data from localStorage:', error);
        return null;
    }
}

/**
 * Delete data from localStorage
 * @param {string} key - The key to delete
 */
export function deleteData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error deleting data from localStorage:', error);
        return false;
    }
}

/**
 * Clear all data from localStorage
 */
export function clearAllData() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/**
 * Get all forms from localStorage
 * @returns {Array} - Array of all forms
 */
export function getAllForms() {
    return getData('forms') || [];
}

/**
 * Get a specific form by ID
 * @param {string} formId - The ID of the form to retrieve
 * @returns {Object} - The form object or null if not found
 */
export function getFormById(formId) {
    // Try to get the form directly (more efficient)
    const form = getData(`form_${formId}`);
    if (form) return form;
    
    // Fall back to searching in all forms
    const forms = getAllForms();
    return forms.find(form => form.id === formId) || null;
}

/**
 * Save a response to a form
 * @param {string} formId - The ID of the form
 * @param {Object} response - The response data
 */
export function saveResponse(formId, response) {
    const form = getFormById(formId);
    
    if (!form) {
        console.error('Form not found:', formId);
        return false;
    }
    
    // Add the response
    form.responses = form.responses || [];
    form.responses.push({
        ...response,
        submittedAt: new Date().toISOString()
    });
    
    // Save the updated form
    saveData(`form_${formId}`, form);
    
    // Update in the forms array too
    const forms = getAllForms();
    const formIndex = forms.findIndex(f => f.id === formId);
    
    if (formIndex !== -1) {
        forms[formIndex] = form;
        saveData('forms', forms);
    }
    
    return true;
}