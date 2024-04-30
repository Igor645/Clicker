var moveSpeed = 1; 
var scaleFactor = 0.1; 
var lastPositions = []; 
var minSpacing = 50; 

function createTriangle() {
    const img = document.createElement('img');
    img.src = 'images/triangle.svg';
    img.classList.add('triangle', 'triangle-svg');
    img.style.position = 'absolute';

    let newPosition;
    let tooClose;

    do {
        newPosition = Math.random() * (window.innerWidth);
        tooClose = lastPositions.some(pos => Math.abs(pos - newPosition) < minSpacing);
    } while (tooClose);

    lastPositions.push(newPosition);
    if (lastPositions.length > 5) lastPositions.shift();

    img.style.right = `${newPosition}px`;
    img.style.top = `${window.innerHeight - 500}px`;
    const rotation = Math.random() * 360;
    img.style.transform = `rotate(${rotation}deg) scale(${scaleFactor})`;

    document.body.appendChild(img);

    let interval = setInterval(() => {
        let currentTop = parseInt(img.style.top, 10);
        img.style.top = `${currentTop - moveSpeed}px`;
        if (currentTop <= -450) {
            clearInterval(interval);
            img.remove();
        }
    }, 20);
}

createTriangleInterval = setInterval(createTriangle, 500);

function updateTriangleAnimation(newTimer, newScaleFactor, newSpeed) {
    clearInterval(createTriangleInterval);
    timer = newTimer;
    scaleFactor = newScaleFactor;
    moveSpeed = newSpeed;
    createTriangleInterval = setInterval(createTriangle, timer);
}