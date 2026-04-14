"use client";

import { useEffect, useState } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  totalInvestment: number;
  projectCount: number;
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      });
  }, []);

  const totalInvestment = clients.reduce((sum, c) => sum + c.totalInvestment, 0);
  const averageInvestment = clients.length > 0 ? totalInvestment / clients.length : 0;

  if (loading) {
    return <div className="p-8 text-center">Cargando clientes...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestión de Clientes</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">Total Clientes</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{clients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Inversión Total</p>
          <p className="text-3xl font-bold text-green-600 mt-2">${totalInvestment.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-medium">Inversión Promedio</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">${Math.round(averageInvestment).toLocaleString()}</p>
        </div>
      </div>

      {/* Grid de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">
                    {client.city}, {client.province}
                  </p>
                </div>
                <span className="text-3xl">🏢</span>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="text-sm">
                  <p className="text-gray-600">📧 Email</p>
                  <p className="text-blue-600 font-mono text-xs">{client.email}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">📞 Teléfono</p>
                  <p className="font-semibold text-gray-900">{client.phone}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">📍 Dirección</p>
                  <p className="text-gray-900">{client.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-blue-600 font-medium">Proyectos</p>
                  <p className="text-2xl font-bold text-blue-900">{client.projectCount}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-green-600 font-medium">Inversión</p>
                  <p className="text-lg font-bold text-green-900">
                    ${client.totalInvestment.toLocaleString()}
                  </p>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Ver Proyectos
              </button>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No hay clientes registrados</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            + Agregar Nuevo Cliente
          </button>
        </div>
      )}
    </div>
  );
}
