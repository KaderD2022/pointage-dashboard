import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, Calendar, Building, Briefcase } from "lucide-react";
import { UpdateEmployeeData, employeeService } from "../services/employeeService";

interface NewEmployeeModalProps {
  onClose: () => void;
  onSave: (employee: UpdateEmployeeData) => void;
  formErrors?: { [key: string]: string };
}

const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({ onClose, onSave, formErrors = {} }) => {
  const [formData, setFormData] = useState({
    matricule: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    fonction: "",
    service: "",
    date_embauche: "",
    poste: "",
    is_admin: false,

  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Générer matricule si vide
    const employeeData: CreateEmployeeData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password  || "defaultPassword123", // si tu veux, tu peux ajouter un champ pour saisir
      fonction: formData.fonction,
      service: formData.service,
      date_embauche: formData.date_embauche,
      matricule: formData.matricule || `EMP${String(Date.now()).slice(-3)}`,
      is_admin: formData.is_admin,
    };

    onSave(employeeData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nouvel Employé</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" /> Informations Personnelles
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matricule
                </label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Auto-généré si vide"
                />
                {formErrors.matricule && <p className="text-red-500 text-sm mt-1">{formErrors.matricule}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.first_name && <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.last_name && <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" /> Email Professionnel *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" /> Email Professionnel *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
              </div>


            </div>

            {/* Informations professionnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" /> Informations Professionnelles
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fonction *
                </label>
                <input
                  type="text"
                  name="fonction"
                  value={formData.fonction}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.fonction && <p className="text-red-500 text-sm mt-1">{formErrors.fonction}</p>}
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="w-4 h-4 inline mr-1" /> Service *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un service</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="RH">Ressources Humaines</option>
                  <option value="Finance">Finance</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Production">Production</option>
                </select>
                {formErrors.service && <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" /> Date d'Embauche *
                </label>
                <input
                  type="date"
                  name="date_embauche"
                  value={formData.date_embauche}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.date_embauche && <p className="text-red-500 text-sm mt-1">{formErrors.date_embauche}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleChange}
                  id="is_admin"
                  className="h-4 w-4"
                />
                <label htmlFor="is_admin" className="text-sm font-medium text-gray-700">
                  Administrateur
                </label>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Créer l'Employé
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmployeeModal;






// import React, { useState } from 'react';
// import { X, User, Mail, Calendar, Building, Briefcase, Lock } from 'lucide-react';
// import { CreateEmployeeData } from '../services/employeeService';

// interface NewEmployeeModalProps {
//   onClose: () => void;
//   onSave: (employee: CreateEmployeeData) => void;
// }
// const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

// const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({ onClose, onSave }) => {
//   const [formData, setFormData] = useState<CreateEmployeeData>({
//     matricule: '',
//     first_name: '',
//     last_name: '',
//     email: '',
//     password: '',
//     fonction: '',
//     service: '',
//     date_embauche: '',
//     is_admin: false,
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

// const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();

//   // Générer un matricule automatique si vide
//   const matricule = formData.matricule || `EMP${String(Date.now()).slice(-3)}`;

//   // Préparer les données typées
//   const employeeData: CreateEmployeeData = {
//     first_name: formData.first_name,
//     last_name: formData.last_name,
//     email: formData.email,
//     password: 'defaultPassword123', // temporaire ou généré
//     fonction: formData.fonction,
//     service: formData.service,
//     date_embauche: formData.date_embauche, // yyyy-mm-dd
//     matricule: matricule,
//     is_admin: false, // ou récupéré depuis le formulaire
//   };

//   onSave(employeeData);
//   onClose();
// };


//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">Nouvel Employé</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Colonne gauche */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-gray-900 flex items-center">
//               <User className="w-5 h-5 mr-2" />
//               Informations Personnelles
//             </h3>

//             <input
//               type="text"
//               name="matricule"
//               value={formData.matricule}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2"
//               placeholder="Matricule (auto si vide)"
//             />

//             <input
//               type="text"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2"
//               placeholder="Prénom"
//               required
//             />

//             <input
//               type="text"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2"
//               placeholder="Nom"
//               required
//             />

//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2"
//               placeholder="Email professionnel"
//               required
//             />

//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2"
//               placeholder="Mot de passe"
//               required
//             />
//           </div>

//           {/* Colonne droite */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-gray-900 flex items-center">
//               <Briefcase className="w-5 h-5 mr-2" />
//               Informations Professionnelles
//             </h3>

//             <input
//               type="text"
//               name="fonction"
//               value={formData.fonction}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2"
//               placeholder="Fonction"
//               required
//             />

//             <select
//               name="service"
//               value={formData.service}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2"
//               required
//             >
//               <option value="">Sélectionner un service</option>
//               <option value="IT">IT</option>
//               <option value="Marketing">Marketing</option>
//               <option value="RH">Ressources Humaines</option>
//               <option value="Finance">Finance</option>
//               <option value="Commercial">Commercial</option>
//               <option value="Production">Production</option>
//             </select>

//             <input
            
//               type="date"
//               name="date_embauche"
//               value={formData.date_embauche}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2"
//               required
//             />

//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={formData.is_admin}
//                 onChange={e =>
//                   setFormData(prev => ({ ...prev, is_admin: e.target.checked }))
//                 }
//               />
//               <span>Administrateur</span>
//             </label>
//           </div>

//           {/* Boutons */}
//           <div className="col-span-2 flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//             >
//               Créer l'Employé
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewEmployeeModal;
