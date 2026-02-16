document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');

    // 로또 번호 생성 함수
    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // 번호를 화면에 표시하는 함수
    function displayNumbers(numbers) {
        numbersDisplay.innerHTML = ''; // 이전 번호 삭제
        numbers.forEach((number, index) => {
            // 순차적으로 공이 나타나는 애니메이션 효과
            setTimeout(() => {
                const ball = createBall(number);
                numbersDisplay.appendChild(ball);
            }, index * 200);
        });
    }

    // 로또 공 DOM 요소 생성 함수
    function createBall(number) {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.textContent = number;
        ball.dataset.number = number; // 숫자에 따라 다른 스타일을 적용하기 위한 데이터 속성
        return ball;
    }

    // 버튼 클릭 이벤트
    generateBtn.addEventListener('click', () => {
        const lottoNumbers = generateLottoNumbers();
        displayNumbers(lottoNumbers);
    });

    // 초기 로딩 시에도 번호를 한 번 생성하여 보여주기
    displayNumbers(generateLottoNumbers());
});
