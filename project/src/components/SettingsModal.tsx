import React, { useState } from 'react';
import { X, Settings, Clock, Users, Calendar, Bell, Shield, Database } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // Paramètres généraux
    companyName: 'PointagePro',
    companyEmail: 'admin@pointagepro.com',
    timezone: 'Africa/Abidjan',
    language: 'fr',
    
    // Paramètres de pointage
    heureArriveMatin: '08:00',
    heureArriveeApresMidi: '14:30',
    heuresParJour: 8,
    heuresParSemaine: 40,
    heuresParMois: 160,
    penalitesPourcentage: 10,
    
    // Paramètres de congés
    congesAnnuels: 30,
    congesMaladie: 15,
    congesMaternite: 90,
    
    // Notifications
    notifRetards: true,
    notifAbsences: true,
    notifConges: true,
    emailNotifications: true,
    
    // Sécurité
    sessionTimeout: 60,
    passwordMinLength: 8,
    requirePasswordChange: false
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'pointage', label: 'Pointage', icon: Clock },
    { id: 'conges', label: 'Congés', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'backup', label: 'Sauvegarde', icon: Database }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Paramètres sauvegardés:', settings);
    alert('Paramètres sauvegardés avec succès !');
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Paramètres Généraux</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleSettingChange('companyName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de l'entreprise
                </label>
                <input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuseau horaire
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Africa/Abidjan">Côte d'Ivoire (GMT)</option>
                  <option value="Africa/Dakar">Sénégal (GMT)</option>
                  <option value="Africa/Casablanca">Maroc (GMT+1)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Langue
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'pointage':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Paramètres de Pointage</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure limite arrivée matin
                </label>
                <input
                  type="time"
                  value={settings.heureArriveMatin}
                  onChange={(e) => handleSettingChange('heureArriveMatin', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure limite arrivée après-midi
                </label>
                <input
                  type="time"
                  value={settings.heureArriveeApresMidi}
                  onChange={(e) => handleSettingChange('heureArriveeApresMidi', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heures par jour
                </label>
                <input
                  type="number"
                  value={settings.heuresParJour}
                  onChange={(e) => handleSettingChange('heuresParJour', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heures par semaine
                </label>
                <input
                  type="number"
                  value={settings.heuresParSemaine}
                  onChange={(e) => handleSettingChange('heuresParSemaine', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heures par mois
                </label>
                <input
                  type="number"
                  value={settings.heuresParMois}
                  onChange={(e) => handleSettingChange('heuresParMois', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pénalités (%)
                </label>
                <input
                  type="number"
                  value={settings.penalitesPourcentage}
                  onChange={(e) => handleSettingChange('penalitesPourcentage', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'conges':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Paramètres des Congés</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Congés annuels (jours)
                </label>
                <input
                  type="number"
                  value={settings.congesAnnuels}
                  onChange={(e) => handleSettingChange('congesAnnuels', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Congés maladie (jours)
                </label>
                <input
                  type="number"
                  value={settings.congesMaladie}
                  onChange={(e) => handleSettingChange('congesMaladie', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Congés maternité (jours)
                </label>
                <input
                  type="number"
                  value={settings.congesMaternite}
                  onChange={(e) => handleSettingChange('congesMaternite', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Paramètres de Notifications</h3>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifRetards}
                  onChange={(e) => handleSettingChange('notifRetards', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Notifications pour les retards</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifAbsences}
                  onChange={(e) => handleSettingChange('notifAbsences', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Notifications pour les absences</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifConges}
                  onChange={(e) => handleSettingChange('notifConges', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Notifications pour les demandes de congés</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Notifications par email</span>
              </label>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Paramètres de Sécurité</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeout de session (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longueur minimale du mot de passe
                </label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.requirePasswordChange}
                onChange={(e) => handleSettingChange('requirePasswordChange', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Forcer le changement de mot de passe tous les 90 jours</span>
            </label>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Sauvegarde et Restauration</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Sauvegarde automatique</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Les données sont sauvegardées automatiquement chaque jour à 2h00.
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Configurer la sauvegarde
                </button>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Sauvegarde manuelle</h4>
                <p className="text-sm text-green-700 mb-3">
                  Créer une sauvegarde immédiate de toutes les données.
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Créer une sauvegarde
                </button>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Restauration</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Restaurer les données à partir d'une sauvegarde précédente.
                </p>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Restaurer les données
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Paramètres du Système</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar des onglets */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {renderTabContent()}
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
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;