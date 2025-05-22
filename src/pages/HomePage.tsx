import { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import defaultAvatar from '../assets/default-avatar.svg';
import { Box } from '@mui/material';

type Category = Database['public']['Tables']['categories']['Row'];

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  image_urls?: string[];
  [key: string]: any;
}

const blobs = [
  {
    className: 'absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-purple-200 opacity-40 rounded-full blur-3xl',
    speed: -10,
  },
  {
    className: 'absolute top-[40%] right-[-100px] w-[300px] h-[300px] bg-purple-100 opacity-30 rounded-full blur-2xl',
    speed: 8,
  },
  {
    className: 'absolute bottom-[-100px] left-[20%] w-[280px] h-[280px] bg-violet-100 opacity-30 rounded-full blur-2xl',
    speed: -6,
  },
  {
    className: 'absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-100 opacity-30 rounded-full blur-3xl',
    speed: 12,
  },
];

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      if (!error) setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-white text-black relative overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Background Layers */}
          <Parallax speed={-30} className="absolute inset-0 z-0">
            <div className="absolute inset-0">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-90"
              >
                <source src="/videos/fashion-hero.mp4" type="video/mp4" />
              </video>
            </div>
          </Parallax>

          <Parallax speed={-20} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-white/90" />
          </Parallax>

          {/* Added Radial Gradients and Subtle Patterns */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              background: 'radial-gradient(circle at 20% 30%, rgba(221, 214, 254, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(196, 182, 250, 0.2) 0%, transparent 50%)',
            }}
          />
           {/* Floating Elements - Refined or Added */}
          {blobs.map((blob, index) => (
            <Parallax key={index} speed={blob.speed} className={`absolute z-0 ${blob.className}`} />
          ))}

          <div className="container mx-auto px-4 relative z-10 text-center">
            <Parallax speed={20} className="mb-8">
              <motion.h1
                className="text-7xl md:text-9xl font-black tracking-tighter"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                  LUXE
                <br />
                <span className="text-purple-600">STORY</span>
              </motion.h1>
            </Parallax>

            <Parallax speed={-10} className="mb-12">
              <motion.p
                className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Khám phá câu chuyện thời trang của bạn
              </motion.p>
            </Parallax>

            <motion.div
              className="flex justify-center gap-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                to="/products"
                className="px-8 py-4 bg-black text-white font-bold text-lg hover:bg-purple-600 transition-colors duration-300"
              >
                Khám phá ngay
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-black text-black font-bold text-lg hover:bg-black hover:text-white transition-colors duration-300"
              >
                Câu chuyện của chúng tôi
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-4">
            <Parallax speed={-20} className="mb-20">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                  BỘ SƯU TẬP
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Khám phá những bộ sưu tập độc đáo được thiết kế riêng cho bạn
                </p>
              </motion.div>
            </Parallax>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Parallax speed={-25} className="relative">
                <CollectionCard
                  title="Xuân Hè 2024"
                  description="Bộ sưu tập tươi mới với những gam màu pastel và chất liệu nhẹ nhàng"
                  imageUrl="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
                  link="/products?collection=spring-summer"
                />
              </Parallax>
              <Parallax speed={25} className="relative">
                <CollectionCard
                  title="Thu Đông 2024"
                  description="Phong cách ấm áp với những thiết kế sang trọng và chất liệu cao cấp"
                  imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  link="/products?collection=fall-winter"
                />
              </Parallax>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-32 relative bg-gray-50">
          <div className="container mx-auto px-4">
            <Parallax speed={-20} className="mb-20">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                  SẢN PHẨM NỔI BẬT
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Những sản phẩm được yêu thích nhất tại cửa hàng của chúng tôi
                </p>
              </motion.div>
            </Parallax>
            
            {loading ? (
              <div className="text-center text-gray-500 py-20">Đang tải sản phẩm...</div>
            ) : (
              <FeaturedProducts products={products} />
            )}
          </div>
        </section>

        {/* Story Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-4">
            <Parallax speed={-20} className="mb-20">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                  CÂU CHUYỆN CỦA CHÚNG TÔI
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Khám phá hành trình tạo nên những sản phẩm thời trang độc đáo
                </p>
              </motion.div>
            </Parallax>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Parallax speed={-30} className="relative">
                <StoryCard
                  title="Thiết kế"
                  description="Quá trình sáng tạo và phát triển mẫu thiết kế"
                  imageUrl="https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=800&q=80"
                />
              </Parallax>
              <Parallax speed={0} className="relative">
                <StoryCard
                  title="Sản xuất"
                  description="Công nghệ và kỹ thuật sản xuất hiện đại"
                  imageUrl="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80"
                />
              </Parallax>
              <Parallax speed={30} className="relative">
                <StoryCard
                  title="Chất lượng"
                  description="Cam kết về chất lượng và tính bền vững"
                  imageUrl="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
                />
              </Parallax>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 relative bg-gray-50">
          <div className="container mx-auto px-4">
            <Parallax speed={-20} className="mb-20">
              <motion.h2
                className="text-5xl md:text-7xl font-black text-center tracking-tighter"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                KHÁCH HÀNG NÓI GÌ?
              </motion.h2>
            </Parallax>
            <TestimonialCarousel />
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
};

// Component CollectionCard
const CollectionCard = ({ title, description, imageUrl, link }: { title: string; description: string; imageUrl: string; link: string }) => (
  <motion.div
    className="relative group cursor-pointer"
    whileHover={{ scale: 1.02 }}
  >
    <div className="relative h-[600px] overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-12">
        <h3 className="text-4xl font-black mb-4 text-white">{title}</h3>
        <p className="text-gray-200 mb-8 text-lg">{description}</p>
        <Link
          to={link}
          className="inline-block px-8 py-4 bg-white text-black font-bold hover:bg-purple-600 hover:text-white transition-colors duration-300"
        >
          Khám phá ngay
        </Link>
      </div>
    </div>
  </motion.div>
);

// Component StoryCard
const StoryCard = ({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) => (
  <motion.div
    className="relative group"
    whileHover={{ y: -10 }}
  >
    <div className="relative h-[400px] overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={e => { e.currentTarget.src = 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=800&q=80'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="text-2xl font-black mb-3 text-white">{title}</h3>
        <p className="text-gray-200">{description}</p>
      </div>
    </div>
  </motion.div>
);

// Component TestimonialCarousel
function TestimonialCarousel() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragLimit, setDragLimit] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*, users:users(id, full_name, avatar_url), products(name)')
        .eq('rating', 5)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error) setComments(data || []);
      setLoading(false);
    };
    fetchComments();
  }, []);

  useLayoutEffect(() => {
    function updateDragLimit() {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        if (trackWidth > containerWidth) {
          setDragLimit(trackWidth - containerWidth);
        } else {
          setDragLimit(0);
        }
      }
    }
    updateDragLimit();
    window.addEventListener('resize', updateDragLimit);
    return () => window.removeEventListener('resize', updateDragLimit);
  }, [comments.length]);

  if (loading) return <div className="text-center text-gray-500">Đang tải bình luận...</div>;
  if (!comments.length) return <div className="text-center text-gray-400">Chưa có bình luận 5 sao nào.</div>;

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto overflow-hidden py-8">
      <motion.div
        ref={trackRef}
        className="flex gap-8 cursor-grab active:cursor-grabbing px-2"
        drag={dragLimit > 0 ? 'x' : false}
        dragConstraints={{ left: -dragLimit, right: 0 }}
        dragElastic={0.18}
        style={{ touchAction: "pan-x" }}
      >
        {comments.map((c, idx) => (
          <motion.div
            key={c.id}
            className={`bg-white rounded-3xl shadow-xl px-8 py-8 min-w-[340px] max-w-[340px] flex flex-col items-center text-center border transition-all duration-500 mx-auto
              ${idx === active ? "scale-105 border-purple-500 shadow-2xl z-10" : "scale-100 border-purple-100"}
            `}
            whileHover={{ scale: 1.08, boxShadow: "0 8px 32px 0 rgba(128,0,255,0.15)" }}
            onClick={() => setActive(idx)}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={c.users?.avatar_url || defaultAvatar} 
              alt={c.users?.full_name || 'User'} 
              className="w-14 h-14 rounded-full object-cover border-2 border-purple-200 mb-2"
              onError={e => { e.currentTarget.src = defaultAvatar; }}
            />
            <div className="font-bold text-purple-700 text-lg mb-1">{c.users?.full_name || 'Khách hàng'}</div>
            <div className="text-yellow-500 text-xl mb-2">{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</div>
            <div className="text-gray-700 mb-2 italic line-clamp-3">"{c.comment}"</div>
            <div className="text-sm text-gray-400">
              Về sản phẩm: <span className="font-semibold text-primary-600">{c.products?.name || ''}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {comments.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`w-3 h-3 rounded-full ${active === idx ? 'bg-purple-500' : 'bg-purple-200'}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

// Thêm component FeaturedProducts
const FeaturedProducts = ({ products }: { products: Product[] }) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.3], [0.8, 0.8, 1]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <motion.div
      style={{ opacity, scale }}
      className="w-full"
    >
      <Slider {...settings}>
        {products.map((item) => (
          <div key={item.id} className="px-4">
            <motion.div
              className="group relative rounded-3xl overflow-hidden shadow-2xl bg-white/90 hover:scale-105 transition-transform duration-500 border border-white/40"
              whileHover={{ scale: 1.07 }}
            >
              <img
                src={item.image_url || (item.image_urls?.[0]) || 'https://via.placeholder.com/400x600?text=No+Image'}
                alt={item.name}
                className="w-full h-64 object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-200/40 via-transparent to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-bold text-purple-700 mb-2 drop-shadow-lg line-clamp-2">{item.name}</h3>
                <p className="text-purple-500 mb-4 text-base font-medium drop-shadow">
                  {item.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </p>
                <Link
                  to={`/products/${item.id}`}
                  className="inline-block px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full font-semibold shadow hover:from-purple-600 hover:to-primary-600 transition-all duration-300 border-2 border-white/20"
                >
                  Xem chi tiết
                </Link>
              </div>
            </motion.div>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
};

export default HomePage;