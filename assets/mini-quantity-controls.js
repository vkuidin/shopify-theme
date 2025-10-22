class MiniQuantityControls extends HTMLElement {
    constructor() {
        super();
        this.miniCart = this.closest('mini-cart');
        
        this.quantityInput = this.querySelector('[quantity-input]');
        this.itemId = this.quantityInput.getAttribute('id');
        this.maxQuantity = parseInt(this.quantityInput.getAttribute('max'), 10) || Infinity;

        this.increaseButton = this.querySelector('[quantity-increase]');
        this.decreaseButton = this.querySelector('[quantity-decrease]');
        this.removeButton = this.querySelector('[remove-item]');
    }

    connectedCallback() {
        this.increaseButton.addEventListener('click', this.handleIncrease.bind(this));
        this.decreaseButton.addEventListener('click', this.handleDecrease.bind(this));
        this.removeButton.addEventListener('click', this.handleRemove.bind(this));

        this.quantityInput.addEventListener('change', this.updateCart.bind(this));
    }

    handleIncrease() {
        const currentValue = parseInt(this.quantityInput.value, 10) || 0;
        if (currentValue < this.maxQuantity) {
            this.quantityInput.value = currentValue + 1;
            this.updateCart();
        }
    }

    handleDecrease() {
        const currentValue = parseInt(this.quantityInput.value, 10) || 0;
        if (currentValue > 1) {
            this.quantityInput.value = currentValue - 1;
            this.updateCart();
        }
    }

    handleRemove() {
        const currentValue = parseInt(this.quantityInput.value, 10) || 0;
        if (currentValue > 0) {
            this.quantityInput.value = 0;
            this.updateCart();
        }
    }

    async updateCart() {
        const quantity = parseInt(this.quantityInput.value, 10) || 0;
        try {
            const response = await fetch(`/cart/change.js`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.itemId,
                    quantity: quantity,
                })
            });
            await response.json();
            if (this.miniCart) {
                this.miniCart.openMiniCart({ open: false, updateBadge: true });
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    }

}

customElements.define('mini-quantity-controls', MiniQuantityControls);