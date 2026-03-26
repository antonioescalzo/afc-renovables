import { useState } from 'react'
import { Package, Users, Truck, BarChart3, Settings, ShoppingCart } from 'lucide-react'
import DashboardTab from './components/DashboardTab'
import ArticulosTab from './components/ArticulosTab'
import ClientesTab from './components/ClientesTab'
import EquiposTab from './components/EquiposTab'
import SalidasTab from './components/SalidasTab'
import ProveedoresTab from './components/ProveedoresTab'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'articulos', label: 'Artículos', icon: Package },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'proveedores', label: 'Proveedores', icon: ShoppingCart },
    { id: 'equipos', label: 'Equipos', icon: Truck },
    { id: 'salidas', label: 'Salidas', icon: Settings }
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🏭 AFC Renovables - Dashboard</h1>
          <p>Gestión de Almacén y Compras en Tiempo Real</p>
        </div>
      </header>

      <nav className="tabs-nav">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'articulos' && <ArticulosTab />}
        {activeTab === 'clientes' && <ClientesTab />}
        {activeTab === 'proveedores' && <ProveedoresTab />}
        {activeTab === 'equipos' && <EquiposTab />}
        {activeTab === 'salidas' && <SalidasTab />}
      </main>

      <footer className="footer">
        <p>© 2026 AFC Renovables - Sistema de Gestión de Almacén y Compras</p>
      </footer>
    </div>
  )
}
