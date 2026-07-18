import React from 'react';
import { useTranslation } from 'react-i18next';

const CategoryPills = ({ categories, selectedCategory, onSelectCategory }) => {
  const { i18n } = useTranslation();

  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      <button
        onClick={() => onSelectCategory(null)}
        className={`snap-start whitespace-nowrap px-8 py-3 rounded-none text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 ${
          selectedCategory === null 
            ? 'bg-primary-900 text-white' 
            : 'bg-transparent text-primary-600 border border-primary-200 hover:border-primary-400 hover:text-primary-900'
        }`}
      >
        {i18n.language === 'ar' ? 'الكل' : 'All'}
      </button>
      
      {categories.map(category => (
        <button
          key={category._id}
          onClick={() => onSelectCategory(category._id)}
          className={`snap-start whitespace-nowrap px-8 py-3 rounded-none text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 ${
            selectedCategory === category._id 
              ? 'bg-primary-900 text-white' 
              : 'bg-transparent text-primary-600 border border-primary-200 hover:border-primary-400 hover:text-primary-900'
          }`}
        >
          {i18n.language === 'ar' ? category.nameAr : category.nameFr}
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;
