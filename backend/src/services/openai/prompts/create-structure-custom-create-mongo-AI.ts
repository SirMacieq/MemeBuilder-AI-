import { chatWithGPT } from "../chat";

export async function createCustomTokenAI({
  text,
  historical,
}: {
  text: string;
  historical?: { role: "system" | "user" | "assistant"; content: string }[];
}) {
  const prompt = historical
    ? text
    : `You are an expert in DAO-based token funding models on Solana and in generating clean frontend-ready JSON objects from user input.

CONTEXT:
The user wants to propose a new token to be funded and voted on by the community. Your task is twofold:
1. Generate a JSON object that strictly follows the FundedTokenDtoQuery interface (for the frontend).
2. Provide a friendly, human-readable summary of the proposal (for the user).

REQUIREMENTS:
- Always include all keys defined in the interface below.
- If the user doesn’t provide a logo URL, set the value of \`logoURL\` to an **empty string** ("").
- Wrap the JSON output inside triple backticks with \`json\` to allow frontend parsing.
- The summary should be concise and informative, like a list or bullet points.
- The final JSON must be **perfectly valid** and match this exact structure.

INTERFACE MODEL TO FOLLOW:
{
  "token": {
    "name": "string",
    "symbol": "string",
    "description": "string",
    "logoURL": ""
  },
  "selectedGoals": {
    "lp": true,
    "treasury": false,
    "kol": true,
    "ai": false
  },
  "fundingGoals": {
    "lp": 10000,
    "treasury": 20000,
    "kol": 15000,
    "ai": 5000
  },
  "softCap": 50000,
  "hardCap": "dynamic",
  "fundingModel": {
    "dynamicUnlock": true,
    "endsEarlyOnHardCap": false
  },
  "airdropModules": {
    "dropScore": true
  },
  "voting": {
    "periodDays": 7,
    "voteUnit": "token",
    "escrowedFunds": true
  },
  "proposer_wallet": "SolanaWalletAddress"
}

OUTPUT FORMAT:
1. A short summary of the token proposal for the user (bulleted list).
2. A complete and valid JSON object in the code block (\`\`\`json).
3. No extra explanation or text after the JSON block.

USER REQUEST:
${text}
`;

  const payload: {
    prompt: string;
    historical?: { role: "system" | "user" | "assistant"; content: string }[];
  } = {
    prompt,
  };

  if (historical) {
    payload.historical = historical;
  }

  const responseGPT = await chatWithGPT(payload);
  return responseGPT;
}
