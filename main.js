let model, webcam, labelContainer, maxPredictions;
const TM_URL = "https://teachablemachine.withgoogle.com/models/ubdJY7c1-/"; // User's Teachable Machine model URL

// Generic images for display based on prediction for Teachable Machine tab
const genericImages = {
    "남성": "https://via.placeholder.com/200/0000FF/FFFFFF?text=Generic+Male", // Blue placeholder
    "여성": "https://via.placeholder.com/200/FFC0CB/000000?text=Generic+Female" // Pink placeholder
};

// Dinner menu items for the Menu Selector tab
const menuItems = [
    "김치찌개", "불고기", "비빔밥", "삼겹살", "된장찌개", "순두부찌개", "갈비찜", "해물파전", "떡볶이", "잡채",
    "파스타", "스테이크", "피자", "햄버거", "리조또", "샐러드", "라자냐", "수프", "샌드위치", "오믈렛",
    "초밥", "라멘", "돈까스", "우동", "규동", "튀김", "오코노미야끼", "타코야끼", "야끼소바", "사시미"
];

let tabInitialized = {
    'tab-content-menu': false,
    'tab-content-contact': false,
    'tab-content-teachable-machine': false
};

// Function to switch tabs
function showTab(tabId) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');
    // Activate the clicked tab button
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');

    // Initialize tab content if not already initialized
    if (!tabInitialized[tabId]) {
        if (tabId === 'tab-content-menu') {
            initMenuSelector();
        } else if (tabId === 'tab-content-teachable-machine') {
            // Teachable Machine init should be triggered by its own "Start" button for webcam access
            // initTeachableMachine(); // Do not auto-start webcam
        }
        tabInitialized[tabId] = true;
    }
}


// --- Teachable Machine Logic ---
async function initTeachableMachine() {
    const modelURL = TM_URL + "model.json";
    const metadataURL = TM_URL + "metadata.json";

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
    document.getElementById("webcam-container").innerHTML = ''; // Clear previous content if any
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ''; // Clear previous content
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    if (webcam && webcam.canvas) { // Ensure webcam is initialized and playing
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }
}

async function predict() {
    if (!model || !webcam || !webcam.canvas) return; // Ensure model and webcam are ready

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    let highestProbability = 0;
    let predictedClass = "";

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        if (labelContainer.childNodes[i]) {
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }

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

// --- Dinner Menu Selector Logic ---
function initMenuSelector() {
    const generateBtn = document.getElementById('generate-btn');
    const menuDisplay = document.getElementById('menu-display');

    // 저녁 메뉴 선택 함수
    function selectDinnerMenu() {
        const randomIndex = Math.floor(Math.random() * menuItems.length);
        return menuItems[randomIndex];
    }

    // 메뉴를 화면에 표시하는 함수
    function displayMenu(menu) {
        menuDisplay.innerHTML = ''; // 이전 메뉴 삭제
        const menuItemElement = createMenuItemElement(menu);
        menuDisplay.appendChild(menuItemElement);
    }

    // 메뉴 항목 DOM 요소 생성 함수
    function createMenuItemElement(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.textContent = item;
        return itemElement;
    }

    // 버튼 클릭 이벤트
    if (generateBtn) { // Ensure button exists before adding listener
        generateBtn.addEventListener('click', () => {
            const selectedMenu = selectDinnerMenu();
            displayMenu(selectedMenu);
        });
    }

    // 초기 로딩 시에도 메뉴를 한 번 선택하여 보여주기
    if (menuDisplay) { // Ensure display element exists
        displayMenu(selectDinnerMenu());
    }
}


// --- Global DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
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
        } else {
            // Set initial button text based on default (dark) mode
            themeToggle.textContent = '☀️';
        }
    }


    // Initialize the default tab
    showTab('tab-content-menu');
});
