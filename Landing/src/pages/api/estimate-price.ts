import type { APIRoute } from 'astro';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
    try{
        console.log("Received request for estimate-price API");
        const { description, urgency } = await request.json();

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
Eres un ingeniero experto en gestión de proyectos. 
Basándote en la siguiente descripción, estima cuántas horas de trabajo se necesitarán.
Una vez tengas las horas estimadas, calcula el precio estimado multiplicado por 20 euros por hora.
Además, considera la urgencia del proyecto y ajusta el precio en consecuencia.
Si el proyecto es urgente, incrementa el precio un 20%.
Cuando termines de hacer tu desarrollo mental, devuelve únicamente un número entero indicando el precio final del proyecto (sin texto adicional).
Es importante que no devuelvas texto adicional, solo el número.

Descripción:
${description}

Urgencia:
${urgency}
        `,
                stream: false, // we want the full response at once
            }),
        });
        const data = await response.json();
        console.log("Response from LLM:", data);
        return new Response(
            JSON.stringify({ price: data.response.trim()}),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error("Error in estimate-price API:", err);
        return new Response(
            JSON.stringify({ error: "Error al procesar la solicitud" }),
            { status: 500 }
        );
    }
};