const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const HF_TOKEN = process.env.HF_TOKEN; // ✅ Используем переменную окружения
const MODEL_URL = "https://api-inference.huggingface.co/models/sberbank-ai/rugpt3large_based_on_gpt2";

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

app.post('/api/analyze', async (req, res) => {
    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({ error: "Введите текст для анализа." });
    }

    try {
        const response = await fetch(MODEL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `Проанализируй текст: "${text}". Ответь кратко и по существу.`,
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при запросе к Hugging Face." });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
