import React from 'react';
import { DietaryType, SortOption } from '../utils/foodMetadata';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dietaryFilter: DietaryType;
  onDietaryChange: (dietary: DietaryType) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFilteredCount: number;
  totalAvailableCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  dietaryFilter,
  onDietaryChange,
  sortOption,
  onSortChange,
  totalFilteredCount,
  totalAvailableCount,
  onResetFilters,
  isFiltered,
}) => {
  return (
    <div className="search-filter-container" id="search-filter-bar">
      {/* ── Top row: Search input & Clear ── */}
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          id="food-search-input"
          className="search-input"
          placeholder="Search menu items (e.g., burger, biryani, paneer, pasta)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search food items"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            id="clear-search-btn"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Second row: Dietary pills, Sort dropdown, and Reset ── */}
      <div className="filter-controls-row">
        {/* Dietary Filters */}
        <div className="dietary-filter-group" role="radiogroup" aria-label="Dietary preference filter">
          <button
            type="button"
            id="dietary-filter-all"
            className={`dietary-pill ${dietaryFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => onDietaryChange('ALL')}
            aria-pressed={dietaryFilter === 'ALL'}
          >
            🍽️ All Items
          </button>
          <button
            type="button"
            id="dietary-filter-veg"
            className={`dietary-pill veg-pill ${dietaryFilter === 'VEG' ? 'active' : ''}`}
            onClick={() => onDietaryChange('VEG')}
            aria-pressed={dietaryFilter === 'VEG'}
          >
            <span className="dietary-dot veg-dot"></span> Vegetarian
          </button>
          <button
            type="button"
            id="dietary-filter-non-veg"
            className={`dietary-pill non-veg-pill ${dietaryFilter === 'NON_VEG' ? 'active' : ''}`}
            onClick={() => onDietaryChange('NON_VEG')}
            aria-pressed={dietaryFilter === 'NON_VEG'}
          >
            <span className="dietary-dot non-veg-dot"></span> Non-Veg
          </button>
        </div>

        {/* Right side controls: Sort & Reset & Counter */}
        <div className="filter-actions-group">
          {/* Sort Dropdown */}
          <div className="sort-select-wrapper">
            <label htmlFor="price-sort-select" className="sort-label">Sort by:</label>
            <select
              id="price-sort-select"
              className="sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort food items by price"
            >
              <option value="DEFAULT">Recommended</option>
              <option value="PRICE_LOW_HIGH">Price: Low to High</option>
              <option value="PRICE_HIGH_LOW">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters button when active */}
          {isFiltered && (
            <button
              type="button"
              id="reset-all-filters-btn"
              className="btn-reset-filters"
              onClick={onResetFilters}
              title="Reset all filters and search"
            >
              ↺ Reset Filters
            </button>
          )}

          {/* Result counter */}
          <span className="filter-count-badge" id="matching-items-count">
            {totalFilteredCount} {totalFilteredCount === 1 ? 'item' : 'items'}
            {totalAvailableCount > 0 && totalFilteredCount !== totalAvailableCount
              ? ` of ${totalAvailableCount}`
              : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
