export const config = {
  api: { bodyParser: false }
};

import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    const file = files.image[0];
    const imageData = fs.readFileSync(file.filepath);
    const base64 = imageData.toString("base64");

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      You are a movie recognition assistant.
      Identify the movie name and year if possible from this screenshot.
      Return ONLY the movie title in English.
    `;

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: `data:image/jpeg;base64,${base64}` }
          ]
        }
      ]
    });

    const guess = result.choices?.[0]?.message?.content?.trim() || "Unknown";
    res.status(200).json({ guess });
  });
}
