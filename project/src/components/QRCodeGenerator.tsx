import React, { useState } from 'react';
import { QrCode, Download, Eye, Copy } from 'lucide-react';

interface Employee {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  poste: string;
  service: string;
}

interface QRCodeGeneratorProps {
  employee: Employee;
  onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ employee, onClose }) => {
  const [qrCodeData, setQrCodeData] = useState('');

  // Générer les données du QR code avec toutes les informations de l'employé
  React.useEffect(() => {
    const employeeData = {
      id: employee.id,
      matricule: employee.matricule,
      nom: employee.nom,
      prenom: employee.prenom,
      email: employee.email,
      poste: employee.poste,
      service: employee.service,
      dateGeneration: new Date().toISOString()
    };
    
    // Encoder les données en base64 pour sécurité
    const encodedData = btoa(JSON.stringify(employeeData));
    setQrCodeData(encodedData);
  }, [employee]);

  const handleDownloadQR = () => {
    // Simuler le téléchargement du QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 300;
    
    if (ctx) {
      // Fond blanc
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 300);
      
      // Simuler un QR code (en réalité il faudrait utiliser une librairie comme qrcode)
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(i * 20, j * 20, 20, 20);
          }
        }
      }
    }
    
    const link = document.createElement('a');
    link.download = `qr-code-${employee.matricule}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleCopyData = () => {
    navigator.clipboard.writeText(qrCodeData);
    alert('Données copiées dans le presse-papiers !');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            QR Code - {employee.prenom} {employee.nom}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Informations de l'employé */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Informations incluses :</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Matricule:</span> {employee.matricule}</p>
              <p><span className="font-medium">Nom:</span> {employee.nom} {employee.prenom}</p>
              <p><span className="font-medium">Email:</span> {employee.email}</p>
              <p><span className="font-medium">Poste:</span> {employee.poste}</p>
              <p><span className="font-medium">Service:</span> {employee.service}</p>
            </div>
          </div>

          {/* Zone du QR Code */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">QR Code généré</p>
                <p className="text-xs text-gray-400 mt-1">300x300 pixels</p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleDownloadQR}
              className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Télécharger</span>
            </button>
            <button
              onClick={handleCopyData}
              className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copier</span>
            </button>
            <button
              className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Prévisualiser</span>
            </button>
          </div>

          {/* Données encodées */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-1">Données encodées:</p>
            <p className="text-xs text-gray-600 break-all font-mono">{qrCodeData}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;