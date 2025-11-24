
import { GoogleGenAI, Type } from "@google/genai";
import { NlToCpcResult, CpcToNlResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nlToCpcPrompt = (sentence: string) => `
Você é um especialista em Lógica Proposicional Clássica (CPC). Sua tarefa é converter uma frase em linguagem natural (português) para uma fórmula bem-formada em CPC.

Analise a frase a seguir: "${sentence}"

Siga estas regras estritamente:
1.  Identifique as proposições atômicas na frase.
2.  Atribua uma variável proposicional única (P, Q, R, S, ...) a cada proposição atômica.
3.  Mapeie os conectivos lógicos da linguagem natural para os símbolos do CPC:
    - "e" -> ∧
    - "ou" -> ∨
    - "não" -> ¬
    - "se ... então" -> →
    - "se e somente se" -> ↔
4.  Construa a fórmula final em CPC, usando parênteses para garantir a ordem de precedência correta.
5.  Retorne o resultado no formato JSON especificado. A fórmula deve ser a representação mais precisa da estrutura lógica da frase.
`;

const cpcToNlPrompt = (formula: string, propositions?: Record<string, string>) => `
Você é um especialista em Lógica Proposicional Clássica (CPC) e um escritor proficiente em português. Sua tarefa é converter uma fórmula de CPC em uma frase coesa e gramaticalmente correta em linguagem natural.

Fórmula: "${formula}"

${propositions ? 
`Use os seguintes significados para as proposições:
${Object.entries(propositions).map(([key, value]) => `- ${key}: "${value}"`).join('\n')}
` 
: 
'Primeiro, gere significados plausíveis e cotidianos em português para cada variável proposicional na fórmula. Os significados devem ser frases completas e simples.'
}

Siga estas regras:
1.  Traduza os símbolos lógicos para seus equivalentes em português:
    - ∧ -> "e"
    - ∨ -> "ou"
    - ¬ -> "não"
    - → -> "se ... então"
    - ↔ -> "se e somente se"
2.  Construa uma única frase em português que represente fielmente a estrutura lógica da fórmula. A frase deve ser natural e de fácil compreensão.
3.  Retorne o resultado no formato JSON especificado, incluindo a frase gerada e o mapa de proposições utilizado (seja o fornecido ou o que você gerou).
`;


export const convertNlToCpc = async (sentence: string): Promise<NlToCpcResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: nlToCpcPrompt(sentence),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            formula: { type: Type.STRING },
            propositions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  variable: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ["variable", "meaning"],
              },
            },
          },
          required: ["formula", "propositions"],
        },
      },
    });

    const resultText = response.text;
    return JSON.parse(resultText) as NlToCpcResult;
  } catch (error) {
    console.error("Error calling Gemini API for NL to CPC:", error);
    throw new Error("Não foi possível converter a frase. Verifique a entrada e tente novamente.");
  }
};

export const convertCpcToNl = async (formula: string, propositions?: Record<string, string>): Promise<CpcToNlResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: cpcToNlPrompt(formula, propositions),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            propositions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  variable: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ["variable", "meaning"],
              },
            },
          },
          required: ["sentence", "propositions"],
        },
      },
    });

    const resultText = response.text;
    return JSON.parse(resultText) as CpcToNlResult;
  } catch (error) {
    console.error("Error calling Gemini API for CPC to NL:", error);
    throw new Error("Não foi possível converter a fórmula. Verifique a entrada e tente novamente.");
  }
};
