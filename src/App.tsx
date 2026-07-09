/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import studioImage from './assets/images/kalyan_studio_header.jpg';
import logoImage from './assets/images/WhatsApp Image 2026-07-09 at 12.41.59 PM.jpeg';
import { CylinderCarousel } from './components/ui/cylinder-carousel';
import beachLady from './assets/images/kalyan_studio_beach_lady_1783493108452.jpg';
import coupleWall from './assets/images/kalyan_studio_couple_wall_1783493129071.jpg';
import coupleBeach from './assets/images/kalyan_studio_couple_beach_1783493147012.jpg';
import coupleMoon from './assets/images/kalyan_studio_couple_moon_1783493164786.jpg';
import coupleSaree from './assets/images/kalyan_studio_couple_saree_1783493179061.jpg';
import coupleJumping from './assets/images/kalyan_studio_couple_jumping_1783493205640.jpg';
const weddingVideo = "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-and-walking-4512-large.mp4";

const CAROUSEL_IMAGES = [
  { src: beachLady, alt: "Beach Editorial Portrait" },
  { src: coupleWall, alt: "Heritage Stone Wall Romance" },
  { src: coupleBeach, alt: "Coastal Leather Jacket Couple" },
  { src: coupleMoon, alt: "Crescent Moon Swing Dream" },
  { src: coupleSaree, alt: "Crimson Twilight Floating Saree" },
  { src: coupleJumping, alt: "Joyous Leap Pre-Wedding" },
];

import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring 
} from 'motion/react';
import { 
  Camera, 
  Heart, 
  Sparkles, 
  Star, 
  Award, 
  Calendar, 
  Mail, 
  Phone, 
  Globe,
  User, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Instagram, 
  Facebook, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Check, 
  CheckCircle, 
  Menu, 
  X, 
  Send, 
  Compass, 
  Sliders, 
  Shield, 
  SlidersHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film
} from 'lucide-react';

// Interface types
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  date: string;
  settings: {
    aperture: string;
    shutter: string;
    iso: string;
    lens: string;
  };
  story: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  review: string;
  rating: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  price: string;
  features: string[];
}

export default function App() {
  // Navigation State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Mouse Parallax coordinates for Hero Collage
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Portfolio filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Stats counting states
  const [stats, setStats] = useState({ clients: 0, years: 0, projects: 0, satisfaction: 0 });
  const statsSectionRef = useRef<HTMLDivElement>(null);

  // Testimonials Carousel State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Services show more / show less state
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);
  const [servicesLimit, setServicesLimit] = useState(4);

  // 3D Showcase Mode Toggle ('photos' | 'video')
  const [showcaseMode, setShowcaseMode] = useState<'photos' | 'video'>('photos');

  // Video player control states
  const [videoSrc, setVideoSrc] = useState<string>(weddingVideo);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true); // Default to muted for seamless browser autoplay and play compatibility
  const [videoProgress, setVideoProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.log("Video play failed:", err));
    }
    setVideoPlaying(!videoPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoMuted;
    setVideoMuted(!videoMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setVideoProgress(progress || 0);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
    setVideoProgress(pos * 100);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoPlaying(false);
      setVideoProgress(0);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoPlaying(false);
      setVideoProgress(0);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setServicesLimit(4);
      } else if (width >= 768) {
        setServicesLimit(2);
      } else {
        setServicesLimit(1);
      }
    };
    
    // Call on mount to set initial size based on actual window size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleServices = () => {
    if (isServicesExpanded) {
      setIsServicesExpanded(false);
      // Smoothly scroll back to the Services section
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsServicesExpanded(true);
    }
  };

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Simple active section detection
      const sections = ['home', 'portfolio', 'services', 'about', 'testimonials', 'booking'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic SEO Page Title & Meta Tag Updates based on currently active section
  useEffect(() => {
    const sectionSeo: Record<string, { title: string; description: string; canonical: string }> = {
      home: {
        title: "Kalyan Digital Studio | Premium Wedding Photographer Rayachoty",
        description: "Kalyan Digital Studio in Rayachoty, Andhra Pradesh delivers premier fine-art wedding photography, cinematic pre-wedding storyboards, and traditional South Indian muhurthams.",
        canonical: "https://ais-pre-2nuydkwv5jdvu4jafvrp2m-172622643158.asia-southeast1.run.app/"
      },
      portfolio: {
        title: "Fine-Art Wedding Portfolio | Kalyan Digital Studio",
        description: "Explore our rich portfolio of traditional muhurthams, cinematic pre-weddings, Gadwal silk bridal stories, and festive celebrations in Rayachoty.",
        canonical: "https://ais-pre-2nuydkwv5jdvu4jafvrp2m-172622643158.asia-southeast1.run.app/#portfolio"
      },
      services: {
        title: "Wedding & Portrait Photography Packages | Kalyan Digital Studio",
        description: "Premium photographic services, including royal muhurtham coverages, heritage portraits, and customized pre-wedding shoots with state-of-the-art gear.",
        canonical: "https://ais-pre-2nuydkwv5jdvu4jafvrp2m-172622643158.asia-southeast1.run.app/#services"
      },
      about: {
        title: "Our Story & Fine-Art Vision | Kalyan Digital Studio",
        description: "Meet our dedicated photographers in Andhra Pradesh. Crafting dramatic compositions, organic textures, and absolute storytelling since 2010.",
        canonical: "https://ais-pre-2nuydkwv5jdvu4jafvrp2m-172622643158.asia-southeast1.run.app/#about"
      },
      testimonials: {
        title: "Client Reviews & Kind Words | Kalyan Digital Studio",
        description: "Read genuine feedback from happy couples and premium clients who trusted Kalyan Digital Studio with their once-in-a-lifetime milestones.",
        canonical: "https://ais-pre-2nuydkwv5jdvu4jafvrp2m-172622643158.asia-southeast1.run.app/#testimonials"
      },
      booking: {
        title: "Book Your Luxurious Photoshoot | Kalyan Digital Studio",
        description: "Reserve your wedding, event, or portrait session. Direct and seamless booking with Kalyan Digital Studio for customized packages.",
        canonical: "https://ais-pre-2nuydkwv5jdvu4jafvrp2m-172622643158.asia-southeast1.run.app/#booking"
      }
    };

    const seoInfo = sectionSeo[activeSection] || sectionSeo.home;

    // Update document title
    document.title = seoInfo.title;

    // Update dynamic Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoInfo.description);

    // Update dynamic Open Graph Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seoInfo.title);

    // Update dynamic Open Graph Description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seoInfo.description);

    // Update dynamic Twitter Title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', seoInfo.title);

    // Update dynamic Twitter Description
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', seoInfo.description);

    // Update dynamic Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seoInfo.canonical);
  }, [activeSection]);

  // Track Mouse movement for gentle parallax in Hero Section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 45;
      const y = (clientY - window.innerHeight / 2) / 45;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-sliding Carousel for Testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Trigger Stat counter animations when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          let startClients = 0;
          let startYears = 0;
          let startProjects = 0;
          let startSatisfaction = 0;

          const duration = 2000;
          const stepTime = 30;
          const steps = duration / stepTime;

          const clientIncrement = 500 / steps;
          const yearsIncrement = 16 / steps;
          const projectsIncrement = 1500 / steps;
          const satIncrement = 98 / steps;

          const interval = setInterval(() => {
            startClients = Math.min(500, startClients + clientIncrement);
            startYears = Math.min(16, startYears + yearsIncrement);
            startProjects = Math.min(1500, startProjects + projectsIncrement);
            startSatisfaction = Math.min(98, startSatisfaction + satIncrement);

            setStats({
              clients: Math.round(startClients),
              years: Math.round(startYears),
              projects: Math.round(startProjects),
              satisfaction: Math.round(startSatisfaction)
            });

            if (startProjects >= 1500) {
              clearInterval(interval);
            }
          }, stepTime);

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Portfolio items database
  const portfolioItems: PortfolioItem[] = [
    {
      id: 'p1',
      title: 'Divine Temple Gold Muhurtham',
      category: 'Weddings',
      image: coupleSaree,
      client: 'Meera & Arvind',
      date: 'May 2026',
      settings: { aperture: 'f/1.4', shutter: '1/320s', iso: '100', lens: '85mm f/1.4' },
      story: 'Captured during the early morning auspicious Muhurtham hours in Tirupati. The golden sunrise light beautifully illuminates the vibrant silk drapes, Jeelakarra Bellam ceremony, and pure sandalwood details.'
    },
    {
      id: 'p2',
      title: 'Heritage Gadwal Silk Bridal Story',
      category: 'Portraits',
      image: coupleWall,
      client: 'Sravanthi Reddy',
      date: 'April 2026',
      settings: { aperture: 'f/1.2', shutter: '1/250s', iso: '160', lens: '50mm f/1.2' },
      story: 'A striking high-contrast natural light portrait showcasing exquisite heirloom jewelry, delicate jasmine flowers (Mogra), and the timeless crimson silk of a traditional Gadwal saree.'
    },
    {
      id: 'p9',
      title: 'Sacred Sreemantham Blessings',
      category: 'Events', // Using as events/cozy milestones
      image: coupleMoon,
      client: 'The Rao Family',
      date: 'July 2026',
      settings: { aperture: 'f/1.8', shutter: '1/100s', iso: '250', lens: '50mm f/1.2' },
      story: 'A warm, emotional family portrait celebrating a traditional Telugu Sreemantham (baby shower) ceremony, capturing the serene blessings of elders and glowing brass lamps.'
    }
  ];

  // Categories list
  const categories = ['All', 'Weddings', 'Portraits', 'Events'];

  // Filter logic
  const filteredPortfolio = selectedCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  // Services database
  const services: Service[] = [
    {
      id: 's1',
      title: 'Traditional Andhra Weddings (Pelli)',
      description: 'Grand, cinematic wedding coverage across traditional temples, heritage halls, and coastal venues. Capturing the divine essence of Jeelakarra Bellam, vibrant Talambralu, and lively Oonjal rituals.',
      icon: <Heart className="w-6 h-6 text-[#D4AF37]" />,
      duration: 'Multi-Day Coverage',
      price: '',
      features: ['Two principal senior photographers & filmmakers', 'Full documentary and fine-art coverage', 'Premium leather-bound heirloom album', 'Private online gallery download']
    },
    {
      id: 's2',
      title: 'Heritage Gadwal & Bridal Portraits',
      description: 'Fine-art portraits focusing on exquisite Gadwal and Dharmavaram silk sarees, heavy gold Vaddanam (waist belts), intricate Buttalu earrings, and sacred temple backdrops.',
      icon: <User className="w-6 h-6 text-[#D4AF37]" />,
      duration: '3 Hours Session',
      price: '',
      features: ['Personalized styling and look planning', 'Heritage/palace location scouting assistance', '15 museum-grade hand-retouched prints', 'Digital master copies with high dynamic range']
    },
    {
      id: 's3',
      title: 'Festive & Cultural Celebrations',
      description: 'Vibrant documentary and candid storytelling of major festivals (Ugadi, Sankranti), traditional family gatherings, Sreemantham, and elegant Grahapravesam ceremonies.',
      icon: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
      duration: '4-6 Hours Session',
      price: '',
      features: ['Discreet candid visual storytellers', 'True-to-life vibrant color calibration', 'Fast-turnaround digital download link', 'Keepsake gold-embossed fine art prints']
    },
    {
      id: 's4',
      title: 'Pancha & Dharmavaram Lookbooks',
      description: 'High-fashion editorial campaigns and promotional visuals for luxury silk dhotis (Panchas), premium Dharmavaram weavers, and heritage Kundan jewelry designs.',
      icon: <Sliders className="w-6 h-6 text-[#D4AF37]" />,
      duration: 'Day Rate / Custom Project',
      price: '',
      features: ['Artistic direction and moodboard setup', 'Professional macro jewelry and textile focus', 'Commercial usage permissions', 'Ultra-high resolution camera gear']
    },
    {
      id: 's5',
      title: 'Traditional Sreemantham (Baby Shower)',
      description: 'Capturing the tender, joyful bangle-wearing and blessing rituals of Sreemantham celebrations with vibrant natural tones and elegant Telugu storytelling.',
      icon: <Compass className="w-6 h-6 text-[#D4AF37]" />,
      duration: '3 Hours Session',
      price: '',
      features: ['Spouse & immediate family portraits', '20 elegant warm-toned master edits', 'Custom silk drapes and backdrops', 'High-res digital files access']
    },
    {
      id: 's6',
      title: 'Classical Kuchipudi & Fine Arts',
      description: 'Cinematic visual preservation of Kuchipudi dancers, Carnatic vocalists, and instrumentalists in mid-performance with dramatic shadows and mudra definition.',
      icon: <Camera className="w-6 h-6 text-[#D4AF37]" />,
      duration: '2 Hours Session',
      price: '',
      features: ['High-speed motion freeze capture', 'Dramatic studio spotlight setup', 'Costume embroidery texture definition', '12 high-end gallery-ready files']
    },
    {
      id: 's7',
      title: 'Heritage Andhra Aerial Scapes',
      description: 'Ethereal aerial perspectives of historic temple gopurams, Godavari backwaters, lush green Konaseema coconut groves, and outdoor pre-wedding celebrations.',
      icon: <SlidersHorizontal className="w-6 h-6 text-[#D4AF37]" />,
      duration: 'Add-on / Standalone',
      price: '',
      features: ['Licensed senior drone operator', '4K ultra-detailed aerial photography', 'Post-processed sky painting grading', 'Stunning cinematic scale']
    },
    {
      id: 's8',
      title: 'Royal Fine-Art Print Calibration',
      description: 'Bespoke color-grading, skin-tone calibration, and custom warm nostalgic profiles highlighting exquisite gold temple jewelry, heavy silk textures, and vintage family heirlooms.',
      icon: <Calendar className="w-6 h-6 text-[#D4AF37]" />,
      duration: 'Per-Image Packages',
      price: '',
      features: ['Advanced gold-accent and jewelry shine enhancement', 'Warm nostalgic cinematic styling profiles', 'High-fidelity texture restoration', 'Quick 48-hour delivery']
    }
  ];

  // Testimonials database
  const testimonials: Testimonial[] = [
    {
      id: 't1',
      name: 'Haritha & Rajashekar Reddy',
      role: 'Wedding in Rayachoty (Kadapa)',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200',
      review: 'Kalyan Digital Studio captures the soul of Rayalaseema weddings! From our early morning auspicious Muhurtham to the grand reception, every detail of our heavy Gadwal silk sarees and the gold temple jewelry was captured with exquisite warmth. Their team was so humble, capturing every teardrop during the Kanyadaanam and the joyful laughter of the Talambralu perfectly.',
      rating: 5
    },
    {
      id: 't2',
      name: 'Sravani & Venkat Rao',
      role: 'Classic South Indian Wedding, Tirupati',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=200',
      review: 'We are absolutely in love with how our Jeelakarra Bellam and Mangalasutram moments were shot! Kalyan\'s team has a rare, quiet grace. They do not force artificial poses—instead, they capture authentic Andhra traditions and genuine emotion. Our family elders in Kadapa and Tirupati were full of praise for their respectful presence and timeless, glowing compositions.',
      rating: 5
    },
    {
      id: 't3',
      name: 'Meenakshi & Sai Charan',
      role: 'Cinematic Pre-Wedding, Gandikota Hills',
      image: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?q=80&w=200',
      review: 'They transformed our pre-wedding shoot at Gandikota (the Grand Canyon of Andhra) into a cinematic masterpiece! Kalyan Garu guided us so naturally, and his eye for dramatic sunset lighting against the red gorges was breathtaking. It felt like we were starring in a fine-art movie. The framing, colors, and raw, candid emotions are absolutely unmatched.',
      rating: 5
    }
  ];

  // Instagram gallery items
  const instagramPhotos = [
    { id: 'i1', img: beachLady, likes: '1.9k', comments: '54' },
    { id: 'i2', img: coupleSaree, likes: '2.8k', comments: '92' },
    { id: 'i3', img: coupleBeach, likes: '2.1k', comments: '78' },
    { id: 'i4', img: coupleMoon, likes: '3.4k', comments: '142' },
    { id: 'i5', img: coupleWall, likes: '2.5k', comments: '93' },
    { id: 'i6', img: coupleJumping, likes: '2.2k', comments: '81' }
  ];

  // Subscribe newsletter
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFFDF8] text-[#3C352E] overflow-x-hidden selection:bg-[#D4AF37]/30">
      
      {/* Dynamic Cursor Highlight - subtle gold/beige glow that trails */}
      <div 
        className="hidden md:block pointer-events-none fixed z-0 rounded-full w-[450px] h-[450px] bg-[#D4AF37]/4 blur-[130px] transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x * 2.5 - 225}px, ${mousePosition.y * 2.5 - 225}px, 0)`,
          top: '50%',
          left: '50%'
        }}
      />

      {/* SEPARATE BRAND HEADER */}
      <header className="w-full bg-[#1A1613] text-white relative overflow-hidden border-b border-[#D4AF37]/40 shadow-md">
        {/* Background image with low opacity for a luxurious overlay effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src={studioImage} 
            alt="Kalyan Digital Studio Background" 
            className="w-full h-full object-cover opacity-35 scale-105 filter blur-[2px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1613] via-[#1A1613]/85 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 sm:py-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <img 
                src={logoImage} 
                alt="Kalyan Digital Studio Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left">
              <p className="text-xl sm:text-2xl md:text-3xl font-serif-elegant tracking-[0.2em] text-[#FFFDF8] uppercase font-bold">
                KALYAN <span className="text-[#D4AF37]">DIGITAL STUDIO</span>
              </p>
              <p className="text-[10px] sm:text-xs text-[#D4AF37] uppercase tracking-[0.25em] font-semibold mt-1">
                Andhra’s Premier Fine-Art Storytellers • Rayachoty
              </p>
            </div>
          </div>

          {/* Quick Contact & Location Info */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-200 font-mono">
            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/10 shadow-sm">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span className="tracking-wide">Rayachoty, Andhra Pradesh</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/10 shadow-sm">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <div className="flex items-center gap-2">
                <a href="tel:+919985302000" className="hover:text-[#D4AF37] transition-colors font-semibold" aria-label="Call studio number +91 9985302000">9985302000</a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* STICKY NAVIGATION BAR */}
      <nav id="navbar" className={`sticky top-0 w-full z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#FFFDF8]/90 backdrop-blur-md py-4 shadow-[0_10px_30px_rgba(60,53,46,0.03)] border-b border-[#F7F1E8]' 
          : 'bg-[#FFFDF8]/60 backdrop-blur-sm py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo with Champagne Gold details */}
          <a href="#home" className="flex items-center space-x-2 md:space-x-2.5 group focus:outline-none" id="logo-link">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
            <span className="font-serif-elegant text-sm sm:text-base tracking-[0.18em] font-bold text-[#3C352E] group-hover:text-[#D4AF37] transition-colors duration-300 uppercase">
              KALYAN DIGITAL STUDIO
            </span>
          </a>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-9">
            {[
              { id: 'home', label: 'Home' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'services', label: 'Services' },
              { id: 'about', label: 'About' },
              { id: 'testimonials', label: 'Reviews' }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                id={`nav-${item.id}`}
                className={`text-sm font-medium tracking-[0.12em] uppercase transition-all duration-300 relative py-1 focus:outline-none ${
                  activeSection === item.id 
                    ? 'text-[#D4AF37]' 
                    : 'text-[#3C352E]/70 hover:text-[#3C352E]'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div 
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Desktop Call To Action */}
          <div className="hidden lg:block">
            <a 
              href="#booking" 
              id="cta-nav-book"
              className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase border border-[#D4AF37] text-[#3C352E] overflow-hidden transition-all duration-500 hover:text-white bg-transparent group"
            >
              <span className="absolute inset-0 w-0 bg-[#D4AF37] transition-all duration-500 ease-out group-hover:width-full group-hover:w-full"></span>
              <span className="relative z-10 flex items-center gap-1">
                Book Now <Calendar className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#3C352E] hover:text-[#D4AF37] focus:outline-none"
            aria-label="Toggle mobile menu"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Fullscreen Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-[#FFFDF8] border-b border-[#F7F1E8] shadow-lg py-8 px-8 flex flex-col space-y-6 lg:hidden"
              id="mobile-nav-panel"
            >
              {[
                { id: 'home', label: 'Home' },
                { id: 'portfolio', label: 'Portfolio' },
                { id: 'services', label: 'Services' },
                { id: 'about', label: 'About Studio' },
                { id: 'testimonials', label: 'Reviews' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium tracking-[0.15em] uppercase transition-colors py-1 ${
                    activeSection === item.id ? 'text-[#D4AF37]' : 'text-[#3C352E]/80 hover:text-[#3C352E]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a 
                href="#booking"
                id="mobile-cta-book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-[#D4AF37] text-white text-sm font-semibold tracking-widest uppercase transition-transform active:scale-[0.98]"
              >
                Book Session
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section 
        id="home" 
        className="relative min-h-screen pt-28 pb-16 flex items-center justify-center bg-gradient-to-b from-[#FFFDF8] via-[#F7F1E8]/40 to-[#FFFDF8] overflow-hidden"
      >
        {/* Soft elegant background particles and bokeh */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-[#D4AF37]/5 blur-[80px]"></div>
          <div className="absolute bottom-[30%] right-[10%] w-96 h-96 rounded-full bg-[#DDE8D8]/20 blur-[100px]"></div>
          
          {/* Sparkles drifting in background */}
          <div className="absolute top-[15%] right-[25%] animate-pulse">
            <Sparkles className="w-5 h-5 text-[#D4AF37]/30" />
          </div>
          <div className="absolute bottom-[25%] left-[20%] animate-pulse duration-1000">
            <Sparkles className="w-4 h-4 text-[#D4AF37]/25" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col space-y-8 text-left"
            id="hero-left-content"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F1E8] rounded-full border border-[#E5DCCF] w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3C352E]/70">
                Luxurious Fine Art Photography
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl text-[#3C352E] font-light leading-[1.12] tracking-wide font-serif-elegant">
              Capturing Life’s <br />
              <span className="italic text-[#D4AF37] font-normal">Most Beautiful</span> <br />
              Moments
            </h1>

            <p className="text-stone-600 font-light text-base md:text-lg leading-relaxed max-w-xl">
              Professional Photography for Weddings, Portraits, Fashion, Events, Commercial Projects, and Creative Storytelling. Crafted through soft linen hues and organic daylight.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#booking"
                id="hero-book-btn"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#D4AF37] text-white font-medium text-sm tracking-[0.15em] uppercase hover:bg-[#C29F2F] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Book a Session <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a 
                href="#portfolio"
                id="hero-portfolio-btn"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-[#E5DCCF] hover:border-[#D4AF37] bg-white text-[#3C352E] font-medium text-sm tracking-[0.15em] uppercase hover:text-[#D4AF37] transition-all duration-300"
              >
                View Portfolio
              </a>
            </div>

            {/* Subtle trust badge */}
            <div className="pt-6 flex items-center gap-6 border-t border-[#F7F1E8] mt-6">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100" alt="Client thumb" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100" alt="Client thumb" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" alt="Client thumb" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3C352E]">Awarded Best Portrait Studio</p>
                <p className="text-[11px] text-stone-500 font-light">International Fine Art Masters 2025 & 2026</p>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Image Collage showcasing the exact official studioImage */}
          <div className="lg:col-span-6 relative h-[480px] sm:h-[600px] w-full flex items-center justify-center pt-8 lg:pt-0">
            
            {/* Background glowing halo */}
            <div className="absolute w-72 h-72 bg-[#D4AF37]/6 rounded-full blur-3xl"></div>

            {/* Parallax Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`
              }}
            >
              {/* Massive, ultra-premium gallery display frame for the uploaded image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="relative w-full max-w-[480px] bg-[#1C1816] p-5 sm:p-6 rounded-2xl shadow-[0_25px_60px_-15px_rgba(212,175,55,0.22),_0_35px_80px_rgba(26,22,19,0.45)] border border-[#D4AF37]/40 group"
                id="hero-official-showcase"
              >
                {/* Gold-foil fine line detailing around the matting */}
                <div className="absolute inset-2.5 border border-[#D4AF37]/20 rounded-xl pointer-events-none"></div>

                {/* Image container with inner border */}
                <div className="overflow-hidden rounded-xl bg-[#26211E] relative aspect-[4/3] border border-[#D4AF37]/10 shadow-inner">
                  {logoImage ? (
                    <img 
                      src={logoImage} 
                      alt="Kalyan Digital Studio Official Masterpiece" 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400">
                      <Camera className="w-12 h-12 text-[#D4AF37] mb-2 animate-bounce" />
                      <p className="text-sm font-semibold">Official Asset Missing</p>
                      <p className="text-[10px] text-stone-500 mt-1">Please upload the original kalyan_studio_header_1783491452992.jpg file</p>
                    </div>
                  )}
                  
                  {/* Subtle luxurious double inner border overlays */}
                  <div className="absolute inset-3.5 border border-[#D4AF37]/40 pointer-events-none rounded-lg z-10 animate-pulse duration-[3000ms]"></div>
                  <div className="absolute inset-4.5 border border-white/10 pointer-events-none rounded-lg z-10"></div>
                  
                  {/* Floating official brand badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#1A1613]/90 backdrop-blur-sm rounded-lg text-[9px] uppercase tracking-[0.25em] font-bold text-[#D4AF37] border border-[#D4AF37]/40 shadow-md">
                    Official Brand Showcase
                  </div>
                </div>
                
                {/* Caption / Label plate with golden/stone premium typography */}
                <div className="mt-5 flex items-center justify-between border-t border-[#3C332F] pt-4">
                  <div className="text-left">
                    <p className="font-serif-elegant text-sm text-stone-100 font-bold tracking-wider">KALYAN DIGITAL STUDIO</p>
                    <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.15em] font-mono mt-0.5">Rayachoty, Andhra Pradesh</p>
                  </div>
                  <div className="text-right font-mono text-[9px] text-stone-400">
                    <p className="font-bold text-stone-200">PREMIER FINE-ART</p>
                    <p className="mt-0.5 text-stone-500">OFFICIAL ARCHIVE</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Camera Graphic Element */}
              <motion.div 
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 4, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-4 right-4 sm:right-8 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_15px_35px_rgba(60,53,46,0.08)] border border-[#E5DCCF] flex items-center space-x-3 z-40"
                id="hero-camera-badge"
              >
                <div className="p-2.5 bg-[#F7F1E8] rounded-full">
                  <Camera className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#3C352E]">Atelier Equipment</p>
                  <p className="text-[9px] text-stone-500 font-light">Fine-Art Optical Calibration</p>
                </div>
              </motion.div>

              {/* Soft Glitter Particle 1 */}
              <div className="absolute top-1/2 left-[5%] w-2 h-2 rounded-full bg-[#D4AF37] opacity-60 animate-ping"></div>
              {/* Soft Glitter Particle 2 */}
              <div className="absolute top-1/4 right-[5%] w-3 h-3 rounded-full bg-[#D4AF37] opacity-40 animate-pulse duration-1000"></div>

            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PORTFOLIO SECTION */}
      <section id="portfolio" className="py-24 bg-[#FFFDF8] border-t border-[#F7F1E8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-3">Portfolio</p>
            <h2 className="text-3xl md:text-5xl font-light text-[#3C352E] font-serif-elegant mb-6">
              Capturing Timeless Masterpieces
            </h2>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-stone-500 font-light text-base leading-relaxed">
              Explore our curated portfolio of weddings, editorial portraits, maternity memories, travel photography, and fine-art landscapes. Every image is hand-polished with cinematic coloring.
            </p>
          </div>

          {/* Cylinder Carousel 3D Showcase */}
          <div className="mb-20 bg-[#FBF9F6] rounded-3xl p-6 sm:p-10 border border-[#E5DCCF]/50 shadow-sm" id="portfolio-3d-showcase">
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#E5DCCF]/40 pb-6 mb-8 gap-4">
              <div className="text-center md:text-left">
                <span className="px-3 py-1 bg-[#F7F1E8] border border-[#E5DCCF]/60 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                  Atelier Interactive 3D Showcase
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-[#3C352E] font-serif-elegant mt-3 tracking-wide">
                  {showcaseMode === 'photos' ? 'Pre-Wedding & Editorial Masterpieces' : 'Cinematic Wedding Film Showcase'}
                </h3>
                <p className="text-[11px] text-stone-400 mt-1 font-light italic">
                  {showcaseMode === 'photos' 
                    ? 'Drag left/right or spin to explore our premium 3D gallery' 
                    : 'Experience cinematic storytelling with our fine-art wedding film'
                  }
                </p>
              </div>
              
              {/* Toggle Switch */}
              <div className="flex items-center bg-[#F7F1E8] p-1 rounded-full border border-[#E5DCCF]/60 shadow-sm">
                <button
                  onClick={() => setShowcaseMode('photos')}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none ${
                    showcaseMode === 'photos'
                      ? 'bg-[#3C352E] text-white shadow-sm'
                      : 'text-[#3C352E]/70 hover:text-[#3C352E]'
                  }`}
                >
                  3D Gallery Spin
                </button>
                <button
                  onClick={() => setShowcaseMode('video')}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none ${
                    showcaseMode === 'video'
                      ? 'bg-[#3C352E] text-white shadow-sm'
                      : 'text-[#3C352E]/70 hover:text-[#3C352E]'
                  }`}
                >
                  Cinematic Video
                </button>
              </div>
            </div>

            {showcaseMode === 'photos' ? (
              <CylinderCarousel images={CAROUSEL_IMAGES} />
            ) : (
              <div className="w-full max-w-4xl mx-auto" id="cinematic-video-player-container">
                <div 
                  className={`relative aspect-video rounded-2xl overflow-hidden bg-black border shadow-2xl transition-all duration-500 group ${
                    isDragging 
                      ? 'border-[#D4AF37] scale-[1.02] shadow-[#D4AF37]/20 ring-2 ring-[#D4AF37]/40' 
                      : 'border-[#D4AF37]/30 hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/60'
                  }`}
                  id="cinematic-video-stage"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <video
                    id="cinematic-wedding-video"
                    className="w-full h-full object-cover"
                    src={videoSrc}
                    controls={false}
                    loop
                    playsInline
                    muted={videoMuted}
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                  />

                  {/* Drag and Drop visual overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 border-4 border-dashed border-[#D4AF37] rounded-2xl z-50 pointer-events-none">
                      <Film className="w-16 h-16 text-[#D4AF37] animate-bounce mb-4" />
                      <p className="text-lg font-serif-elegant font-bold text-white tracking-widest uppercase">
                        Drop to play wedding film!
                      </p>
                      <p className="text-xs text-stone-400 mt-2 font-light italic">
                        Supports MP4, WebM, and MOV formats
                      </p>
                    </div>
                  )}

                  {/* Elegant Golden Dark Cinematic Overlay when not playing */}
                  {!videoPlaying && !isDragging && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/85 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
                      onClick={togglePlay}
                      id="video-not-playing-overlay"
                    >
                      {/* Logo and Brand */}
                      <div className="mb-4 transform transition-all duration-700 group-hover:scale-105">
                        <span className="font-serif-elegant text-3xl sm:text-5xl lg:text-6xl font-light text-[#D4AF37] tracking-widest block mb-1">
                          K
                        </span>
                        <div className="h-[1px] w-20 bg-[#D4AF37] mx-auto mb-2"></div>
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-[#D4AF37]">
                          Kalyan Candid Photography
                        </p>
                      </div>

                      {/* Video Title */}
                      <div className="max-w-xl mb-6">
                        <h4 className="text-xl sm:text-3xl font-light font-serif-elegant text-white tracking-wider uppercase mb-2">
                          Vijaya Reddy <span className="text-[#D4AF37] lowercase italic font-serif-elegant">&</span> Vishakha
                        </h4>
                        <div className="flex items-center justify-center gap-2 text-[8px] sm:text-[10px] text-stone-300 font-bold uppercase tracking-[0.2em]">
                          <span>Cinematic Wedding Video</span>
                          <span className="text-[#D4AF37]">•</span>
                          <span>Rayachoti, Kadapa</span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <button 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D4AF37] hover:bg-white hover:scale-110 active:scale-95 text-[#3C352E] flex items-center justify-center transition-all duration-300 shadow-lg shadow-black/50"
                        aria-label="Play wedding film"
                      >
                        <Play className="w-5 h-5 fill-current ml-1" />
                      </button>

                      {/* Secondary Contact Info */}
                      <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-between items-center text-[9px] text-stone-400 tracking-[0.15em] uppercase font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Film className="w-3 h-3 text-[#D4AF37]" />
                          <span>Now showing teaser</span>
                        </div>
                        <div>
                          <span>95501 10400 / 99853 02000</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Controls on Hover / Play */}
                  {videoPlaying && !isDragging && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                      {/* Scrubber Bar */}
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer relative" onClick={handleScrub}>
                        <div 
                          className="h-full bg-[#D4AF37]" 
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-4">
                          <button onClick={togglePlay} className="hover:text-[#D4AF37] transition-colors focus:outline-none" aria-label={videoPlaying ? "Pause" : "Play"}>
                            {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          
                          <button onClick={toggleMute} className="hover:text-[#D4AF37] transition-colors focus:outline-none" aria-label={videoMuted ? "Unmute" : "Mute"}>
                            {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>

                          <span className="text-[10px] text-stone-300 font-light font-mono">
                            Cinematic Wedding Film Teaser
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-[#D4AF37]">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                          <span>Live Teaser</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info Card */}
                <div className="mt-6 bg-white/40 border border-[#E5DCCF]/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="font-serif-elegant font-bold text-[#3C352E] text-sm">Vijaya Reddy & Vishakha</h5>
                    <p className="text-xs text-stone-500 font-light mt-1">
                      A majestic celebration captured in Rayachoti (Kadapa district) featuring stunning drone captures of Andhra’s scenic landscapes, vibrant traditional Haldi, rich Talambralu customs, and authentic local wedding moments. You can also drag and drop your own cinematic film or teaser directly onto the stage above to preview it immediately!
                    </p>
                  </div>
                  <a 
                    href="https://wa.me/919985302000?text=Hi%20Kalyan%20Digital%20Studio%2C%20I%20saw%20your%20Cinematic%20Wedding%20Video%20for%20Vijaya%20Reddy%20and%20Vishakha%20and%20would%20like%20to%20inquire%20about%20booking%20a%20similar%20film."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba56] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm flex items-center gap-1.5"
                  >
                    Inquire on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Filtering Categories Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12" id="portfolio-categories">
            {categories.map((category) => (
              <button
                key={category}
                id={`filter-btn-${category.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
                aria-label={`Filter portfolio by ${category}`}
                className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-300 focus:outline-none ${
                  selectedCategory === category 
                    ? 'bg-[#D4AF37] text-white shadow-sm' 
                    : 'bg-[#F7F1E8] text-[#3C352E]/80 hover:bg-[#E5DCCF]/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid with Masonry Look */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="portfolio-grid">
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.map((item, index) => (
                <motion.div
                  key={item.id}
                  id={`portfolio-card-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#F7F1E8] aspect-[4/5] shadow-sm hover:shadow-xl transition-shadow duration-500 shine-hover"
                  onClick={() => setSelectedProject(item)}
                >
                  {/* Photo with hover zoom */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3C352E]/90 via-[#3C352E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                    
                    {/* Category */}
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2 block">
                      {item.category}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-light text-white font-serif-elegant mb-3">
                      {item.title}
                    </h3>

                    {/* Meta info */}
                    <p className="text-white/70 text-xs font-light tracking-wide mb-5">
                      Client: {item.client}
                    </p>

                    {/* Elegant Button */}
                    <span className="inline-flex items-center text-[10px] font-semibold text-[#D4AF37] uppercase tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
                      View Project <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Absolute Corner Label (always visible) */}
                  <div className="absolute top-4 left-4 bg-[#FFFDF8]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#3C352E]/80">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state if category has no items */}
          {filteredPortfolio.length === 0 && (
            <div className="text-center py-20 bg-[#F7F1E8]/50 rounded-3xl border border-dashed border-[#E5DCCF]" id="portfolio-empty">
              <Camera className="w-10 h-10 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 font-light">No portraits in this category yet. We are constantly expanding our prints!</p>
            </div>
          )}

        </div>
      </section>

      {/* PORTFOLIO LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 overflow-y-auto"
            id="portfolio-modal"
          >
            <div className="max-w-6xl w-full bg-white rounded-[28px] overflow-hidden shadow-2xl border border-[#F7F1E8] my-8 relative">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/85 rounded-full shadow-md text-[#3C352E] hover:text-[#D4AF37] transition-colors focus:outline-none"
                id="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left: Beautiful Large Image */}
                <div className="lg:col-span-7 bg-[#F7F1E8] aspect-[4/5] lg:aspect-auto lg:h-[650px] relative">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-[#F7F1E8]">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3C352E]">Medium Format Original</span>
                  </div>
                </div>

                {/* Right: Editorial Metadata & Story */}
                <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-[#FFFDF8] h-full lg:min-h-[650px]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-3 block">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-light text-[#3C352E] font-serif-elegant mb-6">
                      {selectedProject.title}
                    </h3>
                    
                    <div className="h-[1px] bg-[#F7F1E8] mb-6"></div>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-[#3C352E]">
                      <div>
                        <p className="text-[10px] uppercase text-stone-400 font-semibold tracking-wider">Client</p>
                        <p className="font-medium mt-1">{selectedProject.client}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-stone-400 font-semibold tracking-wider">Session Date</p>
                        <p className="font-medium mt-1">{selectedProject.date}</p>
                      </div>
                    </div>

                    {/* Creative Story */}
                    <div className="mb-8">
                      <p className="text-[10px] uppercase text-stone-400 font-semibold tracking-wider mb-2">The Behind-The-Lens Story</p>
                      <p className="text-stone-600 font-light text-sm leading-relaxed italic">
                        "{selectedProject.story}"
                      </p>
                    </div>

                    {/* Technical Camera Specs */}
                    <div className="p-5 bg-[#F7F1E8] rounded-2xl border border-[#E5DCCF]">
                      <p className="text-[10px] uppercase text-[#D4AF37] font-bold tracking-wider mb-3 flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5" /> Technical Lightroom Profile
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-2 bg-white rounded-lg">
                          <p className="text-[9px] text-stone-400 uppercase font-bold">Aperture</p>
                          <p className="text-xs font-semibold text-[#3C352E] mt-0.5">{selectedProject.settings.aperture}</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg">
                          <p className="text-[9px] text-stone-400 uppercase font-bold">Shutter</p>
                          <p className="text-xs font-semibold text-[#3C352E] mt-0.5">{selectedProject.settings.shutter}</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg">
                          <p className="text-[9px] text-stone-400 uppercase font-bold">ISO</p>
                          <p className="text-xs font-semibold text-[#3C352E] mt-0.5">{selectedProject.settings.iso}</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg">
                          <p className="text-[9px] text-stone-400 uppercase font-bold">Lens</p>
                          <p className="text-xs font-semibold text-[#3C352E] mt-0.5">{selectedProject.settings.lens}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Action CTA */}
                  <div className="mt-8 pt-6 border-t border-[#F7F1E8] flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                      <p className="text-xs text-stone-500 font-light">Inspired by this aesthetics?</p>
                      <p className="text-sm font-semibold text-[#3C352E]">Schedule a similar photoshoot</p>
                    </div>
                    <a 
                      href="#booking"
                      onClick={() => {
                        setSelectedProject(null);
                      }}
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#C29F2F] text-white font-medium text-xs tracking-wider uppercase transition-colors shadow-sm"
                    >
                      Book Session
                    </a>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUXURY SERVICES SECTION */}
      <section id="services" className="py-24 bg-gradient-to-b from-[#FFFDF8] to-[#F7F1E8]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-3">Our Services</p>
            <h2 className="text-3xl md:text-5xl font-light text-[#3C352E] font-serif-elegant mb-6">
              Tailored Artistic Craftsmanship
            </h2>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-stone-500 font-light text-base leading-relaxed">
              We offer bespoke luxury photography designed around absolute attention to detail, elegant lighting, and seamless creative direction. Choose your desired session below.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" id="services-grid">
            <AnimatePresence initial={false}>
              {services.slice(0, isServicesExpanded ? services.length : servicesLimit).map((service, index) => (
                <motion.div
                  key={service.id}
                  layout="position"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  id={`service-card-${service.id}`}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(60,53,46,0.06)' }}
                  className="bg-white rounded-[24px] p-8 border border-[#F7F1E8] flex flex-col justify-between h-full group hover:border-[#D4AF37]/50 relative"
                >
                  {/* Accent line */}
                  <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                  <div>
                    {/* Icon Panel */}
                    <div className="w-12 h-12 rounded-full bg-[#FFFDF8] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-[#F7F1E8]">
                      {service.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-light text-[#3C352E] font-serif-elegant mb-3">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-stone-500 font-light text-xs leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="h-[1px] bg-[#F7F1E8] mb-6"></div>

                    {/* Included features list */}
                    <ul className="space-y-2.5 mb-8">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start text-[10px] text-stone-600 font-light">
                          <Check className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer book link */}
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#F7F1E8]">
                    <div>
                      <p className="text-[9px] text-stone-400 uppercase font-bold">Timeline</p>
                      <p className="text-xs font-semibold text-[#3C352E]">{service.duration}</p>
                    </div>
                    <a 
                      href="#booking"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F7F1E8] hover:bg-[#D4AF37] hover:text-white text-[#3C352E] text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm"
                    >
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show More / Less button container */}
          {services.length > servicesLimit && (
            <div className="flex justify-center mt-12">
              <button
                id="toggle-services-btn"
                onClick={handleToggleServices}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleServices();
                  }
                }}
                aria-label={isServicesExpanded ? "Show fewer services" : "Show more services"}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-[#E5DCCF] hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white text-[#3C352E] font-semibold text-xs tracking-[0.15em] uppercase transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:ring-offset-2 cursor-pointer"
              >
                {isServicesExpanded ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4 text-[#D4AF37] transition-transform duration-300" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="w-4 h-4 text-[#D4AF37] transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* WHY CHOOSE US (ANIMATED STATS) */}
      <section 
        id="stats" 
        ref={statsSectionRef}
        className="py-20 bg-[#F5EBDD]/60 border-t border-b border-[#E5DCCF]/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Excellence Defined</span>
            <h2 className="text-3xl md:text-4xl font-light text-[#3C352E] font-serif-elegant leading-tight">
              We Don't Just Take Photos; We Create Heirloom Memories
            </h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              We focus on premium visual curation. Our team treats every session like a fine-art editorial production—selecting locations, balancing light gradients, and retaining raw grain textures so your visual legacy looks spectacular.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#E5DCCF]/50">
                <Award className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[#3C352E]">100% Client-Authorised Privacy</p>
                <p className="text-[11px] text-stone-500 font-light">Your private gallery is hosted behind secure, encrypted credentials.</p>
              </div>
            </div>
          </div>

          {/* Right: Beautiful grid of counters */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-6 md:gap-8">
            
            {/* Stat Item 1 */}
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#E5DCCF]/50 text-center flex flex-col justify-center transform hover:-translate-y-1 transition-transform duration-300">
              <p className="text-4xl md:text-5xl font-light text-[#3C352E] font-serif-elegant mb-2 text-[#D4AF37]">
                {stats.clients}+
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3C352E]">Happy Clients</p>
              <p className="text-[10px] text-stone-400 font-light mt-1">Authentic smiles, tears, & reviews</p>
            </div>

            {/* Stat Item 2 */}
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#E5DCCF]/50 text-center flex flex-col justify-center transform hover:-translate-y-1 transition-transform duration-300">
              <p className="text-4xl md:text-5xl font-light text-[#3C352E] font-serif-elegant mb-2 text-[#D4AF37]">
                {stats.years}+
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3C352E]">Years Experience</p>
              <p className="text-[10px] text-stone-400 font-light mt-1">Mastering studio & natural light</p>
            </div>

            {/* Stat Item 3 */}
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#E5DCCF]/50 text-center flex flex-col justify-center transform hover:-translate-y-1 transition-transform duration-300">
              <p className="text-4xl md:text-5xl font-light text-[#3C352E] font-serif-elegant mb-2 text-[#D4AF37]">
                {stats.projects}+
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3C352E]">Projects Completed</p>
              <p className="text-[10px] text-stone-400 font-light mt-1">Weddings, fashion, and books</p>
            </div>

            {/* Stat Item 4 */}
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#E5DCCF]/50 text-center flex flex-col justify-center transform hover:-translate-y-1 transition-transform duration-300">
              <p className="text-4xl md:text-5xl font-light text-[#3C352E] font-serif-elegant mb-2 text-[#D4AF37]">
                {stats.satisfaction}%
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3C352E]">Satisfaction Rate</p>
              <p className="text-[10px] text-stone-400 font-light mt-1">Based on certified feedback loop</p>
            </div>

          </div>

        </div>
      </section>

      {/* BEHIND THE LENS (ABOUT STUDIO) */}
      <section id="about" className="py-24 bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Beautiful large image with decorative elements */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-[#F7F1E8] rounded-[28px] transform translate-x-4 translate-y-4 -z-10 border border-[#E5DCCF]"></div>
            
            <div className="overflow-hidden rounded-[28px] aspect-[4/5] bg-[#F7F1E8] shadow-md group">
              <img 
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000" 
                alt="Studio Principal Photographer" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Absolute Camera lens tag */}
            <div className="absolute -bottom-6 -right-6 bg-[#FFFDF8] border border-[#E5DCCF] p-5 rounded-2xl shadow-lg max-w-[220px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">Kalyan Babu K</p>
              <p className="text-xs font-serif-elegant italic text-stone-500">"Light is my raw medium; Telugu wedding rituals & human authenticity are my target."</p>
            </div>
          </div>

          {/* Right: Studio Story, Timeline, Achievements */}
          <div className="lg:col-span-6 text-left space-y-8" id="about-content">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-3">Behind the Lens</p>
              <h2 className="text-3xl md:text-5xl font-light text-[#3C352E] font-serif-elegant mb-6">
                Our Story & Philosophy
              </h2>
              <div className="w-16 h-[1px] bg-[#D4AF37] mb-6"></div>
              <p className="text-stone-600 font-light text-base leading-relaxed">
                Founded in 2010 in Andhra Pradesh and serving premium clients globally, Kalyan Digital Studio is a dedicated fine art photography studio. We reject sterile clinical studio templates in favor of cinematic light gradients, organic textures, and absolute storytelling.
              </p>
            </div>

            {/* Timeline Milestones */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#3C352E] font-serif-elegant">Our Journey</h3>
              
              <div className="relative border-l border-[#E5DCCF] pl-6 ml-2 space-y-6">
                {/* Milestone 1 */}
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 border-[#D4AF37] bg-white"></div>
                  <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block">2010 — Studio Foundation</span>
                  <p className="text-stone-500 text-xs font-light mt-1">Established an intimate natural-light portrait atelier in Rayachoty, Andhra Pradesh.</p>
                </div>

                {/* Milestone 2 */}
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 border-[#D4AF37] bg-white"></div>
                  <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block">2020 — Andhra Weddings Tour</span>
                  <p className="text-stone-500 text-xs font-light mt-1">Expanded our coverage to high-end weddings across Tirupati, Vijayawada, Hyderabad, and Bangalore.</p>
                </div>

                {/* Milestone 3 */}
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 border-[#D4AF37] bg-white"></div>
                  <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block">2025 — Fine Art Coffee Table Book</span>
                  <p className="text-stone-500 text-xs font-light mt-1">Published our first physical coffee table monograph "Luminance", celebrating traditional Telugu wedding rituals.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CLIENT TESTIMONIALS (GLASSMORPHISM CAROUSEL) */}
      <section id="testimonials" className="py-24 bg-[#F7F1E8]/60 border-t border-[#E5DCCF]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-light text-[#3C352E] font-serif-elegant mb-12">
            Loved By Descerning Clients
          </h2>

          {/* Testimonial card with Glassmorphism */}
          <div className="relative min-h-[300px]" id="testimonials-carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-[28px] p-8 md:p-12 shadow-[0_15px_35px_rgba(60,53,46,0.04)] border border-white max-w-3xl mx-auto"
              >
                {/* Rating Stars */}
                <div className="flex items-center justify-center space-x-1 mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                {/* Review */}
                <p className="font-serif-elegant text-lg md:text-2xl text-[#3C352E] font-light leading-relaxed italic mb-8">
                  "{testimonials[currentTestimonial].review}"
                </p>

                {/* Client Metadata */}
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name} 
                    className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#3C352E]">{testimonials[currentTestimonial].name}</p>
                    <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation arrows */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button 
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-3 bg-white/85 rounded-full shadow-sm text-[#3C352E] hover:text-[#D4AF37] hover:bg-white transition-all duration-300 focus:outline-none"
                id="testimonial-prev-btn"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentTestimonial === idx ? 'bg-[#D4AF37] w-5' : 'bg-[#E5DCCF]'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="p-3 bg-white/85 rounded-full shadow-sm text-[#3C352E] hover:text-[#D4AF37] hover:bg-white transition-all duration-300 focus:outline-none"
                id="testimonial-next-btn"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* BOOKING SECTION (ELEGANT RESERVATION) */}
      <section id="booking" className="py-24 bg-[#FFFDF8] relative">
        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 w-72 h-72 rounded-full bg-[#D4AF37]/3 blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-[#F7F1E8] grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left: Info Block & Beautiful warm photo */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#F7F1E8] to-[#FFFDF8] p-8 md:p-12 flex flex-col justify-between border-r border-[#F7F1E8] relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#D4AF37]/5 blur-2xl"></div>
              
              <div className="space-y-6 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Reservation</span>
                <h3 className="text-3xl font-light text-[#3C352E] font-serif-elegant leading-tight">
                  Reserve Your Heirloom Story
                </h3>
                <p className="text-stone-500 font-light text-xs leading-relaxed">
                  Spaces are highly limited to preserve our bespoke editorial focus. Submit your desired date and photography category. Kalyan will review and coordinate within 24 business hours.
                </p>
              </div>

              <div className="space-y-4 pt-10 relative z-10 border-t border-[#E5DCCF]/50">
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-white rounded-full text-[#D4AF37] shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-stone-400 font-bold">Studio Phone</p>
                    <p className="text-xs font-semibold text-[#3C352E]">
                      <a href="tel:+919985302000" className="hover:text-[#D4AF37] transition-colors duration-300 focus:outline-none focus:underline" aria-label="Call studio phone +91 9985302000">+91 9985302000</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-white rounded-full text-[#D4AF37] shadow-sm">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-stone-400 font-bold">Website</p>
                    <p className="text-xs font-semibold text-[#3C352E]">
                      <a href="https://www.kalyandigitals.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors duration-300 focus:outline-none focus:underline" aria-label="Visit Kalyan Digital Studio Website">www.kalyandigitals.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white rounded-full text-[#D4AF37] shadow-sm mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-stone-400 font-bold">Primary Atelier</p>
                    <p className="text-xs font-semibold text-[#3C352E] leading-relaxed">
                      Kothapet, Ramapuram,<br />
                      Beside Venkateswara Swamy Temple,<br />
                      Rayachoty - 516269, AP
                    </p>
                  </div>
                </div>
              </div>

              {/* Minimalist branding sign */}
              <div className="pt-8">
                <p className="font-serif-elegant text-lg tracking-[0.3em] uppercase text-[#3C352E]/40 font-semibold">KALYAN STUDIO</p>
              </div>
            </div>

            {/* Right: Premium Brand Banner & Direct Contact Actions */}
            <div className="lg:col-span-7 p-8 md:p-12 bg-white flex flex-col justify-between relative" id="booking-container-direct">
              <div className="space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Official Banner</span>
                
                {/* Beautiful frame for Kalyan Digital Studio original brand image */}
                <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37]/30 shadow-lg group">
                  <img 
                    src={logoImage} 
                    alt="Kalyan Digital Studio Official Banner" 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-serif-elegant italic tracking-widest text-[#D4AF37]">Capture Your Legacy</p>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-stone-300 mt-1">Kalyan Digital Studio • Rayachoty</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xl font-light text-[#3C352E] font-serif-elegant">
                    Connect Instantly for Bookings
                  </h4>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    We have removed complicated forms to offer you a direct, luxurious booking experience. Click any button below to connect with us immediately for slot bookings, customized packages, or queries.
                  </p>
                </div>
              </div>

              {/* Direct Call / Chat action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#F7F1E8]">
                {/* Direct Call */}
                <a 
                  href="tel:+919985302000"
                  className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-[#3C352E] hover:bg-[#D4AF37] text-white hover:text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group"
                  id="direct-call-primary"
                  aria-label="Call studio line +91 99853 02000"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37] group-hover:text-white" />
                  <div className="text-left">
                    <p className="text-[8px] opacity-75 font-mono uppercase tracking-wider">Direct Studio Call</p>
                    <p className="text-xs font-bold tracking-widest">99853 02000</p>
                  </div>
                </a>

                {/* WhatsApp Chat Button */}
                <a 
                  href="https://wa.me/919985302000?text=Hi%20Kalyan%20Digital%20Studio%2C%20I%20would%20like%20to%20book%20a%20photography%20session%20with%20you."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  id="direct-whatsapp"
                >
                  <Send className="w-4 h-4 animate-bounce" />
                  <div className="text-left">
                    <p className="text-[8px] opacity-90 font-mono uppercase tracking-wider">Instant Chat & Booking</p>
                    <p className="text-xs font-bold tracking-widest">Connect on WhatsApp</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Elegant Interactive Google Map Section */}
          <div className="mt-12 bg-white rounded-[32px] p-6 sm:p-10 border border-[#F7F1E8] shadow-xl overflow-hidden relative" id="atelier-location-map">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#D4AF37]/3 blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Find Our Studio</span>
                <h4 className="text-2xl font-light text-[#3C352E] font-serif-elegant mt-2">
                  Visit Our Fine-Art Atelier
                </h4>
                <p className="text-stone-500 font-light text-xs mt-1 max-w-xl">
                  Located in Kothapet, Ramapuram, Beside Venkateswara Swamy Temple. Come visit us for custom pre-wedding consultations, view physically curated print albums, and choose exquisite frames.
                </p>
              </div>
              <div className="shrink-0">
                <a 
                  href="https://maps.app.goo.gl/Bo4bFgrCmBehzhsX8" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#3C352E] hover:bg-[#D4AF37] text-white hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Interactive Map Embed Container */}
            <div className="relative w-full aspect-[21/9] min-h-[300px] md:min-h-[350px] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 shadow-inner transition-colors duration-500">
              <iframe
                title="Kalyan Digital Studio Location Map"
                src="https://maps.google.com/maps?q=kothapet%20Ramapuram,%20Beside%20Venkateswara%20swamy%20temple,%20Rayachoty%20516269&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale-[15%] contrast-[105%] hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Details and landmarks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-[#F7F1E8] text-xs font-light text-stone-500">
              <div className="space-y-1.5">
                <p className="font-bold text-[#3C352E] uppercase tracking-wider text-[9px]">Exact Location</p>
                <p className="leading-relaxed">Kothapet, Ramapuram, Beside Venkateswara Swamy Temple, Rayachoty, Andhra Pradesh - 516269</p>
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-[#3C352E] uppercase tracking-wider text-[9px]">Key Landmarks</p>
                <p className="leading-relaxed">Beside Venkateswara Swamy Temple, Rayachoty town area, near bypass approach road.</p>
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-[#3C352E] uppercase tracking-wider text-[9px]">Consultation Hours</p>
                <p className="leading-relaxed">Monday to Sunday: 9:00 AM – 8:00 PM (Auspicious dates and muhurtham booking discussions by appointment).</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INSTAGRAM GALLERY SECTION */}
      <section id="instagram" className="py-16 bg-[#F7F1E8]/30 border-t border-b border-[#F7F1E8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Social Curation</span>
              <h2 className="text-2xl md:text-3xl font-light text-[#3C352E] font-serif-elegant mt-2">
                Live From the @Kalyan_Digital_Studio Feed
              </h2>
            </div>
            <a 
              href="https://www.instagram.com/kalyandigitalphotostudio?igsh=MXR6MTFuODltejZoMg==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-semibold tracking-widest text-[#D4AF37] uppercase hover:text-[#C29F2F] transition-colors mt-4 md:mt-0"
              id="instagram-follow-btn"
            >
              Follow Our Journey <Instagram className="w-4 h-4 ml-1.5" />
            </a>
          </div>

          {/* Large Horizontal Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5" id="instagram-grid">
            {instagramPhotos.map((photo) => (
              <a 
                key={photo.id}
                href="https://www.instagram.com/kalyandigitalphotostudio?igsh=MXR6MTFuODltejZoMg=="
                target="_blank"
                rel="noopener noreferrer"
                className="relative group aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 block"
                aria-label="View photo on Instagram"
              >
                <img 
                  src={photo.img} 
                  alt="Instagram feed" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#3C352E]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4 text-white">
                  <div className="flex items-center gap-1 text-xs">
                    <Heart className="w-4 h-4 fill-white text-white" />
                    <span>{photo.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="w-4 h-4" />
                    <span>{photo.comments}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* CALL TO ACTION (LUXURY BANNER) */}
      <section className="py-24 bg-[#FFFDF8] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          
          <motion.div 
            whileInView={{ opacity: [0, 1], y: [20, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-[#F7F1E8] via-[#FFFDF8] to-[#F5EBDD] rounded-[32px] p-12 md:p-20 border border-[#E5DCCF]/60 shadow-lg relative overflow-hidden flex flex-col items-center"
            id="cta-banner"
          >
            {/* Ambient gold blur glow */}
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#D4AF37]/4 blur-2xl"></div>
            
            <Sparkles className="w-8 h-8 text-[#D4AF37] mb-6 animate-pulse" />

            <h2 className="text-3xl md:text-5xl font-light text-[#3C352E] font-serif-elegant leading-tight max-w-2xl mb-6">
              Let's Turn Your Moments into <br />
              <span className="italic text-[#D4AF37] font-normal">Timeless Memories</span>
            </h2>

            <p className="text-stone-600 font-light text-sm max-w-lg mb-10 leading-relaxed">
              Contact us to discuss your vision, check date availability, or build a entirely bespoke package. We would be honored to host you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <a 
                href="#booking"
                id="cta-banner-book"
                className="px-8 py-4 rounded-full bg-[#3C352E] hover:bg-[#D4AF37] text-white font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-1"
              >
                Book Your Session <Calendar className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://wa.me/919985302000?text=Hi%20Kalyan%20Digital%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20photography%20sessions."
                target="_blank"
                rel="noopener noreferrer"
                id="cta-banner-contact"
                className="px-8 py-4 rounded-full border border-[#E5DCCF] hover:border-[#D4AF37] bg-white text-[#3C352E] hover:text-[#D4AF37] font-semibold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1"
              >
                Inquire via WhatsApp <Send className="w-3.5 h-3.5" />
              </a>
            </div>

          </motion.div>

        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-[#FFFDF8] border-t border-[#F7F1E8] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Logo & Narrative */}
          <div className="md:col-span-4 space-y-6">
            <a href="#home" className="flex items-center space-x-2.5 group focus:outline-none" id="footer-logo">
              <Camera className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-serif-elegant text-lg tracking-[0.18em] font-bold text-[#3C352E] uppercase">
                KALYAN DIGITAL STUDIO
              </span>
            </a>
            <p className="text-xs text-stone-500 font-light leading-relaxed max-w-xs">
              Andhra’s premier fine-art and wedding photography studio dedicated to rendering natural character, rich local rituals, and authentic festive stories. Handcrafted in Rayachoty, AP.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a href="https://www.instagram.com/kalyandigitalphotostudio?igsh=MXR6MTFuODltejZoMg==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#F7F1E8] hover:bg-[#D4AF37] hover:text-white text-stone-600 transition-colors flex items-center justify-center shadow-sm" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/kamini.k.babu/directory_personal_details" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#F7F1E8] hover:bg-[#D4AF37] hover:text-white text-stone-600 transition-colors flex items-center justify-center shadow-sm" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">Navigation</p>
            <ul className="space-y-2.5">
              {['home', 'portfolio', 'services', 'about', 'testimonials'].map((link) => (
                <li key={link}>
                  <a href={`#${link}`} className="text-xs text-stone-500 hover:text-[#D4AF37] capitalize font-light transition-colors">
                    {link === 'testimonials' ? 'reviews' : link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Column */}
          <div className="md:col-span-3 space-y-4">
            <p className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">Atelier Sessions</p>
            <ul className="space-y-2.5 text-xs text-stone-500 font-light">
              <li>Wedding Documentaries</li>
              <li>Minimalist Linen Portraits</li>
              <li>High-Fashion Editorial</li>
              <li>Maternity & New Beginnings</li>
              <li>Product &Travertine Still Life</li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-4">
            <p className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">The Kalyan Journal</p>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Subscribe to get seasonal print release announcements, lighting guides, and session booking availability updates.
            </p>

            <AnimatePresence mode="wait">
              {!newsletterSubscribed ? (
                <motion.form 
                  key="newsletter-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleNewsletterSubmit}
                  className="flex space-x-2"
                  id="newsletter-form"
                >
                  <input 
                    type="email" 
                    required
                    placeholder="Enter email..." 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-2 text-xs border border-[#E5DCCF] rounded-full focus:outline-none focus:border-[#D4AF37] bg-white text-[#3C352E]"
                  />
                  <button 
                    type="submit" 
                    id="subscribe-btn"
                    className="p-2 px-4 rounded-full bg-[#D4AF37] hover:bg-[#C29F2F] text-white text-xs font-semibold transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="newsletter-success"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-[#DDE8D8]/60 text-[#82927A] border border-[#DDE8D8] rounded-xl text-[11px] text-center"
                  id="newsletter-success-msg"
                >
                  Thank you! You are now subscribed to the Kalyan Studio Journal.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Elegant horizontal line and hours / copyright */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-[#F7F1E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-light">
          <div>
            <p>© {new Date().getFullYear()} Kalyan Digital Studio. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <p>Studio Hours: Mon–Sun, 9:00 AM – 9:00 PM IST</p>
            <p>Privacy Policy</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
