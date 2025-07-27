export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ erro: 'Mensagem é obrigatória' });
  }

  try {
    const respostaIA = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: mensagem }],
        temperature: 0.7
      })
    });

    const data = await respostaIA.json();

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ resposta: data.choices[0].message.content });
    } else {
      res.status(500).json({ erro: 'Sem resposta da IA' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao se comunicar com a OpenAI' });
  }
}