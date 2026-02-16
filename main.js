let model, webcam, labelContainer, maxPredictions;
const URL = "https://teachablemachine.withgoogle.com/models/ubdJY7c1-/"; // User's Teachable Machine model URL

// Generic images for display based on prediction
const genericImages = {
    "남성": "https://via.placeholder.com/200/0000FF/FFFFFF?text=Generic+Male", // Blue placeholder
    "여성": "https://via.placeholder.com/200/FFC0CB/000000?text=Generic+Female" // Pink placeholder
};

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    let highestProbability = 0;
    let predictedClass = "";

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;

        if (prediction[i].probability > highestProbability) {
            highestProbability = prediction[i].probability;
            predictedClass = prediction[i].className;
        }
    }

    // Display the dominant prediction and a generic image
    const genderPredictionElement = document.getElementById("gender-prediction");
    const genericImageDisplayElement = document.getElementById("generic-image-display");

    if (highestProbability > 0.7) { // Only show prediction if confidence is high enough
        genderPredictionElement.innerHTML = `가장 높은 확률: ${predictedClass}`;
        const imageUrl = genericImages[predictedClass];
        if (imageUrl) {
            genericImageDisplayElement.innerHTML = `<img src="${imageUrl}" alt="${predictedClass} 대표 이미지">`;
        } else {
            genericImageDisplayElement.innerHTML = `<p>대표 이미지를 찾을 수 없습니다.</p>`;
        }
    } else {
        genderPredictionElement.innerHTML = "분류 중...";
        genericImageDisplayElement.innerHTML = "";
    }
}

// Theme toggle logic (from previous task, kept for consistency)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.textContent = '🌙';
    }
});
