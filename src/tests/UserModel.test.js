// Assuming UserModel is imported from your main file
// const { UserModel } = require('./UserModel');

// For the sake of this test file being self-contained, here is the model:
const UserModel = {
    getUsers: function() {
        const users = localStorage.getItem('statusFeedUsers');
        return users ? JSON.parse(users) : [];
    },
    saveUser: function(username, password) {
        const users = this.getUsers();
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

describe('UserModel Authentication Logic', () => {

    // Clear localStorage before each test to ensure a clean slate
    beforeEach(() => {
        localStorage.clear();
    });

    test('should successfully create a new user and store it in localStorage', () => {
        // 1. Action: Save a new user
        const response = UserModel.saveUser('testuser', 'securePassword123');

        // 2. Assertions: Check the returned response
        expect(response.success).toBe(true);

        // 3. Assertions: Check that localStorage actually updated
        const storedUsers = JSON.parse(localStorage.getItem('statusFeedUsers'));
        expect(storedUsers).toHaveLength(1);
        expect(storedUsers[0].username).toBe('testuser');
        expect(storedUsers[0].password).toBe('securePassword123');
    });

    test('should fail to create a user if the username already exists', () => {
        // 1. Setup: Create the initial user
        UserModel.saveUser('testuser', 'securePassword123');

        // 2. Action: Try to create a user with the same username
        const duplicateResponse = UserModel.saveUser('testuser', 'differentPassword');

        // 3. Assertions: Check that it failed
        expect(duplicateResponse.success).toBe(false);
        expect(duplicateResponse.message).toBe('Username already taken.');

        // Ensure localStorage wasn't updated with a duplicate
        const storedUsers = JSON.parse(localStorage.getItem('statusFeedUsers'));
        expect(storedUsers).toHaveLength(1);
    });

    test('should successfully log in with correct credentials', () => {
        // 1. Setup: Create a user
        UserModel.saveUser('testuser', 'securePassword123');

        // 2. Action: Authenticate with the correct credentials
        const loginResponse = UserModel.authenticate('testuser', 'securePassword123');

        // 3. Assertions
        expect(loginResponse.success).toBe(true);
    });

    test('should fail to log in with an incorrect password', () => {
        // 1. Setup: Create a user
        UserModel.saveUser('testuser', 'securePassword123');

        // 2. Action: Authenticate with the WRONG password
        const loginResponse = UserModel.authenticate('testuser', 'wrongPassword');

        // 3. Assertions
        expect(loginResponse.success).toBe(false);
        expect(loginResponse.message).toBe('Invalid username or password.');
    });
});