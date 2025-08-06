// Global variables to hold web3, contract instance, and user account
let web3;
let contract;
let userAccount;

// DOM Elements
const voteContainer = document.getElementById('vote-container');
const resultsList = document.getElementById('results-list');
const statusElement = document.getElementById('status');
const loadingOverlay = document.getElementById('loading-overlay');

// --- IMPORTANT ---
// Replace this with your deployed smart contract address
const contractAddress = '(contractaddress)';

// Your Contract's ABI (Application Binary Interface)
const contractABI = [
    {
        "inputs": [{ "internalType": "string[]", "name": "candidateNames", "type": "string[]" }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "candidateIndex", "type": "uint256" }],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "candidates",
        "outputs": [
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNumCandidates",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];


// Main function executed on window load
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Initialize Web3 and connect to MetaMask
            web3 = new Web3(window.ethereum);
            
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            console.log('MetaMask connected:', userAccount);

            // Create contract instance
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log('Contract instance created:', contract);

            // Dynamically build the UI and fetch initial results
            await initializeUI();

        } catch (error) {
            console.error('User denied account access or error occurred:', error);
            updateStatus('Please connect MetaMask to use this app.', true);
        }
    } else {
        updateStatus('MetaMask is not installed. Please install it to continue.', true);
        alert('Please install MetaMask!');
    }
});

/**
 * Builds the UI by fetching candidates from the smart contract and creating vote buttons.
 */
async function initializeUI() {
    try {
        updateStatus('Loading candidates from the blockchain...');
        const numCandidates = await contract.methods.getNumCandidates().call();
        
        // Clear any existing buttons
        voteContainer.innerHTML = ''; 

        for (let i = 0; i < numCandidates; i++) {
            const candidate = await contract.methods.candidates(i).call();
            const button = document.createElement('button');
            button.textContent = candidate.name;
            button.onclick = () => vote(i);
            voteContainer.appendChild(button);
        }

        updateStatus('Ready to cast your vote.', false, 3000);

        // Fetch initial vote counts
        await fetchVotes();

    } catch (error) {
        console.error('Error initializing UI:', error);
        updateStatus('Could not load candidate data from the contract.', true);
    }
}

/**
 * Fetches and displays the current vote counts for all candidates.
 */
async function fetchVotes() {
    resultsList.innerHTML = '<li>Loading results...</li>';

    try {
        const numCandidates = await contract.methods.getNumCandidates().call();
        const candidatePromises = [];

        for (let i = 0; i < numCandidates; i++) {
            candidatePromises.push(contract.methods.candidates(i).call());
        }
        
        const candidates = await Promise.all(candidatePromises);

        // Display results
        resultsList.innerHTML = '';
        if (candidates.length === 0) {
            resultsList.innerHTML = '<li>No candidates found.</li>';
            return;
        }

        candidates.forEach(candidate => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${candidate.name}</span> <strong>${candidate.voteCount} votes</strong>`;
            resultsList.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching live votes:', error);
        resultsList.innerHTML = '<li>Failed to load live results.</li>';
    }
}

/**
 * Handles the voting process for a selected candidate.
 * @param {number} candidateIndex - The index of the candidate to vote for.
 */
async function vote(candidateIndex) {
    showLoading(true);
    setButtonsEnabled(false);
    updateStatus('Please confirm the transaction in MetaMask...');

    try {
        await contract.methods.vote(candidateIndex).send({ from: userAccount });
        updateStatus('Vote cast successfully! Updating results...', false, 4000);
        
        // Refresh the vote counts after a successful vote
        await fetchVotes();

    } catch (error) {
        console.error('Error casting vote:', error);
        // Check for common user-initiated errors
        if (error.code === 4001) { // User rejected the transaction
            updateStatus('Transaction was rejected.', true);
        } else {
            updateStatus('Error casting vote. See console for details.', true);
        }
    } finally {
        // Ensure loading overlay is hidden and buttons are re-enabled
        showLoading(false);
        setButtonsEnabled(true);
    }
}


// --- UTILITY FUNCTIONS ---

/**
 * Updates the status message shown to the user.
 * @param {string} message - The text to display.
 * @param {boolean} isError - If true, styles the message as an error.
 * @param {number} [timeout=0] - If > 0, the message will fade after this many milliseconds.
 */
function updateStatus(message, isError = false, timeout = 0) {
    statusElement.textContent = message;
    statusElement.style.color = isError ? '#ff4d4d' : '#ffd700'; // Red for error, gold for status
    
    if (timeout > 0) {
        setTimeout(() => {
            statusElement.textContent = '';
        }, timeout);
    }
}

/**
 * Shows or hides the loading overlay.
 * @param {boolean} show - True to show the overlay, false to hide.
 */
function showLoading(show) {
    loadingOverlay.classList.toggle('hidden', !show);
}

/**
 * Enables or disables all voting buttons.
 * @param {boolean} enabled - True to enable all buttons, false to disable.
 */
function setButtonsEnabled(enabled) {
    const buttons = voteContainer.getElementsByTagName('button');
    for (const button of buttons) {
        button.disabled = !enabled;
    }
}
