 /* ===================================
           SLIDER CLASS - Main Logic
        =================================== */
        class ImageSlider {
            constructor(container, options = {}) {
                // Get DOM elements
                this.container = container;
                this.track = container.querySelector('.slides-track');
                this.slides = Array.from(container.querySelectorAll('.slide'));
                this.prevBtn = container.querySelector('.prev-btn');
                this.nextBtn = container.querySelector('.next-btn');
                this.dotsContainer = container.querySelector('.dots-container');
                
                // Slider state
                this.currentIndex = 0;
                this.totalSlides = this.slides.length;
                
                // Configuration options with defaults
                this.config = {
                    autoSlide: options.autoSlide !== false, // Auto-slide enabled by default
                    interval: options.interval || 4000, // 4 seconds default
                    pauseOnHover: options.pauseOnHover !== false // Pause on hover by default
                };
                
                // Auto-slide timer reference
                this.autoSlideTimer = null;
                
                // Initialize the slider
                this.init();
            }

            /* Initialize slider components */
            init() {
                this.createDots();
                this.attachEventListeners();
                this.updateSlider();
                
                // Start auto-slide if enabled
                if (this.config.autoSlide) {
                    this.startAutoSlide();
                }
            }

            /* Create navigation dots dynamically */
            createDots() {
                this.slides.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (index === 0) dot.classList.add('active');
                    
                    // Add click handler to each dot
                    dot.addEventListener('click', () => this.goToSlide(index));
                    
                    this.dotsContainer.appendChild(dot);
                });
                
                this.dots = Array.from(this.dotsContainer.querySelectorAll('.dot'));
            }

            /* Attach all event listeners */
            attachEventListeners() {
                // Navigation button clicks
                this.prevBtn.addEventListener('click', () => this.previousSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
                
                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.previousSlide();
                    if (e.key === 'ArrowRight') this.nextSlide();
                });
                
                // Pause on hover functionality
                if (this.config.pauseOnHover) {
                    this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
                    this.container.addEventListener('mouseleave', () => {
                        if (this.config.autoSlide) this.startAutoSlide();
                    });
                }

                // Touch/swipe support for mobile
                this.addTouchSupport();
            }

            /* Add touch/swipe functionality for mobile devices */
            addTouchSupport() {
                let startX = 0;
                let endX = 0;
                
                this.track.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });
                
                this.track.addEventListener('touchend', (e) => {
                    endX = e.changedTouches[0].clientX;
                    this.handleSwipe(startX, endX);
                });
            }

            /* Handle swipe gestures */
            handleSwipe(startX, endX) {
                const threshold = 50; // Minimum swipe distance in pixels
                const diff = startX - endX;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.nextSlide(); // Swipe left - next slide
                    } else {
                        this.previousSlide(); // Swipe right - previous slide
                    }
                }
            }

            /* Navigate to next slide */
            nextSlide() {
                this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
                this.updateSlider();
                this.resetAutoSlide();
            }

            /* Navigate to previous slide */
            previousSlide() {
                this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
                this.updateSlider();
                this.resetAutoSlide();
            }

            /* Navigate to specific slide */
            goToSlide(index) {
                this.currentIndex = index;
                this.updateSlider();
                this.resetAutoSlide();
            }

            /* Update slider position and active states */
            updateSlider() {
                // Calculate transform value
                const translateX = -this.currentIndex * 100;
                this.track.style.transform = `translateX(${translateX}%)`;
                
                // Update active dot
                this.dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }

            /* Start automatic sliding */
            startAutoSlide() {
                this.stopAutoSlide(); // Clear any existing timer
                this.autoSlideTimer = setInterval(() => {
                    this.nextSlide();
                }, this.config.interval);
            }

            /* Stop automatic sliding */
            stopAutoSlide() {
                if (this.autoSlideTimer) {
                    clearInterval(this.autoSlideTimer);
                    this.autoSlideTimer = null;
                }
            }

            /* Reset auto-slide timer (called after manual navigation) */
            resetAutoSlide() {
                if (this.config.autoSlide) {
                    this.startAutoSlide();
                }
            }

            /* Destroy slider instance (cleanup) */
            destroy() {
                this.stopAutoSlide();
                // Remove event listeners and clean up
                this.prevBtn.removeEventListener('click', () => this.previousSlide());
                this.nextBtn.removeEventListener('click', () => this.nextSlide());
            }
        }

        /* ===================================
           INITIALIZE SLIDER
        =================================== */
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            const sliderContainer = document.querySelector('.slider-container');
            
            // Create slider instance with custom options
            const slider = new ImageSlider(sliderContainer, {
                autoSlide: true,      // Enable auto-slide
                interval: 5000,       // 5 seconds between slides
                pauseOnHover: true    // Pause when user hovers over slider
            });
            
            // Optional: Make slider instance globally accessible for debugging
            window.slider = slider;
        });