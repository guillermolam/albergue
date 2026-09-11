/**
 * Complex Swup Animations
 * Mind-blowing page transition animations for Albergue
 */

import type { SwupPlugin } from '@swup/core';

// Custom animation plugin with staggered element animations
const complexAnimationsPlugin: SwupPlugin = () => {
  return {
    name: 'ComplexAnimationsPlugin',
    
    // Hook into animation out (page leaving)
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            // Find all elements with animation classes
            const animateOutElements = container.querySelectorAll<HTMLElement>('[data-animate-out]');
            
            if (animateOutElements.length === 0) return;
            
            const delays = Array.from(animateOutElements).map((_, i) => i * 40);
            
            await Promise.all(
              animateOutElements.map((el, i) => {
                return new Promise<void>((resolve) => {
                  setTimeout(() => {
                    // Apply inline styles for animation
                    el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    el.style.opacity = '0';
                    el.style.transform = el.dataset.animateOut || 'translateY(20px)';
                    
                    el.addEventListener('transitionend', () => resolve(), { once: true });
                    
                    // Fallback in case transition doesn't fire
                    setTimeout(() => resolve(), 400);
                  }, delays[i]);
                });
              })
            );
          },
        },
        
        in: {
          await: async ({ container }) => {
            // Find all elements with animation classes
            const animateInElements = container.querySelectorAll<HTMLElement>('[data-animate-in]');
            
            if (animateInElements.length === 0) return;
            
            const delays = Array.from(animateInElements).map((_, i) => i * 60);
            
            await Promise.all(
              animateInElements.map((el, i) => {
                return new Promise<void>((resolve) => {
                  setTimeout(() => {
                    // Get custom animation from data attribute or use default
                    const customAnimation = el.dataset.animateIn;
                    
                    if (customAnimation?.includes('fade')) {
                      el.style.transition = 'opacity 0.6s ease-out';
                      el.style.opacity = '1';
                    } else if (customAnimation?.includes('slide')) {
                      el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                      el.style.opacity = '1';
                      el.style.transform = 'translateX(0)';
                    } else if (customAnimation?.includes('scale')) {
                      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                      el.style.opacity = '1';
                      el.style.transform = 'scale(1)';
                    } else if (customAnimation?.includes('rotate')) {
                      el.style.transition = 'all 0.8s ease-out';
                      el.style.opacity = '1';
                      el.style.transform = 'rotate(0deg)';
                    } else {
                      // Default animation
                      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                      el.style.opacity = '1';
                      el.style.transform = 'translateY(0)';
                    }
                    
                    el.addEventListener('transitionend', () => resolve(), { once: true });
                    
                    // Fallback
                    setTimeout(() => resolve(), 600);
                  }, delays[i]);
                });
              })
            );
          },
        },
      },
    },
    
    // Hook into will replace content
    on: {
      willReplaceContent: ({ container }) => {
        // Add will-change for better performance
        container.style.willChange = 'transform, opacity';
      },
      contentReplaced: ({ container }) => {
        // Reset will-change after animation
        setTimeout(() => {
          container.style.willChange = 'auto';
        }, 1000);
      },
    },
  };
};

// 3D Perspective Animation Plugin
const perspectiveAnimationPlugin: SwupPlugin = () => {
  return {
    name: 'PerspectiveAnimationPlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            container.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease-out';
            container.style.transform = 'perspective(1200px) rotateY(-15deg) translateZ(-50px)';
            container.style.opacity = '0.5';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 800);
            });
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease-out';
            container.style.transform = 'perspective(1200px) rotateY(15deg) translateZ(-50px)';
            container.style.opacity = '0.5';
            
            // Force reflow
            void container.offsetHeight;
            
            container.style.transform = 'perspective(1200px) rotateY(0deg) translateZ(0)';
            container.style.opacity = '1';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 800);
            });
          },
        },
      },
    },
  };
};

// Morph Animation Plugin
const morphAnimationPlugin: SwupPlugin = () => {
  return {
    name: 'MorphAnimationPlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            container.style.transition = 'clip-path 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.8s ease-out';
            container.style.clipPath = 'circle(0% at 50% 50%)';
            container.style.opacity = '0';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 800);
            });
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'clip-path 1s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.8s ease-out';
            container.style.clipPath = 'circle(150% at 50% 50%)';
            container.style.opacity = '1';
            
            // Force reflow
            void container.offsetHeight;
            
            container.style.clipPath = 'circle(150% at 50% 50%)';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 1000);
            });
          },
        },
      },
    },
  };
};

// Glitch Animation Plugin
const glitchAnimationPlugin: SwupPlugin = () => {
  return {
    name: 'GlitchAnimationPlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            const duration = 300;
            const steps = 3;
            
            for (let i = 0; i < steps; i++) {
              container.style.transition = 'none';
              container.style.transform = `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 4}px)`;
              container.style.filter = `hue-rotate(${Math.random() * 180}deg)`;
              
              await new Promise<void>((resolve) => {
                setTimeout(() => resolve(), duration / steps);
              });
            }
            
            container.style.transition = 'opacity 0.3s ease-out';
            container.style.opacity = '0';
            container.style.filter = 'none';
            container.style.transform = 'none';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 300);
            });
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'opacity 0.3s ease-out';
            container.style.opacity = '1';
            container.style.filter = 'none';
            container.style.transform = 'none';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 300);
            });
          },
        },
      },
    },
  };
};

// Warp Speed Animation Plugin
const warpAnimationPlugin: SwupPlugin = () => {
  return {
    name: 'WarpAnimationPlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            container.style.transition = 'all 0.5s ease-out';
            container.style.filter = 'blur(20px)';
            container.style.transform = 'scale(1.2) skewX(-20deg)';
            container.style.opacity = '0';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 500);
            });
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'all 0.5s ease-out';
            container.style.filter = 'blur(0)';
            container.style.transform = 'scale(1) skewX(0deg)';
            container.style.opacity = '1';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 500);
            });
          },
        },
      },
    },
  };
};

// Export all plugins
export {
  complexAnimationsPlugin,
  perspectiveAnimationPlugin,
  morphAnimationPlugin,
  glitchAnimationPlugin,
  warpAnimationPlugin,
};

// Auto-register plugins if using swup directly
if (typeof window !== 'undefined') {
  const swup = (window as any).swup;
  if (swup) {
    swup.use([
      complexAnimationsPlugin,
      perspectiveAnimationPlugin,
      morphAnimationPlugin,
      glitchAnimationPlugin,
      warpAnimationPlugin,
    ]);
  }
}
