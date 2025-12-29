// Define keyframe animations for modal components
export const injectModalAnimations = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes scaleOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0.95); opacity: 0; }
    }
    
    @keyframes blurIn {
      from { backdrop-filter: blur(0px); }
      to { backdrop-filter: blur(4px); }
    }
    
    @keyframes blurOut {
      from { backdrop-filter: blur(4px); }
      to { backdrop-filter: blur(0px); }
    }
  `;
  document.head.appendChild(style);
  
  return () => {
    document.head.removeChild(style);
  };
};

// Animation duration in ms (used for consistency)
export const ANIMATION_DURATION = 400;

// Easing function (Material Design standard)
export const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Modal animation configs
export const modalOverlayAnimation = (isClosing: boolean, isAnimating: boolean) => ({
  animation: isClosing 
    ? `fadeOut ${ANIMATION_DURATION}ms ${EASING}, blurOut ${ANIMATION_DURATION}ms ${EASING}` 
    : isAnimating 
      ? `fadeIn ${ANIMATION_DURATION}ms ${EASING}, blurIn ${ANIMATION_DURATION}ms ${EASING}` 
      : 'none',
  backdropFilter: isClosing ? 'blur(0px)' : 'blur(4px)'
});

export const modalContentAnimation = (isClosing: boolean, isAnimating: boolean) => ({
  animation: isClosing 
    ? `scaleOut ${ANIMATION_DURATION}ms ${EASING}` 
    : isAnimating 
      ? `scaleIn ${ANIMATION_DURATION}ms ${EASING}` 
      : 'none',
  opacity: isClosing ? 0 : 1,
  transform: isClosing ? 'scale(0.95)' : 'scale(1)'
}); 