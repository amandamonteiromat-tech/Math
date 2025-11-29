import { GoogleGenAI, Type } from "@google/genai";
import { Question, GradeLevel } from '../types';

// Helper to generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateMathQuestion = async (topic: string, difficulty: string, gradeLevel: GradeLevel): Promise<Omit<Question, 'createdAt'>> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Map grade level to readable text for the AI
    const gradeTextMap: Record<GradeLevel, string> = {
      '6ano': '6º Ano do Ensino Fundamental II',
      '7ano': '7º Ano do Ensino Fundamental II',
      '8ano': '8º Ano do Ensino Fundamental II',
      '9ano': '9º Ano do Ensino Fundamental II'
    };

    const gradeContext = gradeTextMap[gradeLevel];
    
    const prompt = `Gere uma pergunta de matemática de múltipla escolha para alunos do ${gradeContext}.
    Tópico: "${topic}". 
    Nível de dificuldade: ${difficulty}.
    Certifique-se de que o assunto é adequado à BNCC para este ano escolar.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "O enunciado da pergunta" },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "4 alternativas de resposta" 
            },
            correctOptionIndex: { type: Type.INTEGER, description: "O índice (0-3) da resposta correta no array de opções" },
            category: { type: Type.STRING, description: "Uma categoria curta para a questão (ex: Geometria, Álgebra)" }
          },
          required: ["text", "options", "correctOptionIndex", "category"]
        }
      }
    });

    const json = JSON.parse(response.text || '{}');

    return {
      id: generateId(),
      text: json.text,
      options: json.options,
      correctOptionIndex: json.correctOptionIndex,
      category: json.category,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      gradeLevel: gradeLevel
    };

  } catch (error) {
    console.error("Erro ao gerar questão com IA:", error);
    throw new Error("Falha ao gerar questão. Verifique sua chave de API ou tente novamente.");
  }
};