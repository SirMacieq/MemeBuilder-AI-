import OpenAI from "openai";
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

const openai = new OpenAI();

export async function chatWithGPT({ prompt, historical }: { prompt: string, historical?: { role: "system" | "user" | "assistant", content: string }[] }) {
    //console.log("prompt", prompt);

    const messages = historical
        ? historical.filter(msg => ['system', 'user', 'assistant'].includes(msg.role))
        : [
            { role: "system", content: "You are a helpful assistant." }
        ];

    messages.push({
        role: "user",
        content: prompt,
    });

    console.time()

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Make sure this model is correct
        //@ts-ignore
        messages,
    });

    console.timeEnd()
    
    console.log("COMP", completion.choices[0].message)
    //@ts-ignore
    messages.push(completion.choices[0].message)

    return { result: completion.choices[0].message, historical: messages };
}