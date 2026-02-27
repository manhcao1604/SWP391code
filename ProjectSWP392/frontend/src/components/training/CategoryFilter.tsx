import { useState, useEffect } from 'react';
import { TrainingCategory, trainingApi } from '../../api/training.api';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategory: number | null;
}

export default function CategoryFilter({ 
  onCategorySelect, 
  selectedCategory 
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await trainingApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Categories</h3>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading categories...</div>
      ) : (
        <div className="space-y-2">
          {/* All Categories */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              selectedCategory === null
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>

          {/* Individual Categories */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <div>
                <p className="font-medium">{category.name}</p>
                {category.description && (
                  <p className={`text-xs mt-1 ${
                    selectedCategory === category.id 
                      ? 'text-blue-100' 
                      : 'text-gray-600'
                  }`}>
                    {category.description}
                  </p>
                )}
              </div>
            </button>
          ))}

          {categories.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              No categories available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
