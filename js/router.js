let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'
  };
  
  function OnStartUp() {
    popStateHandler();
  }
  
  OnStartUp();

  document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
  });
  
  document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
  });
  
  document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
  });

  function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
      <h1 class="title">About Me</h1>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
  }
  
  function RenderContactPage() {
    document.querySelector('main').innerHTML = `
      <h1 class="title">Contact with me</h1>
      <form id="contact-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <div class="g-recaptcha" data-sitekey="6Lf6vCgrAAAAAB1xVaU9P3tY6IK4CJh9gwQYfwi3"></div>
        <button type="submit">Send</button>
      </form>`;
  
    document.getElementById('contact-form').addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Form submitted!');
    });
  }
  
  function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
      <h1 class="title">Gallery</h1>
      <div class="gallery" id="gallery"></div>
      <div class="modal" id="modal">
        <button id="closeModal">Close</button>
        <img id="modalImage" src="" alt="Big view">
      </div>
    `;
  
    const gallery = document.getElementById('gallery');
  
    for (let i = 1; i <= 9; i++) {
      const img = document.createElement('img');
      img.dataset.src = 'img/photo' + i + '.jpg';
      img.alt = 'Photo ' + i;
      img.loading = 'lazy';
      img.addEventListener('click', () => openModal(img.dataset.src));
      gallery.appendChild(img);
    }
  
    lazyLoadImages();
  
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') closeModal();
    });
  }


    function lazyLoadImages() {
      const images = document.querySelectorAll('img[data-src]');
      const options = { rootMargin: '50px', threshold: 0.01 };
    
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(async entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            try {
              const response = await fetch(img.dataset.src);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);
              img.src = imageUrl;
            } catch (err) {
              console.error("Błąd ładowania obrazu:", err, img.dataset.src);
              img.alt = "Nie udało się załadować";
            }
            observer.unobserve(img);
          }
        });
        
      }, options);
    
      images.forEach(img => observer.observe(img));
    }
    
    



  function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImage.src = src;
  }
  
  function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    modalImage.src = '';
  }
  

  function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
    if (loc === pageUrls.contact) { RenderContactPage(); }
    if (loc === pageUrls.about) { RenderAboutPage(); }
    if (loc === pageUrls.gallery) { RenderGalleryPage(); }
  }

  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
  
  window.onpopstate = popStateHandler;
  