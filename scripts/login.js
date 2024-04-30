async function register(username, password, gameplayData) {
    try {
        const response = await fetch('http://localhost:3002/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                gameplayData
            })
        });
        const data = await response.json();
        if (data.userId) {
            localStorage.setItem('userId', data.userId);
        }
        return data;
    } catch (error) {
        console.error('Error registering user:', error);
        return { error: 'Internal server error' };
    }
}

async function login(username, password) {
    try {
        const response = await fetch('http://localhost:3002/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();
        if (data.userId) {
            localStorage.setItem('userId', data.userId);
        }
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        return { error: 'Internal server error' };
    }
}

async function fetchGameData(userId) {
    try {
        const response = await fetch(`http://localhost:3002/api/user/${userId}/gameData`);
        const data = await response.json();
        return data.gameplayData;
    } catch (error) {
        console.error('Error fetching gameData:', error);
        return { error: 'Internal server error' };
    }
}

function applyLoginLogic(){
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const response = await login(username, password);
        if (response.error) {
            document.getElementById('loginMessage').textContent = response.error;
        } else {
            console.log('Login successful');
            console.log(response);

            const userId = response.userId;
            localStorage.setItem('user', userId);
            const gameData = await fetchGameData(localStorage.getItem("user"));
            if (gameData.error) {
                console.error('Error fetching gameData:', gameData.error);
            } else {
                player.loadGameData(gameData);
                console.log('GameData fetched and stored:', gameData);
                postAuthentication();
            }
        }
    });
}

function applyRegisterLogic(){
    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const gameplayData = player.gatherGameData();

        const response = await register(username, password, gameplayData);
        if (response.error) {
            document.getElementById('registerMessage').textContent = response.error;
        } else {
            const userId = response.userId;
            localStorage.setItem('user', userId);
            console.log('Registration successful');
            console.log(response);
            postAuthentication();
        }
    });
}

async function updateGameData(userId, updatedGameData) {
    try {
        const response = await fetch(`http://localhost:3002/api/user/${userId}/gameData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedGameData)
        });
        const data = await response.json();
        console.log(data.message); 
    } catch (error) {
        console.error('Error updating game data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');

    function toggleAuthContainer() {
        const authContainer = document.querySelector('.authContainer');

        if (!authContainer) {
            createAuthContainer();
        } else {
            authContainer.remove();
        }
    }

    function createAuthContainer() {
        const authContainer = document.createElement('div');
        authContainer.classList.add('authContainer');

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.id ='closeAuthContainer';
        closeButton.addEventListener('click', toggleAuthContainer);

        const loginForm = createLoginForm();

        authContainer.appendChild(closeButton);
        authContainer.appendChild(loginForm);
        document.querySelector(`.upgradeContainer`).appendChild(authContainer);
        applyLoginLogic();
    }

    loginButton.addEventListener('click', toggleAuthContainer);
});

function createLoginForm() {
    const loginForm = document.createElement('form');
    loginForm.id = 'loginForm';

    const header = document.createElement('h2');
    header.textContent = "Login";

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'loginUsername';
    usernameInput.placeholder = 'Username';
    usernameInput.required = true;

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'loginPassword';
    passwordInput.placeholder = 'Password';
    passwordInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Login';

    const switchToRegisterButton = document.createElement('button');
    switchToRegisterButton.textContent = 'Switch to Register';
    switchToRegisterButton.addEventListener('click', () => {
        const authContainer = document.querySelector('.authContainer');
        const loginForm = document.getElementById('loginForm');
        authContainer.removeChild(loginForm);
        const registerForm = createRegisterForm();
        authContainer.appendChild(registerForm);
        applyRegisterLogic();
    });

    const loginMessage = document.createElement('div');
    loginMessage.id = "loginMessage";

    loginForm.appendChild(header);
    loginForm.appendChild(usernameInput);
    loginForm.appendChild(passwordInput);
    loginForm.appendChild(loginMessage);
    loginForm.appendChild(submitButton);
    loginForm.appendChild(switchToRegisterButton);

    return loginForm;
}

function createRegisterForm() {
    const registerForm = document.createElement('form');
    registerForm.id = 'registerForm';

    const header = document.createElement('h2');
    header.textContent = "Register";
    
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'registerUsername';
    usernameInput.placeholder = 'Username';
    usernameInput.required = true;

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'registerPassword';
    passwordInput.placeholder = 'Password';
    passwordInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Register';

    const switchToLoginButton = document.createElement('button');
    switchToLoginButton.textContent = 'Switch to Login';
    switchToLoginButton.addEventListener('click', () => {
        const authContainer = document.querySelector('.authContainer');
        const registerForm = document.getElementById('registerForm');
        authContainer.removeChild(registerForm);
        const loginForm = createLoginForm();
        authContainer.appendChild(loginForm);
        applyLoginLogic();
    });

    const registerMessage = document.createElement('div');
    registerMessage.id = "registerMessage";

    registerForm.appendChild(header);
    registerForm.appendChild(usernameInput);
    registerForm.appendChild(passwordInput);
    registerForm.appendChild(registerMessage)
    registerForm.appendChild(submitButton);
    registerForm.appendChild(switchToLoginButton);
    return registerForm;
}

function postAuthentication(){
    let authContainer = document.querySelector(".authContainer");
    authContainer.remove();
    const userId = localStorage.getItem('userId');
    if (userId) {
        replaceLoginWithUsername(userId);
    }
}

async function fetchUsername(userId) {
    try {
        const response = await fetch(`http://localhost:3002/api/user/${userId}/username`);
        const data = await response.json();
        if (data.username) {
            return data.username;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching username:', error);
        return null;
    }
}

async function replaceLoginWithUsername(userId) {
    const username = await fetchUsername(userId);
    if (username) {
        const header = document.querySelector('header');
        header.innerHTML = `<div>Geometry Clicker</div> <div class="userDetails">${username}</div>`;
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.classList.add("logoutButton");
        logoutButton.addEventListener('click', () => {
            player.autoUpdate();
            localStorage.removeItem('userId');
            location.reload();
        });
        header.appendChild(logoutButton);
    }
}
