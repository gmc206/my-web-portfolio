// Kwak Minchul Portfolio Interactivity Scripts

document.addEventListener('DOMContentLoaded', () => {
    initCanvasBackground();
    initChartDashboard();
    initScrollAnimations();
    initMobileNav();
});

/* 1. Canvas Particle Background */
function initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000)); // density based
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${this.alpha})`;
            ctx.fill();
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update & Draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connections
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.15;
                    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                }
            }
        }
        ctx.stroke();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* 2. Interactive Charts & Control Panel Dashboard */
function initChartDashboard() {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    
    const datasetSelect = document.getElementById('dataset-select');
    const thresholdSlider = document.getElementById('model-threshold');
    const thresholdVal = document.getElementById('threshold-val');
    
    const precisionEl = document.getElementById('metric-precision');
    const recallEl = document.getElementById('metric-recall');
    const roiEl = document.getElementById('metric-roi');
    
    // Dataset Configurations
    const dataConfigs = {
        churn: {
            type: 'line',
            labels: ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
            datasets: [
                {
                    label: 'Precision (정밀도)',
                    data: [0.35, 0.42, 0.55, 0.68, 0.79, 0.87, 0.92, 0.96, 0.98, 0.99, 1.0],
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Recall (재현율)',
                    data: [1.0, 0.99, 0.97, 0.94, 0.89, 0.82, 0.70, 0.54, 0.35, 0.18, 0.0],
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } }
                },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, min: 0, max: 1 }
                }
            }
        },
        revenue: {
            type: 'line',
            labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1(P)', 'Q2(P)', 'Q3(P)', 'Q4(P)'],
            datasets: [
                {
                    label: '실제 매출 (₩억)',
                    data: [12, 14.5, 13.8, 17.2, null, null, null, null],
                    borderColor: '#06b6d4',
                    backgroundColor: '#06b6d4',
                    pointRadius: 6
                },
                {
                    label: 'AI 예측 매출 (₩억)',
                    data: [12, 14.2, 14.0, 16.9, 18.5, 19.8, 22.0, 24.5],
                    borderColor: '#a855f7',
                    borderDash: [5, 5],
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    fill: false
                }
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } }
                },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
                }
            }
        },
        marketing: {
            type: 'bar',
            labels: ['Search Ads', 'Social Media', 'Display Ads', 'Referrals', 'Email Marketing'],
            datasets: [
                {
                    label: '지출 비용 (₩백만)',
                    data: [15, 24, 8, 5, 3],
                    backgroundColor: 'rgba(6, 182, 212, 0.6)',
                    borderColor: '#06b6d4',
                    borderWidth: 1
                },
                {
                    label: '획득 매출 (₩백만)',
                    data: [35, 68, 12, 18, 14],
                    backgroundColor: 'rgba(168, 85, 247, 0.6)',
                    borderColor: '#a855f7',
                    borderWidth: 1
                }
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } }
                },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
                }
            }
        }
    };
    
    // Create Chart Instance
    let myChart = new Chart(ctx, {
        type: dataConfigs.churn.type,
        data: {
            labels: dataConfigs.churn.labels,
            datasets: dataConfigs.churn.datasets
        },
        options: dataConfigs.churn.options
    });
    
    // Recalculate Metrics based on Slider Threshold
    function updateChurnMetrics(val) {
        const thresholdIndex = Math.round(val * 10);
        
        // Simulated calculations
        const pVal = dataConfigs.churn.datasets[0].data[thresholdIndex];
        const rVal = dataConfigs.churn.datasets[1].data[thresholdIndex];
        
        precisionEl.innerText = `${(pVal * 100).toFixed(1)}%`;
        recallEl.innerText = `${(rVal * 100).toFixed(1)}%`;
        
        // Calculate simulated business ROI (bell curve layout maximized around 0.5 - 0.6)
        // ROI formula mapping
        const roi = (-100 * Math.pow(val - 0.55, 2) + 22).toFixed(1);
        roiEl.innerText = `${roi > 0 ? '+' : ''}${roi}%`;
    }
    
    // Handle slider change
    thresholdSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        thresholdVal.innerText = val.toFixed(2);
        
        if (datasetSelect.value === 'churn') {
            updateChurnMetrics(val);
        }
    });
    
    // Handle dropdown selection
    datasetSelect.addEventListener('change', (e) => {
        const currentData = dataConfigs[e.target.value];
        
        // Destroy and rebuild chart
        myChart.destroy();
        myChart = new Chart(ctx, {
            type: currentData.type,
            data: {
                labels: currentData.labels,
                datasets: currentData.datasets
            },
            options: currentData.options
        });
        
        // Enable/Disable slider depending on data type
        if (e.target.value === 'churn') {
            thresholdSlider.disabled = false;
            document.querySelector('.control-group:nth-child(2)').style.opacity = '1';
            updateChurnMetrics(parseFloat(thresholdSlider.value));
        } else {
            thresholdSlider.disabled = true;
            document.querySelector('.control-group:nth-child(2)').style.opacity = '0.4';
            
            if (e.target.value === 'revenue') {
                precisionEl.innerText = '94.8%'; // MAPE Accuracy
                recallEl.innerText = '₩2.1억';  // Avg Dev
                roiEl.innerText = '+18.4%';
            } else {
                precisionEl.innerText = '3.2x'; // Average ROAS
                recallEl.innerText = '₩147M'; // Total Rev
                roiEl.innerText = '+220%';
            }
        }
    });
    
    // Initial run
    updateChurnMetrics(0.5);
}

/* 3. Skill progress bars animation when in viewport */
function initScrollAnimations() {
    const progressBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.width;
                
                // Temporarily reset to 0, then animate to target
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        skillsObserver.observe(bar);
    });
    
    // Header background transition on scroll
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(9, 13, 22, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            header.style.height = '70px';
        } else {
            header.style.background = 'rgba(9, 13, 22, 0.7)';
            header.style.boxShadow = 'none';
            header.style.height = '80px';
        }
    });
}

/* 4. Mobile Navigation menu toggle */
function initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (toggle && navLinksContainer) {
        toggle.addEventListener('click', () => {
            const isVisible = navLinksContainer.style.display === 'flex';
            if (isVisible) {
                navLinksContainer.style.display = 'none';
                toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            } else {
                navLinksContainer.style.display = 'flex';
                navLinksContainer.style.flexDirection = 'column';
                navLinksContainer.style.position = 'absolute';
                navLinksContainer.style.top = '80px';
                navLinksContainer.style.left = '0';
                navLinksContainer.style.width = '100%';
                navLinksContainer.style.background = 'rgba(9, 13, 22, 0.95)';
                navLinksContainer.style.padding = '2rem';
                navLinksContainer.style.borderBottom = '1px solid var(--border-color)';
                navLinksContainer.style.gap = '1.5rem';
                
                toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            }
        });
        
        // Close menu when clicking link
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinksContainer.style.display = 'none';
                    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
        });
    }
}
