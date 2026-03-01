'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import Link from 'next/link';

interface Slide {
  id: number;
  image: string;
  titleEn: string;
  titleHe: string;
  subtitleEn: string;
  subtitleHe: string;
  ctaEn: string;
  ctaHe: string;
  link: string;
  textColor?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/images/hero/slide1.jpg',
    titleEn: 'NEW COLLECTION',
    titleHe: 'קולקציה חדשה',
    subtitleEn: 'STREETWEAR REDEFINED',
    subtitleHe: 'אופנת רחוב מחודשת',
    ctaEn: 'SHOP NOW',
    ctaHe: 'קנה עכשיו',
    link: '/new-in',
  },
  {
    id: 2,
    image: '/images/hero/slide2.jpg',
    titleEn: 'SUMMER VIBES',
    titleHe: 'אווירת קיץ',
    subtitleEn: 'HOT STYLES FOR HOT DAYS',
    subtitleHe: 'סטייל חם לימים חמים',
    ctaEn: 'EXPLORE',
    ctaHe: 'גלה עכשיו',
    link: '/collections/summer',
  },
  {
    id: 3,
    image: '/images/hero/slide3.jpg',
    titleEn: 'LIMITED DROP',
    titleHe: 'מהדורה מוגבלת',
    subtitleEn: "DON'T MISS OUT",
    subtitleHe: 'אל תפספסו',
    ctaEn: 'GET YOURS',
    ctaHe: 'קבל את שלך',
    link: '/collections/limited',
  },
];

export default function HeroSlider() {
  const { locale } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === 'he';

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  // GSAP Glitch Animation
  useEffect(() => {
    if (titleRef.current) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

      tl.to(titleRef.current, {
        duration: 0.1,
        skewX: 10,
        ease: 'power4.inOut',
      })
      .to(titleRef.current, {
        duration: 0.04,
        skewX: 0,
        ease: 'power4.inOut',
      })
      .to(titleRef.current, {
        duration: 0.04,
        opacity: 0.8,
        ease: 'power4.inOut',
      })
      .to(titleRef.current, {
        duration: 0.04,
        opacity: 1,
        ease: 'power4.inOut',
      })
      .to(titleRef.current, {
        duration: 0.1,
        skewX: -5,
        ease: 'power4.inOut',
      })
      .to(titleRef.current, {
        duration: 0.04,
        skewX: 0,
        ease: 'power4.inOut',
      });

      return () => {
        tl.kill();
      };
    }
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const slide = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[60vh] md:h-[80vh] lg:h-screen overflow-hidden bg-black"
    >
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Placeholder gradient background (replace with actual images) */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Overlay Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Animated Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-50" />
        </motion.div>
      </AnimatePresence>

      {/* Noise/Grain Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-cyan-400 font-medium tracking-[0.3em] text-sm md:text-base mb-4"
              >
                {isRTL ? slide.subtitleHe : slide.subtitleEn}
              </motion.p>

              {/* Title with Glitch Effect */}
              <div ref={titleRef} className="relative">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
                  {/* Main Text */}
                  <span className="relative inline-block">
                    {isRTL ? slide.titleHe : slide.titleEn}

                    {/* Glitch Layers */}
                    <span
                      className="absolute top-0 left-0 w-full text-cyan-400 opacity-70 animate-pulse"
                      style={{
                        clipPath: 'inset(0 0 65% 0)',
                        transform: 'translate(-2px, 0)',
                      }}
                      aria-hidden="true"
                    >
                      {isRTL ? slide.titleHe : slide.titleEn}
                    </span>
                    <span
                      className="absolute top-0 left-0 w-full text-red-500 opacity-70"
                      style={{
                        clipPath: 'inset(65% 0 0 0)',
                        transform: 'translate(2px, 0)',
                      }}
                      aria-hidden="true"
                    >
                      {isRTL ? slide.titleHe : slide.titleEn}
                    </span>
                  </span>
                </h1>

                {/* Animated Underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 origin-left"
                  style={{ maxWidth: '300px' }}
                />
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8"
              >
                <Link href={slide.link}>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden px-8 py-4 bg-white text-black font-bold text-lg tracking-wider rounded-none group"
                  >
                    <span className="relative z-10">{isRTL ? slide.ctaHe : slide.ctaEn}</span>
                    <motion.div
                      className="absolute inset-0 bg-cyan-400"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      {isRTL ? slide.ctaHe : slide.ctaEn}
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="pointer-events-auto p-3 bg-black/50 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-cyan-400 hover:text-black transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="pointer-events-auto p-3 bg-black/50 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-cyan-400 hover:text-black transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 1000);
              }
            }}
            className={`relative w-12 h-1 rounded-full overflow-hidden transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 6, ease: 'linear' }}
                className="absolute inset-0 bg-cyan-400"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs tracking-widest rotate-90 origin-center">SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </div>
  );
}
