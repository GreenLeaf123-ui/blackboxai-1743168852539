document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('generate-image-form');
    const promptInput = document.getElementById('input-value');
    const imageContainer = document.getElementById('images-visible');
    const placeholderText = document.getElementById('imageContainerText');
    const generatedImage = document.getElementById('generated-image');
    const loadingSpinner = document.getElementById('loading-spinner');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const stylePresets = document.querySelectorAll('.style-preset');

    // Style presets handler
    stylePresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const currentPrompt = promptInput.value.trim();
            const style = preset.dataset.style;
            
            if (currentPrompt === '') {
                promptInput.value = `${style} aesthetic`;
            } else if (!currentPrompt.includes(style)) {
                promptInput.value = `${currentPrompt}, ${style} style`;
            }
            promptInput.focus();
        });
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = promptInput.value.trim();
        
        if (!prompt) return;

        // UI Loading state
        placeholderText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        generatedImage.classList.add('hidden');
        downloadBtn.classList.add('hidden');
        shareBtn.classList.add('hidden');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real implementation, this would call an actual AI image generation API
            // For demo purposes, we'll use Unsplash random images based on prompt keywords
            const keywords = extractKeywords(prompt);
            const imageUrl = `https://source.unsplash.com/random/800x800/?${keywords.join(',')}`;
            
            // Load the generated image
            generatedImage.src = imageUrl;
            generatedImage.alt = `AI Generated: ${prompt}`;
            
            generatedImage.onload = () => {
                loadingSpinner.classList.add('hidden');
                generatedImage.classList.remove('hidden');
                downloadBtn.classList.remove('hidden');
                shareBtn.classList.remove('hidden');
            };
            
            generatedImage.onerror = () => {
                throw new Error('Failed to load generated image');
            };
            
        } catch (error) {
            console.error('Image generation error:', error);
            placeholderText.textContent = 'Error generating image. Please try a different prompt.';
            placeholderText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    });

    // Download functionality
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = generatedImage.src;
        link.download = `aesthetic-ai-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Share functionality
    shareBtn.addEventListener('click', async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'My AI-Generated Aesthetic',
                    text: `Check out this "${promptInput.value}" artwork I created!`,
                    url: generatedImage.src,
                });
            } else {
                // Fallback for browsers without Web Share API
                const shareUrl = `${window.location.origin}?prompt=${encodeURIComponent(promptInput.value)}&image=${encodeURIComponent(generatedImage.src)}`;
                prompt('Copy this link to share your creation:', shareUrl);
            }
        } catch (err) {
            console.log('Sharing cancelled', err);
        }
    });

    // Helper function to extract keywords from prompt
    function extractKeywords(prompt) {
        const commonWords = ['the', 'a', 'an', 'in', 'on', 'at', 'and', 'or', 'but'];
        const words = prompt.toLowerCase().split(/\s+/);
        
        return words
            .filter(word => word.length > 2 && !commonWords.includes(word))
            .map(word => word.replace(/[^a-z0-9]/g, ''));
    }
});