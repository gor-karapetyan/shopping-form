let btns = document.querySelectorAll(".btn");
let inputs = document.querySelectorAll(".input-required");
let slideOrder = ['shipping', 'billing', 'payment', 'thanks'];
let copyBtn = document.querySelector('#copy-data');
let cityImgs = document.querySelectorAll('.get-city');
let userData = {
    city: null,
    country: null
};

btns.forEach(function(b, i){
    b.addEventListener('click', btnClickHandler);
});

inputs.forEach(function(inp){
    inp.addEventListener('input', function(){
        removeWarning(inp);
    })
})

copyBtn.addEventListener('click', function(){
    let inputs = document.querySelectorAll('[data-copy]');
    inputs.forEach(function(input){
        let copyName = input.dataset.copy;
        if(input.value.length !== 0){
            let pasteInput = document.querySelector(`[data-paste="${copyName}"]`);
            if(pasteInput !== null){
                pasteInput.value = input.value;
                removeWarning(pasteInput);
            }
        }
    })
})

cityImgs.forEach(function(img){
    img.addEventListener('click', getUserCity);
})

function removeWarning(inp){
    inp.classList.remove('input-warning');
    let tooltip = inp.closest(".input-container").querySelector('.input-tooltip');
    if(tooltip){
        tooltip.classList.remove("visible");
    }
}

function btnClickHandler(e){
    e.preventDefault();

    let slide = this.closest('.form-slide');
    let inputs = slide.querySelectorAll(".input-required");

    inputs.forEach(function(inp, ind){
        let val = inp.value;
        if(val.length === 0){
            inp.classList.add('input-warning');
        }else{
            inp.classList.remove('input-warning');
            
        }

    })
    let firstEmpty = slide.querySelector('.input-warning');
    if(firstEmpty !== null){
        let tooltip = firstEmpty.closest(".input-container").querySelector('.input-tooltip');
        if(tooltip){
            tooltip.classList.add("visible");
        }
    }else{
        openNextSlide();
    }
}

function openNextSlide(){
    let currentVisible = document.querySelector('.form-slide.visible');
    if(currentVisible === null){
        console.log("No any visible slides");
        return;
    }
    let slide = currentVisible.dataset.slide;
    let index = slideOrder.indexOf(slide);
    if(slideOrder[index + 1] !== undefined){
        
        let nextSlide = document.querySelector(`[data-slide="${slideOrder[index + 1]}"]`);
        if(nextSlide !== null){
            currentVisible.classList.remove('visible');
            nextSlide.classList.add('visible');

            if(slideOrder[index + 1] === "thanks"){
                km();
            }

            let nextSlideNav = document.querySelector(`[data-slide-nav="${slideOrder[index + 1]}"]`);
            if(nextSlideNav !== null){
                document.querySelector(`[data-slide-nav="${slide}"]`).classList.remove('font-purple');
                nextSlideNav.classList.add('font-purple');
            }
        }
    }
}

/*function getCountries(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.first.org/data/v1/countries?limit=300');  //! ete XMLHttpRequest veradarcnum e uxaki Object-ner
    xhr.send();

    xhr.onload = function(){
        if(xhr.status === 200){
            let countries = JSON.parse(xhr.response);
            //console.log(countries);
            if(countries.data !== undefined){
                countries = countries.data;
                fillCountries(countries);
            }
        }
    }
}

function fillCountries(data){
    let countrySelect = document.querySelectorAll('.country-select');
    countrySelect.forEach(function(select){
        for(let countryCode in data){
            //console.log(data[countryCode]);
            let option = new Option(data[countryCode].country, data[countryCode].country);
            select.append(option);
        }
    })
    toggleLoading(false);
}

function toggleLoading(show){
    let loading = document.querySelector('.loader');
    if(show){
        loading.classList.remove('hide');
    }else{
        loading.classList.add('hide');
    }
}

window.addEventListener('load', function(){
    getCountries();
})*/


function getCountries(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://restcountries.eu/rest/v2/all');  //? ete XMLHttpRequest veradarcnum e Object-neri zangvac
    xhr.send();

    xhr.onload = function(){
        if(xhr.status === 200){
            let countries = JSON.parse(xhr.response);
            console.log(countries);
            fillCountries(countries);
        }
    }
}

function fillCountries(k){
    let countrySelect = document.querySelectorAll('.country-select');
    countrySelect.forEach(function(select){
        for(let countryCode in k){
            //console.log(data[countryCode]);
            let option = new Option(k[countryCode].name, k[countryCode].name);
            select.append(option);
        }
    })
    setTimeout(function(){
        toggleLoading(false);
    }, 2000);
}

function toggleLoading(show){
    let loading = document.querySelector('.loader');
    if(show){
        loading.classList.remove('hide');
    }else{
        loading.classList.add('hide');
    }
}

function getUserCity(){
    let slide = this.closest('.form-slide');
    let slideAttr = slide.dataset.slide;
    //console.log(slideAttr);
    if(userData.city == null && userData.country == null){
        navigator.geolocation.getCurrentPosition(
            function(data){
             //console.log(data);
             getLocation(data.coords.latitude, data.coords.longitude, slideAttr);
         }, function(){
             alert("error");
         })
    }else{
        setCity(userData.city, slideAttr);
        setCountry(userData.country, slideAttr)
    }
}

function getLocation(lat, long, slideAttr){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.opencagedata.com/geocode/v1/json?key=042f896117d94d93913ebe09f7309de4&q=${lat}+${long}&pretty=1&language=en`);
    xhr.send();

    xhr.onload = function(){
        if(xhr.status === 200){
            let data = JSON.parse(xhr.response);
            //console.log(data);
            let city = data.results[0].components.city;
            let country = data.results[0].components.country;
            //console.log(city, country);
            setCity(city, slideAttr);
            setCountry(country, slideAttr);
            userData.city = city;
            userData.country = country;
        }
    }
}

function setCity(city, slideAttr){
    let input = document.querySelector(`[name='${slideAttr}-city']`);
    input.value = city;
    input.dispatchEvent(new Event("input"));
}

function setCountry(country, slideAttr){
    let select = document.querySelector(`[name='${slideAttr}-country']`);
    select.value = country;
    select.dispatchEvent(new Event("input"));
}

function setInputMasks(){
    let phone = document.querySelector('[name="daytime-phone"]');
    let phoneIm = new Inputmask("+374 (99) 99-99-99");
    phoneIm.mask(phone);

    let email = document.querySelector('[name="email-address"]');
    let emailIm = new Inputmask({alias: "email"});
    emailIm.mask(email);

    let cardNumber = document.querySelector('[name="card-number"]');
    let cardNumberIm = new Inputmask("9999 9999 9999 9999");
    cardNumberIm.mask(cardNumber);

    let dateMax = document.querySelector('[name="datemax"]');
    let dateMaxIm = new Inputmask({ alias: "datetime", inputFormat: "mm / yy"});
    dateMaxIm.mask(dateMax);

    let securityCode = document.querySelector('[name="security-code"]');
    let securityCodeIm = new Inputmask("999");
    securityCodeIm.mask(securityCode);
}

function km(){
    let inp = document.querySelector(`[name="email-address"]`);
    let hr = document.querySelector('.gm');
    hr.innerText = inp.value;

    let day = document.querySelector('.day');
    let now = new Date();
    let oneMonth = new Date(now.setMonth(now.getMonth() + 1));
    day.innerText = oneMonth;
}

window.addEventListener('load', function(){
    getCountries();
    setInputMasks();
});