// pages/api/generate-content.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { artefact, prompt, sector, framework } = JSON.parse(req.body);

  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful project manager who generates project artefacts in rich Markdown format. Ensure the Markdown output is well-structured and formatted." 
          },
          {
            role: "user",
            content: `Generate a ${artefact} with the following details: ${prompt}, in the ${sector} sector and following ${framework} framework. Please use Markdown formatting for sections, bullet points, tables, and any other relevant structures.`,
          },
        ],
        max_tokens: 500, // Adjust this value based on the expected length of content
      });
      

    //console.log(completion);
    const content = completion.choices[0]?.message || '';
    //console.log(content);
    res.status(200).json(content);
    //res.status(200).json({ role: 'assistant', content: 'test' });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
}
