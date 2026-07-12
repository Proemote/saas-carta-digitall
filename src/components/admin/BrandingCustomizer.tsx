'use client';

import { useState } from 'react';
import { Palette, Upload } from 'lucide-react';
import type { CurrentOrg } from '@/lib/auth';

interface BrandingCustomizerProps {
  org: CurrentOrg;
  onSave: (data: {
    primary_color: string;
    secondary_color: string;
    name: string;
    logo_url?: string;
  }) => Promise<void>;
}

export default function BrandingCustomizer({
  org,
  onSave,
}: BrandingCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: org.name,
    primary_color: org.primary_color || '#8B5A3C',
    secondary_color: org.secondary_color || '#D4A574',
    logo_url: org.logo_url || '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving branding:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{
          backgroundColor: `${formData.primary_color}15`,
          color: formData.primary_color,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${formData.primary_color}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${formData.primary_color}15`;
        }}
      >
        <Palette className="w-4 h-4" />
        Personalizar
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Personalizar Branding</h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Nombre del Restaurante
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ focusColor: formData.primary_color }}
              />
            </div>

            {/* Primary Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Color Primario
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) =>
                    setFormData({ ...formData, primary_color: e.target.value })
                  }
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) =>
                    setFormData({ ...formData, primary_color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Color Secundario
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) =>
                    setFormData({ ...formData, secondary_color: e.target.value })
                  }
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondary_color}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      secondary_color: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Logo URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Logo (URL)
              </label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) =>
                  setFormData({ ...formData, logo_url: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
              />
              {formData.logo_url && (
                <img
                  src={formData.logo_url}
                  alt="Logo preview"
                  className="w-16 h-16 rounded-lg mt-2 object-cover"
                />
              )}
            </div>

            {/* Preview */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${formData.primary_color}10` }}>
              <p className="text-xs text-gray-600 mb-2">Vista previa:</p>
              <p
                className="text-lg font-bold"
                style={{ color: formData.primary_color }}
              >
                {formData.name}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: formData.primary_color }}
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
