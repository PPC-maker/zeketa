'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderTree, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/stores/useStore';
import { getApiUrl } from '@/lib/config';

interface Category {
  id: string;
  nameHe: string;
  nameEn: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
}

export default function CategoriesPage() {
  const { locale } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [formData, setFormData] = useState({
    nameHe: '',
    nameEn: '',
    slug: '',
    parentId: '' as string | null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const isRTL = locale === 'he';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/categories/tree`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const flattenCategories = (cats: Category[], result: Category[] = []): Category[] => {
    cats.forEach(cat => {
      result.push(cat);
      if (cat.children) {
        flattenCategories(cat.children, result);
      }
    });
    return result;
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nameHe: category.nameHe,
      nameEn: category.nameEn,
      slug: category.slug,
      parentId: category.parentId,
    });
    setIsNewCategory(false);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      nameHe: '',
      nameEn: '',
      slug: '',
      parentId: null,
    });
    setIsNewCategory(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    const confirmMsg = isRTL
      ? `האם אתה בטוח שברצונך למחוק את "${category.nameHe}"?`
      : `Are you sure you want to delete "${category.nameEn}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${getApiUrl()}/api/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCategories();
      } else {
        alert(isRTL ? 'שגיאה במחיקת הקטגוריה' : 'Error deleting category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(isRTL ? 'שגיאה במחיקת הקטגוריה' : 'Error deleting category');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = isNewCategory
        ? `${getApiUrl()}/api/categories`
        : `${getApiUrl()}/api/categories/${editingCategory?.id}`;

      const method = isNewCategory ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        alert(isRTL ? 'שגיאה בשמירת הקטגוריה' : 'Error saving category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert(isRTL ? 'שגיאה בשמירת הקטגוריה' : 'Error saving category');
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const renderCategory = (category: Category, level = 0) => (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 bg-gray-800 rounded-lg mb-2 ${level > 0 ? 'mr-6 border-r-2 border-cyan-400' : ''}`}
      style={{ marginRight: isRTL ? level * 24 : 0, marginLeft: isRTL ? 0 : level * 24 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderTree className="text-cyan-400" size={20} />
          <span className="text-white font-medium">
            {isRTL ? category.nameHe : category.nameEn}
          </span>
          <span className="text-gray-500 text-sm">({category.slug})</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(category)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit2 size={16} className="text-gray-400 hover:text-cyan-400" />
          </button>
          <button
            onClick={() => handleDelete(category)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="text-red-400 hover:text-red-300" />
          </button>
        </div>
      </div>
      {category.children?.map((child) => renderCategory(child, level + 1))}
    </motion.div>
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            {isRTL ? 'קטגוריות' : 'Categories'}
          </h1>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black rounded-lg hover:bg-cyan-300 transition-colors"
          >
            <Plus size={20} />
            {isRTL ? 'קטגוריה חדשה' : 'Add Category'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => renderCategory(cat))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {isNewCategory
                    ? (isRTL ? 'קטגוריה חדשה' : 'New Category')
                    : (isRTL ? 'עריכת קטגוריה' : 'Edit Category')
                  }
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {isRTL ? 'שם בעברית' : 'Hebrew Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameHe}
                    onChange={(e) => setFormData({ ...formData, nameHe: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {isRTL ? 'שם באנגלית' : 'English Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => {
                      setFormData({ ...formData, nameEn: e.target.value });
                      if (isNewCategory && !formData.slug) {
                        setFormData(prev => ({ ...prev, nameEn: e.target.value, slug: generateSlug(e.target.value) }));
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {isRTL ? 'קטגוריית אב' : 'Parent Category'}
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">{isRTL ? 'ללא (קטגוריה ראשית)' : 'None (Root Category)'}</option>
                    {flattenCategories(categories)
                      .filter(cat => cat.id !== editingCategory?.id)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {isRTL ? cat.nameHe : cat.nameEn}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {isRTL ? 'ביטול' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !formData.nameHe || !formData.nameEn || !formData.slug}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-400 text-black rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Save size={18} />
                        {isRTL ? 'שמור' : 'Save'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
