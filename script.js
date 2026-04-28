// 1. Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

// Update cursor position smoothly
document.addEventListener('mousemove', (e) => {
    // Dot follows exactly
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    
    // Glow follows with slight interpolation delay via css transiton
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorGlow.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorGlow.style.opacity = '1';
});

// 2. Magnetic Buttons & Hover States
const magnetics = document.querySelectorAll('.magnetic, .magnetic-container, .magnetic-lift');

magnetics.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
    });

    elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
        if(elem.classList.contains('glass-card')) {
            elem.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            elem.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        } else {
            elem.style.transform = '';
            elem.style.transition = 'transform 0.5s ease-out';
        }
    });

    elem.addEventListener('mousemove', (e) => {
        const bound = elem.getBoundingClientRect();
        
        if(elem.classList.contains('glass-card')) {
            const x = e.clientX - bound.left;
            const y = e.clientY - bound.top;
            
            const centerX = bound.width / 2;
            const centerY = bound.height / 2;
            
            // Map limits strongly to create a premium subtle 3D tilt
            const rotateX = ((y - centerY) / centerY) * -6; 
            const rotateY = ((x - centerX) / centerX) * 6;
            
            elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            elem.style.transition = 'none'; // Instant snappy tracking
        } else {
            // Apply standard magnetic to icons/nav
            const x = e.clientX - bound.left - bound.width / 2;
            const y = e.clientY - bound.top - bound.height / 2;
            const strength = 12;
            elem.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
            elem.style.transition = 'none';
        }
    });
});

// 3. Typewriter Effect Logic for Hero
const textStr = "Bhushan Wayal";
let j = 0;
const textDisplay = document.querySelector('.typewriter');

function typeout() {
    if (j <= textStr.length) {
        textDisplay.innerHTML = textStr.substring(0, j);
        j++;
        setTimeout(typeout, 120);
    }
}
// Start typing effect on load
setTimeout(typeout, 800);

// 4. Scroll Reveal Animations (AOS Staggering using IntersectionObserver)
// Track elements to trigger them when they enter viewport
const revealItems = document.querySelectorAll('.reveal-item, .reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            // Apply weightless slide-up
            entry.target.classList.add('active');
            // Unobserve to only animate once
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealItems.forEach(el => {
    revealObserver.observe(el);
});

// 5. Header Scrolled State
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if(window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 6. Terminal Overlay Logic
const terminalBtns = [document.getElementById('terminal-btn'), document.getElementById('hero-terminal-btn')];
const terminalOverlay = document.getElementById('terminal-overlay');
const closeTerminalBtn = document.getElementById('close-terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');

const openTerminal = (e) => {
    if(e) e.preventDefault();
    terminalOverlay.classList.remove('hidden');
    setTimeout(() => terminalInput.focus(), 100);
};

const closeTerminal = () => {
    terminalOverlay.classList.add('hidden');
    terminalInput.value = '';
};

terminalBtns.forEach(btn => {
    if(btn) btn.addEventListener('click', openTerminal);
});

closeTerminalBtn.addEventListener('click', closeTerminal);
terminalOverlay.addEventListener('click', (e) => {
    // Only close if clicking exactly on overlay background
    if(e.target === terminalOverlay) closeTerminal();
});

// JSON formatting helper for terminal output
const formatJSON = (obj) => {
    const jsonStr = JSON.stringify(obj, null, 2);
    // Add simple syntax highlighting
    return jsonStr.replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
                  .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>');
};

// File system / profile data
const sysData = {
    'whoami': formatJSON({
        name: "Bhushan Wayal",
        title: "Systems & Security Engineer",
        focus: ["Infrastructure Scale", "Zero-Trust", "Deep Packet Inspection", "Post-Quantum Auth"],
        location: "IIIT Bhopal",
        status: "Active"
    }),
    'skills': `
CORE EXPERTISE:
> Systems & Cloud: Linux/Unix, Distributed Sys, AWS/GCP
> Languages: C/C++17, Python, Bash, Node.js, SQL
> Security: DPI, Post-Quantum Crypto (BFV), VAPT
> Observability: Prometheus, Grafana, Log Parsing
    `
};

const helpData = `
Available commands:
  whoami     - Output user profile metadata (JSON)
  skills     - List core engineering capabilities
  clear      - Clear terminal buffer
  help       - Show this reference
  exit       - Terminate local session
`;

const processCommand = (cmdStr) => {
    const cmd = cmdStr.trim().toLowerCase();
    
    // Echo the prompt + command
    const promptLine = document.createElement('div');
    promptLine.innerHTML = `<span class="prompt">guest@sys:~$</span> ${cmdStr}`;
    terminalOutput.appendChild(promptLine);

    if (cmd === '') return;
    
    if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
        return;
    }

    if (cmd === 'exit') {
        closeTerminal();
        return;
    }

    const outputDiv = document.createElement('div');
    
    if (cmd === 'help') {
        outputDiv.className = 'cmd-output';
        outputDiv.textContent = helpData;
    } else if (sysData[cmd]) {
        outputDiv.className = 'cmd-output';
        // Use innerHTML because sysData might contain syntax highlighted spans
        outputDiv.innerHTML = sysData[cmd];
    } else {
        outputDiv.className = 'cmd-error';
        outputDiv.textContent = `bash: ${cmd}: command not found`;
    }

    terminalOutput.appendChild(outputDiv);
    
    // Keep scrolled to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
};

terminalInput.addEventListener('keydown', function(e) {
    if(e.key === 'Enter') {
        processCommand(this.value);
        this.value = '';
    }
});

// Always keep focus on input when clicking inside terminal
terminalBody.addEventListener('click', () => {
    terminalInput.focus();
});
