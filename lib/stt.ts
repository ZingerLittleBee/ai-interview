export const speechToText = (callback?: (text: string) => void) => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "zh-Hans";
  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    console.log(result[0].transcript);
    callback?.(result[0].transcript);
  };
  recognition.start(); // 开始语音识别
};
