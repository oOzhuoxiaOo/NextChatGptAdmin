const API_URL = 'https://api.deepseek.com/v1'; // 替换为实际的API URL
const API_KEY = 'sk-a11cc5d677e5442d87b5ccf605352ced'; // 替换为实际的API密钥
import express from "express";
import cors from "cors"; // 引入cors库
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: API_URL,
    apiKey: API_KEY
});

const app = express();
app.use(cors()); // 使用cors中间件

app.get('/api/v1', async (req, res) => {
    const { content } = req.query;
    console.log("content", content);
    let stream = await requestOpenAi(req.query.content);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const event of stream) {
        let resultContent = event.choices[0].delta.content;
        console.log("resultContent", resultContent);
        res.write(resultContent)
    }
    return res.end();
});

async function requestOpenAi(content) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: content }],
        model: "deepseek-chat",
        stream: true,
    });

    // console.log("stream", completion);
    // for await (const event of completion) {
    //     console.log(event.choices[0].delta);
    // }

    return completion;
}

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`);
});


