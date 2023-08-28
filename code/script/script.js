//Import
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

//------------------------------------------------------------------------
//SECTION device size verification
if (window.innerWidth < 768)
  throw new Error("This website is optimized for larger devices.");
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION Constant
const dimention = 15;
const total_time =
  new URL(window.location.href).searchParams.get("time") * 1
    ? new URL(window.location.href).searchParams.get("time") * 1
    : 3;
let [snake_position_arr, snake_mesh_arr] = [new Array(), new Array()];
let food_position = {};
let past_time = 0;
let gameStatus = "not-started";
let inputDir = { x: 0, y: 0, z: 0 };
let start_time = new Date();
let score = 0;
let count_eat = 0;
let pausedTime;
let bgAudioStarted = false;
const getDirection = {
  side0: [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 0, z: 1 },
  ],
  side1: [
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
  ],
  side2: [
    { x: -1, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ],
  side3: [
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 0, z: 1 },
    { x: -1, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
  ],
};
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION important function
const select = (selection) => document.querySelector(selection);

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min + 0.5;
}
const generatePostion = () => {
  const [min, max] = [-dimention + 2, dimention - 2];
  return [
    generateRandomNumber(min, max),
    generateRandomNumber(min, max),
    generateRandomNumber(min, max),
  ];
};
const next = (x) => {
  if (x > dimention - 0.5) {
    pass_wall_audio.play();
    return -dimention + 0.5;
  }
  if (x < -dimention + 0.5) {
    pass_wall_audio.play();
    return dimention - 0.5;
  }
  return x;
};
function isInList(element, list) {
  for (let i = 1; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(element)) return true;
  }
  return false;
}
const radiansToDegrees = (radians) => {
  const ag = (radians * 180) / Math.PI;
  if (ag >= 0) return ag;
  return 360 + ag;
};
function getTimeDifferenceFormatted(startTime) {
  const currentTime = new Date();
  const timeDifference =
    startTime.getTime() + total_time * 60 * 1000 - currentTime.getTime();
  if (timeDifference <= 0) return ["00:00", 0];
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  return [formattedTime, timeDifference / 1000];
}
const getSide = (angle) => {
  if (315 >= angle && angle > 225) return "side0";
  if (225 >= angle && angle > 135) return "side1";
  if (135 >= angle && angle > 45) return "side2";
  return "side3";
};
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION importing element
const showTimeElement = document.querySelector(".game-status");
const score_element = document.querySelector(".score");
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION importing audio

const bgAudio = document.getElementById("background-audio");
const pass_wall_audio = select("#pass-wall");
const food_audio = select("#food");
const gameover_audio = select("#gameover");
pass_wall_audio.playbackRate = 5;
bgAudio.loop = true; // Set loop to true
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION Creating scene
const scene = new THREE.Scene();
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-35, 25, 0);
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.minDistance = 30;
orbit.maxDistance = 50;
orbit.minPolarAngle = Math.PI / 4;
orbit.maxPolarAngle = (3 * Math.PI) / 4;
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - snake texture
let head_material_face_color = [
  0x006400, 0x006400, 0x006400, 0x006400, 0x006400, 0x006400,
];
let not_head_material_face_color = [
  0x9acd32, 0x8abe2a, 0x7caf22, 0x6c9e1a, 0x5d8f12, 0x4e800a,
];
let head_material = head_material_face_color.map(
  (color) => new THREE.MeshBasicMaterial({ color: color })
);
let not_head_material = not_head_material_face_color.map(
  (color) => new THREE.MeshBasicMaterial({ color: color })
);
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - create snake block
const createSnakeBlock = (x, y, z, head = false) => {
  const snakeGeometry = new THREE.BoxGeometry(1, 1, 1);
  let snakeMaterial = head ? head_material : not_head_material;
  const snakeMesh = new THREE.Mesh(snakeGeometry, snakeMaterial);
  scene.add(snakeMesh);
  snakeMesh.position.set(x, y, z);
  return snakeMesh;
};
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - walls
let wall = new THREE.Mesh(
  new THREE.BoxGeometry(
    dimention * 2 + 0.5,
    dimention * 2 + 0.5,
    dimention * 2 + 0.5
  ),
  new THREE.MeshBasicMaterial({
    color: 0x3385ff, // Cha
    wireframe: true,
  })
);
scene.add(wall);
wall.rotation.y = -Math.PI / 2;
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - game init
//NOTE: snake head with random position
let head_position = generatePostion();
snake_position_arr.push(head_position);
snake_mesh_arr.push(createSnakeBlock(...head_position, true));
//NOTE: showing time remaining
document.querySelector(".game-status").innerText = `Time remain :- ${total_time
  .toString()
  .padStart(2, "0")}:00`;
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - create food
const [x, y, z] = generatePostion();
const foodGeometry = new THREE.SphereGeometry(0.5, 50);
const foodMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const foodMesh = new THREE.Mesh(foodGeometry, foodMaterial);
scene.add(foodMesh);
foodMesh.position.set(x, y, z);
food_position = { x, y, z };
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - animate function
const moveSnake = (dir) => {
  let [x, y, z] = snake_position_arr[0];
  [x, y, z] = [next(x + dir.x), next(y + dir.y), next(z + dir.z)];
  if (isInList([x, y, z], snake_position_arr)) {
    gameStatus = "game-over";
    return gameOver(score);
  }
  snake_mesh_arr[0].material = not_head_material;
  let newHead = snake_mesh_arr.pop();
  newHead.position.set(x, y, z);
  snake_position_arr = [[x, y, z], ...snake_position_arr];
  snake_mesh_arr = [newHead, ...snake_mesh_arr];
  snake_mesh_arr[0].material = head_material;
  if (food_position.x === x && food_position.y === y && food_position.z === z) {
    snake_mesh_arr.push(
      createSnakeBlock(snake_position_arr[snake_position_arr.length - 1])
    );
    let newpos = generatePostion();
    foodMesh.position.set(...newpos);
    food_position = { x: newpos[0], y: newpos[1], z: newpos[2] };
    score += 1;
    count_eat += 1;
    food_audio.play();
    score += 5 * !(count_eat % 5);
    score_element.innerText = `Score: ${score}`;
  } else {
    snake_position_arr.pop();
  }
};
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - GUI options
const gameOver = (score) => {
  score_element.classList.toggle("end-score");
  document.querySelector(".grey").hidden = false;
  gameover_audio.play();
};
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const setting = {
  speed: 5,
};
gui.add(setting, "speed", 4, 20);
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - animate function
const animate = (time) => {
  if (gameStatus === "time-out" || gameStatus === "game-over") return;
  if (gameStatus === "not-started") start_time = new Date();
  if (time / 1000 - past_time >= 1 / setting.speed) {
    past_time = time / 1000;
    if (gameStatus === "game") {
      let [display, remain] = getTimeDifferenceFormatted(start_time);
      if (remain === 0) {
        gameStatus = "time-out";
        gameOver(score);
      } else {
        showTimeElement.innerText = `Time remain :- ${display}`;
        moveSnake(inputDir);
      }
    }
  }
  showTimeElement.setAttribute("status", gameStatus);
  renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - keydown key
document.addEventListener("keydown", function (event) {
  const angle = radiansToDegrees(orbit.getAzimuthalAngle());
  const [forward, backward, left, right] = getDirection[getSide(angle)];
  let temp_inputDir;
  if (event.key === "ArrowUp") temp_inputDir = forward;
  if (event.key === "ArrowDown") temp_inputDir = backward;
  if (event.key === "ArrowRight") temp_inputDir = right;
  if (event.key === "ArrowLeft") temp_inputDir = left;
  if (event.key === "w") temp_inputDir = { x: 0, y: 1, z: 0 };
  if (event.key === "s") temp_inputDir = { x: 0, y: -1, z: 0 };
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "s"].includes(
      event.key
    )
  ) {
    if (!bgAudioStarted) {
      bgAudio.play();
      bgAudioStarted = true;
    }
    if (snake_mesh_arr.length === 1) {
      inputDir = temp_inputDir;
    } else {
      let temp = [...snake_position_arr[0]];
      temp[0] = next(temp[0] + temp_inputDir.x);
      temp[1] = next(temp[1] + temp_inputDir.y);
      temp[2] = next(temp[2] + temp_inputDir.z);
      if (JSON.stringify(temp) != JSON.stringify(snake_position_arr[1])) {
        inputDir = temp_inputDir;
      }
    }
    if (gameStatus === "pause") {
      start_time = new Date(start_time - 0 + (new Date() - pausedTime));
    }
    score_element.setAttribute("status", "game");
    gameStatus = "game";
  } else if (event.key === "p" || event.key === " ") {
    if (gameStatus === "game") {
      gameStatus = "pause";
      pausedTime = new Date();
    } else if (gameStatus === "pause") {
      gameStatus = "game";
      start_time = new Date(start_time - 0 + (new Date() - pausedTime));
    }
  }
});
//------------------------------------------------------------------------

//------------------------------------------------------------------------
//SECTION - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//------------------------------------------------------------------------
