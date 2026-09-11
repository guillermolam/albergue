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

// Liquid/Smooth Transition Plugin
const liquidAnimationPlugin: SwupPlugin = () => {
  return {
    name: 'LiquidAnimationPlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            container.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            container.style.transform = 'scale3d(1.1, 1.1, 1.1)';
            container.style.filter = 'blur(10px)';
            container.style.opacity = '0';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 600);
            });
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            container.style.transform = 'scale3d(0.9, 0.9, 0.9)';
            container.style.filter = 'blur(10px)';
            container.style.opacity = '0';
            
            // Force reflow
            void container.offsetHeight;
            
            container.style.transform = 'scale3d(1, 1, 1)';
            container.style.filter = 'blur(0)';
            container.style.opacity = '1';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 600);
            });
          },
        },
      },
    },
  };
};

// Particle Explosion Animation Plugin
const particleExplosionPlugin: SwupPlugin = () => {
  return {
    name: 'ParticleExplosionPlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            const duration = 800;
            const particleCount = 20;
            
            // Create particle elements
            const particles: HTMLElement[] = [];
            for (let i = 0; i < particleCount; i++) {
              const particle = document.createElement('div');
              particle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: #00AB39;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
              `;
              document.body.appendChild(particle);
              particles.push(particle);
            }
            
            // Position particles at center
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            particles.forEach((p, i) => {
              p.style.left = `${centerX}px`;
              p.style.top = `${centerY}px`;
              p.style.opacity = '1';
              
              const angle = (i / particleCount) * Math.PI * 2;
              const distance = Math.random() * 300 + 100;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              
              p.style.transition = `all ${duration}ms ease-out`;
              p.style.transform = `translate(${x}px, ${y}px) scale(0)`;
              p.style.opacity = '0';
            });
            
            await new Promise<void>((resolve) => setTimeout(resolve, duration));
            
            // Cleanup
            particles.forEach(p => p.remove());
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'opacity 0.4s ease-out';
            container.style.opacity = '0';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 400);
            });
            
            container.style.opacity = '1';
          },
        },
      },
    },
  };
};

// Neon Glow Animation Plugin
const neonGlowPlugin: SwupPlugin = () => {
  return {
    name: 'NeonGlowPlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            container.style.transition = 'all 0.5s ease-out';
            container.style.filter = 'drop-shadow(0 0 20px rgba(0, 171, 57, 0.8))';
            container.style.transform = 'scale(1.05)';
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
            container.style.filter = 'drop-shadow(0 0 20px rgba(0, 171, 57, 0))';
            container.style.transform = 'scale(0.95)';
            container.style.opacity = '0';
            
            // Force reflow
            void container.offsetHeight;
            
            container.style.filter = 'drop-shadow(0 0 0 rgba(0, 171, 57, 0.8))';
            container.style.transform = 'scale(1)';
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

// Rotate Cube Animation Plugin
const rotateCubePlugin: SwupPlugin = () => {
  return {
    name: 'RotateCubePlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            container.style.transition = 'transform 0.8s ease-out, opacity 0.4s ease-out';
            container.style.transformStyle = 'preserve-3d';
            container.style.transform = 'rotateY(-90deg) rotateX(10deg)';
            container.style.opacity = '0';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 800);
            });
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'transform 0.8s ease-out, opacity 0.4s ease-out';
            container.style.transformStyle = 'preserve-3d';
            container.style.transform = 'rotateY(90deg) rotateX(-10deg)';
            container.style.opacity = '0';
            
            // Force reflow
            void container.offsetHeight;
            
            container.style.transform = 'rotateY(0deg) rotateX(0deg)';
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

// Wobble Animation Plugin
const wobblePlugin: SwupPlugin = () => {
  return {
    name: 'WobblePlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            container.style.transition = 'transform 0.3s ease-out';
            
            // Wobble effect
            container.style.transform = 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)';
            await new Promise<void>((resolve) => setTimeout(resolve, 100));
            
            container.style.transform = 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)';
            await new Promise<void>((resolve) => setTimeout(resolve, 100));
            
            container.style.transform = 'translate3d(-10%, 0, 0) rotate3d(0, 0, 1, -2deg)';
            await new Promise<void>((resolve) => setTimeout(resolve, 100));
            
            container.style.transform = 'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg)';
            container.style.opacity = '0';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 300);
            });
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'transform 0.3s ease-out, opacity 0.4s ease-out';
            container.style.transform = 'translate3d(0, 20px, 0) rotate3d(0, 0, 1, -2deg)';
            container.style.opacity = '0';
            
            // Force reflow
            void container.offsetHeight;
            
            container.style.transform = 'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg)';
            container.style.opacity = '1';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 400);
            });
          },
        },
      },
    },
  };
};

// Zoom Out to Black Plugin
const zoomOutPlugin: SwupPlugin = () => {
  return {
    name: 'ZoomOutPlugin',
    
    replace: {
      animation: {
        out: {
          await: async ({ container }) => {
            container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out';
            container.style.transform = 'scale(0.8)';
            container.style.opacity = '0';
            container.style.filter = 'brightness(0)';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 600);
            });
          },
        },
        
        in: {
          await: async ({ container }) => {
            container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out, filter 0.6s ease-out';
            container.style.transform = 'scale(1.2)';
            container.style.opacity = '0';
            container.style.filter = 'brightness(1.2)';
            
            // Force reflow
            void container.offsetHeight;
            
            container.style.transform = 'scale(1)';
            container.style.opacity = '1';
            container.style.filter = 'brightness(1)';
            
            await new Promise<void>((resolve) => {
              container.addEventListener('transitionend', () => resolve(), { once: true });
              setTimeout(() => resolve(), 600);
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
  liquidAnimationPlugin,
  particleExplosionPlugin,
  neonGlowPlugin,
  rotateCubePlugin,
  wobblePlugin,
  zoomOutPlugin,
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
      liquidAnimationPlugin,
      particleExplosionPlugin,
      neonGlowPlugin,
      rotateCubePlugin,
      wobblePlugin,
      zoomOutPlugin,
    ]);
  }
}
