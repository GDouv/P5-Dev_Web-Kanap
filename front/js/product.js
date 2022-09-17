let url = 'http://localhost:3000/api/products';

let productImg = document.querySelector(".item__img img")


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
    console.log(currentProduct.imageUrl)
    productImg.setAttribute("src", currentProduct.imageUrl)
})
.catch(err => console.log("Erreur", err));