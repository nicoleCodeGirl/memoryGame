# Photo Management Guide

## How Photos Work in the Memory Game

Your memory game now uses a **dynamic photo loading system** that automatically detects and uses photos from the `public/photos/gameCards/` directory. This is much better than the old hardcoded approach!

## Current System

### Before (Hardcoded)
- Photos were hardcoded in `memoryGame.js` as a static array
- Adding/removing photos required code changes
- Limited flexibility

### After (Dynamic)
- Photos are automatically loaded from the server
- No code changes needed to add/remove photos
- Web interface for managing photos
- Command-line tools for bulk operations

## Adding New Photos

### Method 1: Direct Placement (Recommended)
1. Place image files directly in `public/photos/gameCards/` folder
2. You can name them anything you want
3. Refresh the game page - photos will be automatically detected

### Method 2: Web Interface
1. Go to the game page
2. Click "Photo Manager" button
3. Add photos to the `public/photos/` folder
4. Use the "Process" command to move them to gameCards
5. The game will automatically use new photos

### Method 3: Command Line
1. Place new image files in `public/photos/`
2. Run the photo manager script:
   ```bash
   node scripts/photoManager.js process
   ```
3. This will move files to the gameCards directory

## Photo Requirements

- **Supported formats**: JPG, JPEG, PNG, GIF, WEBP
- **Naming convention**: Any name you want! (e.g., `cat.jpg`, `dog.png`, `flower.jpeg`)
- **Location**: Must be in `public/photos/gameCards/` directory
- **Recommended size**: 200x200 pixels or larger (will be scaled automatically)
- **File size**: Keep under 1MB for best performance

## Managing Photos

### View Current Photos
```bash
node scripts/photoManager.js list
```

### Process New Photos
```bash
node scripts/photoManager.js process
```

### Delete Photos via Web Interface
1. Go to Photo Manager page
2. Click "Delete" button next to any photo
3. Confirm deletion

## Technical Details

### API Endpoints
- `GET /api/photos` - Get list of available photos
- `DELETE /api/photos/:filename` - Delete a specific photo
- `GET /admin/photos` - Photo management interface

### File Structure
```
public/photos/
├── gameCards/         # Game images directory
│   ├── cat.jpg        # Game image 1
│   ├── dog.png        # Game image 2
│   ├── flower.jpeg    # Game image 3
│   └── ...            # Any other images
├── player_icon.png    # Non-game image (ignored)
├── error404.jpeg      # Non-game image (ignored)
└── helloPlayer.jpeg   # Non-game image (ignored)
```

### How It Works
1. Server scans `public/photos/gameCards/` directory
2. Filters for any image files (JPG, PNG, GIF, WEBP)
3. Returns JSON array of photo metadata
4. Frontend JavaScript fetches photos and creates pairs
5. Game randomizes and displays the cards (different order each time!)

## Benefits of the New System

✅ **Easy Updates**: Add/remove photos without touching code  
✅ **Automatic Detection**: New photos are automatically included  
✅ **Flexible Naming**: Name photos anything you want  
✅ **Web Management**: User-friendly interface for photo management  
✅ **Error Handling**: Graceful handling of missing or invalid photos  
✅ **Scalable**: Works with any number of photos  
✅ **Secure**: Only allows deletion of game images  
✅ **Randomized**: Cards are shuffled every new game  

## Troubleshooting

### No Photos Loading
- Check that photos are in `public/photos/gameCards/` directory
- Ensure photos are valid image files (JPG, PNG, GIF, WEBP)
- Check browser console for errors
- Verify server is running

### Photos Not Appearing in Game
- Refresh the game page
- Check that photos are valid image files
- Ensure photos are not corrupted

### Permission Errors
- Check file permissions on `public/photos/` directory
- Ensure server has read access to photos

## Future Enhancements

- [ ] Drag-and-drop upload interface
- [ ] Photo categories/themes
- [ ] Automatic image optimization
- [ ] Photo metadata (descriptions, tags)
- [ ] Bulk upload functionality 