document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');

    // 1. Define the HTML structure
    const uiLayout = `
        <header class="topbar">
            <div class="logo">StatusFeed</div>
            <div class="auth-actions" id="authActions">
                <button id="loginBtn" class="btn btn-outline">Log In</button>
                <button id="signupBtn" class="btn btn-solid">Sign Up</button>
            </div>
        </header>

        <main class="feed-container">
            <h2 class="feed-title">Recent Updates</h2>
            
            <div class="status-card">
                <div class="status-header">
                    <span class="username">@dev_guru</span>
                    <span class="timestamp">2h ago</span>
                </div>
                <p class="status-content">Just finished routing the new API endpoints. Everything is running smoothly! 🚀</p>
            </div>

            <div class="status-card">
                <div class="status-header">
                    <span class="username">@design_ninja</span>
                    <span class="timestamp">5h ago</span>
                </div>
                <p class="status-content">Experimenting with CSS grid for the new dashboard layout. The possibilities are endless.</p>
            </div>
        </main>

        <div id="authModal" class="modal hidden">
            <div class="modal-box">
                <span class="close-btn" id="closeModal">&times;</span>
                <h2 id="modalTitle">Welcome</h2>
                <form id="authForm">
                    <div class="input-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" placeholder="Enter your username" required>
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password" required>
                    </div>
                    <p id="authError" style="color: #e74c3c; font-size: 0.9rem; margin-bottom: 1rem; display: none;"></p>
                    <button type="submit" class="btn btn-solid full-width" id="submitBtn">Submit</button>
                </form>
            </div>
        </div>
    `;

    // 2. Inject HTML
    if (appContainer) {
        appContainer.innerHTML = uiLayout;
    } else {
        console.error("Could not find an element with id='app'");
        return;
    }

    // 3. DOM Elements
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const authForm = document.getElementById('authForm');
    const authError = document.getElementById('authError');
    const authActions = document.getElementById('authActions');

    // State to track if we are logging in or signing up
    let currentAuthMode = 'login';

    // 4. Modal Interactions
    loginBtn.addEventListener('click', () => {
        currentAuthMode = 'login';
        modalTitle.textContent = 'Log In';
        submitBtn.textContent = 'Log In';
        authError.style.display = 'none'; // Clear errors
        modal.classList.remove('hidden');
    });

    signupBtn.addEventListener('click', () => {
        currentAuthMode = 'signup';
        modalTitle.textContent = 'Create an Account';
        submitBtn.textContent = 'Sign Up';
        authError.style.display = 'none'; // Clear errors
        modal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        authForm.reset();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
            authForm.reset();
        }
    });

    // 5. User Model & LocalStorage Logic
    const UserModel = {
        getUsers: function() {
            const users = localStorage.getItem('statusFeedUsers');
            return users ? JSON.parse(users) : [];
        },
        saveUser: function(username, password) {
            const users = this.getUsers();
            // Check if user already exists
            if (users.find(u => u.username === username)) {
                return { success: false, message: 'Username already taken.' };
            }
            users.push({ username, password });
            localStorage.setItem('statusFeedUsers', JSON.stringify(users));
            return { success: true };
        },
        authenticate: function(username, password) {
            const users = this.getUsers();
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                return { success: true };
            }
            return { success: false, message: 'Invalid username or password.' };
        }
    };

    // 6. Form Submission Logic
    authForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        if (currentAuthMode === 'signup') {
            const result = UserModel.saveUser(usernameInput, passwordInput);
            if (result.success) {
                alert('Account created successfully! You can now log in.');
                modal.classList.add('hidden');
                authForm.reset();
            } else {
                authError.textContent = result.message;
                authError.style.display = 'block';
            }
        }

        else if (currentAuthMode === 'login') {
            const result = UserModel.authenticate(usernameInput, passwordInput);
            if (result.success) {
                // Update UI to show logged in state
                authActions.innerHTML = `
                    <span style="margin-right: 1rem; font-weight: 500;">Welcome, @${usernameInput}</span>
                    <button id="logoutBtn" class="btn btn-outline">Log Out</button>
                `;

                // Add logout listener to the newly created button
                document.getElementById('logoutBtn').addEventListener('click', () => {
                    location.reload(); // Simple way to reset state for prototyping
                });

                modal.classList.add('hidden');
                authForm.reset();
            } else {
                authError.textContent = result.message;
                authError.style.display = 'block';
            }
        }
    });
});