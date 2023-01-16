import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const suru = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured."
            }
        });
        return;
    }

    const question: string = req.body.payload || "";
    if (question.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Payload is empty"
            }
        });
        return;
    }

    try {
        const answer = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: question,
            temperature: 0.9,
            max_tokens: 70,
        });
        res.status(200).json({
            answer: answer.data.choices[0].text
        });
    } catch (error: any) {
        if(error.response) {
            console.error(error.response.status, error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occured during your request."
                }
            });
        }
    }
}

export default suru;