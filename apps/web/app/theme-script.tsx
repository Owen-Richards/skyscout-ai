/**
 * Theme initialization script
 * Prevents FOUC (Flash of Unstyled Content) by applying theme before hydration
 */

export function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('skyscout-theme') || 'system';
        var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        var resolvedTheme = theme === 'system' ? systemTheme : theme;
        
        // Force immediate rendering with no transitions
        var style = document.createElement('style');
        style.innerHTML = '* { transition: none !important; animation: none !important; }';
        document.head.appendChild(style);
        
        // Apply theme immediately
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolvedTheme);
        
        // Set color-scheme immediately
        document.documentElement.style.setProperty('color-scheme', resolvedTheme);
        
        // Update meta theme-color
        var metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0f172a' : '#ffffff');
        }
        
        // Set attribute for CSS styling
        document.documentElement.setAttribute('data-theme', resolvedTheme);
        
        // Remove the no-transition style after a minimal delay
        setTimeout(function() {
          document.head.removeChild(style);
        }, 1);
      } catch (e) {
        // Fallback to light theme
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.setProperty('color-scheme', 'light');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
