let cart = JSON.parse(localStorage.getItem("Cart"))

let originalCart = cart

let cartTranslatedColors = function() {
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(green)+/g, "Vert"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(white)+/g, "Blanc"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(black)+/g, "Noir"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(yellow)+/g, "Jaune"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(red)+/g, "Rouge"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(orange)+/g, "Orange"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(pink)+/g, "Rose"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(grey)+/g, "Gris"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(purple)+/g, "Violet"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(navy)+/g, "Bleu marine"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(silver)+/g, "Argenté"))
    cart = JSON.parse(JSON.stringify(cart).replaceAll(/(brown)+/g, "Marron"))
    return cart
}
console.log("Cart :")
console.log(cartTranslatedColors())

let apiUrl = 'http://localhost:3000/api/products'

const cartItems = document.getElementById("cart__items")

fetch(apiUrl)
.then(res => res.json())
.then(apiInfos => {
    console.log("API Infos :")
    console.log(apiInfos)
    
    for (let i in cart) {
        // console.log("Produit n°" + parseInt(parseInt([i]) + 1) + " dans le panier : " + JSON.stringify(cart[i]))
    
        if (i > 0) {
            const productInCartItem = cartItems.children[0]
            const cloneArticle = productInCartItem.cloneNode(true)
            cartItems.appendChild(cloneArticle)
        }   
    }
    
    for (let i in cart) {
        const eachArticle = cartItems.children[i]
        const eachArticleId = cart[i].id

        const productFound = function() {
            let result = apiInfos.find(product => product._id === eachArticleId)
            return result
        }

        const productFoundIndex = function() {
            return apiInfos.indexOf(productFound())
        }

        const apiProduct = apiInfos[productFoundIndex()]

        eachArticle.querySelector(".cart__item__img img").setAttribute("src", apiProduct.imageUrl)
        eachArticle.querySelector(".cart__item__content__description h2").innerText = apiProduct.name
        eachArticle.querySelector(".cart__item__content__description p").innerText = cart[i].color
        eachArticle.querySelector(".cart__item__content__description p:nth-of-type(2)").innerText = apiProduct.price + ",00 €"
        eachArticle.querySelector(".itemQuantity").value = cart[i].quantity

        eachArticle.dataset.id = eachArticleId
        eachArticle.dataset.color = originalCart[i].color
    }
})
.catch(err => console.log("Erreur", err))

const productQuantity = document.querySelectorAll(".itemQuantity")
console.log("Contenu de la variable productQuantity : ")
console.log(productQuantity) // Done une NodeList de length 1, donc ne fonctionne pas correctement

// NE FONCTIONNE QUE SUR LE PREMIER PRODUIT DU PANIER ! (A corriger)
for (let i = 0; i < productQuantity.length; i++) {
    productQuantity[i].addEventListener("change", function() {

    //  CODE INUTILE COMMENTE (il y avait cart[productFoundIndex] à la place de cart[i])
    /*
    const productId = this.closest("article").dataset.id
    const productColor = this.closest("article").dataset.color

    const productFound = function() {
        let result = originalCart.find(product => product.id === productId && product.color === productColor)
        return result
    }
    
    const productFoundIndex = function() {
        return originalCart.indexOf(productFound())
    }
    */

    for (let i = 0; i < productQuantity.length; i++) {
        cart[i].quantity = this.value
        console.log("Cart quantity changed : ")
        console.log(cart)
    }
})
}
