# Digi-Dex - Digimon Encyclopedia

## Overview

Digi-Dex is a web application that serves as an interactive Digimon encyclopedia, allowing users to search for detailed information about any Digimon available through the [Digi-API](https://digi-api.com/).

## Features

- Search by Digimon name or ID
- Detailed display of selected Digimon information
- Official images (with placeholder fallbacks)
- Complete profile with description
- List of skills and techniques
- Evolution chain (prior and next evolutions)
- Digital World-style interface with animations
- Responsive design

## Technologies Used

- HTML5
- CSS3 (with animations and variables)
- Vanilla JavaScript (ES6+)
- [Digi-API](https://digi-api.com/) (public Digimon API)

## How to Use

1. Access the application
2. Enter a Digimon name or ID in the search field
3. Click "Search" or press Enter
4. Explore all available information
5. Click on evolutions to navigate between related Digimon

## Project Structure

```
digi-dex/
├── index.html          # Main page
├── style.css           # Global styles and animations
└── script.js           # Application logic
```

## Main Components

### Application State
```javascript
const state = {
    selectedDigimon: null,  // Currently selected Digimon
    isLoading: false,      // Loading state
    error: '',             // Error messages
};
```

### Pages
- **SearchPage**: Initial search interface
- **DigimonDetailsPage**: Detailed Digimon display
- **LoadingSpinner**: Loading indicator
- **ErrorMessage**: Error display

### API Service
```javascript
async function getDigimonByName(name) {
    // API call implementation
}
```

## Visual Style

The app uses a Digital World-inspired theme with:
- Dark colors and neon blues
- Pixelated fonts (VT323)
- Smooth animations and transition effects
- Panel-divided layout for better organization

## Implemented Animations

- `fadeIn`: Smooth appearance
- `zoomIn`: Zoom effect
- `fadeInUpStagger`: Staggered entry
- `slideInRight`: Slide from right
- `spin`: Rotation for spinner

## License

This project is intended for portfolio use and is available for study. Feel free to inspect, copy, and adapt the code for your own projects.
