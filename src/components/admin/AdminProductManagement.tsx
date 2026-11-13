import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Package,
  Search,
  Plus,
  Edit3,
  Archive,
  UploadCloud,
  X,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  Star,
  RefreshCw,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  productService,
  AdminProductListItem,
  AdminProductPayload,
  DbCategory,
} from '@/lib/services/productService';
import { formatPrice } from '@/config/brand';

interface AdminProductManagementProps {
  onProductChange?: () => void;
}

interface VariantFormItem {
  id?: string;
  sku: string;
  name: string;
  finish_name: string;
  wood_species: string;
  upholstery_fabric: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  lead_time_weeks: number;
  status: 'active' | 'draft' | 'archived';
}

interface MediaFormItem {
  url: string;
  media_type: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

export const AdminProductManagement: React.FC<AdminProductManagementProps> = ({ onProductChange }) => {
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'basic' | 'specs' | 'variants' | 'images'>('basic');

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [architecturalStatement, setArchitecturalStatement] = useState('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | null>(null);
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Specs
  const [widthCm, setWidthCm] = useState<number | ''>('');
  const [depthCm, setDepthCm] = useState<number | ''>('');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [seatHeightCm, setSeatHeightCm] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [primaryMaterial, setPrimaryMaterial] = useState('');
  const [secondaryMaterial, setSecondaryMaterial] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [assemblyRequired, setAssemblyRequired] = useState(false);
  const [leadTimeWeeks, setLeadTimeWeeks] = useState<number>(2);
  const [warrantyInfo, setWarrantyInfo] = useState('');

  // Variants
  const [variants, setVariants] = useState<VariantFormItem[]>([]);

  // Media
  const [media, setMedia] = useState<MediaFormItem[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load products and categories
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getAllProductsForAdmin(),
        productService.getCategories(),
      ]);

      if (prodRes.error) setError(prodRes.error);
      else setProducts(prodRes.data);

      if (catRes.data) setCategories(catRes.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products client-side for responsive interaction
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory && p.category_slug !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== 'all' && p.status !== selectedStatus) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSlug = p.slug.toLowerCase().includes(q);
        const matchesSku = p.sku ? p.sku.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesSlug && !matchesSku) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedStatus, searchTerm]);

  // Open modal for creating new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setName('');
    setSlug('');
    setSku('');
    setCategoryId(categories[0]?.id || '');
    setSubtitle('');
    setDescription('');
    setArchitecturalStatement('');
    setBasePrice(1000);
    setCompareAtPrice(null);
    setStatus('active');
    setIsPublished(true);
    setIsFeatured(false);

    setWidthCm('');
    setDepthCm('');
    setHeightCm('');
    setSeatHeightCm('');
    setWeightKg('');
    setPrimaryMaterial('Solid European Oak');
    setSecondaryMaterial('Concealed steel fixings');
    setCareInstructions('Wipe clean with a damp lint-free cloth.');
    setAssemblyRequired(false);
    setLeadTimeWeeks(2);
    setWarrantyInfo('5-year structural craftsmanship warranty.');

    setVariants([
      {
        sku: '',
        name: 'Standard Finish',
        finish_name: 'Standard Finish',
        wood_species: 'Natural White Oak',
        upholstery_fabric: '',
        price: 1000,
        compare_at_price: null,
        stock: 5,
        lead_time_weeks: 2,
        status: 'active',
      },
    ]);

    setMedia([
      {
        url: '/images/products/kronos-lounge-chair.webp',
        media_type: 'image',
        alt_text: 'Primary View',
        is_primary: true,
        display_order: 0,
      },
    ]);

    setModalTab('basic');
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEditModal = async (productId: string) => {
    setIsLoading(true);
    try {
      const { data, error: fetchErr } = await productService.getProductByIdForAdmin(productId);
      if (fetchErr || !data) {
        alert(fetchErr || 'Failed to fetch product details.');
        return;
      }

      setEditingProductId(data.id);
      setName(data.name);
      setSlug(data.slug);
      setSku(data.sku || '');
      setCategoryId(data.category_id || categories[0]?.id || '');
      setSubtitle(data.subtitle || '');
      setDescription(data.description || '');
      setArchitecturalStatement(data.architectural_statement || '');
      setBasePrice(Number(data.base_price));
      setCompareAtPrice(data.compare_at_price ? Number(data.compare_at_price) : null);
      setStatus(data.status);
      setIsPublished(data.is_published);
      setIsFeatured(data.is_featured);

      setWidthCm(data.width_cm ? Number(data.width_cm) : '');
      setDepthCm(data.depth_cm ? Number(data.depth_cm) : '');
      setHeightCm(data.height_cm ? Number(data.height_cm) : '');
      setSeatHeightCm(data.seat_height_cm ? Number(data.seat_height_cm) : '');
      setWeightKg(data.weight_kg ? Number(data.weight_kg) : '');
      setPrimaryMaterial(data.primary_material || '');
      setSecondaryMaterial(data.secondary_material || '');
      setCareInstructions(data.care_instructions || '');
      setAssemblyRequired(data.assembly_required || false);
      setLeadTimeWeeks(data.lead_time_weeks || 2);
      setWarrantyInfo(data.warranty_info || '');

      // Map variants
      const mappedVariants: VariantFormItem[] = (data.product_variants || []).map((v) => ({
        id: v.id,
        sku: v.sku,
        name: v.name,
        finish_name: v.finish_name,
        wood_species: v.wood_species || '',
        upholstery_fabric: v.upholstery_fabric || '',
        price: Number(v.price),
        compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
        stock: v.stock || 0,
        lead_time_weeks: v.lead_time_weeks || 2,
        status: v.status || 'active',
      }));
      setVariants(mappedVariants);

      // Map media
      const mappedMedia: MediaFormItem[] = (data.product_media || []).map((m) => ({
        url: m.url,
        media_type: m.media_type,
        alt_text: m.alt_text || '',
        is_primary: m.is_primary,
        display_order: m.display_order,
      }));
      setMedia(mappedMedia);

      setModalTab('basic');
      setFormError(null);
      setFormSuccess(null);
      setIsModalOpen(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error opening edit modal');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate slug when name changes (only in Add mode)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProductId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generated);
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);
    try {
      const targetId = editingProductId || slug || 'new-product';
      const { url, error: uploadErr } = await productService.uploadProductImage(file, targetId);

      if (uploadErr) {
        setUploadError(uploadErr);
      } else if (url) {
        const isFirst = media.length === 0;
        setMedia((prev) => [
          ...prev,
          {
            url,
            media_type: 'image',
            alt_text: name ? `${name} photo` : 'Product Image',
            is_primary: isFirst,
            display_order: prev.length,
          },
        ]);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddExternalImage = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = media.length === 0;
    setMedia((prev) => [
      ...prev,
      {
        url: newImageUrl.trim(),
        media_type: 'image',
        alt_text: name ? `${name} view` : 'Product image',
        is_primary: isFirst,
        display_order: prev.length,
      },
    ]);
    setNewImageUrl('');
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Ensure at least one primary exists if items remain
      if (updated.length > 0 && !updated.some((m) => m.is_primary)) {
        updated[0].is_primary = true;
      }
      return updated;
    });
  };

  const handleSetPrimaryMedia = (index: number) => {
    setMedia((prev) =>
      prev.map((item, i) => ({
        ...item,
        is_primary: i === index,
      }))
    );
  };

  // Variant operations
  const handleAddVariant = () => {
    const defaultSku = `${slug.toUpperCase() || 'PROD'}-VAR-${variants.length + 1}`;
    setVariants((prev) => [
      ...prev,
      {
        sku: defaultSku,
        name: `Option ${prev.length + 1}`,
        finish_name: 'Finish',
        wood_species: '',
        upholstery_fabric: '',
        price: basePrice,
        compare_at_price: null,
        stock: 5,
        lead_time_weeks: leadTimeWeeks || 2,
        status: 'active',
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantFormItem, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i === index) {
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };

  // Submit product
  const handleSubmitProduct = async (saveAsPublished?: boolean) => {
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!name.trim()) {
      setFormError('Product name is required.');
      setModalTab('basic');
      return;
    }
    if (!slug.trim()) {
      setFormError('Product slug is required.');
      setModalTab('basic');
      return;
    }
    if (basePrice < 0) {
      setFormError('Price cannot be negative.');
      setModalTab('basic');
      return;
    }
    if (compareAtPrice !== null && compareAtPrice <= basePrice) {
      setFormError('Compare-at price (MRP) must be strictly greater than selling price.');
      setModalTab('basic');
      return;
    }

    const finalIsPublished = saveAsPublished !== undefined ? saveAsPublished : isPublished;
    const finalStatus = saveAsPublished !== undefined ? (saveAsPublished ? 'active' : 'draft') : status;

    const payload: AdminProductPayload = {
      id: editingProductId || undefined,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      sku: sku.trim() || undefined,
      category_id: categoryId || undefined,
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      architectural_statement: architecturalStatement.trim() || undefined,
      base_price: basePrice,
      compare_at_price: compareAtPrice || null,
      currency: 'INR',
      status: finalStatus,
      is_published: finalIsPublished,
      is_featured: isFeatured,
      width_cm: widthCm !== '' ? Number(widthCm) : null,
      depth_cm: depthCm !== '' ? Number(depthCm) : null,
      height_cm: heightCm !== '' ? Number(heightCm) : null,
      seat_height_cm: seatHeightCm !== '' ? Number(seatHeightCm) : null,
      weight_kg: weightKg !== '' ? Number(weightKg) : null,
      primary_material: primaryMaterial.trim() || undefined,
      secondary_material: secondaryMaterial.trim() || undefined,
      care_instructions: careInstructions.trim() || undefined,
      assembly_required: assemblyRequired,
      lead_time_weeks: leadTimeWeeks || 2,
      warranty_info: warrantyInfo.trim() || undefined,
      variants: variants.map((v) => ({
        id: v.id,
        sku: v.sku.trim(),
        name: v.name.trim(),
        finish_name: v.finish_name.trim(),
        wood_species: v.wood_species.trim() || undefined,
        upholstery_fabric: v.upholstery_fabric.trim() || undefined,
        price: Number(v.price),
        compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
        lead_time_weeks: Number(v.lead_time_weeks),
        stock: Number(v.stock),
        status: v.status,
      })),
      media: media.map((m, idx) => ({
        url: m.url.trim(),
        media_type: m.media_type,
        alt_text: m.alt_text.trim() || name,
        is_primary: m.is_primary,
        display_order: idx,
      })),
    };

    setIsSubmitting(true);
    try {
      const res = await productService.saveProduct(payload);
      if (!res.success) {
        setFormError(res.error || 'Failed to save product in database.');
      } else {
        setFormSuccess(
          editingProductId
            ? 'Product updated successfully.'
            : 'New product added and published to catalogue.'
        );
        setTimeout(() => {
          setIsModalOpen(false);
          loadData();
          if (onProductChange) onProductChange();
        }, 1200);
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle quick publication from table
  const handleTogglePublish = async (item: AdminProductListItem) => {
    const newPub = !item.is_published;
    try {
      const res = await productService.setProductPublication(item.id, newPub);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? { ...p, is_published: newPub, status: newPub ? 'active' : 'draft' }
              : p
          )
        );
        if (onProductChange) onProductChange();
      } else {
        alert(res.error || 'Failed to update publication status.');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating publication status.');
    }
  };

  // Archive product
  const handleArchive = async (item: AdminProductListItem) => {
    if (!confirm(`Are you sure you want to archive "${item.name}"? It will be hidden from the storefront.`)) {
      return;
    }
    try {
      const res = await productService.archiveProduct(item.id);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? { ...p, status: 'archived', is_published: false }
              : p
          )
        );
        if (onProductChange) onProductChange();
      } else {
        alert(res.error || 'Failed to archive product.');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error archiving product.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1816]/10">
        <div>
          <h2 className="font-serif text-xl text-checkerboard font-medium">Product Catalogue Management</h2>
          <p className="text-xs text-[#666059]">
            Manage live furniture pieces, INR pricing, dimension specifications, materials, and photo galleries.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-[#1A1816]/10 text-checkerboard text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            title="Refresh Products"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-1.5 py-2 px-4 rounded-xl bg-tangerine hover:bg-tangerine/90 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-3 shadow-2xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, slug or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl text-xs text-checkerboard placeholder-[#8C827A] focus:outline-none focus:ring-1 focus:ring-tangerine"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
            className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl text-xs text-checkerboard focus:outline-none focus:ring-1 focus:ring-tangerine cursor-pointer"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by status"
            className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl text-xs text-checkerboard focus:outline-none focus:ring-1 focus:ring-tangerine cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Storefront Visible)</option>
            <option value="draft">Draft (Unpublished)</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
        {isLoading && products.length === 0 ? (
          <div className="py-16 text-center">
            <Loader2 className="w-6 h-6 text-tangerine animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#666059]">Connecting to Supabase product catalogue...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-red-600 mb-3">{error}</p>
            <button
              onClick={loadData}
              className="px-3 py-1.5 bg-white border border-[#1A1816]/10 rounded-lg text-xs font-medium cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-8 h-8 text-[#8C827A] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-serif text-checkerboard font-medium">No Products Found</p>
            <p className="text-xs text-[#666059] mt-1">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search query or filters.'
                : 'Click "Add New Product" to populate your Supabase catalogue.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1A1816]/10 bg-white/70 text-[#666059] uppercase tracking-wider font-medium">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU / Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price (INR)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1816]/5">
                {filteredProducts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-white/60 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-white border border-[#1A1816]/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {p.primary_image ? (
                              <img
                                src={p.primary_image}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/products/kronos-lounge-chair.webp';
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-stone-300" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-checkerboard text-xs flex items-center space-x-1.5">
                              <span>{p.name}</span>
                              {p.is_featured && (
                                <span className="inline-flex items-center text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-sm">
                                  <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-500 text-amber-500" />
                                  Featured
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#8C827A]">
                              {p.variants_count} {p.variants_count === 1 ? 'Variant' : 'Variants'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Slug */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#666059]">
                        <div>{p.sku || '—'}</div>
                        <div className="text-[10px] text-[#8C827A] font-sans">/{p.slug}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                          {p.category_name}
                        </span>
                      </td>

                      {/* Price in INR */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-checkerboard">
                          {formatPrice(p.base_price)}
                        </div>
                        {p.compare_at_price && p.compare_at_price > p.base_price && (
                          <div className="text-[10px] text-[#8C827A] line-through">
                            {formatPrice(p.compare_at_price)}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        {p.stock > 5 ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{p.stock} In Stock</span>
                          </span>
                        ) : p.stock > 0 ? (
                          <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Only {p.stock} left</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                            <span>Out of Stock</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-start gap-1">
                          {p.status === 'active' && p.is_published ? (
                            <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-md">
                              Published
                            </span>
                          ) : p.status === 'archived' ? (
                            <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-stone-700 bg-stone-200 border border-stone-300 px-2 py-0.5 rounded-md">
                              Archived
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                              Draft
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p.id)}
                            className="p-1.5 hover:bg-stone-200 rounded-lg text-checkerboard transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-stone-200 rounded-lg text-checkerboard transition-colors"
                            title="View in Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(p)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              p.is_published
                                ? 'text-amber-700 hover:bg-amber-100'
                                : 'text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title={p.is_published ? 'Unpublish (make Draft)' : 'Publish product'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleArchive(p)}
                            className="p-1.5 hover:bg-stone-200 text-stone-500 hover:text-stone-800 rounded-lg transition-colors cursor-pointer"
                            title="Archive Product"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FBF9F5] border border-[#1A1816]/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#1A1816]/10 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-tangerine">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-checkerboard font-medium">
                    {editingProductId ? `Edit Product: ${name}` : 'Add New Furniture Product'}
                  </h3>
                  <p className="text-[11px] text-[#666059]">
                    Saves directly to Supabase with real-time validation and image upload.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#8C827A] hover:text-checkerboard hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center space-x-1 px-6 pt-3 bg-white/50 border-b border-[#1A1816]/10 shrink-0 text-xs">
              <button
                type="button"
                onClick={() => setModalTab('basic')}
                className={`py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
                  modalTab === 'basic'
                    ? 'border-tangerine text-tangerine'
                    : 'border-transparent text-[#666059] hover:text-checkerboard'
                }`}
              >
                Basic Info & Pricing
              </button>
              <button
                type="button"
                onClick={() => setModalTab('specs')}
                className={`py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
                  modalTab === 'specs'
                    ? 'border-tangerine text-tangerine'
                    : 'border-transparent text-[#666059] hover:text-checkerboard'
                }`}
              >
                Dimensions & Craft Specs
              </button>
              <button
                type="button"
                onClick={() => setModalTab('variants')}
                className={`py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
                  modalTab === 'variants'
                    ? 'border-tangerine text-tangerine'
                    : 'border-transparent text-[#666059] hover:text-checkerboard'
                }`}
              >
                Variants ({variants.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('images')}
                className={`py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
                  modalTab === 'images'
                    ? 'border-tangerine text-tangerine'
                    : 'border-transparent text-[#666059] hover:text-checkerboard'
                }`}
              >
                Photos & Storage ({media.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-checkerboard">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* TAB 1: BASIC INFO & PRICING */}
              {modalTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Kronos Lounge Chair"
                        className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">
                        URL Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. kronos-lounge-chair"
                        className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">SKU (Stock Keeping Unit)</label>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="e.g. FW-KRN-001"
                        className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="p-4 bg-white border border-[#1A1816]/10 rounded-2xl space-y-3">
                    <h4 className="font-serif text-sm font-medium text-checkerboard">
                      Indian Currency Pricing (INR ₹)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#444] mb-1">
                          Selling Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-semibold">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={basePrice}
                            onChange={(e) => setBasePrice(Number(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine font-medium"
                          />
                        </div>
                        <span className="text-[10px] text-[#8C827A] mt-1 block">
                          Preview: {formatPrice(basePrice)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#444] mb-1">
                          Compare-at Price / MRP (₹) <span className="text-[10px] text-[#8C827A]">(Optional strike-through)</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-semibold">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={compareAtPrice ?? ''}
                            onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : null)}
                            placeholder="e.g. 2400"
                            className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine"
                          />
                        </div>
                        {compareAtPrice && compareAtPrice > basePrice && (
                          <span className="text-[10px] text-emerald-600 mt-1 block font-medium">
                            Discount: {Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)}% off MRP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">Subtitle / Short Summary</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. Sculptural Armchair in Cream Bouclé & Natural Oak"
                      className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">Full Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed architectural and craft description..."
                      className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">Architectural Statement / Quote</label>
                    <input
                      type="text"
                      value={architecturalStatement}
                      onChange={(e) => setArchitecturalStatement(e.target.value)}
                      placeholder='“Comfort and cheerful colour should live together naturally in every modern living room.”'
                      className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-tangerine italic"
                    />
                  </div>

                  {/* Publication toggles */}
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="rounded text-tangerine focus:ring-tangerine"
                      />
                      <span className="text-xs font-medium">Publish immediately on storefront</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded text-tangerine focus:ring-tangerine"
                      />
                      <span className="text-xs font-medium">Mark as Featured Piece</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: SPECS */}
              {modalTab === 'specs' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-[#1A1816]/10 rounded-2xl space-y-3">
                    <h4 className="font-serif text-sm font-medium text-checkerboard">Physical Dimensions (cm & kg)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#555] mb-1">Width (cm)</label>
                        <input
                          type="number"
                          value={widthCm}
                          onChange={(e) => setWidthCm(e.target.value ? Number(e.target.value) : '')}
                          placeholder="84"
                          className="w-full px-3 py-2 bg-stone-50 border border-[#1A1816]/10 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#555] mb-1">Depth (cm)</label>
                        <input
                          type="number"
                          value={depthCm}
                          onChange={(e) => setDepthCm(e.target.value ? Number(e.target.value) : '')}
                          placeholder="89"
                          className="w-full px-3 py-2 bg-stone-50 border border-[#1A1816]/10 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#555] mb-1">Height (cm)</label>
                        <input
                          type="number"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : '')}
                          placeholder="76"
                          className="w-full px-3 py-2 bg-stone-50 border border-[#1A1816]/10 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#555] mb-1">Seat Height (cm)</label>
                        <input
                          type="number"
                          value={seatHeightCm}
                          onChange={(e) => setSeatHeightCm(e.target.value ? Number(e.target.value) : '')}
                          placeholder="41"
                          className="w-full px-3 py-2 bg-stone-50 border border-[#1A1816]/10 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#555] mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          value={weightKg}
                          onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
                          placeholder="24"
                          className="w-full px-3 py-2 bg-stone-50 border border-[#1A1816]/10 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">Primary Material</label>
                      <input
                        type="text"
                        value={primaryMaterial}
                        onChange={(e) => setPrimaryMaterial(e.target.value)}
                        placeholder="e.g. Solid European White Oak"
                        className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">Secondary Material / Hardware</label>
                      <input
                        type="text"
                        value={secondaryMaterial}
                        onChange={(e) => setSecondaryMaterial(e.target.value)}
                        placeholder="e.g. Cream Textured Bouclé, Solid Brass Canopy"
                        className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">Delivery Lead Time (Weeks)</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={leadTimeWeeks}
                        onChange={(e) => setLeadTimeWeeks(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">Assembly Required?</label>
                      <div className="pt-2">
                        <label className="inline-flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assemblyRequired}
                            onChange={(e) => setAssemblyRequired(e.target.checked)}
                            className="rounded text-tangerine focus:ring-tangerine"
                          />
                          <span className="text-xs">Yes, requires in-room assembly</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">Warranty Information</label>
                    <input
                      type="text"
                      value={warrantyInfo}
                      onChange={(e) => setWarrantyInfo(e.target.value)}
                      placeholder="e.g. 5-year structural timber frame warranty; 2-year upholstery warranty."
                      className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">Care & Maintenance Instructions</label>
                    <textarea
                      rows={2}
                      value={careInstructions}
                      onChange={(e) => setCareInstructions(e.target.value)}
                      placeholder="e.g. Vacuum upholstery gently with soft brush. Wipe timber surfaces with a damp cloth."
                      className="w-full px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: VARIANTS */}
              {modalTab === 'variants' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-medium text-checkerboard">Finishes & SKU Variants</h4>
                      <p className="text-[11px] text-[#666059]">
                        Each variant has independent pricing, stock quantity, and finish names.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-[#1A1816]/10 hover:bg-stone-50 rounded-xl text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-tangerine" />
                      <span>Add Variant</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {variants.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white border border-[#1A1816]/10 rounded-2xl space-y-3 relative shadow-2xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#1A1816]/5">
                          <span className="font-medium text-xs text-checkerboard">Variant #{idx + 1}</span>
                          {variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete variant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-[#555] mb-1">Variant Name</label>
                            <input
                              type="text"
                              value={v.name}
                              onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                              placeholder="e.g. Natural Oak / Cream Bouclé"
                              className="w-full px-2.5 py-1.5 bg-stone-50 border border-[#1A1816]/10 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#555] mb-1">Finish Title</label>
                            <input
                              type="text"
                              value={v.finish_name}
                              onChange={(e) => handleVariantChange(idx, 'finish_name', e.target.value)}
                              placeholder="e.g. Natural Oak"
                              className="w-full px-2.5 py-1.5 bg-stone-50 border border-[#1A1816]/10 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#555] mb-1">SKU</label>
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                              placeholder="e.g. FW-KRN-OAK-01"
                              className="w-full px-2.5 py-1.5 bg-stone-50 border border-[#1A1816]/10 rounded-lg font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-[#555] mb-1">Variant Price (₹)</label>
                            <input
                              type="number"
                              min="0"
                              value={v.price}
                              onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-stone-50 border border-[#1A1816]/10 rounded-lg text-xs font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#555] mb-1">Stock Quantity</label>
                            <input
                              type="number"
                              min="0"
                              value={v.stock}
                              onChange={(e) => handleVariantChange(idx, 'stock', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-stone-50 border border-[#1A1816]/10 rounded-lg text-xs font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#555] mb-1">Wood Species (Opt)</label>
                            <input
                              type="text"
                              value={v.wood_species}
                              onChange={(e) => handleVariantChange(idx, 'wood_species', e.target.value)}
                              placeholder="e.g. Natural White Oak"
                              className="w-full px-2.5 py-1.5 bg-stone-50 border border-[#1A1816]/10 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: IMAGES & STORAGE */}
              {modalTab === 'images' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif text-sm font-medium text-checkerboard">
                      Product Photography & Supabase Storage
                    </h4>
                    <p className="text-[11px] text-[#666059]">
                      Upload high-resolution photography directly to the secured <code>products</code> bucket in Supabase.
                    </p>
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                      {uploadError}
                    </div>
                  )}

                  {/* Upload Box */}
                  <div className="p-6 border-2 border-dashed border-[#1A1816]/15 hover:border-tangerine bg-white rounded-2xl text-center transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      id="product-photo-upload"
                      disabled={isUploadingImage}
                    />
                    <label
                      htmlFor="product-photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-tangerine">
                        {isUploadingImage ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-checkerboard">
                        {isUploadingImage ? 'Uploading image to Supabase Storage...' : 'Click to select an image from your computer'}
                      </span>
                      <span className="text-[11px] text-[#8C827A]">
                        Supports WebP, PNG, JPEG, and AVIF up to 5 MB per file
                      </span>
                    </label>
                  </div>

                  {/* Or External URL */}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      placeholder="Or enter an image URL (e.g. /images/products/solve-dining-table.webp)..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-[#1A1816]/10 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddExternalImage}
                      className="px-4 py-2 bg-white hover:bg-stone-50 border border-[#1A1816]/10 text-checkerboard rounded-xl text-xs font-medium cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Media Gallery Grid */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-medium text-[#444]">Current Photo Gallery ({media.length})</span>
                    {media.length === 0 ? (
                      <p className="text-xs text-[#8C827A] italic">No photos added yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {media.map((m, idx) => (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden border bg-white shadow-2xs group ${
                              m.is_primary ? 'border-tangerine ring-2 ring-tangerine/30' : 'border-[#1A1816]/10'
                            }`}
                          >
                            <img
                              src={m.url}
                              alt={m.alt_text}
                              className="w-full h-28 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/products/kronos-lounge-chair.webp';
                              }}
                            />
                            <div className="p-2 bg-white text-[11px] flex items-center justify-between">
                              {m.is_primary ? (
                                <span className="text-[10px] text-tangerine font-semibold flex items-center">
                                  <Star className="w-3 h-3 fill-tangerine mr-1" />
                                  Primary
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryMedia(idx)}
                                  className="text-[10px] text-[#8C827A] hover:text-checkerboard cursor-pointer"
                                >
                                  Make Primary
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveMedia(idx)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#1A1816]/10 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-checkerboard text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleSubmitProduct(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-white hover:bg-stone-50 border border-[#1A1816]/10 text-checkerboard text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitProduct(true)}
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 bg-tangerine hover:bg-tangerine/90 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Publish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
