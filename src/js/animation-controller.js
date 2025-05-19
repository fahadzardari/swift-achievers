import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger only once
gsap.registerPlugin(ScrollTrigger);

class AnimationController {
  constructor() {
    this.initialized = false;
    this.animations = [];
  }

  init() {
    if (this.initialized) return;

    // Setup IntersectionObserver for better performance than ScrollTrigger
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.animId;
            const animation = this.animations.find((a) => a.id === id);

            if (animation) {
              animation.play();
              if (animation.once) this.observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.15 },
    );

    this.initialized = true;
  }

  // Register animation for an element
  register(element, options = {}) {
    if (!element) return;

    const id = options.id || Math.random().toString(36).substr(2, 9);
    element.dataset.animId = id;

    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: options.y || 20,
    });

    // Create animation but don't play it yet
    const animation = gsap.timeline({ paused: true }).to(element, {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.7,
      ease: options.ease || "power2.out",
    });

    // Store animation with its ID
    this.animations.push({
      id,
      play: () => animation.play(),
      once: options.once !== false,
    });

    // Observe element
    this.observer.observe(element);

    return animation;
  }

  // Register staggered animations for a group of elements
  registerGroup(elements, options = {}) {
    if (!elements || elements.length === 0) return;

    const id = options.id || Math.random().toString(36).substr(2, 9);
    const container = elements[0].parentElement;
    container.dataset.animId = id;

    // Set initial state for all elements
    gsap.set(elements, {
      opacity: 0,
      y: options.y || 30,
      scale: options.scale || 0.95,
    });

    // Create animation but don't play it yet
    const animation = gsap.timeline({ paused: true }).to(elements, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: options.stagger || 0.1,
      duration: options.duration || 0.7,
      ease: options.ease || "power2.out",
    });

    // Store animation with its ID
    this.animations.push({
      id,
      play: () => animation.play(),
      once: options.once !== false,
    });

    // Observe container
    this.observer.observe(container);

    return animation;
  }
}

// Create a singleton instance
export const animationController = new AnimationController();

// Helper function for simple animations
export function setupAnimations() {
  animationController.init();

  // Find and animate elements with data-anim attribute
  document.querySelectorAll("[data-anim]").forEach((element) => {
    const type = element.dataset.anim;
    const delay = parseFloat(element.dataset.animDelay || 0);

    switch (type) {
      case "fade":
        animationController.register(element, { y: 20, delay });
        break;
      case "fade-up":
        animationController.register(element, { y: 30, delay });
        break;
      case "fade-left":
        animationController.register(element, { x: -30, y: 0, delay });
        break;
      case "fade-right":
        animationController.register(element, { x: 30, y: 0, delay });
        break;
      case "fade-down":
        animationController.register(element, { y: -30, delay });
        break;
      case "fade-in":
        animationController.register(element, { y: 0, delay });
        break;
      case "scale-up":
        animationController.register(element, { scale: 0.95, delay });
        break;
      case "scale-down":
        animationController.register(element, { scale: 1.05, delay });
        break;
      case "scale-bounce":
        animationController.register(element, {
          scale: 0.8,
          y: 15,
          delay,
          ease: "back.out(1.2)",
        });
        break;
    }
  });

  // Group animations
  document.querySelectorAll("[data-anim-group]").forEach((container) => {
    const children = container.querySelectorAll("[data-anim-item]");
    if (children.length > 0) {
      animationController.registerGroup(children, {
        stagger: parseFloat(container.dataset.animStagger || 0.1),
      });
    }
  });
}
