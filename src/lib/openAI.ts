//import { Configuration, OpenAIApi } from "openai-edge";

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY
// });

// const openai = new OpenAIApi(configuration);

export async function generateImagePrompt(name: string) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000", // Optional, but recommended
                "X-Title": "SmartNote", // Optional, but recommended
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-0528:free", // Model ID
                messages: [
                    {
                        role: "system",
                        content: "You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALLE API to generate a thumbnail. The description should be minimalistic and flat styled.",
                    },
                    {
                        role: "user",
                        content: `Please generate a thumbnail description for my notebook titled ${name}`,
                    },
                ],
            }),
        });

        const data = await response.json();

        // Handle errors
        if (data.error) {
            throw new Error(data.error.message || "Error from OpenRouter API");
        }

        if (data.choices && data.choices.length > 0) {
            const image_description = data.choices[0].message.content;
            return image_description as string;
        } else {
            console.log("Unexpected API response format: ", data);
            throw new Error("No choices found in the OpenRouter API response");
        }
    } catch (error) {
        console.log("Error generating image prompt:", error);
        throw error;
    }
}

export async function generateImage(image_description: string): Promise<string> {
    try {
        const response = await fetch("https://api.imagerouter.io/v1/openai/images/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.IMAGEROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "stabilityai/sdxl-turbo:free",
                prompt: image_description,
                n: 1,
                size: "256x256", // Some free tiers may require specific sizes
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Image generation failed");
        }

        const data = await response.json();
        
        if (!data.data?.[0]?.url) {
            throw new Error("Invalid image generation response format");
        }

        return data.data[0].url;
    } catch (error) {
        console.error("Image generation error:", error);
        throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : String(error)}`);
    }
}