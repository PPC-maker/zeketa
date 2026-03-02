'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import {
  Accessibility,
  X,
  ZoomIn,
  ZoomOut,
  Type,
  Contrast,
  MousePointer,
  Link2,
  RotateCcw,
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  highlightLinks: boolean;
  bigCursor: boolean;
  readableFont: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  highlightLinks: false,
  bigCursor: false,
  readableFont: false,
};

export default function AccessibilityWidget() {
  const { locale } = useStore();
  const isRTL = locale === 'he';
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Apply settings to document
  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`;

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Highlight links
    if (newSettings.highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }

    // Big cursor
    if (newSettings.bigCursor) {
      root.classList.add('big-cursor');
    } else {
      root.classList.remove('big-cursor');
    }

    // Readable font
    if (newSettings.readableFont) {
      root.classList.add('readable-font');
    } else {
      root.classList.remove('readable-font');
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 150) {
      updateSetting('fontSize', settings.fontSize + 10);
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 80) {
      updateSetting('fontSize', settings.fontSize - 10);
    }
  };

  return (
    <>
      {/* Global styles for accessibility */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(1.4);
        }
        .high-contrast img {
          filter: contrast(0.8);
        }
        .highlight-links a {
          outline: 3px solid #fbbf24 !important;
          outline-offset: 2px;
          background-color: rgba(251, 191, 36, 0.2) !important;
        }
        .big-cursor,
        .big-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='black' stroke='white' stroke-width='1'%3E%3Cpath d='M4 4l7 19 2.5-6.5L20 14 4 4z'/%3E%3C/svg%3E") 4 4, auto !important;
        }
        .readable-font,
        .readable-font * {
          font-family: Arial, sans-serif !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.1em !important;
        }
      `}</style>

      {/* Accessibility Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        style={{ [isRTL ? 'left' : 'right']: '24px' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isRTL ? 'פתח תפריט נגישות' : 'Open accessibility menu'}
      >
        <Accessibility size={28} />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -300 : 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? -300 : 300 }}
              className="fixed top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto"
              style={{ [isRTL ? 'left' : 'right']: 0 }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="sticky top-0 bg-blue-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Accessibility size={24} />
                  <h2 className="font-bold text-lg">
                    {isRTL ? 'הגדרות נגישות' : 'Accessibility'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-700 rounded"
                  aria-label={isRTL ? 'סגור' : 'Close'}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Font Size */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Type size={20} className="text-blue-600" />
                    <span className="font-semibold">
                      {isRTL ? 'גודל טקסט' : 'Font Size'}
                    </span>
                    <span className="text-sm text-gray-500 mr-auto">
                      {settings.fontSize}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={decreaseFontSize}
                      disabled={settings.fontSize <= 80}
                      className="flex-1 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <ZoomOut size={18} />
                      <span className="text-sm">{isRTL ? 'הקטן' : 'Smaller'}</span>
                    </button>
                    <button
                      onClick={increaseFontSize}
                      disabled={settings.fontSize >= 150}
                      className="flex-1 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <ZoomIn size={18} />
                      <span className="text-sm">{isRTL ? 'הגדל' : 'Larger'}</span>
                    </button>
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="space-y-3">
                  {/* High Contrast */}
                  <button
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${
                      settings.highContrast
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      settings.highContrast ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}>
                      <Contrast size={20} />
                    </div>
                    <div className="text-start">
                      <div className="font-semibold">
                        {isRTL ? 'ניגודיות גבוהה' : 'High Contrast'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isRTL ? 'הגדלת ניגודיות הצבעים' : 'Increase color contrast'}
                      </div>
                    </div>
                    <div className={`mr-auto w-12 h-6 rounded-full transition-colors ${
                      settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                        settings.highContrast
                          ? (isRTL ? 'mr-0.5' : 'ml-6')
                          : (isRTL ? 'mr-6' : 'ml-0.5')
                      }`} />
                    </div>
                  </button>

                  {/* Highlight Links */}
                  <button
                    onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${
                      settings.highlightLinks
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      settings.highlightLinks ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}>
                      <Link2 size={20} />
                    </div>
                    <div className="text-start">
                      <div className="font-semibold">
                        {isRTL ? 'הדגשת קישורים' : 'Highlight Links'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isRTL ? 'סימון בולט של קישורים' : 'Make links more visible'}
                      </div>
                    </div>
                    <div className={`mr-auto w-12 h-6 rounded-full transition-colors ${
                      settings.highlightLinks ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                        settings.highlightLinks
                          ? (isRTL ? 'mr-0.5' : 'ml-6')
                          : (isRTL ? 'mr-6' : 'ml-0.5')
                      }`} />
                    </div>
                  </button>

                  {/* Big Cursor */}
                  <button
                    onClick={() => updateSetting('bigCursor', !settings.bigCursor)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${
                      settings.bigCursor
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      settings.bigCursor ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}>
                      <MousePointer size={20} />
                    </div>
                    <div className="text-start">
                      <div className="font-semibold">
                        {isRTL ? 'סמן גדול' : 'Big Cursor'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isRTL ? 'הגדלת סמן העכבר' : 'Enlarge the mouse cursor'}
                      </div>
                    </div>
                    <div className={`mr-auto w-12 h-6 rounded-full transition-colors ${
                      settings.bigCursor ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                        settings.bigCursor
                          ? (isRTL ? 'mr-0.5' : 'ml-6')
                          : (isRTL ? 'mr-6' : 'ml-0.5')
                      }`} />
                    </div>
                  </button>

                  {/* Readable Font */}
                  <button
                    onClick={() => updateSetting('readableFont', !settings.readableFont)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${
                      settings.readableFont
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      settings.readableFont ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}>
                      <Type size={20} />
                    </div>
                    <div className="text-start">
                      <div className="font-semibold">
                        {isRTL ? 'פונט קריא' : 'Readable Font'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isRTL ? 'פונט נגיש יותר לקריאה' : 'Use more readable font'}
                      </div>
                    </div>
                    <div className={`mr-auto w-12 h-6 rounded-full transition-colors ${
                      settings.readableFont ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                        settings.readableFont
                          ? (isRTL ? 'mr-0.5' : 'ml-6')
                          : (isRTL ? 'mr-6' : 'ml-0.5')
                      }`} />
                    </div>
                  </button>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetSettings}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  {isRTL ? 'איפוס הגדרות' : 'Reset Settings'}
                </button>

                {/* Statement Link */}
                <div className="text-center pt-4 border-t">
                  <a
                    href="/accessibility"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {isRTL ? 'הצהרת נגישות' : 'Accessibility Statement'}
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
