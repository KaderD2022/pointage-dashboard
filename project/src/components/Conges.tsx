import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import FilterModal from './FilterModal';

const Conges: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const conges = [
    {
      id: 1,
      employe: 'Marie Dubois',
      matricule: 'EMP001',
      type: 'Congé Payé',
      dateDebut: '2024-12-23',
      dateFin: '2024-12-27',
      nbJours: 5,
      motif: 'Vacances de fin d\'année',
      statut: 'Approuvé',
      dateDemande: '2024-11-15'
    },
    {
      id: 2,
      employe: 'Jean Martin',
      matricule: 'EMP002',
      type: 'Maladie',
      dateDebut: '2024-12-20',
      dateFin: '2024-12-22',
      nbJours: 3,
      motif: 'Grippe',
      statut: 'En Attente',
      dateDemande: '2024-12-19'
    },
    {
      id: 3,
      employe: 'Sophie Laurent',
      matricule: 'EMP003',
      type: 'Permission',
      dateDebut: '2024-12-19',
      dateFin: '2024-12-19',
      nbJours: 0.5,
      motif: 'Rendez-vous médical',
      statut: 'Refusé',
      dateDemande: '2024-12-15'
    }
  ];

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Congés</h1>
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
            <span>Nouvelle Demande</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Demandes Totales</p>
              <p className="text-2xl font-bold text-blue-600">47</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-green-600">32</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Refusées</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
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
                placeholder="Rechercher un employé..."
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
              <option>Tous les types</option>
              <option>Congé Payé</option>
              <option>Maladie</option>
              <option>Permission</option>
              <option>Maternité</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
              <option>Tous les statuts</option>
              <option>Approuvé</option>
              <option>En Attente</option>
              <option>Refusé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conges Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conges.map((conge) => (
                <tr key={conge.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {conge.employe}
                      </div>
                      <div className="text-sm text-gray-500">
                        {conge.matricule}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      conge.type === 'Congé Payé'
                        ? 'bg-blue-100 text-blue-800'
                        : conge.type === 'Maladie'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {conge.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{new Date(conge.dateDebut).toLocaleDateString('fr-FR')}</div>
                    <div className="text-xs text-gray-500">
                      au {new Date(conge.dateFin).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {conge.nbJours} jour{conge.nbJours > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                    {conge.motif}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      conge.statut === 'Approuvé'
                        ? 'bg-green-100 text-green-800'
                        : conge.statut === 'En Attente'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {conge.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {conge.statut === 'En Attente' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50">
                            Approuver
                          </button>
                          <button className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50">
                            Refuser
                          </button>
                        </>
                      )}
                    </div>
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
          filterType="conges"
        />
      )}
    </div>
  );
};

export default Conges;