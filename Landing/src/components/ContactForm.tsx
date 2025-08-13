import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';


export default function ContactForm() {
    const [form, setForm] = useState({
        contact: "",
        description: "",
        urgency: "",
    });

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        const res = await fetch('/api/estimate-hours', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: form.description,
            }),
        });
        const data = await res.json();
        if (!res.ok) {
            console.error("Error al obtener la estimación de horas:", data);
            alert("Error al procesar la solicitud. Por favor, inténtalo de nuevo.");
            return;
        }
        alert("Estimación de horas: " + data.hours);
        setForm({ contact: "", description: "", urgency: "" });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="contact">Teléfono/Email</Label>
                <Input
                    id="contact"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="Ingrese su teléfono o email"
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe tu idea. Hazlo lo más detallado posible. Nos ayudará!"
                    required
                />
            </div>
            <div>
                <Label htmlFor="urgency">Urgencia</Label>
                <Input
                    id="urgency"
                    value={form.urgency}
                    onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                    placeholder="Muy urgente! Urgente, Normal, Poco urgente..."
                    required
                />
            </div>

            <Button type="submit">Enviar</Button>
        </form>
    )
}