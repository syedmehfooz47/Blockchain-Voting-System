# Blockchain-Voting-System 

# 🗳️ Blockchain Voting System

A secure, transparent, and decentralized voting system powered by blockchain technology. This project ensures integrity, anonymity, and immutability of votes using Ethereum smart contracts and Web3.js.

## ✨ Features

- 🔗 **Decentralized**: Uses blockchain to ensure tamper-proof voting.
- 👀 **Transparent**: Live vote count updates for users.
- 🔒 **Secure**: Requires MetaMask for authentication and transaction approval.
- 🖥️ **User-friendly**: Simple and intuitive UI for easy voting.
- 📱 **Responsive Design**: Works on both desktop and mobile devices.

## 🛠️ Technologies Used

- 🏗️ **Frontend**: HTML, CSS, JavaScript
- ⚙️ **Backend**: Ethereum Smart Contracts (Solidity)
- 📜 **Blockchain Library**: Web3.js
- 🔐 **Wallet Integration**: MetaMask

## 🚀 Installation & Setup

### 📌 Prerequisites
- Install [MetaMask](https://metamask.io/) browser extension.
- Install [Node.js](https://nodejs.org/) and npm.
- Install [Ganache](https://trufflesuite.com/ganache/) for local blockchain testing.
- Install [Truffle](https://www.trufflesuite.com/) for smart contract development.

### 📥 Clone the Repository
```sh
 git clone https://github.com/yourusername/blockchain-voting-system.git
 cd blockchain-voting-system
```

### 📦 Install Dependencies
```sh
 npm install
```

### ⚡ Deploy Smart Contract
1. Start Ganache.
2. Compile and deploy the contract:
```sh
 truffle migrate --reset
```
3. Copy the deployed contract address and update `script.js` accordingly.

### ▶️ Run the Application
```sh
 npm start
```

## 🎯 Usage
1. 🦊 Connect MetaMask and select your Ethereum account.
2. ✅ Choose your candidate and submit your vote.
3. 📊 See live vote updates instantly.

## 📂 Project Structure
```
blockchain-voting-system/
│── contracts/            # Solidity Smart Contracts
│── migrations/           # Deployment scripts
│── src/
│   ├── index.html        # Frontend UI
│   ├── style.css         # Styling
│   ├── script.js         # Web3.js interactions
│── package.json          # Dependencies and scripts
│── truffle-config.js     # Truffle configuration
```

## 🌍 Deployment
- Deploy on Ethereum Testnet (Goerli, Sepolia, etc.)
- Use [Infura](https://infura.io/) for remote Ethereum node access.
- Update `contractAddress` in `script.js` after deployment.

## 🤝 Contribution
Feel free to contribute by forking the repo, making changes, and submitting pull requests.

## 📜 License
This project is licensed under the MIT License.

## 👨‍💻 Authors
- [Syed Mehfooz C S](https://github.com/syedmehfooz47)
- [Zeeshan Yalakapalli](https://github.com/zeeshan8088)

