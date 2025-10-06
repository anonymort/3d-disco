# 3D Disco

An immersive 3D disco experience built with Three.js featuring dynamic lighting, a spinning disco ball, animated dance floor, and interactive camera controls.

## Features

- **Interactive 3D Environment**
  - First-person camera navigation with WASD controls
  - Collision detection to prevent walking through walls
  - Entrance/exit with illuminated stairway

- **Dynamic Lighting**
  - Rotating disco ball with reflective mirror facets
  - Animated spotlights targeting the disco ball
  - Color-changing dance floor tiles (20x20 grid)
  - Moving point lights and laser beams
  - Ceiling panels and wall decorations with color transitions
  - Corner neon light columns

- **Audio System**
  - Procedurally generated background music (120 BPM)
  - Kick drums, hi-hats, and bass synthesizer
  - Muffled sound effect using low-pass filter

- **Visual Effects**
  - Bloom post-processing for glowing lights
  - Fog for depth and atmosphere
  - Emissive materials for neon effects

- **Room Features**
  - DJ booth with LED lighting
  - Speaker systems with LED indicators
  - Entrance archway with EXIT sign
  - Enclosed stairway with ambient lighting

## Performance Optimizations

- Shared geometry instances for repeated objects
- Matrix auto-update disabled for static objects
- Shadows disabled for maximum performance
- High-performance GPU rendering
- Frame skipping for non-critical animations
- Capped pixel ratio for high-DPI displays
- Optimized bloom post-processing

## Controls

- **W** - Move forward
- **S** - Move backward
- **A** - Rotate camera left
- **D** - Rotate camera right

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open your browser to the local server URL (typically http://localhost:5173)

## Build

```bash
npm run build
```

## Technology Stack

- **Three.js** - 3D graphics library
- **Vite** - Build tool and dev server
- **Web Audio API** - Procedural audio generation
- **EffectComposer** - Post-processing effects

## Project Structure

```
src/
├── main.js           # Main application entry point
├── scene.js          # Scene, camera, renderer setup
├── config.js         # Configuration constants
├── room.js           # Room geometry and structures
├── danceFloor.js     # Dance floor tile system
├── lights.js         # Lighting systems
├── discoBall.js      # Disco ball creation
├── audio.js          # Audio system
├── animations.js     # Animation functions
└── controls.js       # Camera controls and collision
```

## Performance

Optimized to maintain 60fps on modern hardware through:
- Efficient geometry sharing
- Minimal draw calls
- Smart animation frame skipping
- Hardware-accelerated rendering

## Browser Compatibility

Best experienced in modern browsers with WebGL support:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

ISC
