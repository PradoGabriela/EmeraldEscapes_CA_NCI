
document.addEventListener('DOMContentLoaded',function(){

    //Variables
    var navButtonMobile = document.getElementById('nav-btn-mobile');
    var sideNav = document.getElementById('side-nav'); 

    //First Check if the elements exist
   if(!navButtonMobile || !sideNav){
        console.error("Elements not found");
        return;
    }
  
    //Function to toggle the side nav
    function setMobileMenu(open) {
        sideNav.classList.toggle('isOpen', open);
        navButtonMobile.classList.toggle('isOpen', open);

        navButtonMobile.setAttribute('aria-expanded', String(open));
        navButtonMobile.setAttribute('aria-label', open ? 'Close nav' : 'Open nav');
        
        document.documentElement.classList.toggle('noScroll', open);
        document.body.classList.toggle('noScroll', open);

    }

    //Listeners

    //Toggle menu when clicked
    navButtonMobile.addEventListener('click', function () {
    setMobileMenu(!sideNav.classList.contains('isOpen'));
    });
    
    //Close Menu if clicked another link 
    sideNav.addEventListener('click', function (event) {
      if (event.target === sideNav || event.target.closest('a')) setMobileMenu(false);
    });

    //Close when using escape 
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && sideNav.classList.contains('isOpen')) setMobileMenu(false);
    });
    




    //Change color theme behaviour
    //Fisrt get the currentTheme or use light as default
    let currentTheme = localStorage.getItem("theme") || "light";

   
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.style.colorScheme = theme;

        //save
        localStorage.setItem("theme", theme);
        currentTheme = theme;

        // Update Switches
        const themeSwitches = document.querySelectorAll(".theme-switch");

        themeSwitches.forEach((element) => {
            element.checked = theme === "dark";
        });
    }

    //Applying when loading the screen
    applyTheme(currentTheme);

    // Switch listener
    const themeSwitches = document.querySelectorAll(".theme-switch");
    themeSwitches.forEach((element) => {
        element.addEventListener("change", () => {
            const selectedTheme = element.checked ? "dark" : "light";
            applyTheme(selectedTheme);
        });
    });



//Carousel hero strip and experiences

    const strip = document.querySelector('.carousel-strip');
    const container = document.querySelector('.carousel-container');

    if (strip && container) 
        {
            // Original images backup
            const originalSlidesImage = Array.from(container.children);

            if (originalSlidesImage.length === 0) return;

            // Duplicate slides for continuous scrolling
            originalSlidesImage.forEach(function (slide) {
                strip.appendChild(slide.cloneNode(true));
            });
                
            document.querySelectorAll(".theme-container").forEach(container => {

                const carousel = container.querySelector(".experience-carousel");
                const nextBtn = container.querySelector(".right-btn");
                const prevBtn = container.querySelector(".left-btn");

                nextBtn.addEventListener("click", () => {
                    carousel.scrollBy({
                        left: carousel.clientWidth * 0.8,
                        behavior: "smooth"
                    });
                });

                prevBtn.addEventListener("click", () => {
                    carousel.scrollBy({
                        left: -carousel.clientWidth * 0.8,
                        behavior: "smooth"
                    });
                });

            });
        }

    

         //Main Experiences cards behaviour
        document.querySelectorAll(".experiences-main-card").forEach((card) => {
            const button = card.querySelector(".expand-card-btn");
            const buttonText = card.querySelector('.expand-card-btn .btn-text');
            const details = card.querySelector(".experience-details");

            button.addEventListener("click", () => {
                const shouldExpand =
                    button.getAttribute("aria-expanded") !== "true";

                // Expand or collapse the card
                card.classList.toggle("expanded", shouldExpand);
                details.hidden = !shouldExpand;

                button.setAttribute("aria-expanded", String(shouldExpand));
                buttonText.textContent = shouldExpand ? "Show Less" : "Show More";

                //translate the user view when showing more information
            requestAnimationFrame(()=> {
                    card.scrollIntoView({
                        behavior: "smooth",
                        block:"start"
                    })
                })
        
            });
        });


    //Redirecting from experiences page to contact
        const params = new URLSearchParams(window.location.search);
        const experience = params.get("experience");

        if (experience) {
            document.getElementById("form-experience").value = experience;
        }
            


    //Experiences Filter Logic
    
        // Getting all the experiences cards and filters
        const experienceCards = document.querySelectorAll(".experiences-main-card");
        const locationFilter = document.getElementById("location-filter");
        const typeFilter = document.getElementById("type-filter");
        const priceFilter = document.getElementById("price-filter");

        function filterExperiences() {

            // Get the selected filter values
            const selectedLocation = locationFilter.value;
            const selectedType = typeFilter.value;
            const selectedPrice = priceFilter.value;

            experienceCards.forEach((card) => {

                // Read the card's data attributes
                const location = card.dataset.location;
                const types = card.dataset.types.split(" ");

                const minPrice = Number(card.dataset.minPrice);
                const maxPrice = Number(card.dataset.maxPrice);


                const matchesLocation =
                    selectedLocation === "all" ||
                    location === selectedLocation;

           
                const matchesType =
                    selectedType === "all" ||
                    types.includes(selectedType);

            
                let matchesPrice = true;
                if (selectedPrice === "budget") {
                    matchesPrice = minPrice < 50;

                } else if (selectedPrice === "moderate") {
                    matchesPrice = minPrice <= 100 && maxPrice >= 50;

                } else if (selectedPrice === "premium") {
                    matchesPrice = minPrice <= 250 && maxPrice >= 101;

                } else if (selectedPrice === "luxury") {
                    matchesPrice = maxPrice > 250;
                }

                //Boolean to confirm the choices
                const shouldShow =
                    matchesLocation &&
                    matchesType &&
                    matchesPrice;

                card.hidden = !shouldShow;

                // If the cards are hidden needs to be collapsed
                if (!shouldShow) {
                    const details = card.querySelector(".experience-details");
                    const button = card.querySelector(".expand-card-btn");
                    const buttonText = button?.querySelector(".btn-text");

                    if (details) {
                        details.hidden = true;
                    }
                    card.classList.remove("expanded");

                    if (button) {
                        button.setAttribute("aria-expanded", "false");
                    }
                    if (buttonText) {
                        buttonText.textContent = "Show More";
                    }
                }
            });
        }


        //Add Listeners(Experiences page)
        if(locationFilter && typeFilter && priceFilter){
            locationFilter.addEventListener("change", filterExperiences);
            typeFilter.addEventListener("change", filterExperiences);
            priceFilter.addEventListener("change", filterExperiences);

            //Apply Starting Filters
            filterExperiences();
        }



        //Contact for logic

        //Variables
        const experiencePrices = {
            "not-decided": 0,
            "the-giants-causeway-quest": 89,
            "the-enchanted-fairy-trail": 45,
            "dublins-dark-legends": 25,
            "the-lovers-legend-escape": 399,
            "the-children-of-lir-adventure": 59,
            "queen-maeves-warrior-trail": 79,
            "the-banshees-midnight-mystery": 29,
            "secrets-of-the-ancient-celts": 99,
            "selkie-secrets-of-the-wild-atlantic": 89,
            "the-leprechauns-lost-treasure": 35,
            "a-night-of-castle-legends": 299,
            "journey-to-tir-na-nog": 499,
            "the-pirate-queens-coastal-adventure": 129,
            "the-haunted-west-road-trip": 249,
            "celtic-legends-weekend": 199
        };

        // Discounts
        const studentDiscount = 0.10;
        const childDiscount= 0.30;

        // Form elements
        const experienceSelect = document.getElementById("form-experience");
        const adultsInput = document.getElementById("adults");
        const childrenInput = document.getElementById("children");
        const studentsInput = document.getElementById("students");
        const personsFields = document.querySelector('.persons-fields');
        const pricePreview = document.querySelector('.price-preview');

        // Fix price formatting
         function formatPrice(amount) {
            return "€" + Math.round(amount);
        }

        // Compute price
        function updatePrice() {

            const basePrice = experiencePrices[experienceSelect.value];

            // If no experience is selected, show zero
            if (basePrice === undefined || basePrice===0) {
                document.getElementById("adult-price").textContent = formatPrice(0);
                document.getElementById("children-price").textContent = formatPrice(0);
                document.getElementById("student-price").textContent = formatPrice(0);
                document.getElementById("total-price").textContent = formatPrice(0);
                personsFields.classList.add("hidden");
                pricePreview.classList.add("hidden");
                return;
            }
            else{
                personsFields.classList.remove("hidden");
                pricePreview.classList.remove("hidden");
                
            }

            // Get persons quantity
            const adults = Number(adultsInput.value) || 0;
            const children = Number(childrenInput.value) || 0;
            const students = Number(studentsInput.value) || 0;

            // compute discount
            const childPrice = basePrice * (1 - childDiscount);
            const studentPrice = basePrice * (1 - studentDiscount);

            // compute subtotals
            const adultTotal = adults * basePrice;
            const childrenTotal = children * childPrice;
            const studentsTotal = students * studentPrice;

            // compute total
            const total = adultTotal + childrenTotal + studentsTotal;

            //Show cost
            document.getElementById("adult-price").textContent =
                formatPrice(adultTotal);

            document.getElementById("children-price").textContent =
                formatPrice(childrenTotal);

            document.getElementById("student-price").textContent =
                formatPrice(studentsTotal);

            document.getElementById("total-price").textContent =
                formatPrice(total);
        }

        //Listeners
        if(experienceSelect && adultsInput && childrenInput && studentsInput)
        {
                experienceSelect.addEventListener("change", updatePrice);
                adultsInput.addEventListener("input", updatePrice);
                childrenInput.addEventListener("input", updatePrice);
                studentsInput.addEventListener("input", updatePrice);
               
                //Initial update
                updatePrice();
        }


       //Contact form validation

       function showFormError(id){
            document.getElementById(id).classList.remove("hidden");
       }

       function hideFormError(id){
            document.getElementById(id).classList.add("hidden");
       }

       const contactForm =  document.getElementById("contact-form")

       if(contactForm)
       {
            contactForm.addEventListener("submit", function(event) {
                event.preventDefault();

                let name = document.getElementById("form-name").value.trim();
                let email = document.getElementById("form-email").value.trim();
                let number = document.getElementById("form-number").value.trim();
                let message = document.getElementById("form-message").value.trim();
                let experienceType = document.getElementById("form-experience").value;

                let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                let phonePattern =  /^\+?[0-9 ]{9,20}$/;
                let isValid = true;

                if(name === "" || name.length < 3){
                    showFormError("name-error");
                    isValid = false;
                }else{
                     hideFormError("name-error");
                    isValid = true;
                }

                if(email === "" || !emailPattern.test(email)){
                    showFormError("email-error");
                    isValid = false;
                }else{
                    hideFormError("email-error");
                    isValid = true;
                }

                if(number === "" || !phonePattern.test(number) || number.length < 10){
                    showFormError("number-error");
                    isValid = false;
                }else{
                     hideFormError("number-error");
                    isValid = true;
                }

                if(message.length < 20){
                    showFormError("message-error");
                    isValid = false;
                }else{
                     hideFormError("message-error");
                    isValid = true;
                }

                if(experienceType === "" || experienceType === "Choose Your Experience"){
                    showFormError("experience-error");
                    isValid = false;
                }else{
                     hideFormError("experience-error");
                    isValid = true;
                }


                if(isValid){
                     document.getElementById("contact-form").style.display = "none";
                      document.getElementById("confirmation").style.display = "block";
                }

               
            }) 
       }

      
        
});


    //Pop up story text
    function togglePopup(button) {
        const popup = button.parentElement;
        const popupText = popup.querySelector(".popuptext");


        document.querySelectorAll(".popuptext.show").forEach((openPopup) => {
            if (openPopup !== popupText) {
                openPopup.classList.remove("show");
            }
        });

        // Toggle the selected popup
        popupText.classList.toggle("show");
        //Toggle the activation button
        button.classList.toggle("active");
}




