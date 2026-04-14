"use client";

import { useEffect, useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  category: string;
  quantity: number;
  location: string;
  unitPrice: number;
  totalValue: number;
  minThreshold: number;
  isLow: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "paneles_solares":
      return "☀️";
    case "inversores":
      return "⚡";
    case "cables":
      return "🔌";
    case "soportes":
      return "🔧";
    case "baterias":
      return "🔋";
    default:
      return "📦";
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "paneles_solares":
      return "Paneles Solares";
    case "inversores":
      return "Inversores";
    case "cables":
      return "Cables";
    case "soportes":
      return "Soportes";
    case "baterias":
      return "Baterías";
    default:
      return category;
  }
};

export default function AlmacenPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("todos");

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(new Set(inventory.map((item) => item.category)));
  const lowInventoryItems = inventory.filter((item) => item.isLow);
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);

  const filteredItems =
    filter === "todos"
      ? inventory
      : filter === "bajo"
        ? lowInventoryItems
        : inventory.filter((item) => item.category === filter);

  if (loading) {
    return <div className="p-8 text-center">Cargando inventario...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestión de Almacén</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">Items en Almacén</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{inventory.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm font-medium">Stock Bajo</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{lowInventoryItems.length}</p>
          <p className="text-xs text-gray-500 mt-2">Items por debajo del mínimo</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Valor Total del Inventario</p>
          <p className="text-3xl font-bold text-green-600 mt-2">${totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Alertas de stock bajo */}
      {lowInventoryItems.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-8">
          <h3 className="font-bold text-orange-900 mb-3">⚠️ Alertas de Stock Bajo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowInventoryItems.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded border border-orange-200">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Stock: {item.quantity} / Mínimo: {item.minThreshold}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("todos")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "todos"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Todos ({inventory.length})
        </button>
        <button
          onClick={() => setFilter("bajo")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "bajo"
              ? "bg-orange-600 text-white"
              : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Stock Bajo ({lowInventoryItems.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {getCategoryIcon(cat)} {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Tabla de inventario */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Producto</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Código</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Categoría</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Ubicación</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Precio Unitario</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Valor Total</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`border-b hover:bg-gray-50 ${item.isLow ? "bg-orange-50" : ""}`}
              >
                <td className="px-6 py-4">
                  <span className="text-lg mr-2">{getCategoryIcon(item.category)}</span>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{item.code}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {getCategoryLabel(item.category)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{item.location}</td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      item.isLow
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  ${item.totalValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    + Entrada
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
