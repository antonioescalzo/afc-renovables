"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface DashboardData {
  metrics: {
    totalProjects: number;
    totalClients: number;
    totalTeams: number;
    totalMaterials: number;
    totalRevenue: number;
    totalHoursWorked: number;
    projectedRevenue: number;
    projectedHours: number;
  };
  projectsByStatus: Array<{ status: string; count: number }>;
  lowInventory: Array<{
    name: string;
    current: number;
    minimum: number;
    location: string;
  }>;
  teamsStats: Array<{
    name: string;
    totalHours: number;
    hourlyRate: number;
  }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  const { metrics, projectsByStatus, lowInventory, teamsStats } = data;

  // Preparar datos para gráficos
  const statusChartData = projectsByStatus.map((item) => ({
    name:
      item.status === "completado"
        ? "Completados"
        : item.status === "en_curso"
          ? "En Curso"
          : "Planificados",
    value: item.count,
  }));

  const teamsChartData = teamsStats.map((team) => ({
    name: team.name,
    horas: team.totalHours,
    ingresos: (team.totalHours * team.hourlyRate).toFixed(0),
  }));

  const projectionData = [
    { mes: "Completados", ingresos: metrics.totalRevenue },
    { mes: "Proyectado", ingresos: metrics.projectedRevenue },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Solar Panel Management System
        </h1>
        <p className="text-gray-600">
          Sistema integral de gestión para empresas de instalación de paneles solares
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Proyectos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {metrics.totalProjects}
              </p>
            </div>
            <span className="text-3xl">🏗️</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Clientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {metrics.totalClients}
              </p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Equipos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {metrics.totalTeams}
              </p>
            </div>
            <span className="text-3xl">👨‍🔧</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${metrics.totalRevenue.toLocaleString()}
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Estado de Proyectos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Estado de Proyectos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Proyecciones de Ingresos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Proyección de Ingresos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="ingresos" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Productividad de Equipos */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Productividad por Equipo</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamsChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" label={{ value: "Horas", angle: -90, position: "insideLeft" }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Ingresos ($)", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="horas" fill="#3b82f6" name="Horas Trabajadas" />
            <Bar yAxisId="right" dataKey="ingresos" fill="#10b981" name="Ingresos Generados" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alertas de Inventario Bajo */}
      {lowInventory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            ⚠️ Alertas de Inventario Bajo
          </h2>
          <div className="space-y-2">
            {lowInventory.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Stock actual: {item.current} | Mínimo: {item.minimum} | Ubicación: {item.location}
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                  Pedir Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
