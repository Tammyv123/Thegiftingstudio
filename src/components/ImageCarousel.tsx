// components/ImageCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface CarouselItem {
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
  interval?: number; // Time in ms for auto-slide
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ items, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set up auto-sliding timer
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);

    // Clean up timer on component unmount
    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (!items || items.length === 0) {
    return null; 
  }

  const currentItem = items[currentIndex];

  return (
    // Added rounded-xl and shadow-xl for visual separation and style
    <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden rounded-xl shadow-xl">
      {/* Background Image with Transition */}
      <div 
        key={currentIndex} // Changing key forces re-render and fade transition
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentItem.image})` }}
      >
        {/* Overlay and Text Content */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-lg mb-4 leading-tight">
            {currentItem.title}
          </h2>
          <p className="text-white text-md md:text-xl lg:text-2xl mb-8 max-w-2xl drop-shadow-md">
            {currentItem.subtitle}
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg" asChild>
            <Link to={currentItem.link}>Shop Now</Link>
          </Button>
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full bg-white transition-all duration-300 ${
              currentIndex === index ? 'opacity-100 scale-125' : 'opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};