document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const menuDisplay = document.getElementById('menu-display'); // Changed from numbersDisplay
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const menuItems = [
        "김치찌개", "불고기", "비빔밥", "삼겹살", "된장찌개", "순두부찌개", "갈비찜", "해물파전", "떡볶이", "잡채",
        "파스타", "스테이크", "피자", "햄버거", "리조또", "샐러드", "라자냐", "수프", "샌드위치", "오믈렛",
        "초밥", "라멘", "돈까스", "우동", "규동", "튀김", "오코노미야끼", "타코야끼", "야끼소바", "사시미"
    ];

    // Theme toggle
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

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.textContent = '🌙';
    }

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
        itemElement.className = 'menu-item'; // Changed from 'ball'
        itemElement.textContent = item;
        return itemElement;
    }

    // 버튼 클릭 이벤트
    generateBtn.addEventListener('click', () => {
        const selectedMenu = selectDinnerMenu();
        displayMenu(selectedMenu);
    });

    // 초기 로딩 시에도 메뉴를 한 번 선택하여 보여주기
    displayMenu(selectDinnerMenu());
});
