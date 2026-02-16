let model, webcam, labelContainer, maxPredictions;
const TM_URL = "https://teachablemachine.withgoogle.com/models/ubdJY7c1-/"; // User's Teachable Machine model URL

// Generic images for display based on prediction for Teachable Machine tab
const genericImages = {
    "남성": "https://via.placeholder.com/200/0000FF/FFFFFF?text=Generic+Male", // Blue placeholder
    "여성": "https://via.placeholder.com/200/FFC0CB/000000?text=Generic+Female" // Pink placeholder
};

// --- Translations ---
const translations = {
    "ko": {
        "site_title": "다기능 사이트",
        "main_title": "다기능 사이트",
        "main_description": "다양한 기능을 한 곳에서 만나보세요!",
        "lang_ko": "한국어",
        "lang_en": "English",
        "tab_intro": "사이트 소개",
        "tab_menu": "저녁 메뉴",
        "tab_contact": "제휴 문의",
        "tab_ml": "닮은꼴 찾기",
        "intro_title": "사이트 소개",
        "intro_p1": "환영합니다! 이 사이트는 다양한 편의 기능을 한곳에 모아 사용자님의 일상에 작은 즐거움과 도움을 드리고자 만들어졌습니다.",
        "intro_p2": "저녁 식사 메뉴를 고민할 때, 새로운 파트너십을 제안하고 싶을 때, 혹은 인공지능을 활용한 재미있는 경험을 원할 때, 언제든지 저희 사이트를 방문해주세요.",
        "intro_p3": "저희는 사용자님의 피드백을 소중히 여기며, 지속적으로 기능을 개선하고 새로운 재미를 제공하기 위해 노력하겠습니다. 많은 관심 부탁드립니다!",
        "menu_title": "오늘 뭐 먹지?",
        "menu_prompt": "메뉴를 돌려보세요!",
        "btn_start": "시작",
        "btn_stop": "정지",
        "comments_title": "댓글",
        "noscript_disqus": "JavaScript를 활성화하면 Disqus 기반 댓글을 볼 수 있습니다.",
        "contact_title": "제휴 문의",
        "contact_description": "제휴 관련 문의사항이 있으시면 아래 양식을 작성해주세요.",
        "form_name": "이름:",
        "form_email": "이메일:",
        "form_subject": "제목:",
        "form_message": "문의 내용:",
        "btn_contact_submit": "문의하기",
        "ml_title": "닮은꼴 찾기",
        "ml_description": "사진을 찍으면 가장 닮은 성별의 대표 이미지를 보여드립니다.",
        "btn_camera_start": "카메라 시작",
        "ml_result_label": "분류 결과:",
        "ml_predicting": "분류 중...",
        "ml_no_image": "대표 이미지를 찾을 수 없습니다.",
        "footer_text": "&copy; 2026 행운을 빌어요!",
        "placeholder_name": "이름을 입력하세요",
        "placeholder_email": "이메일 주소를 입력하세요",
        "placeholder_subject": "문의 제목을 입력하세요",
        "placeholder_message": "문의 내용을 입력하세요"
    },
    "en": {
        "site_title": "Multi-functional Site",
        "main_title": "Multi-functional Site",
        "main_description": "Discover various features in one place!",
        "lang_ko": "Korean",
        "lang_en": "English",
        "tab_intro": "About Site",
        "tab_menu": "Dinner Menu",
        "tab_contact": "Partnership Inquiry",
        "tab_ml": "Find Your Look-alike",
        "intro_title": "About This Site",
        "intro_p1": "Welcome! This site brings together various convenient features to add a little joy and help to your daily life.",
        "intro_p2": "Whether you're pondering over dinner, looking to propose a new partnership, or seeking fun experiences with AI, feel free to visit us anytime.",
        "intro_p3": "We value your feedback and continuously strive to improve functions and provide new fun. Thank you for your continued interest!",
        "menu_title": "What's for Dinner?",
        "menu_prompt": "Spin for your menu!",
        "btn_start": "Start",
        "btn_stop": "Stop",
        "comments_title": "Comments",
        "noscript_disqus": "Please enable JavaScript to view the comments powered by Disqus.",
        "contact_title": "Partnership Inquiry",
        "contact_description": "If you have any partnership inquiries, please fill out the form below.",
        "form_name": "Name:",
        "form_email": "Email:",
        "form_subject": "Subject:",
        "form_message": "Message:",
        "btn_contact_submit": "Submit Inquiry",
        "ml_title": "Find Your Look-alike",
        "ml_description": "Take a photo and we'll show you a generic image of the most similar gender.",
        "btn_camera_start": "Start Camera",
        "ml_result_label": "Classification Result:",
        "ml_predicting": "Classifying...",
        "ml_no_image": "Generic image not found.",
        "footer_text": "&copy; 2026 Good luck!",
        "placeholder_name": "Enter your name",
        "placeholder_email": "Enter your email address",
        "placeholder_subject": "Enter inquiry subject",
        "placeholder_message": "Enter your message"
    }
};

// Dinner menu items for the Menu Selector tab (will be translated by setLanguage)
const menuItems_ko = [
    "김치찌개", "불고기", "비빔밥", "삼겹살", "된장찌개", "순두부찌개", "갈비찜", "해물파전", "떡볶이", "잡채",
    "파스타", "스테이크", "피자", "햄버거", "리조또", "샐러드", "라자냐", "수프", "샌드위치", "오믈렛",
    "초밥", "라멘", "돈까스", "우동", "규동", "튀김", "오코노미야끼", "타코야끼", "야끼소바", "사시미"
];

const menuItems_en = [
    "Kimchi Stew", "Bulgogi", "Bibimbap", "Samgyeopsal", "Doenjang Stew", "Soft Tofu Stew", "Braised Short Ribs", "Seafood Pancake", "Tteokbokki", "Japchae",
    "Pasta", "Steak", "Pizza", "Hamburger", "Risotto", "Salad", "Lasagna", "Soup", "Sandwich", "Omelet",
    "Sushi", "Ramen", "Donkatsu", "Udon", "Gyudon", "Tempura", "Okonomiyaki", "Takoyaki", "Yakisoba", "Sashimi"
];

let currentMenuItems = menuItems_ko; // Initially set to Korean

let currentActiveTab = 'tab-content-intro'; // Keep track of the currently active tab, now defaults to intro

// Function to stop the webcam when switching tabs
function stopWebcam() {
    if (webcam && webcam.stream && webcam.stream.active) {
        webcam.stop();
        const webcamContainer = document.getElementById("webcam-container");
        if (webcamContainer) {
            webcamContainer.innerHTML = ''; // Clear webcam canvas
        }
        const labelContainer = document.getElementById("label-container");
        if (labelContainer) {
            labelContainer.innerHTML = ''; // Clear labels
        }
        const genderPredictionElement = document.getElementById("gender-prediction");
        if (genderPredictionElement) {
            genderPredictionElement.innerHTML = '';
        }
        const genericImageDisplayElement = document.getElementById("generic-image-display");
        if (genericImageDisplayElement) {
            genericImageDisplayElement.innerHTML = '';
        }
    }
}

// Function to apply translations
function setLanguage(lang) {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translations[lang][`placeholder_${key.split('_')[1]}`]; // Handle placeholders
            } else if (element.tagName === 'TEXTAREA' && element.hasAttribute('placeholder')) {
                element.placeholder = translations[lang][`placeholder_${key.split('_')[1]}`];
            } else if (element.tagName === 'OPTION' && element.hasAttribute('data-key')) {
                element.textContent = translations[lang][key]; // Handle option text specifically
            }
            else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update specific hardcoded texts
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    if (menuToggleBtn) {
        if (isSpinning) {
            menuToggleBtn.textContent = translations[lang]['btn_stop'];
        } else {
            menuToggleBtn.textContent = translations[lang]['btn_start'];
        }
    }

    // Update current menu items array
    currentMenuItems = (lang === 'ko') ? menuItems_ko : menuItems_en;

    // Refresh menu display if on menu tab and spinning is not active
    const menuDisplay = document.getElementById('menu-display');
    if (currentActiveTab === 'tab-content-menu' && !isSpinning && menuDisplay) {
        menuDisplay.innerHTML = '';
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.textContent = translations[lang]['menu_prompt'];
        menuDisplay.appendChild(itemElement);
    }
    
    // Also update placeholder texts in the contact form
    const contactForm = document.querySelector('#tab-content-contact form');
    if (contactForm) {
        contactForm.querySelector('#name').placeholder = translations[lang]['placeholder_name'];
        contactForm.querySelector('#email').placeholder = translations[lang]['placeholder_email'];
        contactForm.querySelector('#subject').placeholder = translations[lang]['placeholder_subject'];
        contactForm.querySelector('#message').placeholder = translations[lang]['placeholder_message'];
    }


    localStorage.setItem('language', lang); // Save preference
}

// Function to switch tabs
function showTab(tabId) {
    // Stop webcam if switching away from Teachable Machine tab
    if (currentActiveTab === 'tab-content-teachable-machine' && tabId !== 'tab-content-teachable-machine') {
        stopWebcam();
    }

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

    currentActiveTab = tabId; // Update current active tab

    // Initialize tab content based on tabId
    if (tabId === 'tab-content-menu') {
        initMenuSelector();
    } else if (tabId === 'tab-content-contact') {
        // No specific JS init needed for contact form, but ensure placeholders are translated
        setLanguage(localStorage.getItem('language') || 'ko'); // Re-apply translations for placeholders
    } else if (tabId === 'tab-content-teachable-machine') {
        // Teachable Machine init should be triggered by its own "Start" button for webcam access
        // initTeachableMachine(); // Do not auto-start webcam
    }
}


// --- Teachable Machine Logic ---
async function initTeachableMachine() {
    // Stop any existing webcam instance before starting a new one
    stopWebcam();

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
    const webcamContainer = document.getElementById("webcam-container");
    if (webcamContainer) {
        webcamContainer.innerHTML = ''; // Clear previous content if any
        webcamContainer.appendChild(webcam.canvas);
    }

    labelContainer = document.getElementById("label-container");
    if (labelContainer) {
        labelContainer.innerHTML = ''; // Clear previous content
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }
}

async function loop() {
    if (webcam && webcam.canvas && webcam.stream && webcam.stream.active) { // Ensure webcam is initialized and playing
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    } else {
        // If webcam is stopped, clear prediction results
        const genderPredictionElement = document.getElementById("gender-prediction");
        if (genderPredictionElement) genderPredictionElement.innerHTML = '';
        const genericImageDisplayElement = document.getElementById("generic-image-display");
        if (genericImageDisplayElement) genericImageDisplayElement.innerHTML = '';
        if (labelContainer) labelContainer.innerHTML = '';
    }
}

async function predict() {
    if (!model || !webcam || !webcam.canvas || !webcam.stream || !webcam.stream.active) return; // Ensure model and webcam are ready and active

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
        genderPredictionElement.innerHTML = `${translations[localStorage.getItem('language') || 'ko']['ml_result_label']} ${predictedClass}`;
        const imageUrl = genericImages[predictedClass];
        if (imageUrl) {
            genericImageDisplayElement.innerHTML = `<img src="${imageUrl}" alt="${predictedClass} 대표 이미지">`;
        } else {
            genericImageDisplayElement.innerHTML = `<p>${translations[localStorage.getItem('language') || 'ko']['ml_no_image']}</p>`;
        }
    } else {
        genderPredictionElement.innerHTML = translations[localStorage.getItem('language') || 'ko']['ml_predicting'];
        genericImageDisplayElement.innerHTML = "";
    }
}

// --- Dinner Menu Selector Logic ---
let isSpinning = false;
let spinInterval = null;
let currentMenuItemElement = null; // To hold the currently displayed menu item element

function initMenuSelector() {
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const menuDisplay = document.getElementById('menu-display');

    // 메뉴 항목 DOM 요소 생성 함수
    function createMenuItemElement(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.textContent = item;
        return itemElement;
    }

    // 메뉴 회전 시작/정지 로직
    if (menuToggleBtn) {
        // Remove existing onclick to prevent multiple assignments
        menuToggleBtn.onclick = null;
        menuToggleBtn.onclick = () => {
            if (isSpinning) {
                // Stop spinning
                clearInterval(spinInterval);
                isSpinning = false;
                menuToggleBtn.textContent = translations[localStorage.getItem('language') || 'ko']['btn_start'];
                // Display the final selected item more clearly
                if (currentMenuItemElement) {
                    menuDisplay.innerHTML = '';
                    menuDisplay.appendChild(currentMenuItemElement);
                }
            } else {
                // Start spinning
                isSpinning = true;
                menuToggleBtn.textContent = translations[localStorage.getItem('language') || 'ko']['btn_stop'];
                spinInterval = setInterval(() => {
                    const randomIndex = Math.floor(Math.random() * currentMenuItems.length); // Use currentMenuItems
                    const randomMenuItem = currentMenuItems[randomIndex];
                    menuDisplay.innerHTML = '';
                    currentMenuItemElement = createMenuItemElement(randomMenuItem);
                    menuDisplay.appendChild(currentMenuItemElement);
                }, 100); // Change item every 100ms for spinning effect
            }
        };
    }

    // 초기 로딩 시 메뉴를 한 번 선택하여 보여주기 (옵션)
    if (menuDisplay) {
        if (menuDisplay.innerHTML === '' || menuDisplay.innerHTML === translations['ko']['menu_prompt'] || menuDisplay.innerHTML === translations['en']['menu_prompt']) {
            const currentLang = localStorage.getItem('language') || 'ko';
            menuDisplay.innerHTML = '';
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.textContent = translations[currentLang]['menu_prompt'];
            menuDisplay.appendChild(itemElement);
        }
    }
}


// --- Global DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const languageSwitcher = document.getElementById('language-switcher');

    // Load saved language or default to Korean
    const savedLanguage = localStorage.getItem('language') || 'ko';
    if (languageSwitcher) {
        languageSwitcher.value = savedLanguage;
        languageSwitcher.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }
    setLanguage(savedLanguage); // Apply initial language

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
    showTab('tab-content-intro');
});
