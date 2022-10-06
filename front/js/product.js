let url = 'http://localhost:3000/api/products'

let productImg = document.querySelector(".item__img img")
let productTitle = document.getElementById("title")
let productPrice = document.getElementById("price")
let productDescription = document.getElementById("description")
let productColors = document.getElementById("colors")
let productQuantity = document.getElementById("quantity")


let pageUrl = new URL(document.location.href)

pageHref = new URL(pageUrl.href);
let search_params = new URLSearchParams(pageHref.search)
let productId = search_params.get('id');
console.log("productId : " + productId)

fetch(url + "/" + productId)
.then(res => res.json())
.then((currentProduct) => {
    console.log("currentProduct :")
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
        let newOption = productColors.appendChild(createOption)
        newOption.innerText = currentProduct.colors[2]
        newOption.setAttribute("value", currentProduct.colors[2].toLowerCase())
    }

    if (currentProduct.colors.length > 3) {
        let createOption = document.createElement('option')
        let newOption = productColors.appendChild(createOption)
        newOption.innerText = currentProduct.colors[3]
        newOption.setAttribute("value", currentProduct.colors[3].toLowerCase())
    }
})
.catch(err => console.log("Erreur", err));

let cart = []

if (localStorage.getItem("Cart") != null) {
    cart = JSON.parse(localStorage.getItem("Cart"))
}

// Sauvegarde les infos du produit sélectionné dans un objet JSON
let currentProductInfos = function() {
    let jsonProduct = {
        id : productId,
        quantity : productQuantity.value,
        color : productColors.value
    }
  
    return jsonProduct
}

let productFound = function() {
    let result = cart.find(product => product.id === productId && product.color === productColors.value)
    return result
}

let productFoundIndex = function() {
    return cart.indexOf(productFound())
}

let productIsInCart = function() {
    console.log("Ce produit est déjà dans le panier (JSON) : " + JSON.stringify(productFound()))
    let booleanResult = false
    if (productFound() !== undefined) {
        booleanResult = true
    }
    return booleanResult
}

document.getElementById('addToCart').addEventListener("click", function() {
    if (productIsInCart()) {
        console.log("Index du produit : " + productFoundIndex())
        cart[productFoundIndex()].quantity = parseInt(cart[productFoundIndex()].quantity) + parseInt(productQuantity.value)
    }
    else {
        cart.push(currentProductInfos()) 
    }

    console.log("Cart (JSON) : " + JSON.stringify(cart))

    localStorage.setItem("Cart", JSON.stringify(cart))
})




/* CODE COMMENTE

// Sauvegarde les infos du produit sélectionné dans un objet JSON
let saveCurrentProductInfos = function() {
    let jsonProduct = {
        id : productId,
        quantity : productQuantity.value,
        color : productColors.value
    }

    let productObj = JSON.stringify(jsonProduct)
  
    return productObj
}

console.log("saveCurrentProductInfos : " + saveCurrentProductInfos())


let selectedProductColor = productColors.addEventListener("change", function() {
    saveCurrentProductInfos()

    console.log("saveCurrentProductInfo : " + saveCurrentProductInfos())
    console.log("COLOR CHANGED")
})

let selectedQuantity = productQuantity.addEventListener("change", function() {
    saveCurrentProductInfos()
    console.log("saveCurrentProductInfo : " + saveCurrentProductInfos())
    console.log("++")
})

// Permet d'ajouter un produit au panier mais l'ancien est écrasé à chaque ajout
// Utiliser un array pour mettre les données dedans puis faire un objet avec l'array ?
document.getElementById('addToCart').addEventListener("click", function() {
    // Ajouter les éléments dans l'array cart

    let parseObj = JSON.parse(saveCurrentProductInfos())
    let currentColor = parseObj.color
    console.log("currentColor : " + currentColor)

    if (cart.length == 0) {
        cart.push(saveCurrentProductInfos())
    }

*/

/* CODE COMMENTE

    else if (cart.length >= 1) {
        let currentProductIndex = cart.indexOf(saveCurrentProductInfos())
        console.log("currentProductIndex : " + currentProductIndex)

        
        // Il faut mettre le résultat de saveCurrentProductInfos dans un array
        // Itérer sur cet array pour tester si l'index est présent

        // OU

        // chercher si l'Id est présent dans l'array, puis chercher si la couleur
        // est présente dans le même objet et ensuite mettre à jour la quantité
        
        

        
        // let replaceCart = cart.toString().replaceAll(/(},{)+/g, "} {")
        // console.log("replaceCart : " + replaceCart)
        
       

        if (currentProductIndex < 0) {
            function findProductById(product) {
                return product.id === productId
            }
            console.log("cart : " + cart)
            console.log(cart.find(findProductById))
            cart.push(saveCurrentProductInfos())
        }

        else {
            console.log("cart juste avant parseCart : " + cart)
            let parseCart = JSON.parse(cart[currentProductIndex])
            console.log("parseCart : " + parseCart)

            if (parseCart.color == currentColor) {
            console.log("cartToString : " + cart.toString())

            parseCart.quantity = parseInt(parseCart.quantity) + parseInt(parseObj.quantity)
        
            cart.splice(currentProductIndex, 1)
            cart.push(JSON.stringify(parseCart))
            }

        else {
            cart.push(saveCurrentProductInfos())
        }
        }
        
        

    }

    console.log("Cart : " + cart)
    localStorage.setItem("item" + [localStorage.length], cart)
    console.log("===========================================")
    
})

*/

/*
        Le panier fonctionne presque sauf : après avoir ajouté un produit d'une couleur,
        puis d'une autre couleur et qu'on rajouter ensuite un prduit de la première couleur,
        le nouveau produit est rajouté à la fin au lieu d'update la quantité
        exemple screenshot bureau
        Aussi : On ne peut ajouter que 2 fois de suite un objet de la même couleur, après, un nouvel objet est créé dans l'array
        (ne fonctionne qu'avec 2 fois un élément avec la même quantité)
*/


/* Si cart contient déjà l'élément de la même couleur, augmenter la quantité
cart se réinitiale à chaque changement de page, donc pas besoin de l'Id
récupérer la couleur de l'élément courrant
si élément de la même couleur non présent dans l'array : ajouter le nouvel élément
si même couleur, ne pas dupliquer l'élément
récupérer la quantité initiale
récupérer la nouvelle quantité
ajouter les 2 valeurs
mettre la nouvelle valeur dans "quantity"
*/

/* Si localStorage contient déjà un item avec le même Id, ne pas créer de nouvel item
et augmenter la quantité
récupérer l'Id de l'élément courant
chercher si cet Id existe dans localStorage
récupérer la quantité
additionner la quantité à ajouter et la quantité initiale
remettre les données dans localStorage
*/
