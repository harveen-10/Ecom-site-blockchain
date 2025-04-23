## SHOP SPHERE

# Description
Shop Sphere is a modern, full-stack e-commerce web application that replicates the online shopping experience with enhanced features such as blockchain-powered payments and a loyalty points system. 

Users can securely sign up, browse a curated catalog of products, manage their shopping cart, and complete a mock checkout. The platform is designed to explore seamless integration of Web3 technologies with everyday e-commerce functionality.


# Features
USER AUTHENTICATION: Secure user registration and login using hashed passwords with bcrypt, enabling personalized access to cart, likes, and loyalty points.

HOME PAGE: A welcoming landing page that displays a variety of products.

SHOPPING CART: A dynamic cart system where users can add products, adjust quantities, or remove items. The cart updates in real time as items are added or changed.

BLOCKCHAIN-POWERED PAYMENT: Integration of blockchain technology simulates secure, transparent payments using smart contracts and cryptocurrency wallets. This feature provides a decentralized payment option during checkout, ideal for Web3 applications.

LOYALTY POINTS SYSTEM: Users earn loyalty points based on their purchase activity. These points can be redeemed during future purchases, encouraging repeat shopping and improving user retention.

SEARCH FUNCTIONALITY: Implemented a search bar where users can enter keywords to find specific products.

FILTER: Allow users to filter products based on categories (e.g., clothing, electronics, home decor).

UPVOTES: Added a “like” button to each product card. Displays the total number of likes for each product. Users can click the button to express their preference for a product.


# Technologies Used
React: For dynamic front-end development

Node.js: For backend server operations

PostgreSQL: For database management

Tailwind CSS: For utility-first styling

bcrypt: For secure password hashing

Solidity: For writing smart contracts that handle blockchain-based payments

ethers.js: To connect the frontend with the blockchain and interact with deployed smart contracts


# Setup/Installation
react:
Install Node.js (includes npm).
Create a new React project:
```bash
npx create-react-app your-app-name
```


node.js:
Download and install Node.js from the official website.
Use npm init in your project directory to create a package.json file.

PostgreSQL:
Download and install PostgreSQL from the official website.
Set up a new database and user for your project.

Tailwind CSS:
Install Tailwind via npm: 
```bash
npm install tailwindcss
```
Follow the official guide to include it in your project.

bcrypt:
Install bcrypt with npm: <pre> ```npm install bcrypt ``` </pre>

Solidity (Smart Contract):
Smart contracts are written in Solidity using the Truffle development framework.<br>
Contracts are tested and deployed locally using Ganache, a personal Ethereum blockchain for development.<br>
Truffle Setup:
```bash
npm install -g truffle
truffle init
```
Ganache: Download and install Ganache from [trufflesuite.com/ganache](https://www.trufflesuite.com/ganache). Start the Ganache GUI or CLI to spin up a local Ethereum blockchain

Contract Deployment:
```bash
truffle compile
truffle migrate
```

ethers.js:
Install ethers with npm: <pre> ```npm install ethers ``` </pre>