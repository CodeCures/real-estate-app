import OpenAI from "openai";
import { promptInstruction } from ".";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateQuery(prompt: string): Promise<string> {
    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: promptInstruction(prompt) }],
        model: 'gpt-4o',
    });

    return formatSqlQuery(chatCompletion.choices[0].message.content).trim()
}

const formatSqlQuery = (sql: string) => {
    return sql.replace('\n', ' ').replace('```sql', '').replace('```', '')
}

export default { generateQuery }