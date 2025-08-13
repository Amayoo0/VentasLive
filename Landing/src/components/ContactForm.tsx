import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';


export default function ContactForm() {
    const [form, setForm] = useState({
        contact: "",
        description: "",
        urgency: "",
    });

    function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        console.log("Form submitted:", form);
        alert("Datos enviados correctamente");
        setForm({
            contact: "",
            description: "",
            urgency: "",
        });
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
        </form>
    )
}