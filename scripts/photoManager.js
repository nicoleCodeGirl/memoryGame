#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'photos');
const GAME_CARDS_DIR = path.join(__dirname, '..', 'public', 'photos', 'gameCards');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * Get all image files in the gameCards directory
 */
function getGameCardFiles() {
    try {
        const files = fs.readdirSync(GAME_CARDS_DIR);
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_FORMATS.includes(ext);
        });
    } catch (error) {
        console.error('Error reading gameCards directory:', error.message);
        return [];
    }
}

/**
 * Get all image files in the photos directory (for reference)
 */
function getImageFiles() {
    try {
        const files = fs.readdirSync(PHOTOS_DIR);
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_FORMATS.includes(ext);
        });
    } catch (error) {
        console.error('Error reading photos directory:', error.message);
        return [];
    }
}

/**
 * Get the next available image number (for backward compatibility)
 */
function getNextImageNumber() {
    const files = getGameCardFiles();
    const gameImages = files.filter(file => file.match(/^img\d+\./i));
    
    if (gameImages.length === 0) {
        return 1;
    }
    
    const numbers = gameImages.map(file => {
        const match = file.match(/^img(\d+)\./i);
        return match ? parseInt(match[1]) : 0;
    });
    
    return Math.max(...numbers) + 1;
}

/**
 * Move a file to gameCards directory
 */
function moveToGameCards(filename) {
    const oldPath = path.join(PHOTOS_DIR, filename);
    const newPath = path.join(GAME_CARDS_DIR, filename);
    
    try {
        fs.renameSync(oldPath, newPath);
        console.log(`✓ Moved ${filename} to gameCards directory`);
        return filename;
    } catch (error) {
        console.error(`✗ Error moving ${filename}:`, error.message);
        return null;
    }
}

/**
 * Rename a file to the next available img number (for backward compatibility)
 */
function renameToNextNumber(filename) {
    const ext = path.extname(filename);
    const nextNumber = getNextImageNumber();
    const newName = `img${nextNumber}${ext}`;
    const oldPath = path.join(GAME_CARDS_DIR, filename);
    const newPath = path.join(GAME_CARDS_DIR, newName);
    
    try {
        fs.renameSync(oldPath, newPath);
        console.log(`✓ Renamed ${filename} to ${newName}`);
        return newName;
    } catch (error) {
        console.error(`✗ Error renaming ${filename}:`, error.message);
        return null;
    }
}

/**
 * List all current game images
 */
function listGameImages() {
    const gameFiles = getGameCardFiles();
    const otherFiles = getImageFiles();
    
    console.log('\n🎮 Game Cards (used in memory game):');
    if (gameFiles.length === 0) {
        console.log('   No game cards found');
    } else {
        gameFiles.forEach(file => {
            console.log(`   ${file}`);
        });
    }
    
    const otherImages = otherFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_FORMATS.includes(ext);
    });
    
    if (otherImages.length > 0) {
        console.log('\n📁 Other Images (not used in game):');
        otherImages.forEach(file => {
            console.log(`   ${file}`);
        });
    }
}

/**
 * Process new images (move them to gameCards directory)
 */
function processNewImages() {
    const files = getImageFiles();
    const newImages = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_FORMATS.includes(ext);
    });
    
    if (newImages.length === 0) {
        console.log('No new images to process');
        return;
    }
    
    console.log(`\n🔄 Moving ${newImages.length} image(s) to gameCards directory...`);
    newImages.forEach(file => {
        moveToGameCards(file);
    });
}

/**
 * Main function
 */
function main() {
    const command = process.argv[2];
    
    console.log('🎮 Memory Game Photo Manager\n');
    
    switch (command) {
        case 'list':
            listGameImages();
            break;
        case 'process':
            processNewImages();
            listGameImages();
            break;
        case 'help':
        default:
            console.log('Usage: node photoManager.js [command]');
            console.log('\nCommands:');
            console.log('  list     - List all current game cards');
            console.log('  process  - Move new images to gameCards directory');
            console.log('  help     - Show this help message');
            console.log('\nTo add new photos:');
            console.log('  1. Place image files in public/photos/');
            console.log('  2. Run: node photoManager.js process');
            console.log('  3. Refresh the game page');
            console.log('\nOr simply place images directly in public/photos/gameCards/');
            break;
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    getImageFiles,
    getGameCardFiles,
    getNextImageNumber,
    renameToNextNumber,
    moveToGameCards,
    listGameImages,
    processNewImages
}; 