import React, { useState, useEffect, useCallback } from 'react';
import { Users, Clock, TrendingUp, AlertTriangle, Calendar, FileText, RefreshCw } from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import { dashboardService, DashboardStats, ActivityItem } from '../services/dashboardService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const fetchDashboardData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        dashboardService.getStats(selectedPeriod),
        dashboardService.getRecentActivity()
      ]);
      
      setStats(statsData);
      setActivities(activityData);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handlePrintPDF = async () => {
    try {
      console.log('Export PDF pour la période:', selectedPeriod);
      // Implémentez l'export PDF ici
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Employés',
      value: stats?.total_employees.toString() || '0',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Présents Aujourd\'hui',
      value: stats?.present_today.toString() || '0',
      change: `${stats?.presence_rate || 0}%`,
      changeType: 'positive' as const,
      icon: Clock,
      color: 'green' as const
    },
    {
      title: 'Retards ce Mois',
      value: stats?.late_this_month.toString() || '0',
      change: '-8%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'orange' as const
    },
    {
      title: 'Congés en Cours',
      value: stats?.current_leaves.toString() || '0',
      change: '+2',
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'purple' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Exporter PDF</span>
          </button>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        {['day', 'week', 'month', 'quarter'].map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodChange(period)}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedPeriod === period
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period === 'day' && 'Aujourd\'hui'}
            {period === 'week' && 'Cette semaine'}
            {period === 'month' && 'Ce mois'}
            {period === 'quarter' && 'Ce trimestre'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Évolution des Pointages
              </h2>
              <select 
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handlePeriodChange(e.target.value)}
                value={selectedPeriod}
              >
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="quarter">3 derniers mois</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <TrendingUp className="w-12 h-12 mb-2" />
              <p>Graphique des pointages ({selectedPeriod})</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RecentActivity activities={activities} />
          <QuickActions onActionComplete={fetchDashboardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// import React from 'react';
// import { Users, Clock, TrendingUp, AlertTriangle, Calendar, FileText } from 'lucide-react';
// import StatsCard from './StatsCard';
// import RecentActivity from './RecentActivity';
// import QuickActions from './QuickActions';

// const Dashboard: React.FC = () => {
//   const stats = [
//     {
//       title: 'Total Employés',
//       value: '156',
//       change: '+12%',
//       changeType: 'positive' as const,
//       icon: Users,
//       color: 'blue' as const
//     },
//     {
//       title: 'Présents Aujourd\'hui',
//       value: '142',
//       change: '91%',
//       changeType: 'positive' as const,
//       icon: Clock,
//       color: 'green' as const
//     },
//     {
//       title: 'Retards ce Mois',
//       value: '23',
//       change: '-8%',
//       changeType: 'negative' as const,
//       icon: AlertTriangle,
//       color: 'orange' as const
//     },
//     {
//       title: 'Congés en Cours',
//       value: '8',
//       change: '+2',
//       changeType: 'neutral' as const,
//       icon: Calendar,
//       color: 'purple' as const
//     }
//   ];


//   const handlePrintPDF = () => {
//     window.print();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={handlePrintPDF}
//             className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//           >
//             <FileText className="w-4 h-4" />
//             <span>Imprimer PDF</span>
//           </button>
//           <div className="text-sm text-gray-500">
//             Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <StatsCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Charts and Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Évolution des Pointages
//               </h2>
//               <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
//                 <option>7 derniers jours</option>
//                 <option>30 derniers jours</option>
//                 <option>3 derniers mois</option>
//               </select>
//             </div>
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               <TrendingUp className="w-12 h-12 mb-2" />
//               <p>Graphique des pointages</p>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <RecentActivity />
//           <QuickActions />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;