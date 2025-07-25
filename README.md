# 🎮 Memory Game

A dynamic memory card game built with Node.js, Express, MySQL, and EJS. Players match cards to compete for the best times on the leaderboard.

## ✨ Features

- **Dynamic Photo System**: Automatically loads photos from `public/photos/gameCards/` folder
- **Flexible Photo Management**: Add/remove photos without touching code
- **Randomized Gameplay**: Cards are shuffled differently every new game
- **User Authentication**: Create accounts and track personal scores
- **Leaderboard System**: Compare scores with other players
- **Photo Manager**: Web interface to manage game photos
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ What We Accomplished

### ✅ **Photo System Overhaul**
- **Before**: Hardcoded photo array in JavaScript
- **After**: Dynamic photo loading from server API
- **Benefits**: Easy photo updates, flexible naming, automatic detection

### ✅ **Database Migration**
- **Before**: Direct MySQL installation (complex management)
- **After**: Homebrew MySQL (easy service management)
- **Benefits**: No sudo commands, automatic updates, better integration

### ✅ **Enhanced Randomization**
- **Before**: Basic randomization with potential issues
- **After**: Proper card shuffling with error handling
- **Benefits**: Different game experience every time, no duplicate cards

### ✅ **Photo Organization**
- **Before**: All photos mixed in main photos folder
- **After**: Dedicated `gameCards` folder for game images
- **Benefits**: Better organization, automatic filtering

## 📋 Prerequisites

Before running this application, you need:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Homebrew** (for MySQL installation) - [Install here](https://brew.sh/)
3. **Git** (for cloning the repository)

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd memoryGame
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Install MySQL via Homebrew
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Verify MySQL is running
brew services list | grep mysql
```

### Step 4: Create Database
```bash
# Connect to MySQL (no password by default)
mysql -u root

# In MySQL, create the database
CREATE DATABASE memoryGameDB;
EXIT;
```

### Step 5: Configure Environment (Optional)
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=memoryGameDB
NODE_ENV=development
```

**Note**: If you don't create a `.env` file, the app will use default values.

## 🎮 Running the Game

### Start the Server
```bash
npm start
```

### Access the Game
Open your web browser and navigate to:
```
http://localhost:3000
```

### ⚠️ Important Notes
- **Don't use "Go Live"** - This is for static HTML files only
- **Always use `http://localhost:3000`** in your browser
- **Keep the terminal running** - Don't close it while playing

## 📸 Photo Management

### Adding New Photos
1. **Direct Method** (Recommended):
   - Place image files in `public/photos/gameCards/`
   - Name them anything you want (e.g., `cat.jpg`, `dog.png`)
   - Refresh the game page

2. **Web Interface**:
   - Go to the game page
   - Click "Photo Manager" button
   - Add photos to `public/photos/` folder
   - Use "Process" to move them to gameCards

3. **Command Line**:
   ```bash
   # Place images in public/photos/ then run:
   node scripts/photoManager.js process
   ```

### Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WEBP

### Photo Requirements
- **Location**: Must be in `public/photos/gameCards/` directory
- **Size**: Recommended 200x200 pixels or larger
- **File size**: Keep under 1MB for best performance

## 🛠️ Development

### Project Structure
```
memoryGame/
├── public/
│   ├── photos/
│   │   ├── gameCards/     # Game images (auto-detected)
│   │   └── ...            # Other site images
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   └── ...
├── views/                 # EJS templates
├── scripts/               # Utility scripts
├── server.js             # Main server file
└── package.json          # Dependencies
```

### Key Files
- `server.js` - Main server with routes and database setup
- `public/js/memoryGame.js` - Game logic and photo loading
- `views/memoryGame.ejs` - Game interface template
- `scripts/photoManager.js` - Photo management utilities

### API Endpoints
- `GET /` - Home page with user login
- `GET /memoryGame` - Game interface
- `GET /leaderBoard` - Score leaderboard
- `GET /api/photos` - Get available game photos
- `GET /admin/photos` - Photo management interface

## 🔧 Troubleshooting

### Common Issues

**"Port 3000 already in use"**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill
```

**"Unknown database 'memorygamedb'"**
```bash
# Create the database
mysql -u root -e "CREATE DATABASE memoryGameDB;"
```

**"Error connecting to database"**
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL if needed
brew services start mysql
```

**Photos not loading**
- Check that photos are in `public/photos/gameCards/`
- Ensure photos are valid image files
- Check browser console for errors

### MySQL Management
```bash
# Start MySQL
brew services start mysql

# Stop MySQL
brew services stop mysql

# Restart MySQL
brew services restart mysql

# Check status
brew services list | grep mysql
```

## 🎯 Game Features

### User System
- Create new accounts
- Login with existing accounts
- Deactivate accounts
- Personal score tracking

### Leaderboard
- View all player scores
- Filter by active players only
- View personal scores only
- Sort by completion time

### Game Mechanics
- 40 cards (20 pairs)
- Randomized card placement
- Timer tracking
- Match detection
- Score submission

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check that MySQL is running
4. Ensure the server is started with `npm start`

---

**Happy Gaming! 🎮**