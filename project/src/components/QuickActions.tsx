import React from 'react';
import { Plus, QrCode, Download, Settings } from 'lucide-react';

interface QuickActionsProps {
  onActionComplete?: () => void;
}

interface ActionItem {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  color: 'blue' | 'green' | 'purple' | 'gray';
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionComplete }) => {
  const actions: ActionItem[] = [
    {
      icon: Plus,
      label: 'Nouvel Employé',
      onClick: () => {
        console.log('Ajouter un employé');
        onActionComplete?.();
      },
      color: 'blue'
    },
    {
      icon: QrCode,
      label: 'Générer QR Code',
      onClick: () => {
        console.log('Générer QR code');
        onActionComplete?.();
      },
      color: 'green'
    },
    {
      icon: Download,
      label: 'Exporter Données',
      onClick: () => {
        console.log('Exporter données');
        onActionComplete?.();
      },
      color: 'purple'
    },
    {
      icon: Settings,
      label: 'Paramètres',
      onClick: () => {
        console.log('Ouvrir paramètres');
        onActionComplete?.();
      },
      color: 'gray'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                action.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100 text-blue-700' :
                action.color === 'green' ? 'bg-green-50 hover:bg-green-100 text-green-700' :
                action.color === 'purple' ? 'bg-purple-50 hover:bg-purple-100 text-purple-700' :
                'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;