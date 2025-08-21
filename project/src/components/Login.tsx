import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, QrCode, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string, userData: any) => void;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Préparer les données de formulaire
      const formData = new URLSearchParams();
      console.log('Tentative de connexion avec:', { email, password });
      console.log('T:', formData);
      formData.append('username', email);
      console.log('T2:', formData);
      formData.append('password', password);
      console.log('T2:', formData);

      // Appel à l'API FastAPI
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      console.log('Response:', response);
      console.log('Response2:', response.ok);
      console.log('Response3:', response.status);
      console.log('Response4:', response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur de connexion:', errorData);
        throw new Error(errorData.detail || 'Erreur de connexion');
      }

      const data: LoginResponse = await response.json();
      console.log('Données de connexion:', data);
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        email: email,
        role: data.role
      }));
      console.log('Token stocké:', data.access_token);
      
      // Appeler la callback de succès
      onLogin(data.access_token, { email, role: data.role });
      
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      console.error('Erreur lors de la connexion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour tester avec des identifiants par défaut
  const fillTestCredentials = () => {
    setEmail('admin@pointage.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PointagePro</h1>
          <p className="text-gray-600">Système de Gestion de Pointage</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
              Connexion
            </h2>
            <p className="text-gray-600 text-center">
              Connectez-vous à votre compte
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="votre@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se Connecter'
              )}
            </button>
          </form>

          {/* Bouton de test rapide */}
          <div className="mt-6">
            <button
              type="button"
              onClick={fillTestCredentials}
              disabled={isLoading}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
            >
              Remplir avec les identifiants de test
            </button>
          </div>

          {/* Informations de test */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center mb-2">
              <strong>Comptes de test :</strong>
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Admin:</strong> admin@pointagepro.com / admin123</p>
              <p><strong>Employé:</strong> employe@entreprise.com / employe123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 PointagePro. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;






// import React, { useState } from 'react';
// import { Mail, Lock, Eye, EyeOff, QrCode } from 'lucide-react';

// interface LoginProps {
//   onLogin: (email: string, password: string) => void;
// }

// const Login: React.FC<LoginProps> = ({ onLogin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Simulation d'authentification
//     setTimeout(() => {
//       if (email && password) {
//         onLogin(email, password);
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         {/* Logo et titre */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//             <QrCode className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">PointagePro</h1>
//           <p className="text-gray-600">Système de Gestion de Pointage</p>
//         </div>

//         {/* Formulaire de connexion */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="mb-6">
//             <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
//               Connexion
//             </h2>
//             <p className="text-gray-600 text-center">
//               Connectez-vous à votre compte administrateur
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Champ Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Adresse Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   placeholder="admin@pointagepro.com"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Champ Mot de passe */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de Passe
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Bouton de connexion */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   Connexion...
//                 </div>
//               ) : (
//                 'Se Connecter'
//               )}
//             </button>
//           </form>

//           {/* Informations de test */}
//           <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//             <p className="text-sm text-gray-600 text-center mb-2">
//               <strong>Compte de test :</strong>
//             </p>
//             <p className="text-xs text-gray-500 text-center">
//               Email: admin@pointagepro.com<br />
//               Mot de passe: admin123
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-sm text-gray-500">
//             © 2024 PointagePro. Tous droits réservés.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;