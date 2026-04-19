/**
 * Anti-Inspect Utility
 * Provides measures to discourage the use of browser developer tools.
 */

export const initAntiInspect = () => {
  // 1. Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  }, false);

  // 2. Disable common developer tool shortcuts
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
    }
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
    }
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
    }
  }, false);

  // 3. DevTools Detection
  // We use a trick: debugger statements pause execution if DevTools is open.
  // We can also check the difference between innerWidth and outerWidth,
  // though this is less reliable in modern browsers.
  
  const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      return true;
    }
    return false;
  };

  // Periodically check for DevTools and clear console or distract
  setInterval(() => {
    if (detectDevTools()) {
      console.clear();
      console.log('%c STOP!', 'color: red; font-size: 40px font-weight: bold; text-align: center;');
      console.log('%cDeveloper tools are disabled for security reasons.', 'color: red; font-size: 20px;');
      
      // Optional: infinite debugger loop to freeze the tab if DevTools is open
      // (Use with caution as it can be very annoying)
      // debugger; 
    }
  }, 1000);

  // Use a proxy to detect when a getter is called (often happens when DevTools is open)
  const devtools = {
    isOpen: false,
    orientation: undefined
  };
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function () {
      devtools.isOpen = true;
      return 'devtools';
    }
  });

  setInterval(() => {
    devtools.isOpen = false;
    console.log(element);
    if (devtools.isOpen) {
      console.clear();
      console.warn('DevTools detected. Please close it to continue using the application.');
    }
  }, 1000);
};
