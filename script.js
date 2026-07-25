const canvas = document.getElementById('birthdayCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 375;
canvas.height = 812;

let hearts = [];
let treeAlpha = 0;
let animationStarted = false;

// Heart Shape Math Function
function getHeartPosition(t, scale = 15) {
    let x = scale * (16 * Math.sin(t) ** 3);
    let y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: canvas.width / 2 + x, y: canvas.height / 2.5 + y };
}

function drawTreeBranch(startX, startY, length, angle, depth) {
    if (depth === 0) return;
    
    let endX = startX + length * Math.sin(angle);
    let endY = startY - length * Math.cos(angle);

    ctx.strokeStyle = '#4a2511';
    ctx.lineWidth = depth * 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    drawTreeBranch(endX, endY, length * 0.75, angle - 0.3, depth - 1);
    drawTreeBranch(endX, endY, length * 0.75, angle + 0.3, depth - 1);
}

function startAnimation() {
    if (animationStarted) return;
    animationStarted = true;

    // Step 1: Fade out initial background & show tree growing
    let progress = 0;
    function animateTree() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background gradient shift
        ctx.fillStyle = "#fde1e9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Tree Trunk & Branches
        ctx.save();
        ctx.translate(0, 100);
        drawTreeBranch(canvas.width / 2, 350, 90, 0, 6);
        ctx.restore();

        progress += 0.02;
        if (progress < 1) {
            requestAnimationFrame(animateTree);
        } else {
            startBlooming();
        }
    }
    animateTree();
}

function startBlooming() {
    let count = 0;
    const interval = setInterval(() => {
        let t = Math.random() * Math.PI * 2;
        let pos = getHeartPosition(t, 12 + Math.random() * 4);
        hearts.push({
            x: pos.x,
            y: pos.y,
            size: Math.random() * 10 + 8,
            color:['#ff3366', '#ff6699', '#ff99cc', '#ffb6c1', '#ff1493'][Math.floor(Math.random()*5)]
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fde1e9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(0, 100);
        drawTreeBranch(canvas.width / 2, 350, 90, 0, 6);
        ctx.restore();

        // Draw all bloomed hearts
        hearts.forEach(h => {
            ctx.fillStyle = h.color;
            ctx.beginPath();
            ctx.arc(h.x, h.y, h.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        });

        count++;
        if (count > 250) {
            clearInterval(interval);
            document.getElementById('overlay-text').classList.add('active');
            document.querySelector('.final-wish').classList.add('visible');
        }
    }, 20);
}

// Click to trigger animation
canvas.addEventListener('click', startAnimation);

// Initial placeholder text render
ctx.fillStyle = "#d12e66";
ctx.font = "bold 35px sans-serif";
ctx.textAlign = "center";
ctx.fillText("Tap to Aim for Her Heart 🏹", canvas.width / 2, canvas.height / 2);

