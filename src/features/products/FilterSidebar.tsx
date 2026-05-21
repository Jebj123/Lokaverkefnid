type FilterSidebarProps = {
  isOpen: boolean
  onClose: () => void
  genres: string[]
  platforms: string[]
  selectedGenres: string[]
  selectedPlatforms: string[]
  onToggleGenre: (genre: string) => void
  onTogglePlatform: (platform: string) => void
  onClearFilters: () => void
}

const FilterSidebar = ({
  isOpen,
  onClose,
  genres,
  platforms,
  selectedGenres,
  selectedPlatforms,
  onToggleGenre,
  onTogglePlatform,
  onClearFilters,
}: FilterSidebarProps) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col">
        <button onClick={onClose} className="text-gray-500 hover:text-black cursor-pointer text-xl pl-55">✕</button>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Genre</h2>
        </div>
        <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
          {genres.length === 0 && (
            <p className="text-sm text-gray-400">No genres available.</p>
          )}
          {genres.map(genre => (
            <label key={genre} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => onToggleGenre(genre)}
                className="w-4 h-4 accent-[#6c47ff]"
              />
              <span className="text-sm">{genre}</span>
            </label>
          ))}
        </div>
        <h2 className="font-semibold text-lg border-b pl-3 pb-4">Platform</h2>
        <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
          {platforms.length === 0 && (
            <p className="text-sm text-gray-400">No platforms available.</p>
          )}
          {platforms.map(platform => (
            <label key={platform} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform)}
                onChange={() => onTogglePlatform(platform)}
                className="w-4 h-4 accent-[#6c47ff]"
              />
              <span className="text-sm">{platform}</span>
            </label>
          ))}
        </div>
        {(selectedGenres.length > 0 || selectedPlatforms.length > 0) && (
          <div className="p-4 border-t">
            <button
              onClick={onClearFilters}
              className="w-full text-sm text-[#6c47ff] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default FilterSidebar
