const url = "http://localhost:3000/api/products";

// On récupère tous les éléments nécessaires dans des constantes.
const productImg = document.querySelector(".item__img img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productColors = document.getElementById("colors");
const productQuantity = document.getElementById("quantity");

// On récupère l'id du produit affiché dans l'URL
const pageHref = new URL(document.location.href);
const search_params = new URLSearchParams(pageHref.search);
const productId = search_params.get("id");
console.log("productId : " + productId);

fetch(url + "/" + productId)
    .then((res) => res.json())
    .then((currentProduct) => {
        console.log("currentProduct :");
        console.log(currentProduct);

        // On entre les informations du produit dans la page
        productImg.setAttribute("src", currentProduct.imageUrl);
        productTitle.innerText = currentProduct.name;
        productPrice.innerText = currentProduct.price;
        productDescription.innerText = currentProduct.description;

        // Toute la suite de ce fetch est consacrée au menu de choix des couleurs, on peut peut-être faire plus simple.
        const chooseColorText =
            document.querySelector("#colors option").innerText;

        for (let i = 0; i <= 2; i++) {
            const getExistingColors = document.querySelector(
                "#colors :nth-child(" + [i + 1] + ")"
            );
            const currentProductColor = currentProduct.colors[i - 1];
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
            const createOption = document.createElement("option");
            const newOption = productColors.appendChild(createOption);
            newOption.innerText = currentProduct.colors[2];
            newOption.setAttribute(
                "value",
                currentProduct.colors[2].toLowerCase()
            );
        }

        if (currentProduct.colors.length > 3) {
            const createOption = document.createElement("option");
            const newOption = productColors.appendChild(createOption);
            newOption.innerText = currentProduct.colors[3];
            newOption.setAttribute(
                "value",
                currentProduct.colors[3].toLowerCase()
            );
        }
        // Façon d'ajouter les couleurs un peu bizarre, à améliorer. (Et passer les couleurs en français ?)
    })
    .catch((err) => console.log("Erreur", err));

// On crée un tableau pour le panier et on récupère le contenu du panier dans localStorage si il en existe un.
let cart = [];
if (localStorage.getItem("Cart") != null) {
    cart = JSON.parse(localStorage.getItem("Cart"));
}

// Sauvegarde les infos du produit sélectionné dans l'objet JSON jsonProduct
let currentProductInfos = function () {
    let jsonProduct = {
        id: productId,
        quantity: productQuantity.value,
        color: productColors.value,
    };

    return jsonProduct;
};

// On retrouve le produit sélectionné dans le panier
let productFound = function () {
    let result = cart.find(
        (product) =>
            product.id === productId && product.color === productColors.value
    );
    return result;
};

// On trouve l'index du produit sélectionné productFound dans le panier
let productFoundIndex = function () {
    return cart.indexOf(productFound());
};

// On détermine si ce produit était déjà dans le panier ou pas
let productIsInCart = function () {
    console.log(
        "Ce produit est déjà dans le panier (JSON) : " +
            JSON.stringify(productFound())
    );
    let inCart = false;
    if (productFound() !== undefined) {
        inCart = true;
    }
    return inCart;
};

// On ajoute le produit sélectionné au panier ou on met à jour la quantité dans le panier, dans la limite de 100 produits identiques
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

    // On sauvegarde le panier dans localStorage
    localStorage.setItem("Cart", JSON.stringify(cart));

    alert("Votre sélection a bien été ajoutée au panier !");
});
