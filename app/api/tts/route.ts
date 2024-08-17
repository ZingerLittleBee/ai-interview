export async function POST(req: Request, res: Response) {
  const { prompt }: { prompt: string } = await req.json();
  console.log("prompt", prompt);
  const response = await fetch(
    `https://${process.env.RESOURCE_NAME}.openai.azure.com/openai/deployments/tts/audio/speech?api-version=${process.env.API_VERSION}`,
    {
      method: "POST",
      // @ts-ignore
      headers: {
        "api-key": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts",
        input: prompt,
        voice: "alloy",
      }),
    },
  );
  const data = await response.arrayBuffer();
  return new Response(data, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename=speech.mp3`,
    },
  });
}
