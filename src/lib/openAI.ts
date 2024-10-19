import { Configuration, OpenAIApi } from "openai-edge";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export async function generateImagePrompt(name: string) {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALLE API to generate a thumbnail. The description should be minimalistic and flat styled.",
          },
          {
            role: "user",
            content: `Please generate a thumbnail description for my notebook titled ${name}`,
          },
        ],
      });
  
      const data = await response.json();

    // Handle insufficient quota or other errors
    if (data.error && data.error.code === "insufficient_quota") {
      throw new Error("You have exceeded your OpenAI API quota. Please check your plan and billing details.");
    }

    // Ensure choices array exists and has at least one item
    if (data.choices && data.choices.length > 0) {
      const image_description = data.choices[0].message.content;
      return image_description as string;
    } else {
      console.log("Unexpected API response format: ", data);
      throw new Error("No choices found in the OpenAI API response");
    }
  } catch (error) {
    console.log("Error generating image prompt:", error);
    throw error;
  }
}
export async function generateImage(image_description: string) {
    try {
      const response = await openai.createImage({
        prompt: image_description,
        n: 1,
        size: "256x256",
      });
      const data = await response.json();
      const image_url = data.data[0].url;
      return image_url as string;
    } catch (error) {
      console.error(error);
    }
 }