import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Calendar, AlertTriangle } from 'lucide-react';
import FilterModal from './FilterModal';

const Feries: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const feries = [
    {
      id: 1,
      nom: 'Nouvel An',
      date: '2024-01-01',
      type: 'Fixe',
      statut: 'Validé',
      description: 'Premier jour de l\'année'
    },
    {
      id: 2,
      nom: 'Fête du Travail',
      date: '2024-05-01',
      type: 'Fixe',
      statut: 'Validé',
      description: 'Fête internationale des travailleurs'
    },
    {
      id: 3,
      nom: 'Fête de l\'Indépendance',
      date: '2024-08-07',
      type: 'Fixe',
      statut: 'Validé',
      description: 'Fête nationale de la Côte d\'Ivoire'
    },
    {
      id: 4,
      nom: 'Assomption',
      date: '2024-08-15',
      type: 'Religieux',
      statut: 'Validé',
      description: 'Fête religieuse chrétienne'
    },
    {
      id: 5,
      nom: 'Toussaint',
      date: '2024-11-01',
      type: 'Religieux',
      statut: 'Validé',
      description: 'Fête de tous les saints'
    },
    {
      id: 6,
      nom: 'Noël',
      date: '2024-12-25',
      type: 'Religieux',
      statut: 'Validé',
      description: 'Naissance de Jésus-Christ'
    }
  ];

  const handlePrintPDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Liste des Jours Fériés - ${new Date().toLocaleDateString('fr-FR')}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-box { text-align: center; padding: 10px; border: 1px solid #ccc; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PointagePro - Liste des Jours Fériés</h1>
          <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
        
        <div class="stats">
          <div class="stat-box">
            <h3>Total Jours Fériés</h3>
            <p>${feries.length}</p>
          </div>
          <div class="stat-box">
            <h3>Jours Fixes</h3>
            <p>${feries.filter(f => f.type === 'Fixe').length}</p>
          </div>
          <div class="stat-box">
            <h3>Jours Religieux</h3>
            <p>${feries.filter(f => f.type === 'Religieux').length}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nom du Jour Férié</th>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${feries.map(ferie => `
              <tr>
                <td>${ferie.nom}</td>
                <td>${new Date(ferie.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</td>
                <td>${ferie.type}</td>
                <td>${ferie.description}</td>
                <td>${ferie.statut}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; font-size: 12px; color: #666;">
          <p><strong>Notes importantes :</strong></p>
          <ul>
            <li>Les jours fériés sont automatiquement pris en compte dans les calculs de pointage</li>
            <li>Aucun pointage n'est requis les jours fériés</li>
            <li>Les heures de travail sont ajustées automatiquement</li>
          </ul>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Jours Fériés</h1>
        <div className="flex space-x-3">
          <button
            onClick={handlePrintPDF}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Imprimer PDF</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nouveau Jour Férié</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cette Année</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ce Mois</p>
              <p className="text-2xl font-bold text-green-600">1</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prochains</p>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un jour férié..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
              <option>2024</option>
              <option>2023</option>
              <option>2025</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
              <option>Tous les types</option>
              <option>Fixe</option>
              <option>Religieux</option>
              <option>Mobile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom du Jour Férié
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact Pointages
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feries.map((ferie) => (
                <tr key={ferie.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ferie.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(ferie.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ferie.type === 'Fixe'
                        ? 'bg-blue-100 text-blue-800'
                        : ferie.type === 'Religieux'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {ferie.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                    {ferie.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {ferie.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Jour non travaillé
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showFilters && (
        <FilterModal
          onClose={() => setShowFilters(false)}
          filterType="feries"
        />
      )}
    </div>
  );
};

export default Feries;