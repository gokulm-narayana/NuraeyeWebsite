document.addEventListener('DOMContentLoaded', () => {
    // Navbar logic has been moved to AppHeader in components.js

    // 4. Sequential Video Playback for Hero Section
    const heroVideo = document.getElementById('main-hero-video');
    if (heroVideo) {
        // List of video sources to loop through
        const videos = [
            'vedios/Video_Generation_Request_Fulfilled.mp4',
            'vedios/AI_Surveillance_of_Indian_Commuters.mp4',
            'vedios/Video_Generation_of_Jumping_on_Fence.mp4',
            'vedios/Video_Customization_Indian_People_Person_Display.mp4'
        ];
        let currentVideoIndex = 0;

        // When the current video ends, switch to the next one
        heroVideo.addEventListener('ended', () => {
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;

            // Fade out slightly
            heroVideo.style.opacity = 0.8;

            setTimeout(() => {
                heroVideo.src = videos[currentVideoIndex];
                heroVideo.load(); // Important: load the new source
                heroVideo.play().catch(e => console.log('Autoplay prevented:', e));

                // Fade back in
                heroVideo.style.opacity = 1;
            }, 200); // Small delay for smooth transition effect
        });
    }

    // 5. Contact Sales Form Character Counter
    const messageInput = document.getElementById('message');
    const messageCounter = document.getElementById('message-counter');

    if (messageInput && messageCounter) {
        messageInput.addEventListener('input', () => {
            const currentLength = messageInput.value.length;
            messageCounter.textContent = `${currentLength}/200`;

            if (currentLength >= 200) {
                messageCounter.style.color = '#ef4444'; // Red if maxed out
            } else {
                messageCounter.style.color = 'var(--text-muted)';
            }
        });
    }

    // 6. Contact Tabs
    const tabBtns = document.querySelectorAll('.contact-tab-btn');
    const tabContents = document.querySelectorAll('.contact-tab-content');

    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active to clicked button and target content
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // 7. Manage Personal vs Business form fields
    const userTypeRadios = document.querySelectorAll('input[name="user_type"]');
    const companySection = document.getElementById('company-details-section');
    const companyNameInput = document.getElementById('company_name');

    if (userTypeRadios.length > 0 && companySection) {
        userTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'personal') {
                    // Hide company section and remove required attribute
                    companySection.style.display = 'none';
                    if (companyNameInput) companyNameInput.removeAttribute('required');
                } else {
                    // Show company section and add required attribute
                    companySection.style.display = 'block';
                    if (companyNameInput) companyNameInput.setAttribute('required', 'required');
                }
            });
        });
    }

});

// 8. Product Image Gallery functionality
window.changeImage = function (thumbnailElement, imageSrc) {
    const mainImage = document.getElementById('main-product-image');
    if (!mainImage) return;

    // Smooth transition effect
    mainImage.style.opacity = '0.5';

    setTimeout(() => {
        mainImage.src = imageSrc;
        mainImage.style.opacity = '1';
    }, 150);

    // Update active state on thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnailElement.classList.add('active');
};

// Initialize automatic gallery rotation
document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    if (thumbnails.length > 0) {
        let currentImageIndex = 0;
        let galleryInterval;

        const startGallery = () => {
            galleryInterval = setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
                thumbnails[currentImageIndex].click();
            }, 3000); // 3 seconds interval
        };

        const stopGallery = () => clearInterval(galleryInterval);

        // Start the automatic rotation
        startGallery();

        // Pause rotation when user interacts with the gallery
        const gallery = document.querySelector('.product-gallery');
        if (gallery) {
            gallery.addEventListener('mouseenter', stopGallery);
            gallery.addEventListener('mouseleave', startGallery);
        }

        // Update the index if the user manually clicks a thumbnail
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                currentImageIndex = index;
            });
        });
    }
});

// 9. Contact Sales Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const salesForm = document.getElementById('sales-form');

    if (salesForm) {
        salesForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get the submit button to show loading state
            const submitBtn = salesForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Change button to loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Gather all form data
            const formData = new FormData(salesForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Send data to our local Flask backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Success! Show a success message
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
                    submitBtn.style.backgroundColor = '#10b981'; // Green color
                    submitBtn.style.borderColor = '#10b981';

                    // Reset form
                    salesForm.reset();

                    // Reset character counter if it exists
                    const messageCounter = document.getElementById('message-counter');
                    if (messageCounter) messageCounter.textContent = '0/200';

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                    }, 3000);

                } else {
                    // Server returned an error (e.g., authentication failed)
                    throw new Error(result.message || 'Server error occurred');
                }

            } catch (error) {
                console.error('Error submitting form:', error);

                // Show error state on button
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to Send';
                submitBtn.style.backgroundColor = '#ef4444'; // Red color
                submitBtn.style.borderColor = '#ef4444';

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                }, 3000);

                alert('Failed to send message: ' + error.message + '\n\nIf you are testing locally, make sure you have added your Google App Password to server.py and that the Flask server is running.');
            }
        });
    }
});

// 10. Industry Hero Sliders (generic — works on all solution pages)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero-slider[data-slider-id]').forEach(wrapper => {
        const id = wrapper.getAttribute('data-slider-id');
        const track = document.getElementById(id);
        const prevBtn = document.getElementById(id + '-prev');
        const nextBtn = document.getElementById(id + '-next');
        if (!track) return;

        const totalSlides = track.children.length;
        let currentIdx = 0;

        function goTo(idx) {
            currentIdx = (idx + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${currentIdx * 100}%)`;
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIdx - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIdx + 1));
        setInterval(() => goTo(currentIdx + 1), 5000);
    });
});

// 11. Interactive Features Accordion Showcase
document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.feature-accordion-item');
    const featureDisplayImage = document.getElementById('feature-display-image');

    if (accordionItems.length > 0 && featureDisplayImage) {
        accordionItems.forEach(item => {
            item.addEventListener('click', () => {
                // If this item is already active, do nothing (keep it open)
                if (item.classList.contains('active')) return;

                // Remove active class from all items
                accordionItems.forEach(acc => {
                    acc.classList.remove('active');
                });

                // Add active class to clicked item
                item.classList.add('active');

                // Get new image source
                const newImageSrc = item.getAttribute('data-image');

                if (newImageSrc) {
                    // Fade out
                    featureDisplayImage.style.opacity = '0.5';

                    setTimeout(() => {
                        featureDisplayImage.src = newImageSrc;
                        // Fade in
                        featureDisplayImage.style.opacity = '1';
                    }, 150);
                }
            });
        });
    }
});
