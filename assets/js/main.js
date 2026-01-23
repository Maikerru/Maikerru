// Fullscreen Black Functionality
function goFullscreenBlack() {
  // Add fullscreen black class to body
  document.body.classList.add('fullscreen-black');
    
  // Request fullscreen if supported
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => {
      console.log('Fullscreen request failed:', err);
    });
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function exitFullscreenBlack() {
  // Remove fullscreen black class
  document.body.classList.remove('fullscreen-black');
  
  // Exit fullscreen if in fullscreen mode
  if (document.fullscreenElement || 
      document.mozFullScreenElement || 
      document.webkitFullscreenElement || 
      document.msFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  
  // Hide exit button
  const exitBtn = document.getElementById('exit-fullscreen-btn');
  if (exitBtn) {
    exitBtn.style.display = 'none';
  }
}

// Handle fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
  const isFullscreen = document.fullscreenElement || 
                       document.mozFullScreenElement || 
                       document.webkitFullscreenElement || 
                       document.msFullscreenElement;
  
  if (!isFullscreen) {
    // Exit fullscreen black if fullscreen mode is exited
    exitFullscreenBlack();
  }
}

// Handle ESC key to exit fullscreen black
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('fullscreen-black')) {
    exitFullscreenBlack();
  }
});

// Button sprite functionality
function initButtonSprites() {
  const buttons = document.querySelectorAll('.portfolio-button');
  
  buttons.forEach(button => {
    const img = button.querySelector('img');
    if (!img) return;
    
    const defaultSrc = img.src;
    const hoverSrc = img.dataset.hover || defaultSrc;
    const pressedSrc = img.dataset.pressed || defaultSrc;
    
    // Preload hover and pressed images
    [hoverSrc, pressedSrc].forEach(src => {
      const preloadImg = new Image();
      preloadImg.src = src;
    });
    
    // Set button size to match scaled image for proper hover area
    const SCALE = 3;
    function setButtonSize() {
      if (img.naturalWidth && img.naturalHeight) {
        const scaledWidth = img.naturalWidth * SCALE;
        const scaledHeight = img.naturalHeight * SCALE;
        button.style.width = scaledWidth + 'px';
        button.style.height = scaledHeight + 'px';
        button.style.minWidth = scaledWidth + 'px';
        button.style.minHeight = scaledHeight + 'px';
        button.style.maxWidth = scaledWidth + 'px';
        button.style.maxHeight = scaledHeight + 'px';
        // Ensure button is centered
        button.style.marginLeft = 'auto';
        button.style.marginRight = 'auto';
      }
    }
    
    // Set size when image loads
    if (img.complete) {
      setButtonSize();
    } else {
      img.addEventListener('load', setButtonSize, { once: true });
    }
    
    let isHovering = false;
    let isPressed = false;
    
    function updateSprite() {
      if (isPressed) {
        img.src = pressedSrc;
      } else if (isHovering) {
        img.src = hoverSrc;
      } else {
        img.src = defaultSrc;
      }
    }
    
    // Mouse events
    button.addEventListener('mouseenter', () => {
      isHovering = true;
      updateSprite();
    });
    
    button.addEventListener('mouseleave', () => {
      isHovering = false;
      isPressed = false;
      updateSprite();
    });
    
    button.addEventListener('mousedown', (e) => {
      isPressed = true;
      updateSprite();
      e.preventDefault();
    });
    
    button.addEventListener('mouseup', () => {
      isPressed = false;
      updateSprite();
    });
    
    // Touch events
    button.addEventListener('touchstart', (e) => {
      isPressed = true;
      updateSprite();
      e.preventDefault();
    }, { passive: false });
    
    button.addEventListener('touchend', () => {
      isPressed = false;
      updateSprite();
    });
    
    button.addEventListener('touchcancel', () => {
      isPressed = false;
      updateSprite();
    });
    
    // Keyboard events
    button.addEventListener('focus', () => {
      isHovering = true;
      updateSprite();
    });
    
    button.addEventListener('blur', () => {
      isHovering = false;
      isPressed = false;
      updateSprite();
    });
    
    button.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        isPressed = true;
        updateSprite();
        e.preventDefault();
      }
    });
    
    button.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        isPressed = false;
        updateSprite();
      }
    });
  });
}

// Initialize on page load
window.addEventListener('load', () => {
  console.log('Maikeru website loaded');
  
  // Check if background image loads, if not show fallback
  const bgImage = document.getElementById('background-image');
  if (bgImage) {
    const testImg = new Image();
    testImg.onerror = () => {
      console.log('Background image not found, using fallback gradient');
      bgImage.style.opacity = '0';
    };
    testImg.src = 'assets/images/background.png';
  }
  
  // Initialize button sprites
  initButtonSprites();
});
