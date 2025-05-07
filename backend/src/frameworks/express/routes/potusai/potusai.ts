import express from "express";
import { withAuth } from "../../middlewares/withAuth";
import { Response, Request } from "express";
import { createCustomTokenAI } from "../../../../services/openai/prompts/create-structure-custom-create-mongo-AI";
import { isParsableJSON } from "../../../../services/utils/json";

export const potusaiRouter = express.Router();

potusaiRouter.post(
  "/custom/prediction",
  //@ts-ignore
  withAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, type } = req.body;

      let resGPT: any = {};
      let final: any = null;

      const payload: {
        text: string;
        historical?: {
          role: "system" | "user" | "assistant";
          content: string;
        }[];
        front_historical?: {
          role: "system" | "user" | "assistant";
          content: string;
        }[];
      } = {
        text: text,
      };

      if (req.body.historical) {
        payload.historical = req.body.historical;
      }
      try {
        let numberOfTry = 0;
        let match: any = null;

        let jsonString: any;

        do {
          numberOfTry += 1;
          if (numberOfTry > 1) {
            payload.historical?.push({
              role: "user",
              content: "WARNING JSON cannot be parsed with JSON.parse()",
            });
          }
          resGPT = await createCustomTokenAI(payload);

          const content = resGPT.result.content;

          match = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (match && match[1]) {
            jsonString = match[1]
              .replace(/\\\s/g, "") // Supprime les backslashes suivis d'un espace
              .replace(/\\"/g, '"'); // Remplace `\"` par `"`, si nécessaire
          }
        } while (!isParsableJSON(jsonString) && numberOfTry <= 5);

        if (numberOfTry === 6) {
          res.json({
            status: 500,
            numberOfTry,
            error: "Impossible to parse JSON",
          });
          return;
        }

        const json = JSON.parse(jsonString);

        if (isParsableJSON(jsonString)) {
          if (resGPT.result.content) {
            resGPT.result.content = resGPT.result.content
              .replace(/```json\s*[\s\S]*?\s*```/, "")
              .trim();
          }

          final = { ...json };

          res.json({
            status: 200,
            numberOfTry,
            resGPT: { ...resGPT, structure: final },
          });
          return;
        } else {
          res.json({
            status: 500,
            numberOfTry,
            error: "Impossible to parse JSON",
          });
          return;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error in custom prediction:", errorMessage);
        res.json({
          status: 500,
          error: "Failed to process AI response",
          details: errorMessage,
        });
        return;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Unexpected error:", errorMessage);
      res.json({
        status: 500,
        error: "Internal server error",
        details: errorMessage,
      });
      return;
    }
  }
);
