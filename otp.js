// OTP handling functions

function sendOTP(mobileNumber, callback) {
    // Mock OTP sending - in real implementation, call backend API
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`OTP sent to ${mobileNumber}: ${otp}`);
    
    // Store OTP temporarily (in production, this should be handled server-side)
    localStorage.setItem('currentOTP', otp);
    
    if (callback) callback(otp);
    return otp;
}

function verifyOTP(enteredOTP) {
    const storedOTP = localStorage.getItem('currentOTP');
    if (enteredOTP == storedOTP) {
        localStorage.removeItem('currentOTP');
        return true;
    }
    return false;
}

function showOTPModal() {
    const modal = document.getElementById('otpModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideOTPModal() {
    const modal = document.getElementById('otpModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Auto-focus OTP input
document.addEventListener('DOMContentLoaded', function() {
    const otpInput = document.getElementById('otpInput');
    if (otpInput) {
        otpInput.addEventListener('input', function() {
            if (this.value.length === 6) {
                // Auto-submit OTP
                verifyOTP(this.value);
            }
        });
    }
});
