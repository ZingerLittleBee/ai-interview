export const text_to_speech = async (prompt: string) => {
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

  // 播放
  audio.play();

  return audio;
};
