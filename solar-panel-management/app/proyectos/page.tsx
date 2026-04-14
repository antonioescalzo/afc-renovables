"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planificado" | "en_curso" | "completado" | "pausado";
  client: { name: string };
  estimatedHours: number;
  actualHours: number;
  estimatedCost: number;
  actualCost: number;
  startDate: string;
  endDate: string | null;
  teamAssignments: Array<{ team: { name: string } }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completado":
      return "bg-green-100 text-green-800";
    case "en_curso":
      return "bg-blue-100 text-blue-800";
    case "planificado":
      return "bg-yellow-100 text-yellow-800";
    case "pausado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completado":
      return "✅ Completado";
    case "en_curso":
      return "⏳ En Curso";
    case "planificado":
      return "📋 Planificado";
    case "pausado":
      return "⏸️ Pausado";
    default:
      return status;
  }
};

const getEfficiency = (estimated: number, actual: number) => {
  if (estimated === 0) return 0;
  return Math.round((estimated / actual) * 100);
};

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Cargando proyectos...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestión de Proyectos</h1>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Proyectos</p>
          <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">En Curso</p>
          <p className="text-2xl font-bold text-blue-600">
            {projects.filter((p) => p.status === "en_curso").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Completados</p>
          <p className="text-2xl font-bold text-green-600">
            {projects.filter((p) => p.status === "completado").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Planificados</p>
          <p className="text-2xl font-bold text-yellow-600">
            {projects.filter((p) => p.status === "planificado").length}
          </p>
        </div>
      </div>

      {/* Tabla de proyectos */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Proyecto</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Cliente</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Equipos</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Horas</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Eficiencia</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Costo</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-600 truncate">{project.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{project.client.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {project.teamAssignments.map((ta) => ta.team.name).join(", ") || "Sin asignar"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-gray-900">
                    {project.actualHours.toFixed(1)}h / {project.estimatedHours}h
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`${
                      getEfficiency(project.estimatedHours, project.actualHours) >= 100
                        ? "text-green-600 font-semibold"
                        : "text-orange-600"
                    }`}
                  >
                    {getEfficiency(project.estimatedHours, project.actualHours)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-gray-900">
                    ${project.actualCost.toLocaleString()} / ${project.estimatedCost.toLocaleString()}
                  </div>
                  <span
                    className={`text-xs ${
                      project.actualCost <= project.estimatedCost ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {project.actualCost <= project.estimatedCost ? "✓ Dentro presupuesto" : "✗ Sobrecosto"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
