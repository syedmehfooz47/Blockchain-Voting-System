window.addEventListener('load', async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        try {
            // Request MetaMask connection
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('MetaMask connected');
            
            // Create a Web3 instance
            const web3 = new Web3(window.ethereum);
            
            // Contract Address and ABI
            const contractAddress = '(contractaddress)';
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

            // Create contract instance
            window.contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log('Contract instance created:', window.contract);

            // Fetch live results on page load
            fetchVotes();
        } catch (error) {
            console.error('User denied account access', error);
            document.getElementById('status').innerText = 'User denied account access. Please try again.';
        }
    } else {
        alert('Please install MetaMask!');
    }
});

// Fetch live votes for all candidates
async function fetchVotes() {
    const resultsElement = document.getElementById('results-list');
    resultsElement.innerHTML = 'Loading votes...';

    try {
        const numCandidates = await window.contract.methods.getNumCandidates().call();
        const candidateResults = [];

        // Fetch vote count for each candidate
        for (let i = 0; i < numCandidates; i++) {
            const candidate = await window.contract.methods.candidates(i).call();
            candidateResults.push({ name: candidate.name, voteCount: candidate.voteCount });
        }

        // Display live vote results
        resultsElement.innerHTML = '';
        candidateResults.forEach((candidate, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${candidate.name}: ${candidate.voteCount} votes`;
            resultsElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching live votes:', error);
        resultsElement.innerHTML = 'Failed to load live results.';
    }
}

// Function to vote for a candidate
async function vote(candidateIndex) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const sender = accounts[0];
    const statusElement = document.getElementById('status');

    try {
        await window.contract.methods.vote(candidateIndex).send({ from: sender });
        statusElement.innerText = 'Vote cast successfully!';

        // Fetch live results after vote
        fetchVotes();
    } catch (error) {
        console.error('Error casting vote:', error);
        statusElement.innerText = 'Error casting vote. Please try again.';
    }
}
