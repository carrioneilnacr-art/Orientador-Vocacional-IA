// Consume SSE without retaining prompts or generated text in performance reports.
export async function measureChatStream(body, now = () => performance.now()) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '', firstTextAt = null, textCharacters = 0, finished = false, streamError = false;
  function line(value) {
    if (!value.startsWith('data:')) return;
    const data = value.slice(5).trim();
    if (!data || data === '[DONE]') return;
    try {
      const event = JSON.parse(data);
      if (event.type === 'error' || event.type === 'abort') streamError = true;
      if (event.type === 'finish') finished = true;
      if (event.type === 'text-delta' && typeof event.delta === 'string' && event.delta.length) {
        firstTextAt ??= now();
        textCharacters += event.delta.length;
      }
    } catch { streamError = true; }
  }
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      buffer += decoder.decode(value,{stream:true});
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      lines.forEach(line);
    }
    buffer += decoder.decode();
    if (buffer.trim()) line(buffer);
  } finally { reader.releaseLock(); }
  return {firstTextAt,textCharacters,finished,streamError,valid:finished && textCharacters > 0 && !streamError};
}
