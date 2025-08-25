import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Download, QrCode, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import FilterModal from './FilterModal';
import QRCodeGenerator from './QRCodeGenerator';
import NewEmployeeModal from './NewEmployeeModal';
import ExportModal from './ExportModal';
import { employeeService, Employee, EmployeeStats, CreateEmployeeData } from '../services/employeeService';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showNewEmployee, setShowNewEmployee] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [filters, setFilters] = useState({
    service: '',
    status: '',
    period: 'month'
  });

  const fetchEmployeesData = useCallback(async () => {
    try {
      setLoading(true);
      const [employeesData, statsData] = await Promise.all([
        employeeService.getAllEmployees({
          service: filters.service,
          status: filters.status,
          search: searchTerm
        }),
        employeeService.getEmployeesStats(filters.period)
      ]);
      
      setEmployees(employeesData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchEmployeesData();
  }, [fetchEmployeesData]);

  const handlePrintPDF = async () => {
    try {
      const blob = await employeeService.exportEmployees('pdf', filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'liste_employes.pdf';
      link.click();
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    }
  };

  const handleGenerateQR = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowQRGenerator(true);
  };

const handleSaveEmployee = async (employeeData: CreateEmployeeData, setFormErrors: (errors: any) => void) => {
  try {
    // Appel à l'API pour créer l'employé
    await employeeService.createEmployee(employeeData);

    // Si tout va bien, on réinitialise les erreurs et on ferme le modal
    setFormErrors({});
    setShowNewEmployee(false);
    fetchEmployeesData(); // Rafraîchir la liste des employés
  } catch (error: any) {
    // Vérifier si l'erreur provient de l'API FastAPI
    if (error.response && error.response.data && error.response.data.detail) {
      const detail = error.response.data.detail;

      // Préparer un objet d'erreurs pour les champs
      const fieldErrors: { [key: string]: string } = {};

      // Si c'est une erreur de type liste (FastAPI detail peut renvoyer [{"loc":..., "msg":..., "type":...}])
      if (Array.isArray(detail)) {
        detail.forEach((err: any) => {
          if (err.loc && err.loc.length > 1) {
            const field = err.loc[1]; // le nom du champ
            fieldErrors[field] = err.msg;
          }
        });
      } else if (typeof detail === 'string') {
        // Si c'est une string simple
        if (detail.includes('Email')) fieldErrors.email = detail;
        if (detail.includes('Matricule')) fieldErrors.matricule = detail;
      }

      setFormErrors(fieldErrors);
    } else {
      console.error('Erreur inconnue lors de la création:', error);
    }
  }
};



  const handleDeleteEmployee = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await employeeService.deleteEmployee(id);
        fetchEmployeesData(); // Rafraîchir la liste
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      const blob = await employeeService.exportEmployees(format, filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `employes.${format}`;
      link.click();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
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

  return (
    <div className="space-y-6">
      {/* En-tête et boutons */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
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
          <button 
            onClick={() => setShowNewEmployee(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Employé</span>
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employés</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.total_employees || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employés Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats?.active_employees || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pénalités Totales</p>
              <p className="text-2xl font-bold text-red-600">{stats?.total_penalties || 0}h</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Congés Restants</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.total_remaining_leaves || 0}j</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
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
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filters.period}
              onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
            >
              <option value="day">Jour</option>
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="quarter">Trimestre</option>
              <option value="semester">Semestre</option>
              <option value="year">Année</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filters.service}
              onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
            >
              <option value="">Tous les services</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="RH">RH</option>
              <option value="Finance">Finance</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des employés */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'embauche
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
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {employee.first_name[0]}{employee.last_name[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.matricule}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.poste}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(employee.date_embauche).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleGenerateQR(employee)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Générer QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showFilters && (
        <FilterModal
          onClose={() => setShowFilters(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setShowFilters(false);
          }}
          filterType="employees"
        />
      )}

      {showQRGenerator && selectedEmployee && (
        <QRCodeGenerator
          employee={selectedEmployee}
          onClose={() => {
            setShowQRGenerator(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {showNewEmployee && (
        <NewEmployeeModal
          onClose={() => setShowNewEmployee(false)}
          onSave={handleSaveEmployee}
        />
      )}

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onExport={handleExport}
          exportType="employees"
        />
      )}
    </div>
  );
};

export default Employees;





function setFormErrors(arg0: {}) {
  throw new Error('Function not implemented.');
}
// import React, { useState } from 'react';
// import { Search, Filter, Plus, Download, QrCode, Edit, Trash2, Eye } from 'lucide-react';
// import FilterModal from './FilterModal';
// import QRCodeGenerator from './QRCodeGenerator';
// import NewEmployeeModal from './NewEmployeeModal';
// import ExportModal from './ExportModal';

// const Employees: React.FC = () => {
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
//   const [showQRGenerator, setShowQRGenerator] = useState(false);
//   const [showNewEmployee, setShowNewEmployee] = useState(false);
//   const [showExport, setShowExport] = useState(false);

//   const employees = [
//     {
//       id: 1,
//       matricule: 'EMP001',
//       nom: 'Dubois',
//       prenom: 'Marie',
//       email: 'marie.dubois@entreprise.com',
//       poste: 'Développeuse',
//       service: 'IT',
//       dateEmbauche: '2023-01-15',
//       statut: 'Actif',
//       heuresMois: 152,
//       retardsMois: 2,
//       totalHeuresAnnee: 1824,
//       penalitesHeures: 16,
//       congesRestants: 25
//     },
//     {
//       id: 2,
//       matricule: 'EMP002',
//       nom: 'Martin',
//       prenom: 'Jean',
//       email: 'jean.martin@entreprise.com',
//       poste: 'Chef de Projet',
//       service: 'IT',
//       dateEmbauche: '2022-03-10',
//       statut: 'Actif',
//       heuresMois: 160,
//       retardsMois: 1,
//       totalHeuresAnnee: 1920,
//       penalitesHeures: 8,
//       congesRestants: 30
//     },
//     {
//       id: 3,
//       matricule: 'EMP003',
//       nom: 'Laurent',
//       prenom: 'Sophie',
//       email: 'sophie.laurent@entreprise.com',
//       poste: 'Designer',
//       service: 'Marketing',
//       dateEmbauche: '2023-06-01',
//       statut: 'Congé',
//       heuresMois: 140,
//       retardsMois: 0,
//       totalHeuresAnnee: 1680,
//       penalitesHeures: 0,
//       congesRestants: 20
//     }
//   ];

//   const handlePrintPDF = () => {
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Liste des Employés - ${new Date().toLocaleDateString('fr-FR')}</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//           th { background-color: #f2f2f2; }
//           .header { text-align: center; margin-bottom: 30px; }
//           .stats { display: flex; justify-content: space-around; margin: 20px 0; }
//           .stat-box { text-align: center; padding: 10px; border: 1px solid #ccc; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>PointagePro - Liste des Employés</h1>
//           <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
//         </div>
        
//         <div class="stats">
//           <div class="stat-box">
//             <h3>Total Employés</h3>
//             <p>${employees.length}</p>
//           </div>
//           <div class="stat-box">
//             <h3>Employés Actifs</h3>
//             <p>${employees.filter(e => e.statut === 'Actif').length}</p>
//           </div>
//           <div class="stat-box">
//             <h3>En Congé</h3>
//             <p>${employees.filter(e => e.statut === 'Congé').length}</p>
//           </div>
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th>Matricule</th>
//               <th>Nom & Prénom</th>
//               <th>Email</th>
//               <th>Poste</th>
//               <th>Service</th>
//               <th>Statut</th>
//               <th>Heures/Mois</th>
//               <th>Retards</th>
//               <th>Heures Annuelles</th>
//               <th>Pénalités (h)</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${employees.map(emp => `
//               <tr>
//                 <td>${emp.matricule}</td>
//                 <td>${emp.prenom} ${emp.nom}</td>
//                 <td>${emp.email}</td>
//                 <td>${emp.poste}</td>
//                 <td>${emp.service}</td>
//                 <td>${emp.statut}</td>
//                 <td>${emp.heuresMois}h</td>
//                 <td>${emp.retardsMois}</td>
//                 <td>${emp.totalHeuresAnnee}h</td>
//                 <td>${emp.penalitesHeures}h</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
        
//         <div style="margin-top: 30px; font-size: 12px; color: #666;">
//           <p><strong>Notes importantes :</strong></p>
//           <ul>
//             <li>Total horaire mensuel standard : 160h (40h/semaine)</li>
//             <li>Seuil de retard : 08h00 (matin) et 14h30 (après-midi)</li>
//             <li>Pénalités appliquées : 10% du total mensuel (16h max)</li>
//             <li>Jours ouvrables : Lundi à Vendredi</li>
//           </ul>
//         </div>
//       </body>
//       </html>
//     `;

//     const printWindow = window.open('', '_blank');
//     if (printWindow) {
//       printWindow.document.write(printContent);
//       printWindow.document.close();
//       printWindow.print();
//       printWindow.close();
//     }
//   };

//   const handleGenerateQR = (employee: any) => {
//     setSelectedEmployee(employee);
//     setShowQRGenerator(true);
//   };

//   const handleSaveEmployee = (employee: any) => {
//     console.log('Nouvel employé créé:', employee);
//     // Ici vous ajouteriez la logique pour sauvegarder l'employé
//   };
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
//         <div className="flex space-x-3">
//           <button
//             onClick={handlePrintPDF}
//             className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//           >
//             <Download className="w-4 h-4" />
//             <span>Imprimer PDF</span>
//           </button>
//           <button 
//             onClick={() => setShowExport(true)}
//             className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
//           >
//             <Download className="w-4 h-4" />
//             <span>Exporter</span>
//           </button>
//           <button 
//             onClick={() => setShowNewEmployee(true)}
//             className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Nouvel Employé</span>
//           </button>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Employés</p>
//               <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
//               <Eye className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Heures Totales/Mois</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {employees.reduce((sum, emp) => sum + emp.heuresMois, 0)}h
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
//               <QrCode className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pénalités Totales</p>
//               <p className="text-2xl font-bold text-red-600">
//                 {employees.reduce((sum, emp) => sum + emp.penalitesHeures, 0)}h
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
//               <Edit className="w-6 h-6 text-red-600" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Congés Restants</p>
//               <p className="text-2xl font-bold text-purple-600">
//                 {employees.reduce((sum, emp) => sum + emp.congesRestants, 0)}j
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
//               <Trash2 className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Rechercher un employé..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//               />
//             </div>
//             <button
//               onClick={() => setShowFilters(true)}
//               className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <Filter className="w-4 h-4" />
//               <span>Filtres</span>
//             </button>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
//               <option>Période d'analyse</option>
//               <option>Jour</option>
//               <option>Semaine</option>
//               <option>Mois</option>
//               <option>Trimestre</option>
//               <option>Semestre</option>
//               <option>Année</option>
//             </select>
//             <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
//               <option>Tous les services</option>
//               <option>IT</option>
//               <option>Marketing</option>
//               <option>RH</option>
//               <option>Finance</option>
//             </select>
//             <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
//               <option>Tous les statuts</option>
//               <option>Actif</option>
//               <option>Congé</option>
//               <option>Suspendu</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Employees Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employé
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Service
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Heures/Mois
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Heures Annuelles
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Retards & Pénalités
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Statut
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {employees.map((employee) => (
//                 <tr key={employee.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//                         {employee.prenom[0]}{employee.nom[0]}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {employee.prenom} {employee.nom}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {employee.matricule} • {employee.poste}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {employee.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {employee.service}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{employee.heuresMois}h</div>
//                     <div className="text-xs text-gray-500">sur 160h standard</div>
//                     <div className={`text-xs ${
//                       employee.heuresMois >= 160 ? 'text-green-600' : 
//                       employee.heuresMois >= 144 ? 'text-orange-600' : 'text-red-600'
//                     }`}>
//                       {employee.heuresMois >= 160 ? 'Complet' : 
//                        employee.heuresMois >= 144 ? 'Acceptable' : 'Insuffisant'}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{employee.totalHeuresAnnee}h</div>
//                     <div className="text-xs text-gray-500">sur 1920h/an</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="space-y-1">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         employee.retardsMois === 0 
//                           ? 'bg-green-100 text-green-800'
//                           : employee.retardsMois <= 2
//                           ? 'bg-orange-100 text-orange-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {employee.retardsMois} retard{employee.retardsMois > 1 ? 's' : ''}
//                       </span>
//                       <div className="text-xs text-red-600">
//                         Pénalités: {employee.penalitesHeures}h
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       employee.statut === 'Actif'
//                         ? 'bg-green-100 text-green-800'
//                         : employee.statut === 'Congé'
//                         ? 'bg-blue-100 text-blue-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {employee.statut}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-2">
//                       <button 
//                         className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                         title="Voir détails"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button 
//                         onClick={() => handleGenerateQR(employee)}
//                         className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                         title="Générer QR Code"
//                       >
//                         <QrCode className="w-4 h-4" />
//                       </button>
//                       <button 
//                         className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
//                         title="Modifier"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button 
//                         className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                         title="Supprimer"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showFilters && (
//         <FilterModal
//           onClose={() => setShowFilters(false)}
//           filterType="employees"
//         />
//       )}

//       {showQRGenerator && selectedEmployee && (
//         <QRCodeGenerator
//           employee={selectedEmployee}
//           onClose={() => {
//             setShowQRGenerator(false);
//             setSelectedEmployee(null);
//           }}
//         />
//       )}

//       {showNewEmployee && (
//         <NewEmployeeModal
//           onClose={() => setShowNewEmployee(false)}
//           onSave={handleSaveEmployee}
//         />
//       )}

//       {showExport && (
//         <ExportModal
//           onClose={() => setShowExport(false)}
//           exportType="employees"
//         />
//       )}
//     </div>
//   );
// };

// export default Employees;