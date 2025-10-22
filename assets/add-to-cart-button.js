class AddToCartButton extends HTMLElement {
    constructor() {
        super();
        this.miniCart = document.querySelector('mini-cart');
        this.quantityInput = document.getElementById('product-quantity-input');

        this.variantsScript = this.querySelector('#product-variants-json');
        this.variants = [];

        this.addToCart = this.addToCart.bind(this);
    }
    
    connectedCallback() {
        this.getVariantOptions();
        this.addEventListener('click', this.addToCart);
    }

    getVariantOptions() {
        if (this.variantsScript) {
            const parsedData = JSON.parse(this.variantsScript.textContent);
            this.variants = parsedData.productInfo;
        }
    }

    getMatchingVariantId() {
        const selectedOptions = Array.from(document.querySelectorAll('.product-variant__input:checked')).map(input => input.value);
        const matchingVariant = this.variants.find(variant =>
            variant.options.every((opt, i) => opt === selectedOptions[i])
        );
        
        return matchingVariant ? matchingVariant.id : null;
    }

    startLoading() {
        const buttonText = this.querySelector('[add-button-text]');
        this.classList.add('loading');
        buttonText.textContent = 'Додається до кошика';
        this.disabled = true;
    }

    stopLoading() {
        const buttonText = this.querySelector('[add-button-text]');
        this.classList.remove('loading');
        buttonText.textContent = 'Додати в кошик';
        this.disabled = false;
    }
  
    async addToCart() {
        const variantId = this.getMatchingVariantId();
        const quantity = parseInt(this.quantityInput?.value || '1', 10);

        this.startLoading();

        try {
            const res = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    id: variantId,
                    quantity: quantity
                })
            });

            if (!res.ok) throw new Error();

            await res.json();
            this.stopLoading();
            this.miniCart.openMiniCart({ open: true, updateBadge: true });
        } catch (error) {
            this.stopLoading();
            alert('Помилка при додаванні');
        }
    }
}
  
customElements.define('add-to-cart-button', AddToCartButton);
