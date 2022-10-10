let cart = JSON.parse(localStorage.getItem("Cart"))

let cartTranslatedColors = function() {
    let cartFrenchColors = cart
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(green)+/g, "Vert"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(white)+/g, "Blanc"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(black)+/g, "Noir"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(yellow)+/g, "Jaune"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(red)+/g, "Rouge"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(orange)+/g, "Orange"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(pink)+/g, "Rose"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(grey)+/g, "Gris"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(purple)+/g, "Violet"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(navy)+/g, "Bleu marine"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(silver)+/g, "Argenté"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(brown)+/g, "Marron"))
    cartFrenchColors = JSON.parse(JSON.stringify(cartFrenchColors).replaceAll(/(blue)+/g, "Bleu"))
    return cartFrenchColors
}
console.log("Cart (translated colors) :")
console.log(cartTranslatedColors())

let apiUrl = 'http://localhost:3000/api/products'

const cartItems = document.getElementById("cart__items")

fetch(apiUrl)
.then(res => res.json())
.then(apiInfos => {
    console.log("API Infos :")
    console.log(apiInfos)
    
    cloneArticle()

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
        eachArticle.querySelector(".cart__item__content__description p").innerText = cartTranslatedColors()[i].color
        const eachArticlePrice = eachArticle.querySelector(".cart__item__content__description p:nth-of-type(2)")
        eachArticlePrice.innerText = apiProduct.price + ",00 €"
        eachArticlePrice.classList.add("cart__item__price")
        eachArticlePrice.dataset.price = apiProduct.price
        eachArticle.querySelector(".itemQuantity").value = cart[i].quantity

        eachArticle.dataset.id = eachArticleId
        eachArticle.dataset.color = cart[i].color
    }

    changeProductQuantity()

    deleteProduct()

    document.querySelector("#totalQuantity").innerText = cart.length

    calculateTotalPrice()

    validateFormInfos()
})
.catch(err => console.log("Erreur", err))

function cloneArticle() {
    for (let i in cart) {
        // console.log("Produit n°" + parseInt(parseInt([i]) + 1) + " dans le panier : " + JSON.stringify(cart[i]))
    
        if (i > 0) {
            const productInCartItem = cartItems.children[0]
            const cloneArticle = productInCartItem.cloneNode(true)
            cartItems.appendChild(cloneArticle)
        }   
    }
}

function changeProductQuantity() {
    let productQuantity = document.querySelectorAll(".itemQuantity")

    productQuantity.forEach(product => 
        product.addEventListener("change", function() {

            const productId = this.closest("article").dataset.id
            const productColor = this.closest("article").dataset.color

            const productFound = function() {
                let result = cart.find(product => product.id === productId && product.color === productColor)
                return result
            }
    
            const productFoundIndex = function() {
                return cart.indexOf(productFound())
            }
            
            if (this.value <= 100) {
                cart[productFoundIndex()].quantity = this.value
            }
            else {
                alert("Le panier est limité à 100 produits identiques")
            }
            
            console.log("Cart quantity changed : ")
            console.log(cart)

            calculateTotalPrice()
        })
    )
}

function deleteProduct() {
    let deleteButtons = document.querySelectorAll(".deleteItem")

    deleteButtons.forEach(button => 
        button.addEventListener("click", function() {

            const productId = this.closest("article").dataset.id
            const productColor = this.closest("article").dataset.color

            const productFound = function() {
                let result = cart.find(product => product.id === productId && product.color === productColor)
                return result
            }
    
            const productFoundIndex = function() {
                return cart.indexOf(productFound())
            }

            cart.splice(productFoundIndex(), 1)
            localStorage.setItem("Cart", JSON.stringify(cart))
            document.location.reload()
        })
    )
}

let totalPrice = document.getElementById("totalPrice")
let totalQuantity = document.getElementById("totalQuantity")

function calculateTotalPrice() {
    const articlesPrices = document.querySelectorAll(".cart__item__price")

    let totalPriceAddition = 0
    let productQuantityAddition = 0

    for (let i = 0; i < articlesPrices.length; i++) {
        let productQuantity = cart[i].quantity

        totalPriceAddition += productQuantity * parseInt(articlesPrices[i].dataset.price)
        productQuantityAddition += parseInt(productQuantity)
    }
        
    totalPrice.innerText = totalPriceAddition + ",00"
    totalQuantity.innerText = productQuantityAddition
}

function validateFormInfos() {
    
    let firstNameInput = document.getElementById("firstName")

    let regexName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]+$/u

    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
    firstNameErrorMsg.innerText = "Veuillez saisir votre prénom"

    firstNameInput.addEventListener("change", function() {
        if (firstNameInput.value.length > 1) {
            let testFirstName = regexName.test(firstNameInput.value)

            if (testFirstName === true) {
                firstNameErrorMsg.style.display = "none"
            }
            else {
                firstNameErrorMsg.style.display = "inline"
            }

            console.log("test first name :")
            console.log(testFirstName)
            return testFirstName
        }
        else {
            alert ("Veuillez saisir au moins 2 caractères")
        }
    })

    // Un nom peut n'avoir qu'un seul caractère, exemple : Cédric O, ancien Secrétaire d'état chargé du numérique

    let lastNameInput = document.getElementById("lastName")

    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
    lastNameErrorMsg.innerText = "Veuillez saisir votre nom"

    lastNameInput.addEventListener("change", function() {
        let testLastName = regexName.test(lastNameInput.value)

        if (testLastName === true) {
            lastNameErrorMsg.style.display = "none"
        }
        else {
            lastNameErrorMsg.style.display = "inline"
        }

        console.log("test last name :")
        console.log(testLastName)
        return testLastName
    })


    // Editer le message d'erreur pour le prénom
    // Vérifier le contenu de l'input grâce à une regex
    // Si le contenu est validé, disable le message d'erreur, enable si non valide, disabled de base
    // Pareil pour nom, adresse, ville, email
}