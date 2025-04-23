import { App } from './AppModule.js';
import { OfflineNotification } from './components/OfflineNotification.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('FormBuilder Application initialized at path:', window.location.pathname);
    
    try {
        // Použijeme StorageService místo přímého volání getData
        const forms = await App.storageService.getAllForms();
        console.log(`Found ${forms.length} stored forms`);
        
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
        
        // Inicializace offline notifikace
        const offlineNotification = new OfflineNotification();
        console.log('Offline notification component initialized');
        
        // Detekce aktuální stránky a inicializace příslušných MVC komponent
        const currentPagePath = window.location.pathname;
        
        // Inicializace stránky pro vytváření formulářů
        if (currentPagePath.includes('/src/views/create.html')) {
            console.log('Initializing create.html page with FormView and FormController');
            
            try {
                // Import FormView a FormController
                const { FormView } = await import('./views/FormView.js');
                const { FormController } = await import('./controllers/FormController.js');
                
                // Inicializace View a Controller
                const formContainer = document.querySelector('.form-container');
                if (!formContainer) {
                    throw new Error('Form container not found on create.html page');
                }
                
                const formView = new FormView(formContainer);
                const formController = new FormController(formView);
                
                // Přidání instance do App pro případnou pozdější manipulaci
                App.controllers.formController = formController;
                
                console.log('Create form page successfully initialized');
            } catch (error) {
                console.error('Failed to initialize create.html page:', error);
            }
        }
        
        // Inicializace stránky pro zobrazení formuláře
        else if (currentPagePath.includes('/src/views/form.html')) {
            console.log('Initializing form.html page with FormResponseView and FormResponseController');
            
            try {
                // Import FormResponseView a FormResponseController
                const { FormResponseView } = await import('./views/FormResponseView.js');
                const { FormResponseController } = await import('./controllers/FormResponseController.js');
                
                // Inicializace View a Controller
                const mainContainer = document.querySelector('main');
                if (!mainContainer) {
                    throw new Error('Main container not found on form.html page');
                }
                
                const formResponseView = new FormResponseView(mainContainer);
                const formResponseController = new FormResponseController(formResponseView);
                
                // Přidání instance do App pro případnou pozdější manipulaci
                App.controllers.formResponseController = formResponseController;
                
                console.log('Form response page successfully initialized');
            } catch (error) {
                console.error('Failed to initialize form.html page:', error);
            }
        }
        
        // Inicializace stránky pro administraci formuláře
        else if (currentPagePath.includes('/src/views/admin.html')) {
            console.log('Initializing admin.html page with AdminView and AdminController');
            
            try {
                // Import AdminView a AdminController
                const { AdminView } = await import('./views/AdminView.js');
                const { AdminController } = await import('./controllers/AdminController.js');
                
                // Inicializace View a Controller
                const mainContainer = document.querySelector('main');
                if (!mainContainer) {
                    throw new Error('Main container not found on admin.html page');
                }
                
                const adminView = new AdminView(mainContainer);
                const adminController = new AdminController(adminView);
                
                // Přidání instance do App pro případnou pozdější manipulaci
                App.controllers.adminController = adminController;
                
                console.log('Admin page successfully initialized');
            } catch (error) {
                console.error('Failed to initialize admin.html page:', error);
            }
        }
        
        // Inicializace stránky pro náhled formuláře
        else if (currentPagePath.includes('/src/views/preview.html')) {
            console.log('Initializing preview.html page with FormPreviewView and FormPreviewController');
            
            try {
                // Import FormPreviewView a FormPreviewController
                const { FormPreviewView } = await import('./views/FormPreviewView.js');
                const { FormPreviewController } = await import('./controllers/FormPreviewController.js');
                
                // Inicializace View a Controller
                const mainContainer = document.querySelector('main');
                if (!mainContainer) {
                    throw new Error('Main container not found on preview.html page');
                }
                
                const formPreviewView = new FormPreviewView(mainContainer);
                const formPreviewController = new FormPreviewController(formPreviewView);
                
                // Přidání instance do App pro případnou pozdější manipulaci
                App.controllers.formPreviewController = formPreviewController;
                
                console.log('Form preview page successfully initialized');
            } catch (error) {
                console.error('Failed to initialize preview.html page:', error);
            }
        } else {
            console.log('Current page is not a special view page');
        }
        
    } catch (error) {
        console.error('Error during application initialization:', error);
    }
});