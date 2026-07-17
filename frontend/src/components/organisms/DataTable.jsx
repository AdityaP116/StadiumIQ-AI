/**
 * StadiumIQ — DataTable (Organism)
 *
 * Reusable table component with built-in empty states, loading states,
 * and column mapping.
 *
 * @param {Array} columns - [{ header: 'Name', key: 'name', render: (val, row) => <div/> }]
 * @param {Array} data    - Array of objects
 */

import LoadingSpinner from '../atoms/LoadingSpinner';

const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
      <table className="table-base">
        <thead className="bg-white/[0.02] border-b border-white/5">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center">
                <LoadingSpinner size="md" color="primary" className="mx-auto" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-white/40">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-white/[0.04]' : ''}`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-3 whitespace-nowrap text-sm text-white/80 ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
