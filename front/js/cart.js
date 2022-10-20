const cart = JSON.parse(localStorage.getItem("Cart"))

function cartTranslatedColors() {
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


const apiUrl = 'http://localhost:3000/api/products'

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

        function productFound() {
            const result = apiInfos.find(product => product._id === eachArticleId)
            return result
        }

        function productFoundIndex() {
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
    const productQuantity = document.querySelectorAll(".itemQuantity")

    productQuantity.forEach(product => 
        product.addEventListener("change", function() {

            const productId = this.closest("article").dataset.id
            const productColor = this.closest("article").dataset.color

            function productFound() {
                const result = cart.find(product => product.id === productId && product.color === productColor)
                return result
            }
    
            function productFoundIndex() {
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
            localStorage.setItem("Cart", JSON.stringify(cart))

            calculateTotalPrice()
        })
    )
}


function deleteProduct() {
    const deleteButtons = document.querySelectorAll(".deleteItem")

    deleteButtons.forEach(button => 
        button.addEventListener("click", function() {

            const productId = this.closest("article").dataset.id
            const productColor = this.closest("article").dataset.color

            function productFound() {
                const result = cart.find(product => product.id === productId && product.color === productColor)
                return result
            }
    
            function productFoundIndex() {
                return cart.indexOf(productFound())
            }

            cart.splice(productFoundIndex(), 1)
            localStorage.setItem("Cart", JSON.stringify(cart))
            document.location.reload()
        })
    )
}


const totalPrice = document.getElementById("totalPrice")
const totalQuantity = document.getElementById("totalQuantity")

function calculateTotalPrice() {
    const articlesPrices = document.querySelectorAll(".cart__item__price")

    let totalPriceAddition = 0
    let productQuantityAddition = 0

    for (let i = 0; i < articlesPrices.length; i++) {
        const productQuantity = cart[i].quantity

        totalPriceAddition += productQuantity * parseInt(articlesPrices[i].dataset.price)
        productQuantityAddition += parseInt(productQuantity)
    }
        
    totalPrice.innerText = totalPriceAddition + ",00"
    totalQuantity.innerText = productQuantityAddition
}


const orderButton = document.getElementById("order")
const firstNameInput = document.getElementById("firstName")
const lastNameInput = document.getElementById("lastName")
const addressInput = document.getElementById("address")
const cityInput = document.getElementById("city")
const emailInput = document.getElementById("email")
let contactInfos = new Object()

function validateFormInfos() {
    
    // FIRST NAME TEST
    const regexFirstName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçœčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{2,47}$/u

    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
    firstNameErrorMsg.innerText = "Veuillez saisir votre prénom"
    firstNameErrorMsg.style.display = "none"

    orderButton.addEventListener("click", function(e) {
        const testFirstName = regexFirstName.test(firstNameInput.value)

        if (testFirstName) {
            firstNameInput.value = firstNameInput.value.charAt(0).toUpperCase() + firstNameInput.value.slice(1)
            contactInfos.firstName = firstNameInput.value
        }
        else {
            e.preventDefault()
            firstNameErrorMsg.style.display = "inline"
        }

        console.log("test first name :")
        console.log(testFirstName)
        return testFirstName
    })


    // LAST NAME TEST
    // Un nom peut n'avoir qu'un seul caractère, exemple : Cédric O, ancien Secrétaire d'état chargé du numérique
    // Le record du nom le plus long est de 47 caractères : Pourroy de L'Auberivière de Quinsonas-Oudinot de Reggio
    const regexLastName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçœčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{1,47}$/u

    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
    lastNameErrorMsg.innerText = "Veuillez saisir votre nom"
    lastNameErrorMsg.style.display = "none"

    orderButton.addEventListener("click", function(e) {
        const testLastName = regexLastName.test(lastNameInput.value)

        if (testLastName) {
            lastNameInput.value = lastNameInput.value.charAt(0).toUpperCase() + lastNameInput.value.slice(1)
            contactInfos.lastName = lastNameInput.value
        }
        else {
            e.preventDefault()
            lastNameErrorMsg.style.display = "inline"
        }

        console.log("test last name :")
        console.log(testLastName)
        return testLastName
    })


    // ADDRESS TEST
    const regexAddress = /^[a-zA-Z0-9àâäèéêëîïôöûüÿçœÀÂÄÈÉÊËÎÏÔÖÛÜŸÇŒ ,'-]{3,}$/u

    const addressErrorMsg = document.getElementById("addressErrorMsg")
    addressErrorMsg.innerText = "Veuillez saisir une adresse valide"
    addressErrorMsg.style.display = "none"

    orderButton.addEventListener("click", function(e) {
        const testAddress = regexAddress.test(addressInput.value)

        if (testAddress) {
            contactInfos.address = addressInput.value
        }
        else {
            e.preventDefault()
            addressErrorMsg.style.display = "inline"
        }

        console.log("test address :")
        console.log(testAddress)
        return testAddress
    })


    // CITY TEST
    const regexCity = /^[a-zA-ZàâäèéêëîïôöûüÿçœÀÂÄÈÉÊËÎÏÔÖÛÜŸÇŒ ,'-]{1,}$/u

    const cityErrorMsg = document.getElementById("cityErrorMsg")
    cityErrorMsg.innerText = "Veuillez saisir votre ville"
    cityErrorMsg.style.display = "none"

    orderButton.addEventListener("click", function(e) {
        const testCity = regexCity.test(cityInput.value)

        if (testCity) {
            cityInput.value = cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1)
            contactInfos.city = cityInput.value
        }
        else {
            e.preventDefault()
            cityErrorMsg.style.display = "inline"
        }

        console.log("test city :")
        console.log(testCity)
        return testCity
    })


    // EMAIL TEST
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    const emailErrorMsg = document.getElementById("emailErrorMsg")
    emailErrorMsg.innerText = "Veuillez saisir une adresse email valide"
    emailErrorMsg.style.display = "none"

    orderButton.addEventListener("click", function(e) {
        const testEmail = regexEmail.test(emailInput.value)

        if (testEmail) {
            emailInput.value = emailInput.value.toLowerCase()
            contactInfos.email = emailInput.value
            localStorage.setItem("Contact", JSON.stringify(contactInfos))
        }
        else {
            e.preventDefault()
            emailErrorMsg.style.display = "inline"
        }

        console.log("test email :")
        console.log(testEmail)
        return testEmail
    })
}

// Toujours preventDefault() sur orderButton
// Fonction séparée createContactInfos ?
// Effectuer une reqûete POST sur l'API
// Récupérer l'identifiant de commande dans la réponse de l'API
/* Rediriger l'utilisateur sur la page confirmation en passant l'id de commande dans l'URL,
dans le but d'afficher le numéro de commande */
// Le numéro de commande doit être affiché mais pas conservé/stocké

/* Créer une fonction validateFormInfosV2 dans laquelle (pour éviter les répétitions inutiles) {
    Déclarer toutes les regex
    Déclarer tous les messages d'erreur
    Créer un seul addEventListener au click sur orderButton
    preventDefault(e)
    Déclarer tous les test
    Créer toutes les conditions
    setItem Contact dans localStorage (si fontion non séparée)
}
Tester validateFormInfosV2
Corriger les bugs éventuels
Déployer validateFormInfosV2
Commenter validateFormInfos
*/
