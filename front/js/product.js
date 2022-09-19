let url = 'http://localhost:3000/api/products';

let productImg = document.querySelector(".item__img img")
let productTitle = document.getElementById("title")
let productPrice = document.getElementById("price")
let productDescription = document.getElementById("description")


let pageUrl = new URL(document.location.href)

pageHref = new URL(pageUrl.href);
let search_params = new URLSearchParams(pageHref.search)
let productId = search_params.get('id');

fetch(url + "/" + productId)
.then(res => res.json())
.then((currentProduct) => {
    console.log(currentProduct)
    productImg.setAttribute("src", currentProduct.imageUrl)
    productTitle.innerText = currentProduct.name
    productPrice.innerText = currentProduct.price
    productDescription.innerText = currentProduct.description

    let chooseColorText = document.querySelector("#colors option").innerText

    for (let i = 0; i <= 2; i++) {

        let getExistingColors = document.querySelector("#colors :nth-child(" + [i+1] + ")")
        let currentProductColor = currentProduct.colors[i-1]
        getExistingColors.innerText = currentProductColor
        if (i > 0) {
            getExistingColors.setAttribute("value", currentProductColor.toLowerCase())
        }
    }

    document.querySelector("#colors option").innerText = chooseColorText

    if (currentProduct.colors.length > 2) {
        let createOption = document.createElement('option')
        let newOption = document.getElementById('colors').appendChild(createOption)
        newOption.innerText = currentProduct.colors[2]
        newOption.setAttribute("value", currentProduct.colors[2].toLowerCase())
    }

    if (currentProduct.colors.length > 3) {
        let createOption = document.createElement('option')
        let newOption = document.getElementById('colors').appendChild(createOption)
        newOption.innerText = currentProduct.colors[3]
        newOption.setAttribute("value", currentProduct.colors[3].toLowerCase())
    }
    /*
    - La boucle retire le "SVP sélectionner une couleur" du menu déroulant et le remplace par "undefined"
    lors du 2ème passage dans la boucle, juste avant l'incrémentation.
    - Peut-être peut-on essayer de remplacer les attributs "value" au lieu du innerText ?
    - 3ème couleur non prise en compte quand il y a une troisième couleur.
    - Utiliser le débugeur.
    */

})
.catch(err => console.log("Erreur", err));