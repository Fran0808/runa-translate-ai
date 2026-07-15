import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Loader2, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onBackToApp: () => void;
}

export default function LoginPage({ onBackToApp }: LoginPageProps) {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (activeTab === 'register' && !name.trim()) {
      setError('Por favor, ingresa tu nombre.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'login') {
        await login(email.trim(), password);
      } else {
        await signup(email.trim(), password, name.trim());
      }
      onBackToApp(); // Return to translator page on success
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al procesar tu solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
      <div className="bg-dark-panel/40 border border-gray-800 rounded-3xl p-8 shadow-xl flex flex-col">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white mb-2">
            {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="text-gray-400 text-sm">
            {activeTab === 'login' 
              ? 'Accede para ver tu historial y estadísticas personales.' 
              : 'Únete para guardar y gestionar tus traducciones.'
            }
          </p>
        </div>

        {/* Tab Headers */}
        <div className="flex bg-dark-panel border border-gray-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'login' 
                ? 'bg-brand-teal text-obsidian font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'register' 
                ? 'bg-brand-teal text-obsidian font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-xl p-4 mb-6 flex items-start gap-3 text-xs leading-relaxed">
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nombre Completo</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-4 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-dark-panel border border-gray-800 hover:border-gray-700 focus:border-brand-teal focus:ring-0 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Correo Electrónico</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-dark-panel border border-gray-800 hover:border-gray-700 focus:border-brand-teal focus:ring-0 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Contraseña</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-dark-panel border border-gray-800 hover:border-gray-700 focus:border-brand-teal focus:ring-0 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-4 rounded-xl bg-brand-teal text-obsidian font-bold text-sm hover:bg-teal-400 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando...
              </>
            ) : (
              activeTab === 'login' ? 'Ingresar' : 'Registrar Cuenta'
            )}
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={onBackToApp}
          className="mt-6 text-center text-xs text-gray-500 hover:text-brand-teal transition-colors cursor-pointer"
        >
          Volver como Invitado
        </button>

      </div>
    </div>
  );
}
