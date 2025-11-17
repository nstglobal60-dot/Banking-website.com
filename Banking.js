// Simple front-end simulation of banking app

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');
const contentArea = document.getElementById('content-area');
const navDashboard = document.getElementById('nav-dashboard');
const navTransfer = document.getElementById('nav-transfer');
const navBills = document.getElementById('nav-bills');
const navHistory = document.getElementById('nav-history');
const navSettings = document.getElementById('nav-settings');
const navLogout = document.getElementById('nav-logout');

let currentUser = null;
let users = [];
let transactions = [];

// Toggle Forms
showRegister.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLogin.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Registration
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if(password !== confirmPassword){
        alert("Passwords do not match!");
        return;
    }

    users.push({name, email, password, balance: 1000});
    alert("Registration successful! Please login.");
    registerForm.reset();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);
    if(user){
        currentUser = user;
        authContainer.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadDashboard();
    } else {
        alert("Invalid credentials!");
    }
});

// Navigation
navDashboard.addEventListener('click', loadDashboard);
navTransfer.addEventListener('click', loadTransfer);
navBills.addEventListener('click', loadBills);
navHistory.addEventListener('click', loadHistory);
navSettings.addEventListener('click', loadSettings);
navLogout.addEventListener('click', () => {
    currentUser = null;
    dashboard.classList.add('hidden');
    authContainer.classList.remove('hidden');
});

// Load Sections
function loadDashboard(){
    contentArea.innerHTML = `
        <section>
            <h2>Welcome, ${currentUser.name}</h2>
            <p><strong>Account Balance:</strong> $${currentUser.balance.toFixed(2)}</p>
            <p><strong>Account Number:</strong> 1234567890</p>
        </section>
    `;
}

function loadTransfer(){
    contentArea.innerHTML = `
        <section>
            <h2>Transfer Funds</h2>
            <input type="text" id="recipient" placeholder="Recipient Name">
            <input type="text" id="account-number" placeholder="Account Number">
            <input type="number" id="amount" placeholder="Amount">
            <textarea id="description" placeholder="Description"></textarea>
            <button id="transfer-btn">Transfer</button>
        </section>
    `;
    document.getElementById('transfer-btn').addEventListener('click', () => {
        const recipient = document.getElementById('recipient').value;
        const accountNumber = document.getElementById('account-number').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;

        if(amount > currentUser.balance){
            alert("Insufficient balance!");
            return;
        }

        currentUser.balance -= amount;
        transactions.push({type:"Transfer", recipient, amount, description, date: new Date().toLocaleString()});
        alert("Transfer successful!");
        loadDashboard();
    });
}

function loadBills(){
    contentArea.innerHTML = `
        <section>
            <h2>Pay Bills</h2>
            <select id="bill-type">
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Internet">Internet</option>
                <option value="Insurance">Insurance</option>
            </select>
            <input type="number" id="bill-amount" placeholder="Amount">
            <button id="pay-bill-btn">Pay Bill</button>
        </section>
    `;
    document.getElementById('pay-bill-btn').addEventListener('click', () => {
        const type = document.getElementById('bill-type').value;
        const amount = parseFloat(document.getElementById('bill-amount').value);
        if(amount > currentUser.balance){
            alert("Insufficient balance!");
            return;
        }
        currentUser.balance -= amount;
        transactions.push({type:"Bill Payment", recipient:type, amount, description: type + " Bill", date: new Date().toLocaleString()});
        alert("Bill paid successfully!");
        loadDashboard();
    });
}

function loadHistory(){
    let tableHTML = `
        <section>
            <h2>Transaction History</h2>
            <table>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Recipient</th>
                    <th>Amount</th>
                    <th>Description</th>
                </tr>
    `;
    transactions.forEach(tx => {
        tableHTML += `
            <tr>
                <td>${tx.date}</td>
                <td>${tx.type}</td>
                <td>${tx.recipient}</td>
                <td>$${tx.amount.toFixed(2)}</td>
                <td>${tx.description}</td>
            </tr>
        `;
    });
    tableHTML += `</table></section>`;
    contentArea.innerHTML = tableHTML;
}

function loadSettings(){
    contentArea.innerHTML = `
        <section>
            <h2>Settings</h2>
            <p><strong>Name:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <button id="change-password-btn">Change Password</button>
        </section>
    `;
    document.getElementById('change-password-btn').addEventListener('click', () => {
        const newPassword = prompt("Enter new password:");
        if(newPassword) currentUser.password = newPassword;
        alert("Password updated!");
    });
}
