// =============================================
// LAYOUT: Console vs Standalone
// =============================================
const consoleWrapper = document.getElementById('consoleWrapper');
const standaloneWrapper = document.getElementById('standaloneWrapper');
const formContainer = document.getElementById('formContainer');
const consoleFormSlot = document.getElementById('consoleFormSlot');
const standaloneFormSlot = document.getElementById('standaloneFormSlot');
let currentMode = null;

function updateLayout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Desktop condition for the Switch layout
    const showConsole = (w >= 1024 && h >= 1366);
    const mode = showConsole ? 'console' : 'standalone';

    if (mode === currentMode) return;
    currentMode = mode;

    if (showConsole) {
        consoleWrapper.classList.remove('is-hidden');
        standaloneWrapper.classList.add('is-hidden');
        if (formContainer) consoleFormSlot.appendChild(formContainer);
    } else {
        consoleWrapper.classList.add('is-hidden');
        standaloneWrapper.classList.remove('is-hidden');
        if (formContainer) standaloneFormSlot.appendChild(formContainer);
    }
}

// Initialize layout
document.addEventListener('DOMContentLoaded', updateLayout);
window.addEventListener('resize', updateLayout);

// =============================================
// Back to Top & Scroll Reveal
// =============================================
const btt = document.getElementById('backToTop');
if (btt) {
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.addEventListener('scroll', () => {
    if(btt) {
        if(window.scrollY > 400) btt.classList.add('visible');
        else btt.classList.remove('visible');
    }
}, { passive: true });

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { 
        if (e.isIntersecting) { 
            e.target.classList.add('visible'); 
            observer.unobserve(e.target); 
        } 
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// =============================================
// Form Validation & Handling
// =============================================
const messageEl = document.getElementById('message');
const charCount = document.getElementById('charCount');

if (messageEl && charCount) {
    messageEl.addEventListener('input', () => {
        const len = messageEl.value.length;
        charCount.textContent = `${len} / 2000`;
        if (len > 1800) charCount.classList.add('warn');
        else charCount.classList.remove('warn');
    });
}

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitSpinner = document.getElementById('submitSpinner');

function showFieldError(field, msg) {
    const wrapper = field.closest('.form-field');
    wrapper.classList.add('error', 'animate-shake');
    
    const errorElement = wrapper.querySelector('.error-msg');
    errorElement.textContent = msg;
    errorElement.classList.remove('is-hidden');
    
    setTimeout(() => wrapper.classList.remove('animate-shake'), 500);
}

function clearFieldError(field) {
    const wrapper = field.closest('.form-field');
    wrapper.classList.remove('error');
    const err = wrapper.querySelector('.error-msg');
    if (err) err.classList.add('is-hidden');
}

if (form) {
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => clearFieldError(field));
        field.addEventListener('change', () => clearFieldError(field));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let valid = true;
        
        form.querySelectorAll('.form-field').forEach(wrapper => {
            wrapper.classList.remove('error');
            const err = wrapper.querySelector('.error-msg');
            if(err) err.classList.add('is-hidden');
        });

        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const topic = form.querySelector('#topic');
        const message = form.querySelector('#message');

        if (!name.value.trim() || name.value.trim().length < 2) { 
            showFieldError(name, 'Please enter your name (at least 2 characters).'); 
            valid = false; 
        }
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { 
            showFieldError(email, 'Please enter a valid email address.'); 
            valid = false; 
        }
        if (!topic.value) { 
            showFieldError(topic, 'Please select a topic.'); 
            valid = false; 
        }
        if (!message.value.trim() || message.value.trim().length < 10) { 
            showFieldError(message, 'Please describe your issue (at least 10 characters).'); 
            valid = false; 
        }
        
        if (!valid) return;

        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        submitSpinner.classList.remove('is-hidden');
        
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (error) {
            console.error("Form submission failed:", error);
            alert("Oops! There was a problem submitting your form.");
            submitBtn.disabled = false;
            submitText.textContent = 'Submit Request';
            submitSpinner.classList.add('is-hidden');
            return;
        }

        submitBtn.disabled = false;
        submitText.textContent = 'Submit Request';
        submitSpinner.classList.add('is-hidden');
        form.reset();
        charCount.textContent = '0 / 2000';

        const modal = document.getElementById('successModal');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });
}

// =============================================
// Modal, FAQ, and Toasts
// =============================================
function closeModal() {
    const m = document.getElementById('successModal');
    if(m) {
        m.classList.remove('active');
        m.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

const successModal = document.getElementById('successModal');
if(successModal) {
    successModal.addEventListener('click', e => { 
        if (e.target === e.currentTarget) closeModal(); 
    });
}

document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') closeModal(); 
});

function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const chevron = btn.querySelector('.faq-chevron');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    
    document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
            other.querySelector('.faq-answer').style.maxHeight = '0';
            other.querySelector('.faq-chevron').style.transform = 'rotate(0deg)';
            other.querySelector('.faq-toggle').setAttribute('aria-expanded', 'false');
            other.classList.remove('active');
        }
    });
    
    if (isOpen) {
        answer.style.maxHeight = '0'; 
        chevron.style.transform = 'rotate(0deg)';
        btn.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px'; 
        chevron.style.transform = 'rotate(180deg)';
        btn.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!', 'check_circle'));
}

function showToast(msg, icon = 'check_circle') {
    const t = document.getElementById('toast');
    if(!t) return;
    document.getElementById('toastText').textContent = msg;
    document.getElementById('toastIcon').textContent = icon;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}