import Pagination from './Pagination'

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'Tidak ada data',
  className = '',
  striped = true,
  hoverable = true,
  compact = false,
  pagination = null
}) => {
  const tableClasses = [
    'table',
    striped ? 'table-zebra' : '',
    hoverable ? 'table-hover' : '',
    compact ? 'table-compact' : '',
    className
  ].filter(Boolean).join(' ')

  const LoadingRow = () => (
    <tr>
      <td colSpan={columns.length} className="text-center py-8">
        <div className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memuat data...
        </div>
      </td>
    </tr>
  )

  const EmptyRow = () => (
    <tr>
      <td colSpan={columns.length} className="text-center py-8 text-base-content/60">
        {emptyMessage}
      </td>
    </tr>
  )

  return (
    <div>
      <div className="overflow-x-auto">
        <table className={tableClasses}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.headerClassName || ''}>
                  {column.title || column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRow />
            ) : data.length === 0 ? (
              <EmptyRow />
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={column.className || ''}>
                      {column.render 
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages || pagination.total_pages}
          totalCount={pagination.total || pagination.total_count}
          perPage={pagination.limit || pagination.per_page}
          hasNext={pagination.has_next}
          hasPrev={pagination.has_prev}
          onPageChange={pagination.onPageChange}
          onLimitChange={pagination.onLimitChange}
        />
      )}
    </div>
  )
}

export default Table