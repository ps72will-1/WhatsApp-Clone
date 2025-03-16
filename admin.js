// Admin Module
const Admin = (function() {
    // DOM Elements
    const adminPanel = document.getElementById('admin-panel');
    const toggleAdminSidebar = document.getElementById('toggle-admin-sidebar');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    
    // Initialize event listeners
    function init() {
        toggleAdminSidebar.addEventListener('click', toggleSidebarHandler);
        adminLogoutBtn.addEventListener('click', () => {
            adminPanel.classList.add('hidden');
            document.getElementById('auth-screen').classList.remove('hidden');
            Utilities.showToast('Admin logged out successfully', 'success');
        });
        
        // Add click handlers for admin navigation items
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all nav items
                document.querySelectorAll('.admin-nav-item').forEach(navItem => {
                    navItem.classList.remove('active', 'bg-gray-800', 'text-white');
                    navItem.classList.add('text-gray-300');
                });
                
                // Add active class to clicked item
                this.classList.add('active', 'bg-gray-800', 'text-white');
                this.classList.remove('text-gray-300');
                
                // In a real app, we would load different admin views here
                Utilities.showToast('Navigation clicked: ' + this.querySelector('span').textContent, 'info');
            });
        });
    }
    
    // Toggle admin sidebar
    function toggleSidebarHandler() {
        adminPanel.classList.toggle('admin-hidden-sidebar');
    }
    
    // Public API
    return {
        init
    };
})();

// Initialize Admin module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // This will be called from app.js to avoid initialization order issues
});