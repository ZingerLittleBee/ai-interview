import {createAzure} from "@ai-sdk/azure";
import {generateText} from "ai";

const azure = createAzure({
    resourceName: process.env.RESOURCE_NAME,
    apiKey: process.env.API_KEY,
    headers: {
        'api-version': process.env.API_VERSION ?? '',
    },
});

export async function POST(req: Request) {
    const { prompt }: { prompt: string } = await req.json();

    const { text } = await generateText({
        model: azure('gpt-4o'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    return Response.json({ text });
}
