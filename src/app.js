/**
 * Main application initialization script
 */
import { App } from './AppModule.js';
import { Form } from './models/form.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Form Builder Application initialized');
    
    // Použijeme StorageService místo přímého volání getData
    const forms = await App.storageService.getAllForms();
    console.log(`Found ${forms.length} stored forms`);
    
    // Stejná funkcionalita jako v původním souboru
    const statsContainer = document.getElementById('form-stats');
    if (statsContainer) {
        statsContainer.textContent = `${forms.length} formulářů vytvořeno`;
    }
    
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
    
    // Publikujeme událost o inicializaci aplikace
    App.eventBus.publish('app:initialized', { currentPath });

    // Inicializace stránky pro vytváření formulářů
    if (window.location.pathname.includes('/src/views/create.html')) {
        import('./views/FormView.js').then(module => {
            const FormView = module.FormView;
            import('./controllers/FormController.js').then(module => {
                const FormController = module.FormController;
                
                // Vytvoření instance FormView a FormController
                const formView = new FormView(document.querySelector('.form-container'));
                const formController = new FormController(formView);
                
                console.log('Form creation page initialized');
            });
        });
    }
});