import React, { useState, useEffect, useMemo } from 'react';
import {
  Image as ImageIcon,
  Volume2,
  FileText,
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AdminMedia } from '../../types';

export const AdminMediaPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMedia, setNewMedia] = useState<Partial<AdminMedia>>({
    name: '',
    type: 'image',
    url: '',
    sizeBytes: 120400,
    mimeType: 'image/png',
    category: 'lesson',
    languageId: 'santali'
  });
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getMedia();
      setMediaItems(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load media items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.name || !newMedia.url) {
      alert('Name and URL are required.');
      return;
    }

    try {
      setUploading(true);
      await adminApi.uploadMedia(newMedia);
      setShowUploadModal(false);
      setNewMedia({
        name: '',
        type: 'image',
        url: '',
        sizeBytes: 120400,
        mimeType: 'image/png',
        category: 'lesson',
        languageId: 'santali'
      });
      await loadMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: AdminMedia) => {
    if (item.usedInCount > 0) {
      if (!window.confirm(`Warning: This asset is currently used in ${item.usedInCount} lesson(s) or question(s). Delete anyway?`)) {
        return;
      }
    } else {
      if (!window.confirm('Delete this media asset?')) return;
    }

    try {
      await adminApi.deleteMedia(item.mediaId);
      await loadMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete asset');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = useMemo(() => {
    return mediaItems.filter(m => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q);
      const matchesType = selectedType === 'all' || m.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [mediaItems, searchQuery, selectedType, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-vanisetu-accent" />
            Media & Asset Library
          </h1>
          <p className="text-sm text-vanisetu-text-muted mt-1">
            Central repository for tribal audio recordings, cultural photography, Ol Chiki glyphs, and iconography.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-sm font-semibold hover:bg-vanisetu-primary-dark transition shadow-md"
        >
          <Upload className="w-4 h-4" />
          Upload Asset
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Total Assets</p>
          <p className="text-2xl font-bold text-vanisetu-primary mt-0.5">{mediaItems.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Audio Pronunciations</p>
          <p className="text-2xl font-bold text-blue-600 mt-0.5">
            {mediaItems.filter(m => m.type === 'audio').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Cultural Images</p>
          <p className="text-2xl font-bold text-purple-600 mt-0.5">
            {mediaItems.filter(m => m.type === 'image').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Total Curriculum Uses</p>
          <p className="text-2xl font-bold text-vanisetu-accent mt-0.5">
            {mediaItems.reduce((acc, curr) => acc + curr.usedInCount, 0)}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-vanisetu-primary/10 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by file name or URL..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-vanisetu-text-muted">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All File Types</option>
              <option value="image">Images</option>
              <option value="audio">Audio Pronunciations</option>
              <option value="icon">Icons</option>
              <option value="document">Documents</option>
            </select>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Categories</option>
              <option value="lesson">Lesson Media</option>
              <option value="language">Language Logos</option>
              <option value="module">Module Covers</option>
              <option value="culture">Cultural Artifacts</option>
              <option value="pronunciation">Spoken Audio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl text-center text-sm text-vanisetu-text-muted border border-vanisetu-primary/10">
          Loading media assets...
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-xl text-center text-red-600 text-sm border border-red-200">
          {error}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-sm text-vanisetu-text-muted border border-vanisetu-primary/10">
          No media files found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map(item => (
            <div
              key={item.mediaId}
              className="bg-white rounded-xl border border-vanisetu-primary/10 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              {/* Asset Preview */}
              <div className="h-36 bg-gray-100 flex items-center justify-center p-2 relative overflow-hidden">
                {item.type === 'image' || item.type === 'icon' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : item.type === 'audio' ? (
                  <div className="flex flex-col items-center gap-2 text-blue-600">
                    <Volume2 className="w-10 h-10" />
                    <button
                      type="button"
                      onClick={() => {
                        const a = new Audio(item.url);
                        a.play().catch(() => alert('Audio file not found at URL'));
                      }}
                      className="px-2 py-1 rounded bg-blue-50 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                    >
                      Play Audio Sample
                    </button>
                  </div>
                ) : (
                  <FileText className="w-10 h-10 text-gray-400" />
                )}

                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-sm">
                  {item.type}
                </span>
              </div>

              {/* Asset Info */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-xs truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[11px] text-vanisetu-text-muted truncate mt-0.5" title={item.url}>
                    {item.url}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                    <span className="capitalize">{item.category}</span>
                    <span>{(item.sizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-vanisetu-primary">
                    Used in: <strong>{item.usedInCount}</strong>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.mediaId)}
                      title="Copy URL"
                      className="p-1.5 text-gray-500 hover:text-vanisetu-primary hover:bg-vanisetu-cream/60 rounded-md transition"
                    >
                      {copiedId === item.mediaId ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      title="Delete Asset"
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-vanisetu-primary/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-vanisetu-primary flex items-center gap-2">
                <Upload className="w-5 h-5 text-vanisetu-accent" />
                Upload / Register Media Asset
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Santali Ol Chiki Alphabet Glyph"
                  value={newMedia.name}
                  onChange={e => setNewMedia({ ...newMedia, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Asset Type *</label>
                  <select
                    value={newMedia.type}
                    onChange={e =>
                      setNewMedia({
                        ...newMedia,
                        type: e.target.value as AdminMedia['type'],
                        mimeType: e.target.value === 'audio' ? 'audio/mpeg' : 'image/png'
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="icon">Icon</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newMedia.category}
                    onChange={e =>
                      setNewMedia({ ...newMedia, category: e.target.value as AdminMedia['category'] })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    <option value="lesson">Lesson</option>
                    <option value="language">Language</option>
                    <option value="module">Module</option>
                    <option value="culture">Culture</option>
                    <option value="pronunciation">Pronunciation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Public Resource URL or Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/assets/images/ol-chiki.png"
                  value={newMedia.url}
                  onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-xs font-bold hover:bg-vanisetu-primary-dark shadow disabled:opacity-50"
                >
                  {uploading ? 'Registering...' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
