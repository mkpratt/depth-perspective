function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

// DIFFERENT COOL COLOR FREQUENCIES
// const frequency = 0.62;
// const frequency = 0.2;
const frequency = 0.25;
// const frequency = 0.15;
// const frequency = 0.3;

let body = document.querySelector('body');
let view = {
    width: window.innerWidth,
    height: window.innerHeight,
}

const lrBorderWidth = view.width / 2 * (0.1);
const lrBorderHeight = view.height / 2 * (0.1);

let elArr = [];
const layers = 20;

for (let i = 1; i <= layers; i++) {
    red = Math.sin(frequency * i + 5.8) * 127 + 128;
    green = Math.sin(frequency * i + 10.8) * 127 + 128;
    blue = Math.sin(frequency * i + 15.8) * 127 + 128;

    if (i === 1) {
        body.style.backgroundColor = RGB2Color(red, green, blue);
    }

    let el = document.createElement('div');
    el.classList.add('layer');
    el.topBottomWidth = (view.height / 2 * (i / layers));
    el.leftRightWidth = (view.width / 2 * (i / layers));
    el.style.borderWidth = el.topBottomWidth + 'px ' + el.leftRightWidth + 'px';
    el.style.borderColor = RGB2Color(red, green, blue);
    el.style.borderStyle = 'solid';
    el.style.zIndex = layers - (i - 1);
    body.appendChild(el);
    
    elArr.push(el);
}

let faceXLabel = document.querySelector(".faceX");
let faceYLabel = document.querySelector(".faceY");

var tracker = new tracking.ObjectTracker('face');

tracker.setInitialScale(1);
tracker.setStepSize(1.2);

tracking.track('#video', tracker, { camera: true });
tracker.on('track', function (event) {
    var maxRectArea = 0;
    var maxRect;
    event.data.forEach(function (rect) {
        if (rect.width * rect.height > maxRectArea) {
            maxRectArea = rect.width * rect.height;
            maxRect = rect;
        }
    });
    if (maxRectArea > 0) {
        var rectCenterX = maxRect.x + (maxRect.width / 2);
        var rectCenterY = maxRect.y + (maxRect.height / 2);

        let facePosX = 100 - Math.round(rectCenterX / 320 * 100);
        let facePosY = Math.round(rectCenterY / 240 * 100);

        // faceXLabel.textContent = 'X: ' + facePosX + '%'; //320
        // faceYLabel.textContent = 'Y: ' + facePosY + '%'; //240
        
        elArr.forEach((el, idx) => {
            let newPosX = -50 + facePosX;
            el.style.marginLeft = (newPosX * (el.leftRightWidth / (layers * (layers / 10)))) + 'px';
            let newPosY = -50 + facePosY;
            el.style.marginTop = (newPosY * (el.topBottomWidth / (layers * (layers / 10)))) + 'px';
        });
    }
});
