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
        if (!form.contact || !form.description || !form.urgency) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }
        const res = await fetch('/api/send-email', {
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
        alert("Proyecto solicitado con éxito. Nos pondremos en contacto contigo pronto.");
        setForm({ contact: "", description: "", urgency: "", price: "" });
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6 max-w-lg max-auto">
            <div>
                <Label htmlFor="contact" className='block text-sm font-medium text-gray-700 mb-1'>
                    Email de contacto
                </Label>
                <Input
                    id="contact"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="Ingrese su teléfono o email"
                    required
                    className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                />
            </div>
            <div>
                <Label htmlFor="description" className='block text-sm font-medium text-gray-700 mb-1'>
                    Descripción
                </Label>
                <Input
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe tu idea..."
                    required
                    className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                />
            </div>
            <div>
                <Label htmlFor="urgency" className='block text-sm font-medium text-gray-700 mb-1'>
                    Urgencia
                </Label>
                <Input
                    id="urgency"
                    value={form.urgency}
                    onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                    placeholder="¿Con qué urgencia necesitas este proyecto?"
                    required
                    className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                />
            </div>
            <div>
                <Label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Estimar precio (opcional)
                </Label>

                <div className="flex">
                    <Input
                        id="price"
                        value={form.price}
                        placeholder="Haz clic en ESTIMAR"
                        className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        readOnly
                    />
                    <Button
                        onClick={estimatePrice}
                        type="button"
                        className="bg-indigo-600 hover:bg-indigo-700 ml-4 text-white px-4 py-2 rounded-r-md transition-colors"
                    >
                        ESTIMAR ⚡
                    </Button>
                </div>
            </div>
            <div className="flex space-x-3">
                {/* <Button onClick={estimateHours} type="button" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md">
                    Estimar horas
                </Button> */}
                <Button onClick={handleSubmit} type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md">
                    Solicitar proyecto
                </Button>
            </div>
        </form>
    )
}