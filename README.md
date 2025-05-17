# MemeBuilder(ai)

## 🧠 Overview

**MemeBuilder(ai)** is a modular, no-code token launch framework for DAOs on **Solana**.  
It empowers DAO members to **propose, vote on, fund, and launch memecoins** in a fully automated, trustless, and decentralized manner – directly on-chain.

The platform integrates optional third-party modules including:
- Personalized **AI agents**
- **KOL** (Key Opinion Leader) campaign orchestration
- **InfoFi** analytics for smart launch strategies
- **UGC** to reward top community members on Socials

The platform also provides the tools necessary to build and fund dedicated SubDAOs for each token launched - necessary to maintain long-term growth.

Our mission: **replace fragmented token launch processes** with a scalable system that aligns incentives, ensures transparency, and leverages smart contract automation.

---

## 🚀 Core MVP Components

### 1. Critical Features

#### 🗳 DAO Voting Mechanism
- 1 NFT/X tokens = 1 vote = predetermined investment
- Simple proposal creation and voting interface
- 5-day time-limited voting period
- Vote tracking and visualizations

#### 💰 Fund Escrow System
- Auto-locking of funds on vote
- Secure on-chain escrow contract
- Transparent fund tracking with SoftCap monitoring

#### 🛠 Token Deployment Automation
- Automatic token deployment when SoftCap is reached
- Basic tokenomics (fixed in MVP)
- SPL token creation on Solana

#### 🔁 Refund Mechanism
- Automatic refund if SoftCap not reached in time
- Transparent status updates
- Secure return of funds

#### 📊 Basic Allocation Logic
- Fixed % LP provisioning
- Fixed % treasury allocation
- Basic airdrop functionality

#### 📺 Dashboard & UI
- View/create proposals
- Track votes and funding
- Phantom wallet integration
- Status display for success/failure

---

## 🧱 Technical Architecture

### 2.1 Technology Stack

- **Blockchain:** Solana
- **Smart Contracts:** Rust with Anchor framework
- **Frontend:** React/Next.js + Tailwind CSS
- **Wallets:** `@solana/wallet-adapter` (Phantom, Solflare)
- **Contract Integration:** `@coral-xyz/anchor`
- **Backend (Optional):** Serverless (e.g. Vercel Functions)
- **Database (Optional):** PostgreSQL or MongoDB

---

### 2.2 Core Smart Contracts (Anchor-based)

#### 🧩 ProposalProgram
- Manage proposals and votes
- Handle fund escrow
- Monitor SoftCap threshold

#### 🔧 TokenDeployer
- Create SPL token
- Manage initial distribution
- LP and treasury logic

---

### 2.3 System Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│                MemeBuilder(ai) MVP              │
├───────────────────┬─────────────────────────────┤
│                   │                             │
│    Anchor-based   │     React/Next.js UI        │
│  Solana Programs  │  with @coral-xyz/anchor     │
│                   │                             │
└───────────────────┴─────────────────────────────┘
          ↑                       ↑
          │                       │
          │                       │
┌─────────┴───────────┐  ┌────────┴────────────┐
│    Solana Chain     │  │   Simple Backend    │
│    (On-chain Data)  │  │  (Off-chain Data)   │
└─────────────────────┘  └─────────────────────┘
```

## Setup Instructions

### Back-end

Welcome!

#### Before You Start

  - Only necessary if you want to run your own Solana program.
  - Ensure you have built and deployed your smart contract.
  - Run the `syncIdl.sh` script located at the project root.

#### Getting Started

  1. Install dependencies:

```
npm install
```

  2. Set up environment variables:

Create a `.env` file in the `/backend` directory and Aadd the following variables:

```
PORT=3012
SECRET_TOKEN=your_secret_token
ENV_REPOSITORIES=mongo
URI_MONGO=your_mongo_uri
URI_MONGOLOCAL=your_local_mongo_uri
URI_BACK=http://localhost:3012/
OPENAI_API_KEY=your_openai_api_key
SOLANA_ADMIN_KEYPAIR=your_admin_secret_key_as_json_array
```

  3. Run the development server:

If using local MongoDB:

```
docker compose up
```

In another terminal window, start the backend:

```
npm run dev
```

### Front-end

#### Before You Start

  - Only necessary if you want to run your own Solana program.
  - Ensure you have built and deployed your smart contract.
  - Run the `syncIdl.sh` script located at the project root.

#### Getting Started

  1. Install dependencies:

Use your preferred package manager. For example:

```
npm install
```

  2. Set up environment variables:

Create a `.env file` in the `/frontend` directory and add the following variables:

```
JWT_SECRET=your_secret
NEXT_PUBLIC_API_URL=http://localhost:3000  # or your backend URL
NEXT_PUBLIC_SOLANA_CLUSTER=devnet  # or 'mainnet'
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_GATEWAY_URL=your_pinata_gateway_url
```

  3. Run the development server:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 in your browser to see the app.

### Smart Contract (Solana Program)

The Solana Program is written in Rust with Anchor, and the associated Tests
 Suite is written in JS with Mocha.

To build the Solana Program run:

```
anchor build
```

To run the Tests Suite run:

```
anchor test
```

Please be mindful of the cluster of concern: `localnet`, `devnet` or `mainnet`.

