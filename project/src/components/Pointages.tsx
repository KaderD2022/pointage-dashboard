import React, { useState } from 'react';
import { Search, Filter, Download, Clock, CheckCircle, XCircle, AlertTriangle, Calendar } from 'lucide-react';
import FilterModal from './FilterModal';
import ExportModal from './ExportModal';

const Pointages: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('jour');
  const [showExport, setShowExport] = useState(false);

  const pointages = [
    {
      id: 1,
      employe: 'Marie Dubois',
      matricule: 'EMP001',
      date: '2024-12-19',
      arrivee: '08:00',
      departPause: '12:00',
      retourPause: '14:00',
      departFinal: '17:30',
      heuresTravaillees: 7.5,
      heuresRequises: 8,
      statut: 'Normal',
      retard: false,
      absence: 0.5, // 30 minutes d'absence
      penalite: 0
    },
    {
      id: 2,
      employe: 'Jean Martin',
      matricule: 'EMP002',
      date: '2024-12-19',
      arrivee: '08:15',
      departPause: '12:00',
      retourPause: '14:30',
      departFinal: '17:45',
      heuresTravaillees: 7,
      heuresRequises: 8,
      statut: 'Retard',
      retard: true,
      absence: 1,
      penalite: 0.1 // 10% de pénalité
    },
    {
      id: 3,
      employe: 'Sophie Laurent',
      matricule: 'EMP003',
      date: '2024-12-19',
      arrivee: '07:45',
      departPause: '11:45',
      retourPause: '13:30',
      departFinal: '17:30',
      heuresTravaillees: 8.5,
      heuresRequises: 8,
      statut: 'Normal',
      retard: false,
      absence: 0,
      penalite: 0
    }
  ];

  const calculateStats = () => {
    const presents = pointages.filter(p => p.heuresTravaillees > 0).length;
    const absents = 156 - presents; // Total employés - présents
    const retards = pointages.filter(p => p.retard).length;
    const totalHeures = pointages.reduce((sum, p) => sum + p.heuresTravaillees, 0);
    const totalAbsences = pointages.reduce((sum, p) => sum + p.absence, 0);
    const totalPenalites = pointages.reduce((sum, p) => sum + p.penalite, 0);

    return { presents, absents, retards, totalHeures, totalAbsences, totalPenalites };
  };

  const stats = calculateStats();

  const handlePrintPDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport de Pointage - ${new Date().toLocaleDateString('fr-FR')}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .stat-box { text-align: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; }
          .normal { background-color: #d4edda; }
          .retard { background-color: #f8d7da; }
          .absence { background-color: #fff3cd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PointagePro - Rapport de Pointage</h1>
          <p>Période: ${selectedPeriod} du ${new Date().toLocaleDateString('fr-FR')}</p>
          <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
        
        <div class="stats">
          <div class="stat-box normal">
            <h3>Présents</h3>
            <p style="font-size: 24px; margin: 5px 0;">${stats.presents}</p>
          </div>
          <div class="stat-box retard">
            <h3>Retards</h3>
            <p style="font-size: 24px; margin: 5px 0;">${stats.retards}</p>
          </div>
          <div class="stat-box absence">
            <h3>Absences (h)</h3>
            <p style="font-size: 24px; margin: 5px 0;">${stats.totalAbsences.toFixed(1)}</p>
          </div>
          <div class="stat-box">
            <h3>Heures Totales</h3>
            <p style="font-size: 24px; margin: 5px 0;">${stats.totalHeures.toFixed(1)}h</p>
          </div>
        </div>

        <h2>Détail des pointages</h2>
        <table>
          <thead>
            <tr>
              <th>Employé</th>
              <th>Matricule</th>
              <th>Date</th>
              <th>Arrivée</th>
              <th>Pause</th>
              <th>Reprise</th>
              <th>Départ</th>
              <th>Heures Travaillées</th>
              <th>Heures Requises</th>
              <th>Absence (h)</th>
              <th>Pénalité</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${pointages.map(p => `
              <tr class="${p.retard ? 'retard' : p.absence > 0 ? 'absence' : 'normal'}">
                <td>${p.employe}</td>
                <td>${p.matricule}</td>
                <td>${new Date(p.date).toLocaleDateString('fr-FR')}</td>
                <td>${p.arrivee}</td>
                <td>${p.departPause}</td>
                <td>${p.retourPause}</td>
                <td>${p.departFinal}</td>
                <td>${p.heuresTravaillees}h</td>
                <td>${p.heuresRequises}h</td>
                <td>${p.absence}h</td>
                <td>${(p.penalite * 100).toFixed(1)}%</td>
                <td>${p.statut}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ccc; padding-top: 20px;">
          <h3>Règles de Pointage PointagePro</h3>
          <ul>
            <li><strong>Horaires standard :</strong> 08h00-12h00 / 14h00-17h30 (8h/jour, 40h/semaine, 160h/mois)</li>
            <li><strong>Seuils de retard :</strong> Matin 08h00, Après-midi 14h30</li>
            <li><strong>Pénalités :</strong> 10% du total mensuel pour heures manquantes (max 16h)</li>
            <li><strong>Weekends :</strong> Samedi et dimanche non ouvrables</li>
            <li><strong>Calcul absences :</strong> Heures requises - Heures travaillées</li>
            <li><strong>Jours fériés :</strong> Pris en compte automatiquement</li>
          </ul>
          <p><strong>Total heures effectives :</strong> ${stats.totalHeures.toFixed(1)}h | 
             <strong>Total absences :</strong> ${stats.totalAbsences.toFixed(1)}h | 
             <strong>Taux de présence :</strong> ${((stats.totalHeures / (pointages.length * 8)) * 100).toFixed(1)}%</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Pointages</h1>
        <div className="flex space-x-3">
          <button
            onClick={handlePrintPDF}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Imprimer PDF</span>
          </button>
          <button 
            onClick={() => setShowExport(true)}
            className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Présents</p>
              <p className="text-2xl font-bold text-green-600">{stats.presents}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absents</p>
              <p className="text-2xl font-bold text-red-600">{stats.absents}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retards</p>
              <p className="text-2xl font-bold text-orange-600">{stats.retards}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Heures Totales</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalHeures.toFixed(1)}h</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absences</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalAbsences.toFixed(1)}h</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
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
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              defaultValue="2024-12-19"
            />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="jour">Aujourd'hui</option>
              <option value="semaine">Cette semaine</option>
              <option value="mois">Ce mois</option>
              <option value="trimestre">Ce trimestre</option>
              <option value="semestre">Ce semestre</option>
              <option value="annee">Cette année</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pointages Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arrivée Matin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pause
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Départ Final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heures & Absences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut & Pénalités
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pointages.map((pointage) => (
                <tr key={pointage.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {pointage.employe}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pointage.matricule}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(pointage.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      pointage.retard ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {pointage.arrivee}
                    </span>
                    {pointage.retard && (
                      <div className="text-xs text-red-500">Retard</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pointage.departPause}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${
                      pointage.retourPause > '14:30' ? 'text-red-600 font-medium' : 'text-gray-900'
                    }`}>
                      {pointage.retourPause}
                    </span>
                    {pointage.retourPause > '14:30' && (
                      <div className="text-xs text-red-500">Retard AM</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pointage.departFinal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {pointage.heuresTravaillees}h / {pointage.heuresRequises}h
                      </div>
                      {pointage.absence > 0 && (
                        <div className="text-xs text-red-600">
                          Absence: {pointage.absence}h
                        </div>
                      )}
                      <div className={`text-xs ${
                        pointage.heuresTravaillees >= pointage.heuresRequises ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {pointage.heuresTravaillees >= pointage.heuresRequises ? 'Complet' : 'Insuffisant'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pointage.statut === 'Normal'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pointage.statut}
                      </span>
                      {pointage.penalite > 0 && (
                        <div className="text-xs text-red-600">
                          Pénalité: {(pointage.penalite * 100).toFixed(1)}%
                        </div>
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
          filterType="pointages"
        />
      )}

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          exportType="pointages"
        />
      )}
    </div>
  );
};

export default Pointages;