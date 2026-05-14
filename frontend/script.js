document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('text');
    const startButton = document.getElementById('startButton');

    const effects = [
        () => { textElement.style.color = getRandomColor(); },
        () => { textElement.style.fontSize = `${Math.random() * 3 + 1}em`; },
        () => { textElement.style.transform = `rotate(${Math.random() * 360}deg)`; },
        () => { textElement.style.opacity = Math.random(); },
        () => { textElement.style.textShadow = `${Math.random() * 10}px ${Math.random() * 10}px 5px ${getRandomColor()}`; }
    ];

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    startButton.addEventListener('click', () => {
        const interval = setInterval(() => {
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            randomEffect();
        }, 500);

        setTimeout(() => {
            clearInterval(interval);
        }, 10000);
    });

    // ✅ Анализ текста
    document.getElementById('analyzeButton').addEventListener('click', async () => {
        const inputText = document.getElementById('textInput').value;
        const outputDiv = document.getElementById('aiOutput');

        if (!inputText.trim()) {
            outputDiv.textContent = 'Введите текст для анализа.';
            return;
        }

        outputDiv.textContent = 'Обработка...';

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: inputText })
            });

            const data = await response.json();

            if (data.error) {
                outputDiv.textContent = `Ошибка: ${data.error}`;
                return;
            }

            outputDiv.textContent = data[0]?.generated_text || 'Не удалось получить ответ.';
        } catch (error) {
            outputDiv.textContent = 'Ошибка сети.';
            console.error(error);
        }
    });

    // ✅ Проверка ИИ
    document.getElementById('testAIButton').addEventListener('click', async () => {
        const resultDiv = document.getElementById('testAIResult');
        resultDiv.textContent = 'Проверка...';

        try {
            const response = await fetch('/api/test-ai');
            const data = await response.json();

            if (data.ok) {
                resultDiv.textContent = '✅ Модель доступна!';
            } else {
                resultDiv.textContent = `❌ Ошибка: ${data.error}`;
            }
        } catch (error) {
            resultDiv.textContent = '❌ Ошибка сети';
            console.error(error);
        }
    });
});
