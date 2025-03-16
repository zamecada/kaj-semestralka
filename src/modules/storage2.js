/**
 * Form Storage Module - modul pro ukládání a načítání formulářů
 * @module modules/storage2
 * 
 */

/**
 * Generuje unikátní ID pro formulář
 * @return {string} Unikátní ID
 */
const generateFormId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  };
  
  /**
   * Generuje PIN pro administraci formuláře
   * @param {number} length - Délka PINu
   * @return {string} Vygenerovaný PIN
   */
  const generateAdminPin = (length = 6) => {
    const digits = '0123456789';
    let pin = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      pin += digits[randomIndex];
    }
    
    return pin;
  };
  
  /**
   * Uloží formulář do localStorage
   * @param {Object} formData - Data formuláře
   * @return {Object} Uložený formulář s vygenerovaným ID a PINem
   */
  export const saveForm = (formData) => {
    const formId = generateFormId();
    const adminPin = generateAdminPin();
    
    const completeForm = {
      ...formData,
      id: formId,
      adminPin,
      responses: [],
      createdAt: new Date().toISOString()
    };
    
    // Načtení existujících formulářů
    const existingForms = JSON.parse(localStorage.getItem('forms') || '[]');
    
    // Přidání nového formuláře
    existingForms.push(completeForm);
    
    // Uložení do localStorage
    localStorage.setItem('forms', JSON.stringify(existingForms));
    
    return completeForm;
  };
  
  /**
   * Načte formulář z localStorage podle ID
   * @param {string} formId - ID formuláře
   * @return {Object|null} Data formuláře nebo null, pokud formulář neexistuje
   */
  export const getForm = (formId) => {
    const forms = JSON.parse(localStorage.getItem('forms') || '[]');
    return forms.find(form => form.id === formId) || null;
  };
  
  /**
   * Přidá novou odpověď k formuláři
   * @param {string} formId - ID formuláře
   * @param {Object} responseData - Data odpovědi
   * @return {boolean} Úspěch operace
   */
  export const addResponse = (formId, responseData) => {
    const forms = JSON.parse(localStorage.getItem('forms') || '[]');
    const formIndex = forms.findIndex(form => form.id === formId);
    
    if (formIndex === -1) {
      return false;
    }
    
    const response = {
      id: generateFormId(),
      ...responseData,
      createdAt: new Date().toISOString()
    };
    
    forms[formIndex].responses.push(response);
    localStorage.setItem('forms', JSON.stringify(forms));
    
    return true;
  };
  
  /**
   * Vrátí seznam všech formulářů
   * @return {Array} Seznam formulářů
   */
  export const getAllForms = () => {
    return JSON.parse(localStorage.getItem('forms') || '[]');
  };
  
  export default {
    saveForm,
    getForm,
    addResponse,
    getAllForms
  };