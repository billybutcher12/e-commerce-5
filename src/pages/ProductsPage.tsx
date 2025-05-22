import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import BannerSlider from '../components/shared/BannerSlider';
import Pagination from '../components/shared/Pagination';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  image_url?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category_id: string;
  image_urls?: string[];
  sizes?: string[];
  colors?: string[];
  created_at?: string;
  stock?: number;
  is_featured?: boolean;
  discount_price?: number;
}

interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string | null;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value: number;
  valid_to: string | null;
  is_active: boolean;
  max_discount: number;
  quantity: number;
  used: number;
}

function getCategoryIcon(name: string, idx: number) {
  // Gán icon theo tên hoặc random cho demo
  const icons = ['🧥', '👗', '👟', '🎒', '👜', '👒', '🧢', '🩳', '🧦', '🧤', '🧣', '👚', '👔', '👞', '👠', '👡', '👢', '🩱', '🩲', '🕶️', '💍', '💄', '🎩', '🧸', '🎁'];
  if (name.toLowerCase().includes('áo')) return '👕';
  if (name.toLowerCase().includes('quần')) return '👖';
  if (name.toLowerCase().includes('giày')) return '👟';
  if (name.toLowerCase().includes('túi')) return '👜';
  if (name.toLowerCase().includes('mũ')) return '🧢';
  return icons[idx % icons.length];
}

function getCategoryBadge(idx: number) {
  // Gán badge thú vị cho một số danh mục
  const badges = [
    { label: 'Hot', color: 'bg-red-500' },
    { label: 'New', color: 'bg-green-500' },
    { label: 'Sale', color: 'bg-yellow-400 text-yellow-900' },
    { label: '🔥', color: 'bg-orange-500' },
    { label: '⭐', color: 'bg-purple-400' },
  ];
  if (idx % 5 === 0) return badges[0];
  if (idx % 7 === 0) return badges[1];
  if (idx % 9 === 0) return badges[2];
  if (idx % 11 === 0) return badges[3];
  if (idx % 13 === 0) return badges[4];
  return null;
}

function CategoryList({ selectedCategory, setSelectedCategory }: { selectedCategory: string | null, setSelectedCategory: (id: string | null) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySales, setCategorySales] = useState<{ [categoryId: string]: number }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Lấy tổng số lượng bán cho từng danh mục
    const fetchCategorySales = async () => {
      const { data: products } = await supabase.from('products').select('category_id, sold');
      const sales: { [categoryId: string]: number } = {};
      (products || []).forEach((p: any) => {
        if (!p.category_id) return;
        sales[p.category_id] = (sales[p.category_id] || 0) + (p.sold || 0);
      });
      setCategorySales(sales);
    };
    fetchCategorySales();
  }, [categories]);

  // Tìm top 2 danh mục có số lượng bán cao nhất
  const hotCategoryIds = Object.entries(categorySales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => id);

  return (
    <div className="my-8 py-10 px-2 rounded-3xl bg-gradient-to-br from-purple-50 via-purple-100 to-white shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-center">Danh mục sản phẩm</h2>
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {/* Tất cả */}
        <motion.div
          className="flex flex-col items-center group cursor-pointer relative"
          whileHover={{
            scale: 1.13,
            rotateY: 12,
            boxShadow: '0 16px 48px 0 rgba(80,36,255,0.22), 0 0 24px 0 #a78bfa55',
            filter: 'brightness(1.08) drop-shadow(0 0 16px #a78bfa88)',
          }}
          whileTap={{ scale: 0.97, rotateY: -8 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          style={{ perspective: 800, minWidth: 110, minHeight: 140 }}
          onClick={() => setSelectedCategory(null)}
        >
          <motion.div
            className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 mb-2 flex items-center justify-center text-3xl text-primary-400 border border-purple-100 group-hover:border-purple-400 transition"
            whileHover={{ rotateX: 10, scale: 1.10, borderColor: '#a78bfa', boxShadow: '0 0 32px #a78bfa88' }}
            transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          >
            <span>🌈</span>
          </motion.div>
          <span
            className={`text-sm md:text-base font-semibold text-primary-700 group-hover:text-purple-600 transition-colors duration-200 text-center drop-shadow group-hover:drop-shadow-lg ${selectedCategory === null ? 'font-bold relative' : ''}`}
            style={selectedCategory === null ? { fontWeight: 700 } : { }}
          >
            Tất cả
            {selectedCategory === null && (
              <span className="block w-8 h-1 bg-purple-400 rounded-full mx-auto mt-1 animate-fade-in" />
            )}
          </span>
        </motion.div>
        {categories.map((cat, idx) => {
          const isHot = hotCategoryIds.includes(cat.id);
          const badge = getCategoryBadge(idx);
          return (
            <motion.div
              key={cat.id}
              className="flex flex-col items-center group cursor-pointer relative"
              whileHover={{
                scale: 1.13,
                rotateY: 12,
                boxShadow: '0 16px 48px 0 rgba(80,36,255,0.22), 0 0 24px 0 #a78bfa55',
                filter: 'brightness(1.08) drop-shadow(0 0 16px #a78bfa88)',
              }}
              whileTap={{ scale: 0.97, rotateY: -8 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              style={{ perspective: 800, minWidth: 110, minHeight: 140 }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <motion.div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 mb-2 border border-purple-100 group-hover:border-purple-400 transition flex items-center justify-center text-3xl"
                whileHover={{ rotateX: 10, scale: 1.10, borderColor: '#a78bfa', boxShadow: '0 0 32px #a78bfa88' }}
                transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              >
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <span>{getCategoryIcon(cat.name, idx)}</span>
                )}
              </motion.div>
              <span
                className={`text-sm md:text-base font-semibold text-primary-700 group-hover:text-purple-600 transition-colors duration-200 text-center drop-shadow group-hover:drop-shadow-lg ${selectedCategory === cat.id ? 'font-bold relative' : ''}`}
                style={selectedCategory === cat.id ? { fontWeight: 700 } : { }}
              >
                {cat.name}
                {selectedCategory === cat.id && (
                  <span className="block w-8 h-1 bg-purple-400 rounded-full mx-auto mt-1 animate-fade-in" />
                )}
              </span>
              {isHot && (
                <span className="absolute -top-2 right-2 px-2 py-0.5 text-xs rounded-full text-white font-bold shadow bg-red-500 animate-bounce">Hot</span>
              )}
              {badge && (
                <span className={`absolute -top-2 right-2 px-2 py-0.5 text-xs rounded-full text-white font-bold shadow ${badge.color} animate-bounce`}>{badge.label}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Hàm ánh xạ tên màu tiếng Việt sang mã màu CSS hợp lệ
const colorMap: Record<string, string> = {
  'trắng': '#fff',
  'đen': '#222',
  'đỏ': 'red',
  'xanh': 'blue',
  'vàng': 'yellow',
  'hồng': 'pink',
  'xám': 'gray',
  'nâu': '#8B4513',
  'cam': 'orange',
  'tím': 'purple',
  'xanh lá': 'green',
  'bạc': 'silver',
  'vàng gold': 'gold',
  'be': '#f5f5dc',
  'xanh dương': 'blue',
  'xanh navy': '#001f5b',
  'xanh ngọc': '#00ced1',
  'xanh rêu': '#3a5a40',
  'xanh lam': '#4682b4',
  'xanh da trời': '#87ceeb',
  'xanh lục': '#228b22',
  'xanh chuối': '#bfff00',
  'xanh mint': '#98ff98',
  'xanh pastel': '#b2fefa',
  'vàng chanh': '#fff700',
  'vàng đồng': '#b87333',
  'vàng nhạt': '#fffacd',
  'hồng pastel': '#ffd1dc',
  'hồng đậm': '#e75480',
  'hồng nhạt': '#ffe4e1',
  'tím pastel': '#d1c4e9',
  'tím đậm': '#6a1b9a',
  'nâu đất': '#a0522d',
  'nâu nhạt': '#deb887',
  'kem': '#fffdd0',
  'bạch kim': '#e5e4e2',
  'rêu': '#3a5a40',
  'ngọc': '#00ced1',
  'bích': '#0095b6',
  'cam đất': '#e97451',
  'cam nhạt': '#ffd580',
  'cam đậm': '#ff6600',
  'xám nhạt': '#d3d3d3',
  'xám đậm': '#555',
};
function getCssColor(color: string) {
  return colorMap[color.trim().toLowerCase()] || color;
}

const ProductsPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sort, setSort] = useState<string>('latest');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [showCategory, setShowCategory] = useState(true);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Thay đổi từ 12 xuống 8 sản phẩm mỗi trang (2 dòng x 4 cột)
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const { user } = useAuth();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [productRatings, setProductRatings] = useState<Record<string, number>>({});
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
      if (data && data.length > 0) {
        const prices = data.map((p: Product) => p.price);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
    };
    fetchProducts();
  }, []);

  // Lấy tất cả size và màu từ danh sách sản phẩm
  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes || [])));
  const allColors = Array.from(new Set(products.flatMap(p => p.colors || [])));

  // Filter products
  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => (p.sizes || []).some(size => selectedSizes.includes(size)));
    }
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => (p.colors || []).some(color => selectedColors.includes(color)));
    }
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(p => selectedRatings.some(r => Math.round(productRatings[p.id] || 0) === r));
    }
    if (onlyDiscount) {
      filtered = filtered.filter(p => typeof p.discount_price === 'number' && p.discount_price > 0 && p.discount_price < p.price);
    }
    if (sort === 'latest') {
      filtered = filtered.sort((a, b) => (a.id < b.id ? 1 : -1));
    } else if (sort === 'price_asc') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, sort, search, selectedSizes, selectedColors, selectedRatings, onlyDiscount, productRatings]);

  const suggestionProducts = search.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  // Xử lý slider giá
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, idx: 0 | 1) => {
    const value = Number(e.target.value);
    setPriceRange((prev) => {
      const next = [...prev] as [number, number];
      next[idx] = value;
      if (next[0] > next[1]) next[0] = next[1];
      if (next[1] < next[0]) next[1] = next[0];
      return next;
    });
  };

  // Tính toán sản phẩm cho trang hiện tại
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset về trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, sort, search]);

  // Scroll to top đến phần tổng số sản phẩm khi chuyển trang
  useEffect(() => {
    const productsHeader = document.querySelector('.products-header');
    if (productsHeader) {
      productsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoadingVouchers(true);
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching vouchers:', error);
      } else {
        const now = new Date();
        // Lọc voucher còn hạn sử dụng
        const filteredVouchers = (data || []).filter(voucher => {
          // Nếu voucher không có user_id hoặc user_id trùng với user hiện tại
          const isForUser = !voucher.user_id || voucher.user_id === user?.id;
          // Nếu không có ngày hết hạn thì luôn hiển thị, còn có thì phải còn hạn
          const isNotExpired = !voucher.valid_to || new Date(voucher.valid_to) >= now;
          return isForUser && isNotExpired;
        });
        setVouchers(filteredVouchers);
      }
      setLoadingVouchers(false);
    };
    fetchVouchers();
  }, [user]);

  // Fetch rating trung bình cho tất cả sản phẩm (tính bằng JS)
  useEffect(() => {
    const fetchRatings = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('product_id, rating');
      if (!error && data) {
        const ratingMap: Record<string, { sum: number, count: number }> = {};
        data.forEach((r: any) => {
          if (!ratingMap[r.product_id]) ratingMap[r.product_id] = { sum: 0, count: 0 };
          ratingMap[r.product_id].sum += r.rating;
          ratingMap[r.product_id].count += 1;
        });
        const avgMap: Record<string, number> = {};
        Object.keys(ratingMap).forEach(pid => {
          avgMap[pid] = ratingMap[pid].count > 0 ? ratingMap[pid].sum / ratingMap[pid].count : 0;
        });
        setProductRatings(avgMap);
      }
    };
    fetchRatings();
  }, []);

  // Thêm hàm reset filter:
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([minPrice, maxPrice]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedRatings([]);
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSlider />
      {/* <CategoryList selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} /> */}
      
      {/* Voucher Section - Full width */}
      <div className="w-full bg-gradient-to-r from-purple-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">💳</span>
            <h2 className="text-xl font-bold text-primary-600">
              Voucher hiện có
            </h2>
          </div>

          {loadingVouchers ? (
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse snap-start min-w-[300px] md:min-w-[340px]">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : vouchers.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {vouchers.map(voucher => (
                <div 
                  key={voucher.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group snap-start min-w-[300px] md:min-w-[340px]"
                >
                  {/* Ribbon */}
                  <div className="absolute -right-16 top-5 bg-primary-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
                    {voucher.discount_type === 'percent' ? `${voucher.discount_value}% OFF` : `${voucher.discount_value.toLocaleString()}₫ OFF`}
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-primary-600 mb-4">
                      {voucher.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>📦</span>
                        <span>Đơn tối thiểu: {voucher.min_order_value.toLocaleString()}₫</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <span>⏰</span>
                        <span>Hết hạn: {new Date(voucher.valid_to || '').toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Mã voucher:</div>
                        <code className="text-base font-bold font-mono text-primary-700">{voucher.code}</code>
                      </div>
                      <button 
                        onClick={() => {
                          if (!user) {
                            toast.error('Vui lòng đăng nhập để lưu voucher');
                            return;
                          }
                          navigator.clipboard.writeText(voucher.code);
                          toast.success('Đã sao chép mã voucher');
                        }}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-300 text-sm font-medium"
                      >
                        Sao chép
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Còn lại: {voucher.quantity - voucher.used} voucher
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl">
              <div className="text-gray-400 text-6xl mb-4">🎫</div>
              <div className="text-gray-600 font-medium">Hiện không có voucher nào khả dụng</div>
              <div className="text-gray-500 text-sm mt-1">Vui lòng quay lại sau nhé!</div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8">
        <div className="flex flex-col lg:flex-row gap-8 container mx-auto px-4 py-8">
          {/* Sidebar - Ẩn trên mobile, hiện khi click button */}
          <div className="lg:w-1/4 w-full">
            <button 
              onClick={() => setShowCategory(!showCategory)}
              className="lg:hidden w-full bg-primary-600 text-white py-3 px-4 rounded-lg flex items-center justify-between mb-4"
            >
              <span>Danh mục sản phẩm</span>
              <span>{showCategory ? '−' : '+'}</span>
            </button>
            
            <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${showCategory ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg">Danh mục</span>
                <button onClick={() => setShowCategory(!showCategory)} className="text-xl font-bold focus:outline-none lg:hidden">
                  {showCategory ? '−' : '+'}
                </button>
              </div>
              
              {showCategory && (
                <ul className="mb-6 space-y-2">
                  <li
                    className={`cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${
                      !selectedCategory 
                        ? 'bg-primary-100 text-primary-700 font-semibold shadow-md' 
                        : 'hover:bg-gray-100 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    Tất cả
                  </li>
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className={`cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === cat.id 
                          ? 'bg-primary-100 text-primary-700 font-semibold shadow-md' 
                          : 'hover:bg-gray-100 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              )}

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Khoảng giá</h3>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    min={minPrice}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-28 p-2 border rounded focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Từ"
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-28 p-2 border rounded focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Đến"
                  />
                </div>
                <div className="text-sm text-gray-500">Từ {priceRange[0].toLocaleString('vi-VN')}₫ đến {priceRange[1].toLocaleString('vi-VN')}₫</div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-bold text-lg mb-4">Sắp xếp</h3>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                >
                  <option value="latest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="name_asc">Tên A-Z</option>
                  <option value="name_desc">Tên Z-A</option>
                </select>
              </div>

              {/* Lọc Size */}
              {allSizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map(size => (
                      <button
                        key={size}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium ${selectedSizes.includes(size) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300'}`}
                        onClick={() => setSelectedSizes(selectedSizes.includes(size) ? selectedSizes.filter(s => s !== size) : [...selectedSizes, size])}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lọc Màu */}
              {allColors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Màu sắc</h3>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <button
                        key={color}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors duration-150 ${selectedColors.includes(color) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-primary-50'}`}
                        style={{ minWidth: 48 }}
                        onClick={() => setSelectedColors(selectedColors.includes(color) ? selectedColors.filter(c => c !== color) : [...selectedColors, color])}
                        title={color}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter số sao */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Số sao</h3>
                <div className="flex flex-wrap gap-2">
                  {[5,4,3,2,1].map(star => (
                    <button
                      key={star}
                      className={`px-3 py-1 rounded-lg border text-sm font-medium flex items-center gap-1 ${selectedRatings.includes(star) ? 'bg-yellow-400 text-white border-yellow-500' : 'bg-white text-yellow-500 border-gray-300'}`}
                      onClick={() => setSelectedRatings(selectedRatings.includes(star) ? selectedRatings.filter(s => s !== star) : [...selectedRatings, star])}
                    >
                      {star} <svg className="inline w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter sản phẩm giảm giá vào sidebar (trước filter size): */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyDiscount}
                    onChange={e => setOnlyDiscount(e.target.checked)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="font-bold text-lg">Chỉ hiện sản phẩm đang giảm giá</span>
                </label>
              </div>

              {/* Nút Xóa bộ lọc ở cuối sidebar: */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-primary-100 hover:text-primary-700 transition-all shadow"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="lg:w-3/4 w-full">
            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm phù hợp</div>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setPriceRange([minPrice, maxPrice]);
                      setSearch('');
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
                    sizes: product.sizes || [],
                    colors: product.colors || [],
                    created_at: product.created_at || '',
                    stock: product.stock || 0,
                    is_featured: product.is_featured || false,
                    rating: productRatings[product.id] || 0,
                  }}
                    showAddToCart={true}
                />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;