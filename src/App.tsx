import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, X, ShoppingBag, Send, ChevronLeft, ChevronRight, 
  Plus, Minus, Dumbbell, Sparkles, CheckCircle, 
  Instagram, Facebook, Award, Target, Zap, Clock, User, 
  Sun, Moon, Trash2, ArrowUpRight, Shield, HeartPulse, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, CartItem, CarouselItem } from "./types";
import { PRODUCTS, CAROUSEL_EQ } from "./data";

// ==========================================
// CUSTOM PREMIUM KINETIC THEMED COMPONENTS
// ==========================================

// Magnetic Mouse Pull effect
function MagneticButton({ 
  children, 
  className, 
  onClick, 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
  [key: string]: any;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = ref.current;
    if (!btn) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btn.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (distance < 90) {
      setPosition({ x: distanceX * 0.3, y: distanceY * 0.3 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.8 }}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// 3D Horizontal Ring Carousel holding equipment items
function ThreeDRingCarousel({ 
  items, 
  onItemSelect 
}: { 
  items: CarouselItem[]; 
  onItemSelect: (idx: number) => void;
}) {
  const [rotation, setRotation] = useState(0);

  // Auto rotate the carousel slowly every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRotation(prev => prev - 90);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setRotation(prev => prev + 90);
  };

  const handleNext = () => {
    setRotation(prev => prev - 90);
  };

  // Convert current rotation angle back to selected index of item (4 items in 360 ring)
  const activeIdx = (Math.round(-rotation / 90) % items.length + items.length) % items.length;

  useEffect(() => {
    onItemSelect(activeIdx);
  }, [activeIdx]);

  return (
    <div className="relative w-full h-[360px] flex flex-col items-center justify-center perspective-1000 overflow-visible py-4 select-none">
      {/* 3D Ring container */}
      <div 
        className="relative w-full max-w-[480px] h-[240px] flex items-center justify-center preserve-3d" 
        style={{ transform: "rotateX(-6deg)" }}
      >
        {items.map((item, idx) => {
          const itemAngle = (idx * 90) + rotation;
          const rad = (itemAngle * Math.PI) / 180;
          const radius = 220; // Radius of 220px
          const x = Math.sin(rad) * radius;
          const z = Math.cos(rad) * radius;
          
          const scale = 0.55 + ((z + radius) / (2 * radius)) * 0.45;
          const opacity = 0.2 + ((z + radius) / (2 * radius)) * 0.8;
          const zIndex = Math.round((z + radius) * 10);

          return (
            <motion.div
              key={item.id}
              style={{
                position: "absolute",
                transform: `translate3d(${x}px, 0px, ${z}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                transformStyle: "preserve-3d"
              }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className={`w-[170px] sm:w-[210px] h-[220px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 select-none cursor-pointer ${
                idx === activeIdx 
                  ? "border-2 border-lime-neon shadow-[0_0_20px_rgba(204,255,0,0.3)]" 
                  : "border border-white/10"
              }`}
              onClick={() => {
                const rotationDiff = ((idx - activeIdx + 2) % 4 - 2) * -90;
                setRotation(prev => prev + rotationDiff);
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.75]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-[9px] font-mono font-bold tracking-wider text-lime-neon block mb-0.5 uppercase">
                  {item.category}
                </span>
                <h4 className="font-sans font-extrabold text-white text-xs sm:text-sm uppercase tracking-tight line-clamp-1">
                  {item.name}
                </h4>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Control buttons with custom styles */}
      <div className="flex gap-4 mt-6 z-20 relative">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-zinc-800 hover:border-lime-neon flex items-center justify-center text-white hover:text-lime-neon transition-colors bg-zinc-950 shadow-md cursor-pointer"
          aria-label="Previous physical item"
        >
          <ChevronLeft className="w-5 h-5 font-bold" />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-zinc-800 hover:border-lime-neon flex items-center justify-center text-white hover:text-lime-neon transition-colors bg-zinc-950 shadow-md cursor-pointer"
          aria-label="Next physical item"
        >
          <ChevronRight className="w-5 h-5 font-bold" />
        </button>
      </div>
    </div>
  );
}

// 3D Flip Cards for Shop Products
function ProductFlipCard({ 
  product, 
  onAddToCart, 
  onBuyNow 
}: { 
  product: Product; 
  onAddToCart: (p: Product) => void; 
  onBuyNow: () => void; 
}) {
  return (
    <div className="flip-card w-full h-[400px] cursor-pointer group">
      <div className="flip-card-inner h-full w-full relative preserve-3d transition-transform duration-[0.9s]">
        
        {/* Front Face: Product visual structure */}
        <div className="flip-card-front absolute inset-0 bg-zinc-950/80 border border-white/5 rounded-2xl p-5 flex flex-col justify-between overflow-hidden preserve-3d shadow-xl">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#ccff00]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-center z-10">
            <span className="bg-lime-neon/10 border border-lime-neon/20 text-lime-neon px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold tracking-widest uppercase">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
              <span className="text-lime-neon">★</span> {product.rating.toFixed(1)}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-6" style={{ transform: "translateZ(30px)" }}>
            <img 
              src={product.image} 
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-[160px] max-w-full object-contain rounded-xl duration-500 group-hover:scale-105"
            />
          </div>

          <div className="pt-2">
            <h4 className="font-extrabold text-sm text-zinc-100 font-sans tracking-tight uppercase line-clamp-1 mb-1">{product.name}</h4>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">HOVER TO FLIP SPEC</span>
              <span className="text-lime-neon text-lg font-black">${product.price}</span>
            </div>
          </div>
        </div>

        {/* Back Face: Dynamic Specifications, Actions, Prices */}
        <div className="flip-card-back absolute inset-0 bg-neutral-950 border border-[#ccff00]/25 rounded-2xl p-6 flex flex-col justify-between overflow-hidden preserve-3d shadow-xl bg-gradient-to-b from-neutral-950 to-neutral-900">
          <div className="absolute inset-0 bg-[#ccff00]/2 pointer-events-none" />
          
          <div>
            <span className="text-[9px] font-mono text-lime-neon uppercase font-bold tracking-widest block mb-1">
              SPEC SHEETS
            </span>
            <h4 className="font-extrabold text-xs text-white tracking-tight uppercase mb-3 line-clamp-1 border-b border-zinc-800 pb-2">
              {product.name}
            </h4>
            <p className="text-[11px] text-zinc-450 leading-relaxed font-light mb-4 text-justify">
              {product.description}
            </p>
            
            <div className="space-y-1.5">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-zinc-350 font-mono">
                  <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2 relative z-20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-zinc-500 font-mono text-[9px] font-medium uppercase tracking-widest">
                ACQUISITION VALUE
              </span>
              <span className="text-lime-neon text-xl font-black glow-text-neon">
                ${product.price}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="py-2.5 px-2 bg-zinc-950 rounded-sm border border-[#ccff00]/40 text-[#ccff00] font-mono text-[9px] tracking-wider uppercase font-extrabold hover:bg-[#ccff00] hover:text-black hover:border-lime-neon transition-all cursor-pointer"
              >
                + ADD CART
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow();
                }}
                className="py-2.5 px-2 bg-[#ccff00] text-black rounded-sm font-mono text-[9px] tracking-widest uppercase font-extrabold hover:bg-white hover:text-black transition-all flex items-center justify-center neon-bg cursor-pointer"
              >
                BUY SECURE
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function App() {
  // Theme & Persistence State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("elite_iron_theme");
    return (saved as "dark" | "light") || "dark";
  });

  // UI Navigation Sidebar state (Mobile)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart Drawer & Items State
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 3D Equipment Carousel Active index
  const [eqIndex, setEqIndex] = useState(0);

  // Enquiry Fields State
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryGoal, setEnquiryGoal] = useState("Hypertrophy");
  const [enquiryWhatsapp, setEnquiryWhatsapp] = useState("");
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccessData, setEnquirySuccessData] = useState<any | null>(null);

  // Custom Toast notification stack state
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  // Hero Mouse Movement tilt angle state (3D Parallax effect)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Theme Persistence
  useEffect(() => {
    localStorage.setItem("elite_iron_theme", theme);
  }, [theme]);

  // Handle Hero Mouse Move 3D Perspective Rotation
  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate difference vector and normalize to a scale of -15 to +15 deg rotate
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    setMouseOffset({
      x: offsetX * 12, // horizontal tilt
      y: -offsetY * 12  // vertical tilt (inverted)
    });
  };

  const handleHeroMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Toast System trigger helper
  const triggerToast = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message: "STAY TUNED: Integration in Progress by Deepak Bishnoi." };
    setToasts((prev) => [...prev, newToast]);
    
    // Automatically auto-clear toast after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Select program and scroll down to enquiry form
  const selectProgramAndScroll = (goalName: string) => {
    setEnquiryGoal(goalName);
    const el = document.getElementById("enquiry");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Shopping Cart Actions
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
    triggerToast();
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    triggerToast();
  };

  const cartSubtotal = cartItems.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity, 
    0
  );

  const cartTotalItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Submit Enquiry Callback
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryWhatsapp) return;

    setIsSubmittingEnquiry(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: enquiryName,
          goal: enquiryGoal,
          whatsapp: enquiryWhatsapp
        })
      });

      if (!res.ok) {
        throw new Error("Failed to register enquiry");
      }

      const data = await res.json();
      setEnquirySuccessData(data.payload);
      
      // Clear inputs
      setEnquiryName("");
      setEnquiryWhatsapp("");
    } catch (err) {
      console.error(err);
      triggerToast();
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "light" ? "light-mode-active" : "bg-black text-white"} relative transition-colors duration-500 overflow-hidden font-sans`}>
      
      {/* 3D FLOATING KINETIC BG ASSETS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[12%] left-[8%] animate-float-slow text-lime-neon/25 hover:text-lime-neon/65 transition-colors duration-500">
          <Dumbbell className="w-[36px] h-[36px] rotate-45 stroke-[1.25]" />
        </div>
        <div className="absolute top-[28%] right-[10%] animate-float-medium text-lime-neon/20 hover:text-lime-neon/60 transition-colors duration-500">
          <Zap className="w-[30px] h-[30px] -rotate-12 stroke-[1.25]" />
        </div>
        <div className="absolute top-[62%] left-[5%] animate-float-reverse text-lime-neon/25 hover:text-lime-neon/70 transition-colors duration-500">
          <Sparkles className="w-[28px] h-[28px] rotate-12 stroke-[1.25]" />
        </div>
        <div className="absolute top-[78%] right-[6%] animate-float-slow text-lime-neon/20 hover:text-lime-neon/60 transition-colors duration-500">
          <Target className="w-[38px] h-[38px] rotate-[50deg] stroke-[1.25]" />
        </div>
        <div className="absolute top-[45%] left-[85%] animate-float-medium text-lime-neon/25 hover:text-lime-neon/65 transition-colors duration-500">
          <Award className="w-[32px] h-[32px] -rotate-[30deg] stroke-[1.25]" />
        </div>
        <div className="absolute top-[88%] left-[15%] animate-float-reverse text-lime-neon/20 hover:text-lime-neon/60 transition-colors duration-500">
          <HeartPulse className="w-[30px] h-[30px] stroke-[1.25]" />
        </div>
      </div>

      {/* GLOWING AMBIENT BACKGROUNDS */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-[#ccff00]/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-300px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#ccff00]/8 blur-[180px] pointer-events-none z-0" />

      {/* FIXED TOAST NOTIFICATION CONTAINER */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="glass-card-neon p-4 rounded-xl border border-lime-neon/50 bg-zinc-950/90 text-white shadow-2xl relative overflow-hidden"
            >
              {/* Progress Depletion Bar */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4.5, ease: "linear" }}
                className="absolute bottom-0 left-0 h-[3px] bg-lime-neon" 
              />
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-lime-neon/20 flex items-center justify-center text-lime-neon shrink-0 animate-pulse">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-lime-neon">ELITE WIRE</h4>
                  <p className="text-sm font-medium text-zinc-100">{toast.message}</p>
                </div>
                <button 
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} 
                  className="ml-auto text-zinc-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER NAVBAR */}
      <nav className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-zinc-900 transition-colors duration-500 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <a href="#" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
            <span className="p-1.5 rounded bg-lime-neon text-black font-extrabold flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </span>
            <span>ELITE <span className="text-lime-neon italic glow-text-neon">IRON</span></span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-widest text-zinc-400">
            <a href="#" className="text-white hover:text-lime-neon transition-colors">Home</a>
            <a href="#programs" className="hover:text-lime-neon transition-colors">Programs</a>
            <a href="#carousel" className="hover:text-lime-neon transition-colors">Machinery</a>
            <a href="#shop" className="hover:text-lime-neon transition-colors">Lite Shop</a>
            <a href="#enquiry" className="hover:text-lime-neon transition-colors">Enquire</a>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-lime-neon transition-all border border-zinc-800"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-lime-neon" /> : <Moon className="w-5 h-5 text-zinc-800" />}
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-all border border-zinc-800 relative cursor-pointer"
              aria-label="Open Cart"
              id="desktop-cart-button"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-lime-neon text-black font-mono font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-black animate-bounce">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Mobile Burger Link */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-zinc-900 text-white cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE DROP DOWN DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-zinc-950 border-b border-zinc-900 overflow-hidden z-30 relative px-6 py-4"
          >
            <div className="flex flex-col gap-4 font-mono text-sm uppercase tracking-widest py-2">
              <a 
                href="#" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-lime-neon transition-colors"
              >
                Home
              </a>
              <a 
                href="#programs" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-400 hover:text-lime-neon"
              >
                Programs
              </a>
              <a 
                href="#carousel" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-400 hover:text-lime-neon"
              >
                Machinery
              </a>
              <a 
                href="#shop" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-400 hover:text-lime-neon"
              >
                Lite Shop
              </a>
              <a 
                href="#enquiry" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-400 hover:text-lime-neon scroll-smooth"
              >
                Enquire
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE WRAPPER */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* ======================================= */}
        {/* HERO SECTION WITH SPECIAL KINETIC 3D ASSETS */}
        {/* ======================================= */}
        <section 
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          className="relative py-12 md:py-16 min-h-[90vh] overflow-visible"
        >
          {/* GIANT WATERMARK '01' ON LEFT COLUMN BACKGROUND */}
          <div 
            className="absolute -left-12 top-[5%] text-[24rem] md:text-[32rem] font-sans font-black tracking-tighter opacity-[0.06] select-none pointer-events-none font-mono text-lime-neon outline-text"
            style={{ WebkitTextStroke: "2.5px #ccff00" }}
          >
            01
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Massive Kinetic Hero Info */}
            <div className="lg:col-span-7 flex flex-col justify-center select-none relative">
              <h2 className="text-xs font-bold neon-text tracking-[0.3em] uppercase mb-4">
                Peak Performance Terminal
              </h2>

              {/* Rotating 3D titles on mousehover */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  transform: `perspective(1000px) rotateX(${mouseOffset.y}deg) rotateY(${mouseOffset.x}deg)`,
                  transition: "transform 0.1s ease-out"
                }}
                className="relative"
              >
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-5">
                  EVOLVE <br />
                  <span className="text-zinc-800 outline-text" style={{ WebkitTextStroke: "1.5px #ccff00" }}>BEYOND</span> <br />
                  <span className="text-lime-neon block mt-1 glow-text-neon animate-pulse-neon">LIMITS</span>
                </h1>
              </motion.div>
              
              <p className="mt-4 text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-xl">
                Architecting the next generation of human strength through neuro-optimized training, titanium-forged machinery, and elite bio-nutritional protocols.
              </p>

              {/* Magnetic Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <MagneticButton 
                  onClick={() => {
                    const el = document.getElementById("enquiry");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }} 
                  className="px-8 py-4 bg-lime-neon text-black font-black uppercase italic text-sm rounded-sm transition-all duration-300 flex items-center justify-center gap-2 neon-bg cursor-pointer"
                >
                  START YOUR EVOLUTION <ArrowUpRight className="w-5 h-5 font-bold" />
                </MagneticButton>
                <MagneticButton 
                  onClick={() => {
                    const el = document.getElementById("programs");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }} 
                  className="px-8 py-4 bg-transparent text-white border border-zinc-700 font-bold uppercase text-xs rounded-sm hover:border-lime-neon hover:text-lime-neon transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5" /> ELITE PROGRAMS
                </MagneticButton>
              </div>

              {/* Stats banner */}
              <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-zinc-900/50 max-w-lg">
                <div>
                  <h4 className="font-mono text-2xl md:text-3xl font-black text-white">4000+</h4>
                  <p className="text-[10px] text-zinc-500 tracking-wider font-mono">ACTIVE RECRUITS</p>
                </div>
                <div>
                  <h4 className="font-mono text-2xl md:text-3xl font-black text-lime-neon">24/7</h4>
                  <p className="text-[10px] text-zinc-500 tracking-wider font-mono">COACH ASSISTANCE</p>
                </div>
                <div>
                  <h4 className="font-mono text-2xl md:text-3xl font-black text-white">100%</h4>
                  <p className="text-[10px] text-zinc-500 tracking-wider font-mono">BIOPHYSIQUE PRO</p>
                </div>
              </div>
            </div>

            {/* Right Column: Rotating 3D Dumbbell representation card */}
            <div className="lg:col-span-5 relative flex items-center justify-center h-[380px] sm:h-[450px]">
              
              {/* Spinning lines in background */}
              <div className="absolute w-72 h-72 rounded-full border border-lime-neon/5 animate-spin-slow pointer-events-none" />
              <div className="absolute w-52 h-52 rounded-full border border-dashed border-lime-neon/10 pointer-events-none" />

              {/* Glowing neon bg backdrop */}
              <div className="absolute w-60 h-[#ccff00]/10 rounded-full blur-[90px] pointer-events-none" />

              {/* Kinetic transform card */}
              <motion.div
                style={{
                  y: mouseOffset.y * 2.5,
                  x: mouseOffset.x * 2.5,
                  transformStyle: "preserve-3d"
                }}
                animate={{ 
                  y: [0, -12, 0],
                  rotateY: [0, 360] // Continuous physical 3D rotation transition
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  rotateY: { repeat: Infinity, duration: 25, ease: "linear" }
                }}
                className="glass p-6 rounded-2xl w-[310px] sm:w-[350px] border border-white/10 relative flex flex-col items-center justify-center shadow-3xl text-center select-none"
              >
                
                {/* Product Label */}
                <div className="absolute top-4 left-4 bg-zinc-950 border border-zinc-800 rounded-sm px-2.5 py-1 text-[9px] font-mono font-bold text-lime-neon">
                  TITANIUM SLATE ACTIVE
                </div>

                {/* 3D Dumbbell Vector representation */}
                <div className="w-48 h-48 flex items-center justify-center relative my-4">
                  <Dumbbell className="w-36 h-36 text-zinc-800 rotate-45 stroke-[1.25] absolute drop-shadow-[0_0_20px_rgba(204,255,0,0.3)] text-white" />
                  <Dumbbell className="w-32 h-32 text-lime-neon rotate-45 stroke-[1.5] absolute opacity-100" />
                  <div className="absolute w-10 h-10 rounded-full bg-lime-neon/10 animate-ping" />
                </div>

                {/* technical properties footer inside card */}
                <div className="w-full pt-4 border-t border-zinc-900 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] text-zinc-400">CORE MASS</span>
                    <span className="font-mono text-[9px] font-bold text-lime-neon">HEX HYBRID</span>
                  </div>
                  <div className="text-xs font-black tracking-tight text-white uppercase italic">
                    PHYSICAL STRENGTH VECTORS
                  </div>
                </div>
              </motion.div>

              {/* Small floating AI overlay widget */}
              <motion.div 
                style={{
                  x: mouseOffset.x * -2,
                  y: mouseOffset.y * -2
                }}
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-2 right-2 sm:right-6 bg-zinc-950/90 border border-lime-neon/30 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 backdrop-blur-md"
              >
                <div className="w-6 h-6 rounded bg-lime-neon flex items-center justify-center text-black font-black font-mono text-xs">
                  AI
                </div>
                <div>
                  <h5 className="font-mono text-[9px] font-black text-lime-neon tracking-wider leading-none">SYSTEMS ACTIVE</h5>
                  <p className="text-[10px] text-white">99.8% POWER LATENCY</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* INFINITE HORIZONTAL 3D RING CAROUSEL */}
          <div className="mt-16 pt-12 border-t border-zinc-900/50 w-full overflow-visible">
            <div className="text-center mb-6 max-w-lg mx-auto">
              <span className="font-mono text-[10px] text-lime-neon font-black tracking-[0.25em] uppercase">SYSTEM ACQUISITIONS</span>
              <h3 className="text-2xl font-black mt-1 italic uppercase text-white">
                3D ROTATIONAL EQUIPMENT RING
              </h3>
            </div>
            {/* The spectacular 3D ring component connects directly to the system specifications slide view */}
            <ThreeDRingCarousel items={CAROUSEL_EQ} onItemSelect={(idx) => setEqIndex(idx)} />
          </div>
        </section>

        {/* ======================================= */}
        {/* SECTION: ELITE EVOLUTION PROGRAMS */}
        {/* ======================================= */}
        <section 
          id="programs"
          className="py-16 md:py-24 relative overflow-visible"
        >
          {/* Section revealed zoom in effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full relative"
          >
            {/* Ambient holographic glow behind section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
              <span className="font-mono text-xs text-lime-neon font-black tracking-[0.25em] uppercase">ULTRA-PERFORMANCE MATRIX</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-2 italic uppercase text-white font-sans">
                ELITE <span className="text-lime-neon glow-text-neon animate-pulse-neon">EVOLUTION</span> PROGRAMS
              </h2>
              <div className="w-16 h-1.5 bg-lime-neon mx-auto mt-4 rounded" />
              <p className="text-zinc-400 font-light mt-4 leading-relaxed font-sans">
                Achieving elite athletic transformation requires targeted physiological adaptation profiles. Select a program vector below to configure your anatomical goals.
              </p>
            </div>

            {/* 3-Column Glassmorphism Program Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
              {/* Program 1: Neuro-Hypertrophy */}
              <div className="glass rounded-2xl border border-white/10 hover:border-lime-neon/50 p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_30px_rgba(204,255,0,0.15)] group relative overflow-hidden font-sans">
                <div className="scan-line opacity-10 group-hover:opacity-30" />
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-lime-neon/10 border border-lime-neon/20 text-lime-neon px-2.5 py-0.5 rounded-sm font-mono text-[9px] font-bold tracking-widest uppercase">
                      STRENGTH MODIFICATIONS
                    </span>
                    <Dumbbell className="w-6 h-6 text-lime-neon animate-pulse" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white uppercase italic tracking-tight mb-3">
                    NEURO-HYPERTROPHY SPEC
                  </h3>
                  <p className="text-xs text-zinc-450 leading-relaxed mb-6">
                    Designed to trigger maximum myofibrillar expansion using optimized tension curves, hyper-volume sets, and precision mechanical failure protocols.
                  </p>
                  <div className="space-y-2 mb-8 text-left">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>5-Day Hypertrophy Split</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>Intra-Set Recovery Ratios</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>Myofibrillar Expansion Focus</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => selectProgramAndScroll("Hypertrophy")}
                  className="w-full py-3 bg-zinc-950 border border-[#ccff00]/40 text-[#ccff00] font-mono text-[10px] tracking-wider uppercase font-extrabold hover:bg-[#ccff00] hover:text-black transition-all cursor-pointer rounded-sm"
                >
                  RESERVE PROTOCOL
                </button>
              </div>

              {/* Program 2: Metabolic Adipose Shred */}
              <div className="glass rounded-2xl border border-white/10 hover:border-lime-neon/50 p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_30px_rgba(204,255,0,0.15)] group relative overflow-hidden font-sans">
                <div className="scan-line opacity-10 group-hover:opacity-30" />
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-lime-neon/10 border border-lime-neon/20 text-lime-neon px-2.5 py-0.5 rounded-sm font-mono text-[9px] font-bold tracking-widest uppercase">
                      ENERGY CONDITIONING
                    </span>
                    <HeartPulse className="w-6 h-6 text-lime-neon animate-pulse" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white uppercase italic tracking-tight mb-3">
                    METABOLIC ADIPOSE SHRED
                  </h3>
                  <p className="text-xs text-zinc-450 leading-relaxed mb-6">
                    Neuro-metabolic conditioning designed to maximize calorie dissipation, increase oxygen uptake metrics, and shred excess fat while retaining lean mass.
                  </p>
                  <div className="space-y-2 mb-8 text-left">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>High-Intensity Lactate Threshold</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>EPOC Density Circuits</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>Fat Oxidation Protocols</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => selectProgramAndScroll("Fat Loss")}
                  className="w-full py-3 bg-zinc-950 border border-[#ccff00]/40 text-[#ccff00] font-mono text-[10px] tracking-wider uppercase font-extrabold hover:bg-[#ccff00] hover:text-black transition-all cursor-pointer rounded-sm"
                >
                  RESERVE PROTOCOL
                </button>
              </div>

              {/* Program 3: Neurological Force Capacity */}
              <div className="glass rounded-2xl border border-white/10 hover:border-lime-neon/50 p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_30px_rgba(204,255,0,0.15)] group relative overflow-hidden font-sans">
                <div className="scan-line opacity-10 group-hover:opacity-30" />
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-lime-neon/10 border border-lime-neon/20 text-lime-neon px-2.5 py-0.5 rounded-sm font-mono text-[9px] font-bold tracking-widest uppercase">
                      POWER ACQUISITION
                    </span>
                    <Shield className="w-6 h-6 text-lime-neon animate-pulse" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white uppercase italic tracking-tight mb-3">
                    NEUROLOGICAL FORCE CAPACITY
                  </h3>
                  <p className="text-xs text-zinc-450 leading-relaxed mb-6">
                    Optimize central nervous system recruitment and motor unit synchrony. Tailored for raw powerlifting, squats, presses, and maximal neurological force output.
                  </p>
                  <div className="space-y-2 mb-8 text-left">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>1-Rep Max Peak Programming</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>CNS Decompression Splits</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                      <span className="w-1.5 h-1.5 bg-lime-neon rounded-full" />
                      <span>Kinetic Velocity Diagnostics</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => selectProgramAndScroll("Powerlifting")}
                  className="w-full py-3 bg-zinc-950 border border-[#ccff00]/40 text-[#ccff00] font-mono text-[10px] tracking-wider uppercase font-extrabold hover:bg-[#ccff00] hover:text-black transition-all cursor-pointer rounded-sm"
                >
                  RESERVE PROTOCOL
                </button>
              </div>

            </div>

          </motion.div>
        </section>

        {/* ======================================= */}
        {/* SECTION: ROTATING 3D PRODUCT CAROUSEL */}
        {/* ======================================= */}
        <section 
          id="carousel"
          className="py-16 md:py-24 relative overflow-visible bg-[#050505]/40 rounded-3xl border border-zinc-900 px-6 sm:px-12"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
              <div>
                <span className="font-mono text-xs text-lime-neon font-black tracking-[0.25em] uppercase">APEX GYM MACHINERY</span>
                <h2 className="text-4xl md:text-5xl font-black mt-2 italic uppercase">
                  HEAVY 3D <span className="text-lime-neon glow-text-neon">EQUIPMENT</span> INDEX
                </h2>
                <div className="w-20 h-1.5 bg-lime-neon mt-3 rounded" />
              </div>
              <p className="text-zinc-400 font-light max-w-md leading-relaxed">
                Tour our biomechanically-optimized modular steel platforms built for maximum torque transfer and zero structural deflection.
              </p>
            </div>

            {/* Rotating Carousel Visualizer Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Product Visual Area */}
              <div className="lg:col-span-6 flex justify-center items-center relative h-[320px] sm:h-[400px]">
                
                {/* Visual rings/frames behind */}
                <div className="absolute w-80 h-80 rounded-full border border-zinc-900 border-dashed animate-spin-slow pointer-events-none" />
                <div className="absolute w-64 h-64 rounded-full bg-lime-neon/5 blur-3xl pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={eqIndex}
                    initial={{ opacity: 0, rotateY: -45, scale: 0.85 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: 45, scale: 0.85 }}
                    transition={{ duration: 0.65 }}
                    className="relative max-w-sm w-full h-[300px] rounded-xl border border-white/10 p-4 shadow-2xl overflow-hidden glass"
                  >
                    
                    {/* Visual Graphic Overlay representing machine */}
                    <div className="h-full w-full flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-[#0a0d0f] border border-zinc-800/80 font-mono text-[9px] text-lime-neon uppercase font-black">
                        {CAROUSEL_EQ[eqIndex].category}
                      </div>

                      {/* Fallback Unsplash Frame with glowing gradient */}
                      <img 
                        src={CAROUSEL_EQ[eqIndex].image} 
                        alt={CAROUSEL_EQ[eqIndex].name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl opacity-60 group-hover:opacity-85 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                      
                      {/* Central machinery vector glowing line markup */}
                      <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/95 border border-zinc-900 p-3.5 rounded-xl">
                        <span className="font-mono text-[10px] text-lime-neon block">ACTIVE PLATFORM SYSTEM</span>
                        <h4 className="font-bold text-sm tracking-tight text-white uppercase">{CAROUSEL_EQ[eqIndex].name}</h4>
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>

                {/* Left/Right controls overlaid directly */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                  <button 
                    onClick={() => setEqIndex((prev) => (prev === 0 ? CAROUSEL_EQ.length - 1 : prev - 1))}
                    className="p-3.5 rounded-xl bg-zinc-900 text-white hover:bg-lime-neon hover:text-black border border-zinc-800 hover:border-lime-neon transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-mono text-sm tracking-widest text-[#ccff00] font-black">{eqIndex + 1} / {CAROUSEL_EQ.length}</span>
                  <button 
                    onClick={() => setEqIndex((prev) => (prev === CAROUSEL_EQ.length - 1 ? 0 : prev + 1))}
                    className="p-3.5 rounded-xl bg-zinc-900 text-white hover:bg-lime-neon hover:text-black border border-zinc-800 hover:border-lime-neon transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

              {/* Product Specifications details */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <span className="font-mono text-xs text-lime-neon tracking-wider font-bold">CHAMBER CONFIGURATION SPEC</span>
                <h3 className="text-3xl font-black text-white italic tracking-tight uppercase leading-tight mt-1.5">
                  {CAROUSEL_EQ[eqIndex].name}
                </h3>
                
                <p className="mt-4 text-zinc-400 text-base leading-relaxed font-light">
                  {CAROUSEL_EQ[eqIndex].description}
                </p>

                {/* Grid spec sheets */}
                <div className="mt-6 flex flex-col gap-3.5">
                  {CAROUSEL_EQ[eqIndex].specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-900">
                      <span className="font-mono text-xs text-zinc-400 font-medium uppercase tracking-wider">{spec.label}</span>
                      <span className="font-mono text-xs text-lime-neon font-black tracking-wider">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button 
                    onClick={triggerToast}
                    className="px-7 py-3 w-fit bg-zinc-950 border border-zinc-700 text-white font-bold uppercase tracking-widest hover:border-[#ccff00] hover:text-[#ccff00] transition-all rounded-sm flex items-center gap-2 duration-300"
                  >
                    BOOK EQUIPMENT SESSION <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </section>

        {/* ======================================= */}
        {/* SECTION: THE SHOP (E-COMMERCE LITE) */}
        {/* ======================================= */}
        <section 
          id="shop"
          className="py-16 md:py-24 relative overflow-visible"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full"
          >
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs text-lime-neon font-black tracking-[0.25em] uppercase">BIO-SUPPORT STORE</span>
              <h2 className="text-4xl md:text-5xl font-black mt-2 italic uppercase">
                THE LITE <span className="text-lime-neon glow-text-neon">SHOP</span> PORTAL
              </h2>
              <div className="w-16 h-1.5 bg-lime-neon mx-auto mt-4 rounded" />
              <p className="text-zinc-400 font-light mt-4">
                Elite physical modification requires pure substrates. Acquire our limited-production muscle stabilizers, weighted cylinders, and heavy accessories.
              </p>
            </div>

            {/* Shopping 3-column Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {PRODUCTS.map((prod) => (
                <ProductFlipCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={addToCart}
                  onBuyNow={triggerToast}
                />
              ))}
            </div>

          </motion.div>
        </section>

        {/* ======================================= */}
        {/* SECTION: ENQUIRY CONTACT WEBHOOK REGISTRATION */}
        {/* ======================================= */}
        <section 
          id="enquiry"
          className="py-16 md:py-24 relative overflow-visible"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full flex justify-center"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 glass rounded-2xl p-8 sm:p-12 max-w-4xl w-full relative overflow-hidden">
              
              {/* Backglow accent */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#ccff00]/10 blur-[80px] pointer-events-none" />

              {/* Info Column */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-lime-neon font-black tracking-[0.25em] uppercase">REGISTRATION PROTOCOLS</span>
                  <h3 className="text-3xl md:text-4xl font-black mt-2 italic uppercase leading-none">
                    ACQUIRE THE <br />
                    <span className="text-lime-neon glow-text-neon outline-text" style={{ WebkitTextStroke: "1px #ccff00" }}>ELITE ACCESS</span>
                  </h3>
                  <div className="w-14 h-1 bg-lime-neon mt-4 rounded" />
                  <p className="text-zinc-400 font-light mt-5 text-xs leading-relaxed max-w-sm">
                    Enter physical telemetry profiles below. Upon registration, credentials will prepare simulated JSON payloads and compile forward payloads directly to the elite Metropolis gym servers.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Shield className="w-4.5 h-4.5 text-lime-neon shrink-0" />
                    <span>SECURE WA SHIELD CONNECTION</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <HeartPulse className="w-4.5 h-4.5 text-lime-neon shrink-0" />
                    <span>IMMEDIATE MEDICAL SCREENER FORWARD</span>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div className="lg:col-span-7">
                
                {enquirySuccessData ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-sm glass border border-lime-neon text-center flex flex-col items-center justify-center h-full py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-lime-neon animate-bounce mb-4" />
                    <h4 className="font-mono text-xl font-black text-lime-neon tracking-widest uppercase">ACCESS GRANTED</h4>
                    <p className="text-sm font-bold text-white mt-2 mb-4 uppercase italic">TELEMETRY SECURED BY DEEPAK BISHNOI</p>
                    
                    {/* Log details */}
                    <div className="bg-black/80 border border-zinc-800 p-4 rounded-sm w-full text-left text-xs font-mono mb-6">
                      <div className="text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-1.5 mb-1.5 text-[10px]">PAYLOAD WEBHOOK ARRAYS:</div>
                      <div>
                        <span className="text-zinc-500">RECRUIT_NAME:</span> <span className="text-lime-neon">{enquirySuccessData.name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">TRAINING_GOAL:</span> <span className="text-lime-neon">{enquirySuccessData.goal}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">WHATSAPP_COMMS:</span> <span className="text-lime-neon">{enquirySuccessData.whatsapp}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setEnquirySuccessData(null)}
                      className="px-6 py-2.5 bg-zinc-900 text-white hover:bg-lime-neon hover:text-black font-mono text-[10px] tracking-widest uppercase font-black rounded-sm transition-all border border-zinc-800 hover:border-lime-neon cursor-pointer"
                    >
                      LOG NEW RECRUIT
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="flex flex-col gap-5 relative p-6 bg-zinc-950/60 rounded-xl border border-zinc-900/60 overflow-hidden">
                    {/* Sweeping scanline across the entire form */}
                    <div className="scan-line opacity-20 pointer-events-none" />

                    <div className="relative">
                      <label className="font-mono text-[9px] tracking-wider text-zinc-500 block mb-1 uppercase font-bold">RECRUIT FULL NAME</label>
                      <div className="relative overflow-hidden rounded-sm group">
                        {/* Internal scanning laser line */}
                        <div className="scan-line opacity-[0.14] group-focus-within:opacity-50 transition-opacity" style={{ animationDuration: '5s' }} />
                        <input
                          type="text"
                          required
                          className="w-full bg-black border border-zinc-850 p-3.5 text-sm focus:border-lime-neon outline-none transition-all rounded-sm text-white placeholder-zinc-650 group-hover:border-zinc-700"
                          placeholder="e.g., Brock Lesnar"
                          value={enquiryName}
                          onChange={(e) => setEnquiryName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="font-mono text-[9px] tracking-wider text-zinc-500 block mb-1 uppercase font-bold">ANATOMICAL GOAL</label>
                      <div className="relative overflow-hidden rounded-sm group">
                        <div className="scan-line opacity-[0.14] group-focus-within:opacity-50 transition-opacity" style={{ animationDuration: '7s' }} />
                        <select
                          className="w-full bg-black border border-zinc-850 p-3.5 text-sm focus:border-lime-neon outline-none transition-all rounded-sm text-zinc-300 group-hover:border-zinc-700 cursor-pointer"
                          value={enquiryGoal}
                          onChange={(e) => setEnquiryGoal(e.target.value)}
                        >
                          <option value="Hypertrophy">Hypertrophy (Hyper Muscle Mass)</option>
                          <option value="Fat Loss">Adipose Shred (Fat Loss Conditioning)</option>
                          <option value="Powerlifting">Powerlifting (Raw Neurological Power)</option>
                          <option value="General Health">Vascular Fortification (Cardio / Vitality)</option>
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="font-mono text-[9px] tracking-wider text-zinc-500 block mb-1 uppercase font-bold">WHATSAPP ENCRYPTION NUMBER</label>
                      <div className="relative overflow-hidden rounded-sm group">
                        <div className="scan-line opacity-[0.14] group-focus-within:opacity-50 transition-opacity" style={{ animationDuration: '6s' }} />
                        <input
                          type="tel"
                          required
                          className="w-full bg-black border border-zinc-850 p-3.5 text-sm focus:border-lime-neon outline-none transition-all rounded-sm text-white placeholder-zinc-650 group-hover:border-zinc-700"
                          placeholder="e.g., +91 9999999999"
                          value={enquiryWhatsapp}
                          onChange={(e) => setEnquiryWhatsapp(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingEnquiry}
                      className="w-full neon-bg text-black font-black uppercase italic text-sm rounded-sm transition-transform hover:scale-[1.01] active:scale-95 duration-300 py-4 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isSubmittingEnquiry ? "SUBMITTING TELEMETRY ACCESS..." : "FORWARD REGISTER WEBHOOK"} <Send className="w-4 h-4 font-bold" />
                    </button>

                  </form>
                )}

              </div>

            </div>
          </motion.div>
        </section>

      </main>

      {/* ======================================= */}
      {/* SHOPPING CART OVERLAY RIGHT SIDE DRAWER */}
      {/* ======================================= */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black/85 cursor-pointer backdrop-blur-sm" 
            />
            
            {/* Slide out form block */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 max-w-md w-full h-full bg-zinc-950 border-l border-zinc-850 p-6 flex flex-col justify-between shadow-2xl z-50 text-white"
            >
              
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-lime-neon" />
                  <h3 className="font-mono text-base font-black tracking-widest uppercase">RECRUIT CONTAINER ({cartTotalItems})</h3>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List Feed */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Dumbbell className="w-16 h-16 text-zinc-800 animate-bounce mb-3" />
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No physical substrates locked inside cart chamber yet.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={item.product.id}
                      className="flex gap-4 p-3 bg-zinc-900 border border-zinc-850 rounded-xl"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-black text-xs uppercase text-white font-mono">{item.product.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-mono text-xs text-lime-neon">${item.product.price}</span>
                        </div>

                        {/* Increment / Decrement controls */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, -1)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, 1)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Calculations */}
              {cartItems.length > 0 && (
                <div className="pt-4 border-t border-zinc-900 bg-zinc-950/90 space-y-4">
                  <div className="flex justify-between items-center text-sm font-mono uppercase tracking-wider">
                    <span className="text-zinc-400">Biological Subtotal:</span>
                    <span className="text-lime-neon font-black">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                    <span>Forwarding Delivery:</span>
                    <span className="uppercase text-emerald-400 font-bold">COMPLIMENTARY ACCESS</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-xl bg-lime-neon text-black font-extrabold text-xs tracking-widest font-mono uppercase hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    COORDINATE ACQUISITION <ShoppingBag className="w-4 h-4 font-bold" />
                  </button>
                  <p className="text-[9px] text-zinc-500 font-mono text-center uppercase tracking-widest">SUBSTRATE METRICS FORMULATED BY DEEPAK BISHNOI</p>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================= */}
      {/* INTERACTIVE COMPREHENSIVE FOOTER */}
      {/* ======================================= */}
      <footer className="bg-black text-zinc-500 pt-16 pb-12 border-t border-zinc-950 mt-12 relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-zinc-950 pb-12 mb-8">
          
          {/* Column A: Logo, description, address */}
          <div>
            <a href="#" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white mb-4">
              <span className="p-1 rounded bg-lime-neon text-black font-extrabold flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </span>
              <span>ELITE <span className="text-lime-neon italic">IRON</span></span>
            </a>
            <p className="text-xs text-zinc-400 leading-normal mb-4 font-light">
              Premium physical modification temple incorporating cutting-edge cyber-machinery frameworks, 24/7 assisting artificial intelligence, and top tier coaches.
            </p>
            <div className="text-[11px] font-mono leading-relaxed space-y-1">
              <p>Elite Iron Gym - 10th Floor</p>
              <p>Neon Boulevard, Central Metropolis</p>
              <p className="text-lime-neon">METROPOLIS, G-9092</p>
            </div>
          </div>

          {/* Column B: Links list */}
          <div>
            <h4 className="font-mono text-xs font-black text-white tracking-[0.2em] uppercase mb-4">MAP ARRAYS</h4>
            <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
              <a href="#" className="hover:text-lime-neon transition-colors">Home Landing</a>
              <a href="#programs" className="hover:text-lime-neon transition-colors">Elite Programs</a>
              <a href="#carousel" className="hover:text-lime-neon transition-colors">Machinery Specs</a>
              <a href="#shop" className="hover:text-lime-neon transition-colors">Biosupport Store</a>
              <a href="#enquiry" className="hover:text-lime-neon transition-colors">Access Registry</a>
            </div>
          </div>

          {/* Column C: Operating Hours info */}
          <div>
            <h4 className="font-mono text-xs font-black text-white tracking-[0.2em] uppercase mb-4">ACCESS WINDOWS</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between border-b border-zinc-950 pb-1.5">
                <span className="text-zinc-500">MON - FRI</span>
                <span className="text-white font-bold">24H SECURE ENTRY</span>
              </div>
              <div className="flex justify-between border-b border-zinc-950 pb-1.5">
                <span className="text-zinc-500">SAT - SUN</span>
                <span className="text-lime-neon font-black">24H SECURE ENTRY</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-light leading-normal">
                Strict biometric keycard access required during unmanned midnight shift slots (02:00 AM - 05:00 AM).
              </p>
            </div>
          </div>

          {/* Column D: Social array / Toast trigger */}
          <div>
            <h4 className="font-mono text-xs font-black text-white tracking-[0.2em] uppercase mb-4">SOCIAL TELEMETRY</h4>
            <p className="text-xs text-zinc-400 mb-4 font-light">
              Submit WhatsApp identifiers or follow public media relays to track monthly physique releases.
            </p>
            <div className="flex gap-4 mb-4">
              <button 
                onClick={triggerToast} 
                className="w-10 h-10 rounded-lg bg-zinc-900 hover:bg-lime-neon text-white hover:text-black flex items-center justify-center transition-colors border border-zinc-800 cursor-pointer"
                aria-label="Instagram link"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button 
                onClick={triggerToast} 
                className="w-10 h-10 rounded-lg bg-zinc-900 hover:bg-lime-neon text-white hover:text-black flex items-center justify-center transition-colors border border-zinc-800 cursor-pointer"
                aria-label="Facebook link"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                onClick={triggerToast} 
                className="w-10 h-10 rounded-lg bg-zinc-900 hover:bg-lime-neon text-white hover:text-black flex items-center justify-center transition-colors border border-zinc-800 cursor-pointer animate-bounce"
                aria-label="WhatsApp Link"
              >
                <Zap className="w-5 h-5 text-lime-neon hover:text-black" />
              </button>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-lime-neon uppercase font-bold block">RECONSTRUCTED BY DEEPAK BISHNOI</span>
          </div>

        </div>

        {/* Footer legal bar */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <span>&copy; {new Date().getFullYear()} ELITE IRON METROPOLIS INC. ALL CHANNELS ENCRYPTED</span>
          <div className="flex gap-6 uppercase">
            <button className="hover:text-lime-neon transition-colors" onClick={triggerToast}>Biomechanical Liability</button>
            <button className="hover:text-lime-neon transition-colors" onClick={triggerToast}>Physical Privacy Shield</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
