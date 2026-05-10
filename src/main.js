document.addEventListener('DOMContentLoaded', () => {
    // 1. Target the root element in your HTML (e.g., <div id="app"></div>)
    const appContainer = document.getElementById('app');

    // 2. Define the HTML structure
    const uiLayout = `
        <header class="topbar">
            <div class="logo">StatusFeed</div>
            <div class="auth-actions">
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
                <form id="authForm" onsubmit="event.preventDefault();">
                    <div class="input-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" placeholder="Enter your username" required>
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="btn btn-solid full-width" id="submitBtn">Submit</button>
                </form>
            </div>
        </div>
    `;

    // 3. Inject HTML into the DOM
    if (appContainer) {
        appContainer.innerHTML = uiLayout;
    } else {
        console.error("Could not find an element with id='app' to inject the UI.");
        return;
    }

    // 4. Modal Interactions
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');

    // Open Login
    loginBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Log In';
        submitBtn.textContent = 'Log In';
        modal.classList.remove('hidden');
    });

    // Open Sign Up
    signupBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Create an Account';
        submitBtn.textContent = 'Sign Up';
        modal.classList.remove('hidden');
    });

    // Close Modal via X button
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close Modal by clicking the dark overlay outside the box
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
});