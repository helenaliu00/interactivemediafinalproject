let handpose;
let detections = [];

let canvas;
let video;

let img; 

function preload(){
  img = loadImage('images/tester.PNG');
}


function setup(){
  canvas = createCanvas(640, 480);//3D mode!!!
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);

  const options = {
    flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }

  handpose = ml5.handpose(video, options, modelReady);
  colorMode(HSB);
}

function modelReady() {
  console.log("Model ready!");
  handpose.on('predict', results => {
    detections = results;

    // console.log(detections);
  });

  select('#status').html('Model Loaded');

}


function draw(){
  clear();
  //In webgl mode, origin of the coordinate setted to centre.
  //So I re-positioned it to top-left.
  //translate(-width/2, -height/2);

  if(detections.length > 0){
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

        // Check for "Thumbs Up" gesture
        if (isThumbsUp(detections[0].landmarks)) {
          fill(0, 255, 0); // Green color for positive indication
          textSize(32);
          text('Thumbs Up!', 10, 30);

                // Get the position of the palm base (landmark 0)
      let x = detections[0].landmarks[0][0];
      let y = detections[0].landmarks[0][1];
      
      // Display the image at the hand's position
      image(img, x - img.width / 2, y - img.height / 2); // Center the image on the hand position
      
        }
      }
    }
    
    function isThumbsUp(landmarks) {
      // Get y-coordinates of the thumb and other fingers' tips
      let thumbTipY = landmarks[4][1];
      let indexTipY = landmarks[8][1];
      let middleTipY = landmarks[12][1];
      let ringTipY = landmarks[16][1];
      let pinkyTipY = landmarks[20][1];
    
      // Check if the thumb tip is higher than the tips of other fingers
      return thumbTipY < indexTipY && thumbTipY < middleTipY && thumbTipY < ringTipY && thumbTipY < pinkyTipY;
    
  }
  



function drawLandmarks(indexArray, hue){
    noFill();
    strokeWeight(10);
    for(let i=0; i<detections.length; i++){
      for(let j=indexArray[0]; j<indexArray[1]; j++){
        let x = detections[i].landmarks[j][0];
        let y = detections[i].landmarks[j][1];
        let z = detections[i].landmarks[j][2];
        stroke(hue, 40, 255);
        point(x, y);
      }
    }
  }

function drawLines(index){
  stroke(0, 0, 255);
  strokeWeight(3);
  for(let i=0; i<detections.length; i++){
    for(let j=0; j<index.length-1; j++){
      let x = detections[i].landmarks[index[j]][0];
      let y = detections[i].landmarks[index[j]][1];
      let z = detections[i].landmarks[index[j]][2];

      let _x = detections[i].landmarks[index[j+1]][0];
      let _y = detections[i].landmarks[index[j+1]][1];
      let _z = detections[i].landmarks[index[j+1]][2];
      line(x, y, _x, _y);
    }
  }
}
