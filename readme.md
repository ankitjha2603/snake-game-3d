# 3D Snake Game with Three.js

![Dive into our 3D Snake Game crafted using Three.js! Use arrow keys and S/W/P/Space keys to guide your snake toward delicious food, earning 1 point for each bite. And guess what? After every 5 bites, you'll score an extra 5 points! Ready for a challenge? You can easily change the speed. You've got 3 minutes to play, and if you want more time, just make a simple change in the web link. Just make sure to avoid letting your snake bite itself anywhere on its body. Also, keep an eye on the time ticking down. Move your view with your mouse – it's Snake like you've never experienced!](gif/intro.gif)

Welcome to the 3D Snake Game, built using the Three.js library. Immerse yourself in a dynamic 3D gaming experience as you guide the snake through the environment, munching on delicious food and earning points.

## Features

- Control the snake using arrow keys (← ↑ → ↓) and 'S'/'W' keys.
- Pause the game using the 'P' key or the Spacebar.
- Score 1 point for each food item eaten.
- Earn an extra 5 points after every 5 food items consumed.
- Adjust the game speed using a user-friendly interface.
- Default game time is 3 minutes, extendable through a URL parameter.
- Rotate the view using the cursor to make control effortless.
- Game over conditions: timeout or snake biting itself.

## How to Play

1. Use arrow keys (← ↑ → ↓) or 'S'/'W' keys to control the snake's movement.
2. Eat the food items to grow longer and earn points.
3. Score 1 point for each food item.
4. Score an extra 4 points after every 4 food items consumed.
5. Avoid colliding with the snake's own body.
6. Monitor the remaining time on the display.
7. Rotate your view by moving your cursor.
8. Adjust the game speed for a more challenging experience.

## Adjusting Total Game Time

Customize the game duration by using the `time` URL parameter. This feature lets you choose how long you want your game session to last. The default game duration is set to 3 minutes.

To adjust the total game time, follow these simple steps:

1. Enter the game URL and append `?time=<minutes>` to the end of it.
2. Replace `<minutes>` with the number of minutes you desire for the game duration. For instance, if you want to play a 5-minute game, the URL would look like this:
   `https://ankitjha2603.github.io/snake-game-3d/?time=5`

In this example, the game will run for 5 minutes. Feel free to experiment with different time values to adjust the game length to your preference.

This feature enables you to tailor your gaming experience, making it shorter or longer as you see fit.

## Demo

Check out the live demo of the game [here](https://ankitjha2603.github.io/snake-game-3d).

## Credits

- Built with [Three.js](https://threejs.org/)
- User interface powered by [dat.gui](https://github.com/dataarts/dat.gui)
