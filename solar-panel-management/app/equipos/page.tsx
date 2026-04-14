"use client";

import { useEffect, useState } from "react";

interface Team {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  totalHoursWorked: number;
  projectCount: number;
  activeProjects: string[];
}

export default function EquiposPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      });
  }, []);

  const totalHours = teams.reduce((sum, t) => sum + t.totalHoursWorked, 0);
  const totalEarnings = teams.reduce(
    (sum, t) => sum + t.totalHoursWorked * t.hourlyRate,
    0
  );

  if (loading) {
    return <div className="p-8 text-center">Cargando equipos...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestión de Equipos</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">Total Equipos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{teams.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-medium">Horas Totales Trabajadas</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{totalHours.toFixed(1)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Facturación Total</p>
          <p className="text-3xl font-bold text-green-600 mt-2">${totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabla de equipos */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Equipo</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Descripción</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Tarifa/Hora</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Horas Trabajadas</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Ingresos Generados</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Proyectos</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Proyectos Activos</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{team.name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{team.description}</td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  ${team.hourlyRate.toFixed(2)}/h
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold text-sm">
                    {team.totalHoursWorked.toFixed(1)} horas
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">
                  ${(team.totalHoursWorked * team.hourlyRate).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold text-sm">
                    {team.projectCount}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {team.activeProjects.length > 0 ? (
                    <div className="space-y-1">
                      {team.activeProjects.map((project, idx) => (
                        <div key={idx} className="bg-blue-50 px-2 py-1 rounded text-blue-900 font-medium text-xs">
                          {project}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">Sin proyectos activos</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rendimiento por equipo */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rendimiento por Equipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => {
            const efficiency = team.totalHoursWorked > 0
              ? Math.round((team.projectCount / team.totalHoursWorked) * 100)
              : 0;
            return (
              <div key={team.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900">{team.name}</h3>
                  <span className="text-2xl">👨‍🔧</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-600">Productividad</p>
                      <span className="font-bold text-gray-900">{efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(efficiency, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Horas</p>
                      <p className="text-lg font-bold text-gray-900">
                        {team.totalHoursWorked.toFixed(1)}h
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Ingresos</p>
                      <p className="text-lg font-bold text-green-600">
                        ${(team.totalHoursWorked * team.hourlyRate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
