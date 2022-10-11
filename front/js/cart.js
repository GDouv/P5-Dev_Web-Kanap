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

    let regexFirstName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçœčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{2,47}$/u

    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
    firstNameErrorMsg.innerText = "Veuillez saisir votre prénom"

    firstNameInput.addEventListener("change", function() {
        let testFirstName = regexFirstName.test(firstNameInput.value)

        if (testFirstName) {
            firstNameErrorMsg.style.display = "none"
            firstNameInput.value = firstNameInput.value.charAt(0).toUpperCase() + firstNameInput.value.slice(1)
        }
        else {
            firstNameErrorMsg.style.display = "inline"
        }

        console.log("test first name :")
        console.log(testFirstName)
        return testFirstName
    })

    // Un nom peut n'avoir qu'un seul caractère, exemple : Cédric O, ancien Secrétaire d'état chargé du numérique
    // Le record du nom le plus long est de 47 caractères : Pourroy de L'Auberivière de Quinsonas-Oudinot de Reggio

    let lastNameInput = document.getElementById("lastName")

    let regexLastName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçœčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{1,47}$/u

    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
    lastNameErrorMsg.innerText = "Veuillez saisir votre nom"

    lastNameInput.addEventListener("change", function() {
        let testLastName = regexLastName.test(lastNameInput.value)

        if (testLastName) {
            lastNameErrorMsg.style.display = "none"
            lastNameInput.value = lastNameInput.value.charAt(0).toUpperCase() + lastNameInput.value.slice(1)
        }
        else {
            lastNameErrorMsg.style.display = "inline"
        }

        console.log("test last name :")
        console.log(testLastName)
        return testLastName
    })

    let addressInput = document.getElementById("address")

    let regexAddress = /^[a-zA-Z0-9àâäèéêëîïôöûüÿçœÀÂÄÈÉÊËÎÏÔÖÛÜŸÇŒ ,'-]{3,}$/u

    const addressErrorMsg = document.getElementById("addressErrorMsg")
    addressErrorMsg.innerText = "Veuillez saisir une adresse valide"

    addressInput.addEventListener("change", function() {
        let testAddress = regexAddress.test(addressInput.value)

        if (testAddress) {
            addressErrorMsg.style.display = "none"
        }
        else {
            addressErrorMsg.style.display = "inline"
        }

        console.log("test address :")
        console.log(testAddress)
        return testAddress
    })

    let cityInput = document.getElementById("city")

    let regexCity = /^[a-zA-ZàâäèéêëîïôöûüÿçœÀÂÄÈÉÊËÎÏÔÖÛÜŸÇŒ ,'-]$/u

    const cityErrorMsg = document.getElementById("cityErrorMsg")
    cityErrorMsg.innerText = "Veuillez saisir votre ville"

    cityInput.addEventListener("change", function() {
        let testCity = regexCity.test(cityInput.value)

        if (testCity) {
            cityErrorMsg.style.display = "none"
            cityInput.value = cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1)
        }
        else {
            cityErrorMsg.style.display = "inline"
        }

        console.log("test city :")
        console.log(testCity)
        return testCity
    })

    let emailInput = document.getElementById("email")

    let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    const emailErrorMsg = document.getElementById("emailErrorMsg")
    emailErrorMsg.innerText = "Veuillez saisir une adresse email valide"

    emailInput.addEventListener("change", function() {
        let testEmail = regexEmail.test(emailInput.value)

        if (testEmail) {
            emailErrorMsg.style.display = "none"
            emailInput.value = emailInput.value.toLowerCase()
        }
        else {
            emailErrorMsg.style.display = "inline"
        }

        console.log("test email :")
        console.log(testEmail)
        return testEmail
    })
}