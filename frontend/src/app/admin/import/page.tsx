'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Check, X, AlertCircle, Download, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/stores/useStore';
import { getApiUrl } from '@/lib/config';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  categories: string[];
}

export default function ImportPage() {
  const { locale } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [limitPerCategory, setLimitPerCategory] = useState(0);
  const [replaceAll, setReplaceAll] = useState(true);
  const isRTL = locale === 'he';

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
      parseFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    // Simple CSV parsing for preview
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    const data = lines.slice(1, 6).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      return row;
    });

    setPreviewData(data);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // If replaceAll is true, first delete all existing products
      if (replaceAll) {
        setProgress(10);
        await fetch(`${getApiUrl()}/api/import/products`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProgress(20);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('limitPerCategory', limitPerCategory.toString());

      const response = await fetch(`${getApiUrl()}/api/import/csv`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        setResult({
          success: data.imported || 0,
          failed: data.failed || 0,
          errors: data.errors || [],
          categories: data.categories || [],
        });
      } else {
        setResult({
          success: 0,
          failed: 1,
          errors: [data.message || 'Import failed'],
          categories: [],
        });
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setResult({
        success: 0,
        failed: 1,
        errors: [error.message || 'Upload failed'],
        categories: [],
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewData([]);
    setResult(null);
    setProgress(0);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'ייבוא CSV/Excel' : 'Import CSV/Excel'}
          </h1>
          <p className="text-gray-600">
            {isRTL
              ? 'העלה קובץ CSV או Excel לייבוא מוצרים וקטגוריות'
              : 'Upload a CSV or Excel file to import products and categories'}
          </p>
        </div>

        {/* Upload Area */}
        {!file && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
              isDragging
                ? 'border-cyan-400 bg-cyan-50'
                : 'border-gray-300 bg-white'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${isDragging ? 'bg-cyan-400' : 'bg-gray-100'}`}>
                <Upload size={40} className={isDragging ? 'text-white' : 'text-gray-400'} />
              </div>
              <div>
                <p className="text-xl font-medium text-gray-900">
                  {isRTL ? 'גרור קובץ לכאן' : 'Drag and drop your file here'}
                </p>
                <p className="text-gray-500 mt-1">
                  {isRTL ? 'או לחץ לבחירת קובץ' : 'or click to browse'}
                </p>
              </div>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-6 py-3 bg-cyan-400 text-black font-bold rounded-lg cursor-pointer hover:bg-cyan-300 transition-colors"
              >
                {isRTL ? 'בחר קובץ' : 'Select File'}
              </label>
              <p className="text-sm text-gray-400">
                {isRTL ? 'פורמטים נתמכים: CSV, XLSX' : 'Supported formats: CSV, XLSX'}
              </p>
            </div>
          </motion.div>
        )}

        {/* File Preview */}
        {file && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* File Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileSpreadsheet size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="p-6 border-b border-gray-100 bg-gray-50 space-y-4">
              {/* Replace All Toggle */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-yellow-800">
                    {isRTL ? 'החלף את כל המוצרים' : 'Replace all products'}
                  </span>
                  <p className="text-xs text-yellow-600 mt-1">
                    {isRTL
                      ? 'ימחק את כל המוצרים הקיימים לפני הייבוא'
                      : 'Will delete all existing products before import'}
                  </p>
                </div>
                <button
                  onClick={() => setReplaceAll(!replaceAll)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    replaceAll ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      replaceAll ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Limit per category */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  {isRTL ? 'מגבלת מוצרים לקטגוריה' : 'Products per category limit'}
                </span>
                <select
                  value={limitPerCategory}
                  onChange={(e) => setLimitPerCategory(Number(e.target.value))}
                  className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value={0}>{isRTL ? 'ללא מגבלה (הכל)' : 'No limit (All)'}</option>
                  <option value={5}>5 {isRTL ? 'מוצרים' : 'products'}</option>
                  <option value={10}>10 {isRTL ? 'מוצרים' : 'products'}</option>
                  <option value={20}>20 {isRTL ? 'מוצרים' : 'products'}</option>
                  <option value={50}>50 {isRTL ? 'מוצרים' : 'products'}</option>
                </select>
              </label>
            </div>

            {/* Data Preview */}
            {previewData.length > 0 && (
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-medium text-gray-900 mb-4">
                  {isRTL ? 'תצוגה מקדימה (5 שורות ראשונות)' : 'Preview (first 5 rows)'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(previewData[0] || {}).slice(0, 5).map((header) => (
                          <th key={header} className="px-4 py-2 text-left font-medium text-gray-700">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          {Object.values(row).slice(0, 5).map((value: any, j) => (
                            <td key={j} className="px-4 py-2 text-gray-600 truncate max-w-[200px]">
                              {String(value).substring(0, 50)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="p-6">
              {isUploading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 size={24} className="text-cyan-400 animate-spin" />
                    <span className="font-medium text-gray-900">
                      {isRTL ? 'מעלה...' : 'Uploading...'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-cyan-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-500">{progress}%</p>
                </div>
              ) : (
                <button
                  onClick={handleUpload}
                  className="w-full py-4 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  {isRTL ? 'התחל ייבוא' : 'Start Import'}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Result Header */}
              <div className={`p-6 ${result.success > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${result.success > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                    {result.success > 0 ? (
                      <Check size={24} className="text-white" />
                    ) : (
                      <AlertCircle size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {result.success > 0
                        ? isRTL ? 'הייבוא הושלם!' : 'Import Complete!'
                        : isRTL ? 'הייבוא נכשל' : 'Import Failed'}
                    </h3>
                    <p className="text-gray-600">
                      {isRTL
                        ? `${result.success} מוצרים יובאו בהצלחה, ${result.failed} נכשלו`
                        : `${result.success} products imported, ${result.failed} failed`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Categories Created */}
              {result.categories.length > 0 && (
                <div className="p-6 border-b border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {isRTL ? 'קטגוריות שנוצרו' : 'Categories Created'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="p-6 border-b border-gray-100">
                  <h4 className="font-medium text-red-600 mb-3">
                    {isRTL ? 'שגיאות' : 'Errors'}
                  </h4>
                  <ul className="space-y-2">
                    {result.errors.map((error, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="p-6 flex gap-4">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {isRTL ? 'ייבוא נוסף' : 'Import More'}
                </button>
                <a
                  href="/admin/products"
                  className="flex-1 py-3 bg-cyan-400 text-black font-medium rounded-lg hover:bg-cyan-300 transition-colors text-center"
                >
                  {isRTL ? 'צפה במוצרים' : 'View Products'}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 rounded-xl p-6"
        >
          <h3 className="font-bold text-blue-900 mb-3">
            {isRTL ? 'הוראות' : 'Instructions'}
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>
              • {isRTL
                ? 'הקובץ חייב לכלול עמודות: שם, תיאור, קטגוריה, מחיר, מק"ט'
                : 'File must include columns: Name, Description, Category, Price, SKU'}
            </li>
            <li>
              • {isRTL
                ? 'קטגוריות חדשות ייווצרו אוטומטית'
                : 'New categories will be created automatically'}
            </li>
            <li>
              • {isRTL
                ? 'תמונות יכולות להיות קישורי URL'
                : 'Images can be URL links'}
            </li>
            <li>
              • {isRTL
                ? 'הגדר מגבלת מוצרים לקטגוריה לשליטה בכמות הייבוא'
                : 'Set products per category limit to control import volume'}
            </li>
          </ul>

          <a
            href="/templates/import-template.csv"
            download
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:underline"
          >
            <Download size={16} />
            {isRTL ? 'הורד תבנית CSV' : 'Download CSV Template'}
          </a>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
