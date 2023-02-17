let url = "http://localhost:3000/api/products";

let productImg = document.querySelector(".item__img img");
let productTitle = document.getElementById("title");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");
let productColors = document.getElementById("colors");
let productQuantity = document.getElementById("quantity");

let pageUrl = new URL(document.location.href);

pageHref = new URL(pageUrl.href);
let search_params = new URLSearchParams(pageHref.search);
let productId = search_params.get("id");
console.log("productId : " + productId);

fetch(url + "/" + productId)
    .then((res) => res.json())
    .then((currentProduct) => {
        console.log("currentProduct :");
        console.log(currentProduct);
        productImg.setAttribute("src", currentProduct.imageUrl);
        productTitle.innerText = currentProduct.name;
        productPrice.innerText = currentProduct.price;
        productDescription.innerText = currentProduct.description;

        let chooseColorText =
            document.querySelector("#colors option").innerText;

        for (let i = 0; i <= 2; i++) {
            let getExistingColors = document.querySelector(
                "#colors :nth-child(" + [i + 1] + ")"
            );
            let currentProductColor = currentProduct.colors[i - 1];
            getExistingColors.innerText = currentProductColor;
            if (i > 0) {
                getExistingColors.setAttribute(
                    "value",
                    currentProductColor.toLowerCase()
                );
            }
        }

        document.querySelector("#colors option").innerText = chooseColorText;

        if (currentProduct.colors.length > 2) {
            let createOption = document.createElement("option");
            let newOption = productColors.appendChild(createOption);
            newOption.innerText = currentProduct.colors[2];
            newOption.setAttribute(
                "value",
                currentProduct.colors[2].toLowerCase()
            );
        }

        if (currentProduct.colors.length > 3) {
            let createOption = document.createElement("option");
            let newOption = productColors.appendChild(createOption);
            newOption.innerText = currentProduct.colors[3];
            newOption.setAttribute(
                "value",
                currentProduct.colors[3].toLowerCase()
            );
        }
        // Façon d'ajouter les couleurs un peu bizarre, à améliorer et passer les couleurs en Français
    })
    .catch((err) => console.log("Erreur", err));

let cart = [];

if (localStorage.getItem("Cart") != null) {
    cart = JSON.parse(localStorage.getItem("Cart"));
}

// Sauvegarde les infos du produit sélectionné dans un objet JSON
let currentProductInfos = function () {
    let jsonProduct = {
        id: productId,
        quantity: productQuantity.value,
        color: productColors.value,
    };

    return jsonProduct;
};

let productFound = function () {
    let result = cart.find(
        (product) =>
            product.id === productId && product.color === productColors.value
    );
    return result;
};

let productFoundIndex = function () {
    return cart.indexOf(productFound());
};

let productIsInCart = function () {
    console.log(
        "Ce produit est déjà dans le panier (JSON) : " +
            JSON.stringify(productFound())
    );
    let booleanResult = false;
    if (productFound() !== undefined) {
        booleanResult = true;
    }
    return booleanResult;
};

document.getElementById("addToCart").addEventListener("click", function () {
    if (productColors.value.length < 1) {
        alert("Veuillez sélectionner une couleur");
    } else if (productQuantity.value < 1) {
        alert("Veuillez saisir un nombre d'article(s) valide");
    } else if (productIsInCart()) {
        console.log("Index du produit : " + productFoundIndex());
        cart[productFoundIndex()].quantity =
            parseInt(cart[productFoundIndex()].quantity) +
            parseInt(productQuantity.value);

        if (cart[productFoundIndex()].quantity > 100) {
            cart[productFoundIndex()].quantity =
                parseInt(cart[productFoundIndex()].quantity) -
                parseInt(productQuantity.value);
            alert("Le panier est limité à 100 produits identiques");
        }
    } else {
        if (productQuantity.value <= 100) {
            cart.push(currentProductInfos());
        } else {
            alert("Le panier est limité à 100 produits identiques");
        }
    }

    console.log("Cart (JSON) : " + JSON.stringify(cart));

    localStorage.setItem("Cart", JSON.stringify(cart));

    alert("Votre sélection a bien été ajoutée au panier !");
});
