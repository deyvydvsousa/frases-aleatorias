const quoteEl = document.getElementById('quote');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyBtn');

async function fetchRandomQuote() {
  quoteEl.textContent = 'Carregando...';
  quoteEl.style.opacity = 0.6;

  try {
    const res = await fetch('https://api.adviceslip.com/advice?cachebust=' + Date.now());
    if (!res.ok) throw new Error('Erro ao buscar frase');
    const data = await res.json();
    const englishQuote = data.slip.advice;

    const translateRes = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        englishQuote
      )}&langpair=en|pt`
    );
    const translateData = await translateRes.json();
    const translatedQuote =
      translateData.responseData.translatedText || englishQuote;

    quoteEl.textContent = `"${translatedQuote}"`;
  } catch (error) {
    console.error('Erro ao carregar frase:', error);
    quoteEl.textContent = 'Não foi possível carregar a frase 😔';
  }

  quoteEl.style.opacity = 1;
}

async function copyCurrentQuote() {
  const text = quoteEl.textContent.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => (copyBtn.textContent = 'Copiar'), 1200);
  } catch {
    alert('Não foi possível copiar.');
  }
}

newQuoteBtn.addEventListener('click', fetchRandomQuote);
copyBtn.addEventListener('click', copyCurrentQuote);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchRandomQuote();
});
document.addEventListener('DOMContentLoaded', fetchRandomQuote);
