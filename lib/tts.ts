export const textToSpeech = async (prompt: string): Promise<void> => {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });

  const data = await response.arrayBuffer();
  // 创建 audio 元素
  const audio = new Audio();

  // 创建 blob 对象
  const audioBlob = new Blob([data], { type: "audio/mpeg" });

  // URL.createObjectURL 生成 blob URL
  const audioUrl = URL.createObjectURL(audioBlob);

  // 设置音频源
  audio.src = audioUrl;

  audio.addEventListener('ended', () => {
    console.log('音频播放完毕');
    URL.revokeObjectURL(audioUrl);
  });

  // 播放
  return audio.play();
};
