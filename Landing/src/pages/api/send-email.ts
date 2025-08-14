import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { contact, description, urgency } = body;

        const apiKey = import.meta.env.RESEND_API_KEY;
        const emailTo = import.meta.env.RESEND_EMAIL_TO;

        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
            from: 'Landing <onboarding@resend.dev>',
            to: [emailTo],
            subject: 'Nuevo proyecto de desarrollo web',
            html: `<strong>Contacto:</strong> ${contact}<br>
                   <strong>Descripción:</strong> ${description}<br>
                   <strong>Urgencia:</strong> ${urgency}`,
        });
        if (error) {
            console.error("Error al enviar el correo:", error);
            return new Response(JSON.stringify({ error: "Error al enviar el correo" }), { status: 500 });
        }
        return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (error) {
        console.error("Error en el manejo de la solicitud de envio de email:", error);
        return new Response(JSON.stringify({ error: "Error en el manejo de la solicitud de envio de email" }), { status: 500 });
    }
}