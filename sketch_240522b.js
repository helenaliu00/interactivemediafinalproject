let canvas;
let video;
let thumbsUpImg;
let pointingImg;
let peaceImg;
let threeImg;
let fourImg;
let detectionInProgress = false;
let handpose;
let detections = [];

function preload() {
  thumbsUpImg = loadImage('images/animal.PNG');
  pointingImg = loadImage('images/bird.PNG');
  peaceImg = loadImage('images/turtle.PNG');
  threeImg = loadImage('images/fish.PNG');
  fourImg = loadImage('images/insect.PNG');
}

function setup() {

  // Create a canvas element with the same dimensions as the video
  canvas = createCanvas(800, 600);
  canvas.id("canvas");

  // Create a video capture element
  video = createCapture(VIDEO);
  video.id("video");
  // video.hide();

  // Set the size of the video element to match the window dimensions
  video.size(800, 600);


  // Position the canvas and video elements
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
  video.position(x, y);

  const options = {
    flipHorizontal: false,
    maxContinuousChecks: Infinity,
    detectionConfidence: 0.8,
    scoreThreshold: 0.75,
    iouThreshold: 0.3,
  }

  handpose = ml5.handpose(video, options, modelReady);
  colorMode(HSB);
}


function modelReady() {
  console.log("Model ready!");

  // Update detections when handpose predicts
  handpose.on('predict', results => {
    detections = results;
  });

  // Update status message
  select('#status').html('Model Loaded');

}


function draw() {
  clear();

  // push();
  // imageMode(CORNER);
  // image(video, 0, 0, width, auto);
  // pop();

  // Display the images at the center of the hand if detection is in progress
  if (detections.length > 0) {
    let hand = detections[0].landmarks;
    let centerX = hand[9][0]; // X-coordinate of the wrist
    let centerY = hand[9][1]; // Y-coordinate of the wrist
    console.log(centerX, centerY)

    imageMode(CENTER);
    if (isThumbsUp(hand)) {
      image(thumbsUpImg, centerX, centerY);
      detectionInProgress = true;
    } else if (isPointingFinger(hand)) {
      image(pointingImg, centerX, centerY);
      detectionInProgress = true;
    } else if (isPeace(hand)) {
      image(peaceImg, centerX, centerY);
      detectionInProgress = true;
    } else if (isThreeFingersUp(hand)) {
      image(threeImg, centerX, centerY);
      detectionInProgress = true;
    } else if (isFourFingersUp(hand)) {
      image(fourImg, centerX, centerY);
      detectionInProgress = true;
    } else {
      detectionInProgress = false;
    }
  } else {
    detectionInProgress = false;
  }

  // Draw hand landmarks and lines
  drawLines([0, 5, 9, 13, 17, 0]);//palm
  drawLines([0, 1, 2, 3 ,4]);//thumb
  drawLines([5, 6, 7, 8]);//index finger
  drawLines([9, 10, 11, 12]);//middle finger
  drawLines([13, 14, 15, 16]);//ring finger
  drawLines([17, 18, 19, 20]);//pinky

  drawLandmarks([0, 1], 0);//palm base
  drawLandmarks([1, 5], 60);//thumb
  drawLandmarks([5, 9], 120);//index finger
  drawLandmarks([9, 13], 180);//middle finger
  drawLandmarks([13, 17], 240);//ring finger
  drawLandmarks([17, 21], 300);//pinky
}

function isThumbsUp(landmarks) {
  let thumbTipY = landmarks[4][1];
  let indexTipY = landmarks[8][1];
  let middleTipY = landmarks[12][1];
  let ringTipY = landmarks[16][1];
  let pinkyTipY = landmarks[20][1];
  return thumbTipY < indexTipY && thumbTipY < middleTipY && thumbTipY < ringTipY && thumbTipY < pinkyTipY;
}

function isPointingFinger(landmarks) {
  let indexTipY = landmarks[8][1];
  let thumbTipY = landmarks[4][1];
  let middleTipY = landmarks[12][1];
  let ringTipY = landmarks[16][1];
  let pinkyTipY = landmarks[20][1];
  return indexTipY < thumbTipY && indexTipY < middleTipY && indexTipY < ringTipY && indexTipY < pinkyTipY;
}

function isPeace(landmarks) {
  let indexTipY = landmarks[8][1];
  let middleTipY = landmarks[12][1];
  let thumbTipY = landmarks[4][1];
  let ringTipY = landmarks[16][1];
  return indexTipY < thumbTipY && middleTipY < thumbTipY && ringTipY > thumbTipY;
}

function isThreeFingersUp(landmarks) {
  let pinkyTipY = landmarks[20][1];
  let ringBottomJointY = landmarks[17][1];
  return pinkyTipY > ringBottomJointY;
}

function isFourFingersUp(landmarks) {
  let thumbTipY = landmarks[4][1];
  let indexBaseY = landmarks[5][1]; // Assuming index finger's base is at index 5
  return thumbTipY > indexBaseY;
}

function drawLandmarks(indexArray, hue) {
  noFill();
  strokeWeight(10);
  for (let i = 0; i < detections.length; i++) {
    for (let j = indexArray[0]; j < indexArray[1]; j++) {
      let x = detections[i].landmarks[j][0];
      let y = detections[i].landmarks[j][1];
      stroke(hue, 40, 255);
      point(x, y);
    }
  }
}

function drawLines(index) {
  stroke(0, 0, 255);
  strokeWeight(3);
  for (let i = 0; i < detections.length; i++) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = detections[i].landmarks[index[j]][0];
      let y = detections[i].landmarks[index[j]][1];
      let _x = detections[i].landmarks[index[j + 1]][0];
      let _y = detections[i].landmarks[index[j + 1]][1];
      line(x, y, _x, _y);
    }
  }
}
