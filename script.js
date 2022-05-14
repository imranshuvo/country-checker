'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const loader = document.getElementById('loader');
const search = document.getElementById('country');


/*
const response = new XMLHttpRequest();
response.open('GET', 'https://restcountries.com/v3.1/name/bangladesh');
response.send();
response.addEventListener('load', function(){
    //console.log(this.responseText);

    const data = JSON.parse(this.responseText);
    console.log(data);
});
*/
function getLanguages(data){
 const languages = Object.values(data.languages);
 return languages.join(',');
}
function getCurrencies(data){
const curr = Object.values(data.currencies);
let currencies = curr.map(a => {
    return a.name;
});
return currencies.join(',');
}
function renderCountry(data, className = '') {
const html = `
<article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
    ).toFixed(1)}M people</p>
    <p class="country__row"><span>🗣️</span>${getLanguages(data)}</p>
    <p class="country__row"><span>💰</span>${getCurrencies(data)}</p>
    </div>
</article>
`;
countriesContainer.insertAdjacentHTML('beforeend', html);
countriesContainer.style.opacity = 1;
};


function getCountryData(country){
    const apiUrl = `https://restcountries.com/v3.1/name/${country}`;
    const response = fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const [country] = data;
            //console.log(country);
            renderCountry(country);
            const neighbour = country.borders;
            //console.log(neighbour);
            neighbour.forEach(element => {
                getNeighborCountry(element);
            });
            loader.hidden = true;
        });
    
}

function getNeighborCountry(country){
    const apiUrl = `https://restcountries.com/v3.1/alpha/${country}`;
    fetch(apiUrl)
    .then( response => response.json())
    .then( data => {
        const [country] = data;
        renderCountry(country,'neighbour');
    });
}

//getCountryData('usa');


// Event Listeners
search.addEventListener('input', (e) => {
    loader.hidden = false;
    if(e.target.value.length >= 2){
        setTimeout(() => {
            getCountryData(e.target.value);
        }, 2000);
        
    }else{
        
    }
});