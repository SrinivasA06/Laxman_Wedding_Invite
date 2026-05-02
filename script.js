document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // RSVP Form Submission Handling
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const scriptURL = 'https://script.google.com/macros/s/AKfycbxrvS3sHpkBXzq-Ywb-N-vSt3hgiPmU76HmQ2AHuD4fEfmTluZvAtH1mjZFuwa_JL6C/exec';
            const submitBtn = rsvpForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Build URL-encoded payload from the form fields
            const params = new URLSearchParams({
                name: rsvpForm.querySelector('[name="name"]').value,
                attendance: rsvpForm.querySelector('[name="attendance"]:checked')?.value || '',
                guests: rsvpForm.querySelector('[name="guests"]').value,
                message: rsvpForm.querySelector('[name="message"]').value
            });

            // no-cors + URLSearchParams (no custom headers) is the only way
            // to POST to Google Apps Script from a browser reliably
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: params
            })
                .then(() => {
                    rsvpForm.style.display = 'none';
                    const rsvpText = document.querySelector('.rsvp-text');
                    if (rsvpText) rsvpText.style.display = 'none';
                    document.getElementById('rsvp-success').style.display = 'block';
                })
                .catch(error => {
                    console.error('RSVP error:', error.message);
                    alert('Oops! Something went wrong. Please try again.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});
