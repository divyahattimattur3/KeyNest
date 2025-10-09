// UPI Payment handling functions

function initiateUPIPayment(amount, upiId, callback) {
    // Mock UPI payment initiation
    console.log(`Initiating UPI payment: Amount ${amount}, UPI ID: ${upiId}`);
    
    // In real implementation, integrate with UPI API
    // For now, simulate payment processing
    setTimeout(() => {
        const transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
        if (callback) callback(true, transactionId);
    }, 2000);
}

function showPaymentModal(amount) {
    const modal = document.getElementById('paymentModal');
    const amountSpan = document.getElementById('paymentAmount');
    
    if (modal && amountSpan) {
        amountSpan.textContent = amount;
        modal.style.display = 'flex';
    }
}

function hidePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function processUPIPayment() {
    const upiIdInput = document.getElementById('upiId');
    const amount = document.getElementById('paymentAmount').textContent;
    
    if (upiIdInput && upiIdInput.value) {
        const upiId = upiIdInput.value;
        
        // Show loading
        const submitBtn = document.querySelector('#paymentModal .btn-primary');
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        initiateUPIPayment(amount, upiId, function(success, transactionId) {
            submitBtn.textContent = 'Complete Payment';
            submitBtn.disabled = false;
            
            if (success) {
                alert(`Payment successful! Transaction ID: ${transactionId}`);
                hidePaymentModal();
                upiIdInput.value = '';
            } else {
                alert('Payment failed. Please try again.');
            }
        });
    } else {
        alert('Please enter a valid UPI ID');
    }
}

// Generate QR code for UPI payment (mock)
function generateUPIQR(amount) {
    // In real implementation, use a QR code library to generate UPI QR
    const qrContainer = document.querySelector('.upi-qr');
    if (qrContainer) {
        qrContainer.innerHTML = `
            <div style="width: 200px; height: 200px; background: #f0f0f0; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; text-align: center;">
                UPI QR Code<br>
                Amount: ${amount}<br>
                UPI ID: keynest@upi
            </div>
        `;
    }
}

// Auto-generate QR when payment modal opens
document.addEventListener('DOMContentLoaded', function() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (paymentModal.style.display === 'flex') {
                        const amount = document.getElementById('paymentAmount').textContent;
                        generateUPIQR(amount);
                    }
                }
            });
        });
        observer.observe(paymentModal, { attributes: true });
    }
});
