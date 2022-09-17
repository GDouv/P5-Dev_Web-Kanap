let url = 'http://localhost:3000/api/products';

let productImg = document.querySelector(".item__img img")
let productTitle = document.getElementById("title")
let productPrice = document.getElementById("price")
let productDescription = document.getElementById("description")


let pageUrl = new URL(document.location.href)

console.log(pageUrl)
console.log(pageUrl.href)

pageHref = new URL(pageUrl.href);
let search_params = new URLSearchParams(pageHref.search)
let productId = search_params.get('id');

console.log(productId)

fetch(url + "/" + productId)
.then(res => res.json())
.then((currentProduct) => {
    console.log(currentProduct)
    console.log(currentProduct.imageUrl)
    productImg.setAttribute("src", currentProduct.imageUrl)
    productTitle.innerText = currentProduct.name
    productPrice.innerText = currentProduct.price
    productDescription.innerText = currentProduct.description

    // Ajouter maintenant les couleurs dans le menu déroulant

})
.catch(err => console.log("Erreur", err));