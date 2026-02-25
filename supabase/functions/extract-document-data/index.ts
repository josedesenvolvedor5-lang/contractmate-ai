import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { variables, images } = await req.json();

    if (!variables || !Array.isArray(variables) || variables.length === 0) {
      return new Response(JSON.stringify({ error: "Variables array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify({ error: "At least one image is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const variablesList = variables.map((v: { name: string; displayName: string }) => 
      `- "${v.name}" (${v.displayName})`
    ).join("\n");

    const prompt = `Você é um especialista em OCR e extração de dados de documentos brasileiros.
Analise as imagens de documentos fornecidas e extraia os seguintes campos:

${variablesList}

INSTRUÇÕES:
- Extraia APENAS os campos listados acima
- Se um campo não for encontrado, retorne string vazia
- Para CPF, mantenha a formatação XXX.XXX.XXX-XX
- Para RG, mantenha a formatação original
- Para datas, use o formato DD/MM/AAAA
- Retorne APENAS um JSON válido no formato:
{
  "results": [
    { "name": "nome_do_campo", "value": "valor_extraido", "confidence": 0.95 }
  ]
}
- confidence deve ser um número entre 0 e 1 indicando sua certeza`;

    const imageContents = images.map((base64: string) => ({
      type: "image_url" as const,
      image_url: { url: base64 },
    }));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              ...imageContents,
            ],
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response (may be wrapped in markdown code block)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON in response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
