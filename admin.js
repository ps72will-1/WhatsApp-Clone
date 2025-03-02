// DOM Elements
const usersTableBody = document.getElementById('users-table-body');
const totalUsersElement = document.getElementById('total-users');
const activeUsersElement = document.getElementById('active-users');
const totalMessagesElement = document.getElementById('total-messages');
const addUserBtn = document.getElementById('add-user-btn');

// Set up admin event listeners
function setupAdminEventListeners() {
    // Add user button
    addUserBtn.addEventListener('click', () => {
        const name = document.getElementById('admin-user-name').value;
        const email = document.getElementById('admin-user-email').value;
        const phone = document.getElementById('admin-user-phone').value;
        const role = document.getElementById('admin-user-role').value;
        
        if (name.trim() === '' || email.trim() === '') {
            alert('Please enter at least name and email');
            return;
        }
        
        // In a real app, this would create a user in Firebase
        // auth.createUserWithEmailAndPassword(email, 'temporary-password')
        //     .then((userCredential) => {
        //         const user = userCredential.user;
        //         
        //         // Add user profile
        //         return db.collection('users').doc(user.uid).set({
        //             name: name,
        //             email: email,
        //             phone: phone,
        //             role: role,
        //             status: 'offline',
        //             createdAt: firebase.firestore.FieldValue.serverTimestamp()
        //         });
        //     })
        //     .then(() => {
        //         // Clear form
        //         document.getElementById('admin-user-name').value = '';
        //         document.getElementById('admin-user-email').value = '';
        //         document.getElementById('admin-user-phone').value = '';
        //         document.getElementById('admin-user-role').value = 'user';
        //         
        //         alert('User added successfully');
        //         loadAdminData();
        //     })
        //     .catch((error) => {
        //         alert('Error adding user: ' + error.message);
        //     });
        
        // For demo, add to local array
        const newUser = {
            id: 'user' + (window.demoUsers.length + 1),
            name: name,
            email: email,
            phone: phone,
            status: 'offline',
            isAdmin: role === 'admin'
        };
        
        window.demoUsers.push(newUser);
        
        // Update table
        loadAdminData();
        
        // Clear form
        document.getElementById('admin-user-name').value = '';
        document.getElementById('admin-user-email').value = '';
        document.getElementById('admin-user-phone').value = '';
        document.getElementById('admin-user-role').value = 'user';
        
        alert('User added successfully');
    });
}

// Load admin data
function loadAdminData() {
    // Load users table
    usersTableBody.innerHTML = '';
    
    window.demoUsers.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'Not provided'}</td>
            <td>
                <span class="status-circle ${user.status === 'online' ? 'status-online' : 'status-offline'}"></span>
                ${user.status}
            </td>
            <td>
                <span class="admin-action edit-user" data-id="${user.id}"><i class="fas fa-edit"></i></span>
                <span class="admin-action delete-user" data-id="${user.id}"><i class="fas fa-trash"></i></span>
            </td>
        `;
        
        // Add event listeners
        row.querySelector('.edit-user').addEventListener('click', () => {
            alert(`This would open an edit form for user: ${user.name}`);
        });
        
        row.querySelector('.delete-user').addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete user: ${user.name}?`)) {
                // In a real app, this would delete from Firebase
                // db.collection('users').doc(user.id).delete()
                //     .then(() => {
                //         // Also delete from auth if possible
                //         // This would typically be done in a Cloud Function
                //         alert('User deleted successfully');
                //         loadAdminData();
                //     })
                //     .catch((error) => {
                //         alert('Error deleting user: ' + error.message);
                //     });
                
                // For demo, remove from local array
                const index = window.demoUsers.findIndex(u => u.id === user.id);
                if (index !== -1) {
                    window.demoUsers.splice(index, 1);
                    loadAdminData();
                }
            }
        });
        
        usersTableBody.appendChild(row);
    });
    
    // Update statistics
    totalUsersElement.textContent = window.demoUsers.length;
    activeUsersElement.textContent = window.demoUsers.filter(u => u.status === 'online').length;
    totalMessagesElement.textContent = '124'; // Demo value
}

// Export functions
window.setupAdminEventListeners = setupAdminEventListeners;
window.loadAdminData = loadAdminData;