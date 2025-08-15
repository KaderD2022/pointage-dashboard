import React, { useState } from 'react';
import { X, Download, FileText, Calendar, Users, Clock } from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
  exportType?: 'employees' | 'pointages' | 'conges' | 'feries';
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, exportType = 'employees' }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedPeriod, setSelectedPeriod] = useState('mois');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const formats = [
    { id: 'pdf', label: 'PDF', icon: FileText, description: 'Format PDF pour impression' },
    { id: 'excel', label: 'Excel', icon: Download, description: 'Fichier Excel (.xlsx)' },
    { id: 'csv', label: 'CSV', icon: Download, description: 'Fichier CSV pour import' }
  ];

  const periods = [
    { id: 'jour', label: 'Aujourd\'hui' },
    { id: 'semaine', label: 'Cette semaine' },
    { id: 'mois', label: 'Ce mois' },
    { id: 'trimestre', label: 'Ce trimestre' },
    { id: 'semestre', label: 'Ce semestre' },
    { id: 'annee', label: 'Cette année' },
    { id: 'personnalise', label: 'Période personnalisée' }
  ];

  const getFieldsByType = () => {
    switch (exportType) {
      case 'employees':
        return [
          'matricule', 'nom', 'prenom', 'email', 'poste', 'service', 
          'dateEmbauche', 'statut', 'heuresMois', 'totalHeuresAnnee', 
          'retardsMois', 'penalitesHeures', 'congesRestants'
        ];
      case 'pointages':
        return [
          'employe', 'matricule', 'date', 'arrivee', 'departPause', 
          'retourPause', 'departFinal', 'heuresTravaillees', 'heuresRequises', 
          'absence', 'retard', 'penalite', 'statut'
        ];
      case 'conges':
        return [
          'employe', 'matricule', 'type', 'dateDebut', 'dateFin', 
          'nbJours', 'motif', 'statut', 'dateDemande'
        ];
      case 'feries':
        return [
          'nom', 'date', 'type', 'description', 'statut'
        ];
      default:
        return [];
    }
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = () => {
    const exportData = {
      format: selectedFormat,
      period: selectedPeriod,
      dateDebut: selectedPeriod === 'personnalise' ? dateDebut : null,
      dateFin: selectedPeriod === 'personnalise' ? dateFin : null,
      fields: selectedFields.length > 0 ? selectedFields : getFieldsByType(),
      type: exportType
    };

    console.log('Export des données:', exportData);
    
    // Simulation de l'export
    const fileName = `${exportType}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
    alert(`Export en cours...\nFichier: ${fileName}\nFormat: ${selectedFormat.toUpperCase()}\nPériode: ${selectedPeriod}`);
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Exporter les {exportType}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format d'export */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Format d'export</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {formats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2 text-blue-500" />
                    <div className="font-medium">{format.label}</div>
                    <div className="text-sm text-gray-500">{format.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Période */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              <Calendar className="w-5 h-5 inline mr-2" />
              Période
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    selectedPeriod === period.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {selectedPeriod === 'personnalise' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Champs à exporter */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Champs à exporter
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {getFieldsByType().map((field) => (
                <label key={field} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => handleFieldToggle(field)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Laissez vide pour exporter tous les champs
            </p>
          </div>

          {/* Aperçu */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Aperçu de l'export</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Type:</strong> {exportType}</p>
              <p><strong>Format:</strong> {selectedFormat.toUpperCase()}</p>
              <p><strong>Période:</strong> {periods.find(p => p.id === selectedPeriod)?.label}</p>
              <p><strong>Champs:</strong> {selectedFields.length > 0 ? selectedFields.length : getFieldsByType().length} champs</p>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;