let c = document.getElementById("my-canvas");
let ctx = c.getContext("2d");

let loadImage = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

let imagePath = (frameNumber, animationstyle) => {
  return "images/" + animationstyle + "/" + frameNumber + ".png";
};

let frames = {
  backward: [1, 2, 3, 4, 5, 6],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  forward: [1, 2, 3, 4, 5, 6],
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
};

let loadImages = (callback) => {
  let images = {
    backward: [],
    block: [],
    forward: [],
    idle: [],
    kick: [],
    punch: [],
  };
  let imagesToLoad = 0;

  ["punch", "forward","kick", "backward", "block"].forEach(
    (animation) => {
      let animationFrames = frames[animation];
      imagesToLoad = imagesToLoad + animationFrames.length;

      animationFrames.forEach((frameNumber) => {
        let path = imagePath(frameNumber, animation);

        loadImage(path, (image) => {
          images[animation][frameNumber - 1] = image;
          imagesToLoad -= 1;

          if (imagesToLoad === 0) {
            callback(images);
          }
        });
      });
    }
  );
};

let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, 600, 600);
      ctx.drawImage(image, 0, 0, 600, 600);
    }, index * 150);
  });

  setTimeout(callback, images[animation].length * 150);
};

loadImages((images) => {
  let queuedAnimations = [];

  let aux = () => {
    let selectedAnimation;

    if (queuedAnimations.length === 0) {
      selectedAnimation = "idle";
    } else {
      selectedAnimation = queuedAnimations.shift();
    }

    animate(ctx, images, selectedAnimation, aux);
  };

  aux();

  let buttonClicked = (move) => {
    document.getElementById(move).onclick = () => {
      queuedAnimations.push(move);
    };
  };

  buttonClicked("punch");
  buttonClicked("forward");
  buttonClicked("kick");
  buttonClicked("backward");
  buttonClicked("block");
  
  document.addEventListener("keyup", (event) => {
    const key = event.key;
	
	if (key === "w" || key === "W") {
      queuedAnimations.push("punch");
    } else if (key === "D" || key === "d") {
      queuedAnimations.push("forward");
    } else if (key === "s" || key === "S") {
      queuedAnimations.push("kick");
    } else if (key === "A" || key === "a") {
      queuedAnimations.push("backward");
    } else if (key === " ")  {
      queuedAnimations.push("block");
    }
		
  });
});
