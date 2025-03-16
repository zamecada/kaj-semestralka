/**
 * Main application initialization script
 */

// Import required modules
import { getData } from './modules/storage.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Form Builder Application initialized');
    
    // Check if there are any stored forms
    const forms = getData('forms') || [];
    console.log(`Found ${forms.length} stored forms`);
    
    // If on the home page, show a quick stats counter
    const statsContainer = document.getElementById('form-stats');
    if (statsContainer) {
        statsContainer.textContent = `${forms.length} formulářů vytvořeno`;
    }
    
    // If there are example links on the home page, fill them with real data
    const exampleFormLink = document.getElementById('example-form-link');
    if (exampleFormLink && forms.length > 0) {
        const latestForm = forms[forms.length - 1];
        exampleFormLink.href = `/src/views/form.html?id=${latestForm.id}`;
        exampleFormLink.textContent = latestForm.title;
    }
    
    // Check for active page and apply appropriate navigation highlight
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});