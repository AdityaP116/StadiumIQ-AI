/**
 * StadiumIQ — Error State
 * Reusable error display component for query errors and service failures.
 */

import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
      <AlertCircle size={24} className="text-red-400" />
    </div>
    <div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      {message && (
        <p className="text-white/40 text-sm mt-1 max-w-sm">{message}</p>
      )}
    </div>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary gap-2">
        <RefreshCw size={14} />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
