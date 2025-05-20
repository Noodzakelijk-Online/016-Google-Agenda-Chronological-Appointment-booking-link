/**
 * Chrome Extension for Appointment Sorting
 * 
 * This content script automatically rearranges appointment times in chronological order,
 * from shortest to longest duration on noodzakelijkonline.nl and Google Agenda appointment scheduler.
 */

// Configuration
const config = {
  // Debounce time in milliseconds to avoid excessive re-sorting
  debounceTime: 100,
  
  // Selectors for different platforms
  selectors: {
    // noodzakelijkonline.nl selectors
    noodzakelijk: {
      // Container that holds all appointment cards
      container: '.appointments-container, .appointment-list, .card-container',
      // Individual appointment cards
      items: '.card, .appointment-card, .appointment-option',
      // Fallback if specific selectors don't match
      fallbackContainer: 'body',
    },
    
    // Google Agenda selectors (estimated based on common patterns)
    googleAgenda: {
      // Container that holds all appointment options
      container: '.appointment-options, .time-slots-container, .gm-appointment-list',
      // Individual appointment options
      items: '.appointment-option, .time-slot-item, .gm-appointment-item',
      // Fallback if specific selectors don't match
      fallbackContainer: 'body',
    }
  },
  
  // Domains to activate the extension on
  domains: [
    'noodzakelijkonline.nl',
    'calendar.google.com'
  ]
};

// Global variables
let debounceTimer = null;
let observer = null;

/**
 * Extract duration in minutes from an appointment element
 * @param {HTMLElement} element - The appointment element
 * @returns {number} - Duration in minutes, or Infinity if not found
 */
function extractDuration(element) {
  if (!element) return Infinity;
  
  // Get all text content from the element
  const text = element.textContent || '';
  
  // Try to find duration using various patterns
  
  // Pattern 1: "NO X" format (like "NO 30")
  const headerMatch = text.match(/NO\s+(\d+)/i);
  if (headerMatch && headerMatch[1]) {
    return parseInt(headerMatch[1], 10);
  }
  
  // Pattern 2: "X minutes" or "X minuten" format
  const minutesMatch = text.match(/(\d+)\s*(minutes|minuten)/i);
  if (minutesMatch && minutesMatch[1]) {
    return parseInt(minutesMatch[1], 10);
  }
  
  // Pattern 3: Just look for numbers followed by "min"
  const minMatch = text.match(/(\d+)\s*min/i);
  if (minMatch && minMatch[1]) {
    return parseInt(minMatch[1], 10);
  }
  
  // Pattern 4: Just find any number in the text (last resort)
  const numberMatch = text.match(/\d+/);
  if (numberMatch) {
    return parseInt(numberMatch[0], 10);
  }
  
  // If no duration found, return Infinity to place at the end
  return Infinity;
}

/**
 * Sort appointment elements by duration (shortest to longest)
 * @param {HTMLElement} container - The container element holding appointments
 * @param {string} itemSelector - Selector for individual appointment items
 */
function sortAppointments(container, itemSelector) {
  if (!container) return;
  
  // Get all appointment elements
  const items = Array.from(container.querySelectorAll(itemSelector));
  if (items.length <= 1) return; // No need to sort if 0 or 1 items
  
  // Create array of [element, duration] pairs
  const itemsWithDuration = items.map(item => {
    return [item, extractDuration(item)];
  });
  
  // Sort by duration (ascending)
  itemsWithDuration.sort((a, b) => a[1] - b[1]);
  
  // Reinsert elements in sorted order
  itemsWithDuration.forEach(([item]) => {
    container.appendChild(item);
  });
  
  console.log('Appointments sorted by duration (shortest to longest)');
}

/**
 * Find the appropriate container element based on selectors
 * @returns {Object} - Object containing container and itemSelector
 */
function findContainerAndSelector() {
  const domain = window.location.hostname;
  let container = null;
  let itemSelector = '';
  
  // Check if we're on noodzakelijkonline.nl
  if (domain.includes('noodzakelijkonline')) {
    // Try each selector in the noodzakelijk config
    const selectors = config.selectors.noodzakelijk;
    container = document.querySelector(selectors.container);
    itemSelector = selectors.items;
    
    // If container not found, use fallback and search for cards
    if (!container) {
      container = document.querySelector(selectors.fallbackContainer);
      // Look for any div that might contain appointment cards
      const possibleContainers = Array.from(document.querySelectorAll('div')).filter(div => {
        const children = div.children;
        return children.length >= 2 && 
               Array.from(children).some(child => child.textContent.includes('minuten') || 
                                                 child.textContent.includes('minutes'));
      });
      
      if (possibleContainers.length > 0) {
        // Use the container with the most potential appointment cards
        container = possibleContainers.reduce((a, b) => a.children.length > b.children.length ? a : b);
      }
    }
  } 
  // Check if we're on Google Calendar
  else if (domain.includes('calendar.google.com')) {
    // Try each selector in the googleAgenda config
    const selectors = config.selectors.googleAgenda;
    container = document.querySelector(selectors.container);
    itemSelector = selectors.items;
    
    // If container not found, use fallback and search for appointment options
    if (!container) {
      container = document.querySelector(selectors.fallbackContainer);
      // Look for any div that might contain appointment options
      const possibleContainers = Array.from(document.querySelectorAll('div')).filter(div => {
        const children = div.children;
        return children.length >= 2 && 
               Array.from(children).some(child => child.textContent.includes('min') || 
                                                 child.textContent.match(/\d+\s*(minutes|minuten)/i));
      });
      
      if (possibleContainers.length > 0) {
        // Use the container with the most potential appointment options
        container = possibleContainers.reduce((a, b) => a.children.length > b.children.length ? a : b);
      }
    }
  }
  
  return { container, itemSelector };
}

/**
 * Main function to sort appointments with debouncing
 */
function sortAppointmentsWithDebounce() {
  // Clear any existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  // Set a new timer
  debounceTimer = setTimeout(() => {
    const { container, itemSelector } = findContainerAndSelector();
    if (container && itemSelector) {
      sortAppointments(container, itemSelector);
    } else {
      console.log('Appointment container not found. Will retry when content changes.');
    }
  }, config.debounceTime);
}

/**
 * Set up mutation observer to watch for DOM changes
 */
function setupObserver() {
  // Disconnect any existing observer
  if (observer) {
    observer.disconnect();
  }
  
  // Find the container to observe
  const { container } = findContainerAndSelector();
  
  // If no container found, observe the body for changes
  const targetNode = container || document.body;
  
  // Create a new observer
  observer = new MutationObserver((mutations) => {
    // Check if any of the mutations involve adding nodes
    const hasAddedNodes = mutations.some(mutation => 
      mutation.type === 'childList' && mutation.addedNodes.length > 0
    );
    
    // Only trigger sort if nodes were added
    if (hasAddedNodes) {
      sortAppointmentsWithDebounce();
    }
  });
  
  // Start observing
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
  
  console.log('Mutation observer set up to detect new appointments');
}

/**
 * Initialize the extension
 */
function init() {
  // Check if we're on a supported domain
  const currentDomain = window.location.hostname;
  const isSupported = config.domains.some(domain => currentDomain.includes(domain));
  
  if (!isSupported) {
    console.log('Not on a supported domain. Extension inactive.');
    return;
  }
  
  console.log('Appointment Sorter Extension initialized');
  
  // Initial sort
  sortAppointmentsWithDebounce();
  
  // Set up observer for dynamic content
  setupObserver();
  
  // Also sort when page is fully loaded
  window.addEventListener('load', sortAppointmentsWithDebounce);
}

// Start the extension
init();
