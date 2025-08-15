import React from 'react';
import { Users, Clock, TrendingUp, AlertTriangle, Calendar, FileText } from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Employés',
      value: '156',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Présents Aujourd\'hui',
      value: '142',
      change: '91%',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'green' as const
    },
    {
      title: 'Retards ce Mois',
      value: '23',
      change: '-8%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'orange' as const
    },
    {
      title: 'Congés en Cours',
      value: '8',
      change: '+2',
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'purple' as const
    }
  ];


  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrintPDF}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Imprimer PDF</span>
          </button>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Évolution des Pointages
              </h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
                <option>3 derniers mois</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <TrendingUp className="w-12 h-12 mb-2" />
              <p>Graphique des pointages</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;