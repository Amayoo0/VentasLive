import type { APIRoute } from 'astro';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
    try{
        console.log("Received request for estimate-hours API");
        const { description } = await request.json();

        // Request to Ollama local LLM
        const apiUrl = import.meta.env.LLM_API_URL;
        if (!apiUrl) {
            console.error("LLM_API_URL is not defined in environment variables");
            return new Response(
                JSON.stringify({ error: "LLM_API_URL is not configured" }),
                { status: 500 }
            );
        }
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3',
                prompt: `
Eres un experto en gestión de proyectos. 
Basándote en la siguiente descripción, estima cuántas horas de trabajo se necesitarán. 
Devuelve únicamente un número entero (sin texto adicional).

Descripción:
${description}
        `,
                stream: false, // we want the full response at once
            }),
        });
        const data = await response.json();
        console.log("Response from LLM:", data);
        return new Response(
            JSON.stringify({ hours: data.response.trim()}),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error("Error in estimate-hours API:", err);
        return new Response(
            JSON.stringify({ error: "Error al procesar la solicitud" }),
            { status: 500 }
        );
    }
};