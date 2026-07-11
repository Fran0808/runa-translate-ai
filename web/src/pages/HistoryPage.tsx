import { Clock } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-10 flex-1 flex flex-col items-center justify-center">
      <div className="text-center max-w-2xl mb-8">
        <h2 className="text-3xl font-extrabold text-white mb-2">
          Historial de Traducciones
        </h2>
        <p className="text-gray-400">
          Últimas consultas de traducción registradas en la base de datos.
        </p>
      </div>

      {/* History List Placeholder */}
      <div className="w-full bg-dark-panel/20 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px]">
        <div className="bg-gray-900/50 p-4 rounded-full border border-gray-800 mb-4">
          <Clock className="w-10 h-10 text-brand-teal" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Sin historial reciente</h3>
        <p className="text-gray-500 text-sm text-center max-w-xs">
          Las traducciones que realices se guardarán automáticamente aquí para acceder a ellas después.
        </p>
      </div>
    </div>
  );
}
