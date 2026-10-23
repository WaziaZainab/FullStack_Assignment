# 🎨 Skribbl.io Clone

A real-time multiplayer drawing and guessing game inspired by Skribbl.io. Players can join rooms, take turns drawing a secret word, and guess what other players are drawing.

## ✨ Features

- **Multiplayer Gameplay:** Play with multiple players in real time.
- **Room System:** Create or join game rooms.
- **Interactive Drawing Canvas:** Draw using different colors and tools.
- **Live Chat:** Communicate with other players and submit word guesses.
- **Real-Time Communication:** Synchronize drawing and game events using Socket.IO.
- **Scoring System:** Award points for correct guesses.
- **Game Timer:** Keep each drawing round time-limited.
- **Leaderboard:** Track player scores during the game.

*Note: Features listed above should match the functionality implemented in the current version of the project.*

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Socket.IO Client

**Backend**
- Node.js
- Express.js
- TypeScript
- Socket.IO

**Database**
- MongoDB
- Mongoose

## 📁 Project Structure

```text
FullStack_Assignment/
├── client/       # React frontend
├── server/       # Node.js backend
├── shared/       # Shared types and constants
├── README.md
└── .gitignore
```

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- Git
- MongoDB, if required by the configured backend

### 1. Clone the Repository

```bash
git clone https://github.com/WaziaZainab/FullStack_Assignment.git
cd FullStack_Assignment
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

### 4. Install Backend Dependencies

Open a separate terminal from the project root:

```bash
cd server
npm install
```

### 5. Configure and Start the Backend

Configure the required environment variables according to the server configuration, then run:

```bash
npm run dev
```

The frontend and backend must both be running for multiplayer functionality to work.

## 🔌 Real-Time Communication

Socket.IO is used to support real-time communication between connected players, including game events and drawing updates.

## 🚀 Future Improvements

- Private rooms with shareable invitation codes
- Improved mobile responsiveness
- Additional drawing tools and word categories
- Enhanced player profiles and game statistics

## 👩‍💻 Author

**Wazia Zainab**

GitHub: [WaziaZainab](https://github.com/WaziaZainab)

---

This project was created as a full-stack development assignment to practice real-time multiplayer application development.
