import React from 'react';
import { Plus, Download, FileText, Settings } from 'lucide-react';
import NewEmployeeModal from './NewEmployeeModal';
import ExportModal from './ExportModal';
import SettingsModal from './SettingsModal';

const QuickActions: React.FC = () => {
  const [showNewEmployee, setShowNewEmployee] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  const actions = [
    {
      label: 'Nouvel Employé',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      onClick: () => setShowNewEmployee(true)
    },
    {
      label: 'Rapport PDF',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600 text-white',
      onClick: () => window.print()
    },
    {
      label: 'Exporter',
      icon: Download,
      color: 'bg-purple-500 hover:bg-purple-600 text-white',
      onClick: () => setShowExport(true)
    },
    {
      label: 'Paramètres',
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600 text-white',
      onClick: () => setShowSettings(true)
    }
  ];

  const handleSaveEmployee = (employee: any) => {
    console.log('Nouvel employé créé:', employee);
    // Ici vous ajouteriez la logique pour sauvegarder l'employé
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ${action.color}`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showNewEmployee && (
        <NewEmployeeModal
          onClose={() => setShowNewEmployee(false)}
          onSave={handleSaveEmployee}
        />
      )}

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          exportType="employees"
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default QuickActions;