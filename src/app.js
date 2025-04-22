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

    // Inicializace stránky pro zobrazení formuláře
    if (window.location.pathname.includes('/src/views/form.html')) {
        import('./views/FormResponseView.js').then(module => {
            const FormResponseView = module.FormResponseView;
            import('./controllers/FormResponseController.js').then(module => {
                const FormResponseController = module.FormResponseController;
                
                // Vytvoření instance FormResponseView a FormResponseController
                const formResponseView = new FormResponseView(document.querySelector('main'));
                const formResponseController = new FormResponseController(formResponseView);
                
                console.log('Form response page initialized');
            });
        });
    }

    // Inicializace stránky pro administraci formuláře
    if (window.location.pathname.includes('/src/views/admin.html')) {
        import('./views/AdminView.js').then(module => {
            const AdminView = module.AdminView;
            import('./controllers/AdminController.js').then(module => {
                const AdminController = module.AdminController;
                
                // Vytvoření instance AdminView a AdminController
                const adminView = new AdminView(document.querySelector('main'));
                const adminController = new AdminController(adminView);
                
                console.log('Admin page initialized');
            });
        });
    }

    // Inicializace stránky pro náhled formuláře
    if (window.location.pathname.includes('/src/views/preview.html')) {
        import('./views/FormPreviewView.js').then(module => {
            const FormPreviewView = module.FormPreviewView;
            import('./controllers/FormPreviewController.js').then(module => {
                const FormPreviewController = module.FormPreviewController;
                
                // Vytvoření instance FormPreviewView a FormPreviewController
                const formPreviewView = new FormPreviewView(document.querySelector('main'));
                const formPreviewController = new FormPreviewController(formPreviewView);
                
                console.log('Form preview page initialized');
            });
        });
    }
});