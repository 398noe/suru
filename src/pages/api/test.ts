import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export const test = async (req: NextApiRequest, res: NextApiResponse) => {
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
        res.status(200).json({
            answer: `取得 : ${question}`
        });
    } catch (error: any) {
        console.error(`Error Request: ${error}`);
        res.status(500).json({
            error: {
                message: "An error occured during your request."
            }
        });
    }
}

export default test;