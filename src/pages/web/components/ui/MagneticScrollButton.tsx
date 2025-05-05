import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const MagneticScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [bouncePosition, setBouncePosition] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    let animationFrame;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newPosition = Math.sin(elapsed / 300) * 5;
      setBouncePosition(newPosition);
      animationFrame = requestAnimationFrame(animate);
    };

    if (isVisible && !isClicked) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, isClicked]);

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x / 8, y: y / 8 });
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
  };

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out
      ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16 pointer-events-none"
      }`}
    >
      <div
        className="flex flex-col items-center cursor-pointer"
        style={{
          transform: `translate(${position.x}px, ${
            bouncePosition + position.y
          }px)`,
          transition: "transform 0.1s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={resetPosition}
        onClick={scrollToTop}
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={resetPosition}
        onTouchStart={() => setIsClicked(true)}
        onTouchEnd={resetPosition}
      >
        <ChevronUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="text-sm text-gray-700 dark:text-gray-400 mb-2">
          Scroll to top
        </span>
      </div>
    </div>
  );
};

export default MagneticScrollButton;
