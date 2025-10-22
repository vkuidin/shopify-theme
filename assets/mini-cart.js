class MiniCart extends HTMLElement {
    constructor() {
        super();
        this.openMiniCartButton = document.querySelector('[mini-cart-open]');
        this.cartCount = document.querySelector('[mini-cart-count]');
    }

    connectedCallback() {
        this.openMiniCartButton.addEventListener('click', this.openMiniCart.bind(this, { open: true, updateBadge: false }));
    }
    
    async fetchCart() {
        try {
            const response = await fetch('/cart.js');
            return await response.json();
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }

    async fetchMiniCartSection() {
        try {
            const response = await fetch('/?sections=mini-cart');
            const sectionData = await response.json();
            return sectionData['mini-cart'];
        } catch (error) {
            console.error('Error fetching mini-cart section:', error);
            throw error;
        }
    }

    async openMiniCart({ open = false, updateBadge = false } = {}) {
        try {
            if (updateBadge) {
                const cart = await this.fetchCart();
                this.updateBadgeCount(cart.item_count);
            }
            
            const html = await this.fetchMiniCartSection();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('#shopify-section-mini-cart .mini-cart')?.innerHTML;

            if (content) {
                this.innerHTML = content;
                if (open) {
                    setTimeout(() => {
                        this.classList.add('mini-cart--open');
                    }, 0);
                }
                this.addCloseHandler();
            }
        } catch (error) {
            console.error('Error refreshing mini cart:', error);
        }
    }
      

    addCloseHandler() {
        const closeBtn = this.querySelector('[mini-cart-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.closeMiniCart.bind(this));
        }
    }

    updateBadgeCount(count, ) {
        if (this.cartCount) {
            this.cartCount.textContent = count;
        } 
    }

    closeMiniCart() {
        this.classList.remove('mini-cart--open');
    }
}

customElements.define('mini-cart', MiniCart);