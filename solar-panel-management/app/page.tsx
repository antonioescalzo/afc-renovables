"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [hasSeed, setHasSeed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAndSeed() {
      try {
        // Intentar obtener datos del dashboard
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          if (data.metrics.totalProjects > 0) {
            setHasSeed(true);
          } else {
            // Si no hay datos, hacer seed
            await seedDatabase();
          }
        } else {
          // Si hay error, hacer seed
          await seedDatabase();
        }
      } catch (error) {
        console.log("Haciendo seed de la BD...");
        await seedDatabase();
      } finally {
        setLoading(false);
      }
    }

    checkAndSeed();
  }, []);

  async function seedDatabase() {
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (res.ok) {
        setHasSeed(true);
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-lg text-gray-700">Inicializando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {hasSeed ? (
        <Dashboard />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Preparando datos...</p>
        </div>
      )}
    </main>
  );
}
