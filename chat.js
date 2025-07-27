export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem não fornecida' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
}