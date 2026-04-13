// ══════ SARA KHILJI | GODMODE ANIMATIONS ══════

// 1. Setup Smooth Scrolling (Lenis)
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
  smooth: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

// Helper: Split text into spans for animation
function splitTextWords(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const words = el.innerText.split(" ");
    el.innerHTML = "";
    words.forEach(word => {
      const span = document.createElement("span");
      span.innerHTML = word + "&nbsp;";
      span.classList.add("word");
      el.appendChild(span);
    });
  });
}
splitTextWords(".split-text");
splitTextWords(".split-lines");

// 2. Custom Magnetic Cursor
const cursor = document.querySelector('.cursor');
if (window.innerWidth > 768) {
  window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
  });
}

// 3. Preloader Intro Timeline
let introTl = gsap.timeline({
  onComplete: () => document.body.classList.remove("loading")
});

let counter = { val: 0 };
introTl.to(counter, {
  val: 100, duration: 1.5, ease: "power2.inOut",
  onUpdate: function() {
    document.querySelector('.preloader-counter').innerHTML = Math.round(counter.val) + "%";
  }
})
.to(".preloader", {
  yPercent: -100, duration: 1, ease: "power4.inOut"
})
.set(".mega-bg-img", { opacity: 1 })
.fromTo(".mega-bg-img", { scale: 1.5 }, { scale: 1, duration: 2, ease: "power3.out" }, "-=0.5")
// Let the FG photo scale down slightly from full screen just at the end of load
.fromTo(".mega-fg-inner", { width: "100vw", height: "100vh", borderRadius: "0px" }, { width: "100vw", height: "100vh", borderRadius: "0px", duration: 1, ease: "power4.out" }, "-=1")
.to(".mega-text", { opacity: 1, y: -20, duration: 1 }, "-=1");


// 4. HERO GODMODE SCROLL TRIGGER (The requested overlay effect)
// Scroll distance is 200vh (from mega-hero section)
let heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".mega-hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
    pin: true,
  }
});

// As we scroll, the foreground photo shrinks violently into a portrait card
heroTl.to(".mega-fg-inner", {
  width: window.innerWidth > 768 ? "30vw" : "80vw", // portrait width
  height: window.innerWidth > 768 ? "45vw" : "120vw", // portrait height
  borderRadius: "20px",
  y: "10vh", // shift it down a bit 
  ease: "power2.inOut"
}, 0);

// And the interior background scales up massively while brightening
heroTl.to(".mega-bg-img", {
  scale: 1.2,
  filter: "brightness(0.9)",
  ease: "power1.inOut"
}, 0);

// The SARA KHILJI text separates
heroTl.to(".mega-text", {
  scale: 1.5,
  letterSpacing: "2vw",
  opacity: 0,
  ease: "power2.inOut"
}, 0);

heroTl.to(".scroll-down-hint", { opacity: 0 }, 0);


// 5. INTRO KINETIC TEXT REVEAL
// Text flies in from 3D space
gsap.from(".intro-section .word", {
  scrollTrigger: {
    trigger: ".intro-section",
    start: "top 70%",
  },
  rotationX: 90,
  y: 100,
  z: -500,
  opacity: 0,
  stagger: 0.1,
  duration: 1.5,
  ease: "back.out(1.7)"
});

// 6. SKILLS 3D GLASS CARDS Reveal
// Pin the skills section
let skillsTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".skills-3d",
    start: "top top",
    end: "bottom top",
    scrub: 1,
    pin: ".skills-sticky"
  }
});

// Photo comes to life
skillsTl.to(".sara-vibe", { filter: "grayscale(0%) contrast(1)", scale: 1.1, duration: 1 }, 0);

// Glass cards smash in
skillsTl.fromTo(".top-left", { x: -200, opacity: 0, rotationY: -45 }, { x: 0, opacity: 1, rotationY: 0, duration: 1 }, 0.2);
skillsTl.fromTo(".bottom-right", { x: 200, opacity: 0, rotationY: 45 }, { x: 0, opacity: 1, rotationY: 0, duration: 1 }, 0.4);
skillsTl.fromTo(".top-right", { y: -200, opacity: 0, rotationX: 45 }, { y: 0, opacity: 1, rotationX: 0, duration: 1 }, 0.6);
skillsTl.fromTo(".bottom-left", { y: 200, opacity: 0, rotationX: -45 }, { y: 0, opacity: 1, rotationX: 0, duration: 1 }, 0.8);

// 7. HORIZONTAL PROJECTS GALLERY
const horizontalWrapper = document.querySelector('.horizontal-wrapper');
const slides = gsap.utils.toArray('.horizontal-slide');

// Use exact pixel calculation to avoid Lenis bugs
let totalWidth = horizontalWrapper.scrollWidth;

gsap.to(horizontalWrapper, {
  x: () => -(horizontalWrapper.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".projects-horizontal",
    start: "top top",
    end: () => "+=" + (horizontalWrapper.scrollWidth - window.innerWidth),
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    anticipatePin: 1 // helps with sticking bugs
  }
});

// Hover Parallax on Project Images
document.querySelectorAll(".proj-img-wrap").forEach(wrap => {
  wrap.addEventListener("mousemove", (e) => {
    if(window.innerWidth <= 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to(wrap.querySelector("img"), { x: x, y: y, scale: 1.1, duration: 0.5 });
  });
  wrap.addEventListener("mouseleave", () => {
    if(window.innerWidth <= 768) return;
    gsap.to(wrap.querySelector("img"), { x: 0, y: 0, scale: 1, duration: 0.5 });
  });
});

// 8. INSANE INTERACTIVE 3D POPUPS (Like Abigail Bloom)
const popup = document.querySelector('.insane-popup');
const popupBg = document.querySelector('.insane-popup-bg');
const popupContent = document.querySelector('.insane-popup-content');
const popupClose = document.querySelector('.popup-close');
const popupImg = document.querySelector('.popup-img');
const popupTitle = document.querySelector('.popup-title');
const popupDesc = document.querySelector('.popup-desc');

document.querySelectorAll('.proj-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    // Fill data
    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('h3').innerText;
    const desc = card.querySelector('p').innerText;
    
    popupImg.src = imgSrc;
    popupTitle.innerText = title;
    popupDesc.innerText = desc;

    // Trigger extreme animation
    popup.classList.add('active');
    lenis.stop(); // Freeze smooth scroll

    const popTl = gsap.timeline();
    popTl.to(popupBg, { opacity: 1, duration: 0.5, ease: "power2.out" })
         .to(popupContent, { 
            scale: 1, 
            rotationY: 0, 
            z: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: "elastic.out(1, 0.4)" 
         }, "-=0.3");
  });
});

// Close Popup
popupClose.addEventListener('click', () => {
  const popTl = gsap.timeline({
    onComplete: () => {
      popup.classList.remove('active');
      lenis.start(); // Resume scroll
    }
  });
  
  popTl.to(popupContent, { 
          scale: 0.5, 
          rotationY: -90, 
          z: -500, 
          opacity: 0, 
          duration: 0.6, 
          ease: "power3.in" 
       })
       .to(popupBg, { opacity: 0, duration: 0.4 }, "-=0.2");
});

// 9. FINAL CONTACT TEXT
gsap.from(".contact-ultra .word", {
  scrollTrigger: {
    trigger: ".contact-ultra",
    start: "top 80%",
  },
  y: 100,
  opacity: 0,
  stagger: 0.1,
  ease: "power4.out",
  duration: 1
});
