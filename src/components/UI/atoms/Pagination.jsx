import Button from './Button'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  perPage = 10,
  hasNext = false,
  hasPrev = false,
  onPageChange,
  onLimitChange,
  showLimitSelector = true,
  limitOptions = [10, 25, 50, 100]
}) => {
  // Hapus kondisi ini agar pagination selalu ditampilkan
  // if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Jika hanya ada 1 halaman, tetap tampilkan halaman 1
    if (totalPages <= 1) {
      return [1]
    }

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-base-300">
      {/* Info */}
      <div className="text-sm text-base-content/70">
        Menampilkan {((currentPage - 1) * perPage) + 1} - {Math.min(currentPage * perPage, totalCount)} dari {totalCount} data
      </div>

      <div className="flex items-center gap-4">
        {/* Limit Selector */}
        {showLimitSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/70">Tampilkan:</span>
            <select
              className="select select-bordered select-sm w-20"
              value={perPage}
              onChange={(e) => onLimitChange?.(parseInt(e.target.value))}
            >
              {limitOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        {/* Pagination Buttons */}
        <div className="join">
          <Button
            className="join-item btn-sm"
            variant="outline"
            disabled={!hasPrev}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            «
          </Button>
          
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <Button
                key={`dots-${index}`}
                className="join-item btn-sm"
                variant="outline"
                disabled
              >
                ...
              </Button>
            ) : (
              <Button
                key={page}
                className="join-item btn-sm"
                variant={page === currentPage ? "primary" : "outline"}
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </Button>
            )
          ))}
          
          <Button
            className="join-item btn-sm"
            variant="outline"
            disabled={!hasNext}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            »
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pagination