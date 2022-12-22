// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

const uploadInput = document.querySelector('.uploader__input')
const ulEl = document.querySelector('.panel__excursions')
uploadInput.addEventListener('change', uploadedInput)
console.log()
function uploadedInput(e) {

    const file = e.target.files[0];
    if (file && file.type.includes('csv')) {
        const reader = new FileReader();

        reader.onload = function (readerEvent) {
            const content = readerEvent.target.result;
            const lines = content.split(/[\r\n]+/gm)
            lines.forEach(function (elem) {
                var travelIndex = elem.split(/[""]+/gm);
                const travelPrototype = document.querySelector('.excursions__item--prototype')
                const travelPrototypeCopy = travelPrototype.cloneNode(true)
                travelPrototypeCopy.classList.remove('excursions__item--prototype')
                travelPrototypeCopy.querySelector('.excursions__title').textContent = travelIndex[3]
                travelPrototypeCopy.querySelector('.excursions__description').textContent = travelIndex[5]
                travelPrototypeCopy.querySelector('.excursions__price--adult').textContent = travelIndex[7]
                travelPrototypeCopy.querySelector('.excursions__price--child').textContent = travelIndex[9]
                travelPrototype.parentElement.appendChild(travelPrototypeCopy)
            });
        }
        reader.readAsText(file, 'UTF-8')
    }
    else alert('Please choose CVS file')
}


const travelSubmitButton = document.querySelector('.excursions')
travelSubmitButton.addEventListener('submit', intoBasket)

let orderPriceValue = document.querySelector('.order__total-price-value');
let totalValueArray = [];
const summaryPanel = document.querySelector('.panel__summary')
orderPriceValue.innerText = 0;

function intoBasket(e) {
    e.preventDefault();
    
    totalValueArray = [];
    const amountsEl = e.target.getElementsByClassName('excursions__field-input');
    const inputOneValue = amountsEl[0].value;
    const inputTwoValue = amountsEl[1].value;

    var pattern = new RegExp(/[0-9]/);



    if (pattern.test(inputOneValue) &&
        pattern.test(inputTwoValue)) {

        const basket = document.querySelector('.summary__item--prototype');
        const clonedBasket = basket.cloneNode(true);
        clonedBasket.classList.remove('summary__item--prototype')

        const excursionTitle = e.target.parentElement.querySelector('.excursions__title').textContent;
        const childPrice = e.target.querySelector('.excursions__price--child').innerText;
        const adultPrice = e.target.querySelector('.excursions__price--adult').innerText;
        clonedBasket.querySelector("span.summary__name").textContent = excursionTitle
        const totalBasketPrice = +(inputTwoValue * childPrice) + +(inputOneValue * adultPrice);
        clonedBasket.querySelector('.summary__total-price').innerText = +" " + totalBasketPrice;
        const sumaryBasketPrice = clonedBasket.querySelector('.summary__prices').innerText = 'dzieci :' + (amountsEl[1].value) + 'x' + (childPrice) + 'PLN, dorośli :' + (amountsEl[0].value) + 'x' + (adultPrice) + 'PLN';
        orderPriceValue.innerText = +totalBasketPrice + +orderPriceValue.innerText ;
        totalValueArray.push(orderPriceValue.innerText)

        summaryPanel.appendChild(clonedBasket)
    }
    else alert('Enter number-type value')

}

const formEl = document.querySelector('.panel__order')
const inputValidation = formEl.querySelectorAll('input')
const informationPanel = document.createElement('div')
formEl.addEventListener('submit', validationForm)

console.log(summaryPanel.children.length)

function validationForm(e) {
    formEl.appendChild(informationPanel)
    informationPanel.innerHTML = ''
    e.preventDefault()

    var pattern = new RegExp(/^[a-z,',-]+(\s)[a-z,',-]+$/i);

    if (summaryPanel.children.length <= 1){
        alert('You did not choose any trip yet')
    }

    else if (inputValidation[0].value.trim() === '' || !pattern.test(inputValidation[0].value)) {
        informationPanel.classList.add('information__panel')
        const validationInfo = document.createElement('p')
        informationPanel.appendChild(validationInfo)
        validationInfo.textContent = "Please enter Your full name in following pattern: 'Frist-name Last-name'"
    }

    else if (inputValidation[1].value.trim() === '' || !inputValidation[1].value.includes('@')) {
        informationPanel.classList.add('information__panel')
        const validationInfo = document.createElement('p')
        informationPanel.appendChild(validationInfo)
        validationInfo.textContent = 'Email must include @'
    }

    else alert('Dziękujemy za złożenie zamówienia o wartości ' + totalValueArray + ' PLN. Szczegóły zamówienia zostały wysłane na adres e-mail : ' + inputValidation[1].value)


}


summaryPanel.addEventListener('click', deleteOrder)

function deleteOrder(e) {
    e.preventDefault();
    totalValueArray = [];
    const deleteTripvalue = e.target.parentElement.querySelector('.summary__total-price').innerText;
    if (e.target.innerText === 'X') {
        summaryPanel.removeChild(e.target.parentElement.parentElement)
        orderPriceValue.innerText -= deleteTripvalue
        totalValueArray.push(orderPriceValue.innerText)
    }
}


