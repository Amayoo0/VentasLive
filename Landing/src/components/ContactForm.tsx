import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';


export default function ContactForm() {
    const [form, setForm] = useState({
        contact: "",
        description: "",
        urgency: "",
        price: "",
    });

    async function estimateHours() {
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
    }

    async function estimatePrice() {
        const res = await fetch('/api/estimate-price', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: form.description,
                urgency: form.urgency,
            }),
        });
        const data = await res.json();
        if (!res.ok) {
            console.error("Error al obtener la estimación de precio:", data);
            alert("Error al procesar la solicitud. Por favor, inténtalo de nuevo.");
            return;
        }
        setForm({ ...form, price: data.price });
        alert("Estimación de precio: " + data.price + " euros");
    }


    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
            console.error("Error al enviar el formulario:", data);
            alert("Error al enviar el formulario. Por favor, inténtalo de nuevo.");
            return;
        }
        setForm({ contact: "", description: "", urgency: "", price: "" });
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
            <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                    id="price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Realice una estimación de precio por adelantado"
                />
            </div>


            <Button onClick={estimateHours} type="button">Estimar horas</Button>
            <Button onClick={estimatePrice} type="button">Estimar precio</Button>
            <Button onClick={handleSubmit} type="submit">Enviar</Button>
        </form>
    )
}