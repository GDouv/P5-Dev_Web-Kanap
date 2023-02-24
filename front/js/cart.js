// On récupère les données du panier depuis localStorage
const cart = JSON.parse(localStorage.getItem("Cart"));

// Cette focntion permet de traduire les couleurs utilisées sur le site pour les afficher en français dans le panier.
function cartTranslatedColors() {
    let cartFrenchColors = cart;
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(green)+/g, "Vert")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(white)+/g, "Blanc")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(black)+/g, "Noir")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(yellow)+/g, "Jaune")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(red)+/g, "Rouge")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(orange)+/g, "Orange")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(pink)+/g, "Rose")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(grey)+/g, "Gris")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(purple)+/g, "Violet")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(navy)+/g, "Bleu marine")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(silver)+/g, "Argenté")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(brown)+/g, "Marron")
    );
    cartFrenchColors = JSON.parse(
        JSON.stringify(cartFrenchColors).replaceAll(/(blue)+/g, "Bleu")
    );
    return cartFrenchColors;
}
console.log("Cart (translated colors) :");
console.log(cartTranslatedColors());

const apiUrl = "http://localhost:3000/api/products";

// Constantes pour accéder aux différents éléments de la page
const cartItems = document.getElementById("cart__items");

const totalPrice = document.getElementById("totalPrice");
const totalQuantity = document.getElementById("totalQuantity");

const orderButton = document.getElementById("order");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");

// Regex
const regexFirstName =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçœčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{2,47}$/u;
const regexLastName =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçœčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{1,47}$/u;
const regexAddress = /^[a-zA-Z0-9àâäèéêëîïôöûüÿçœÀÂÄÈÉÊËÎÏÔÖÛÜŸÇŒ ,'-]{3,}$/u;
const regexCity = /^[a-zA-ZàâäèéêëîïôöûüÿçœÀÂÄÈÉÊËÎÏÔÖÛÜŸÇŒ ,'-]{1,}$/u;
const regexEmail = /^[a-zA-Z0-9\.-]+@{1}([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]{2,4}$/u;

// Messages d'erreur setup
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
firstNameErrorMsg.innerText = "Veuillez saisir votre prénom";
firstNameErrorMsg.style.display = "none";

const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
lastNameErrorMsg.innerText = "Veuillez saisir votre nom";
lastNameErrorMsg.style.display = "none";

const addressErrorMsg = document.getElementById("addressErrorMsg");
addressErrorMsg.innerText = "Veuillez saisir une adresse valide";
addressErrorMsg.style.display = "none";

const cityErrorMsg = document.getElementById("cityErrorMsg");
cityErrorMsg.innerText = "Veuillez saisir votre ville";
cityErrorMsg.style.display = "none";

const emailErrorMsg = document.getElementById("emailErrorMsg");
emailErrorMsg.innerText = "Veuillez saisir une adresse email valide";
emailErrorMsg.style.display = "none";

// On crée un tableau products et on y insère les id des produits uniquement, car la validation de commande ne gère pas encore les couleurs et les quantités
let products = [];
for (element of cart) {
    products.push(element.id);
}

fetch(apiUrl)
    .then((res) => res.json())
    .then((apiInfos) => {
        console.log("API Infos :");
        console.log(apiInfos);

        cloneArticle();

        // Permet d'afficher tous les produits du panier sur la page panier
        // Je ne sais pas comment extraire cette fonction du fetch (impossible ?) car si je le fais et que je l'appelle, les produits ne s'affichent pas.
        function getCartProducts() {
            for (let i in cart) {
                const eachArticle = cartItems.children[i];
                const eachArticleId = cart[i].id;

                function productFound() {
                    const result = apiInfos.find(
                        (product) => product._id === eachArticleId
                    );
                    return result;
                }

                function productFoundIndex() {
                    return apiInfos.indexOf(productFound());
                }

                const apiProduct = apiInfos[productFoundIndex()];

                eachArticle
                    .querySelector(".cart__item__img img")
                    .setAttribute("src", apiProduct.imageUrl);
                eachArticle.querySelector(
                    ".cart__item__content__description h2"
                ).innerText = apiProduct.name;
                eachArticle.querySelector(
                    ".cart__item__content__description p"
                ).innerText = cartTranslatedColors()[i].color;
                const eachArticlePrice = eachArticle.querySelector(
                    ".cart__item__content__description p:nth-of-type(2)"
                );
                eachArticlePrice.innerText = apiProduct.price + ",00 €";
                eachArticlePrice.classList.add("cart__item__price");
                eachArticlePrice.dataset.price = apiProduct.price;
                eachArticle.querySelector(".itemQuantity").value =
                    cart[i].quantity;

                eachArticle.dataset.id = eachArticleId;
                eachArticle.dataset.color = cart[i].color;
            }
        }
        getCartProducts();

        changeProductQuantity();

        deleteProduct();

        document.querySelector("#totalQuantity").innerText = cart.length;

        calculateTotalPrice();

        validateFormInfos();
    })
    .catch((err) =>
        console.log("Erreur lors de la récupération des données de l'API", err)
    );

// Cette fonction sert à dupliquer le front de l'objet dans le panier pour afficher plusieurs objets dans le panier.
function cloneArticle() {
    for (let i in cart) {
        // console.log("Produit n°" + parseInt(parseInt([i]) + 1) + " dans le panier : " + JSON.stringify(cart[i]))

        if (i > 0) {
            const productInCartItem = cartItems.children[0];
            const cloneArticle = productInCartItem.cloneNode(true);
            cartItems.appendChild(cloneArticle);
        }
    }

    if (cart.length < 1) {
        const emptyCartItem = cartItems.children[0];
        emptyCartItem.remove();
        let createP = cartItems.appendChild(document.createElement("p"));
        createP.textContent = "Votre panier est vide !";
    }
}

// Cette fonction sert à mettre à jour la quantité d'un produit
function changeProductQuantity() {
    const productQuantity = document.querySelectorAll(".itemQuantity");

    productQuantity.forEach((product) =>
        product.addEventListener("change", function () {
            const productId = this.closest("article").dataset.id;
            const productColor = this.closest("article").dataset.color;

            function productFoundIndex() {
                const result = cart.find(
                    (product) =>
                        product.id === productId &&
                        product.color === productColor
                );
                return cart.indexOf(result);
            }

            if (this.value <= 100) {
                cart[productFoundIndex()].quantity = this.value;
            } else {
                alert("Le panier est limité à 100 produits identiques");
            }

            console.log("Cart quantity changed : ");
            console.log(cart);
            localStorage.setItem("Cart", JSON.stringify(cart));

            calculateTotalPrice();
        })
    );
}

// On peut peut-être extraire la fonction productFoundIndex des fonctions deleteProduct et changeProductQuantity,
// mais les constantes productId et productcolor n'ont l'air de fonctionner qu'à l'intérieur de ces fonctions.
// Cette fonction permet de supprimer un produit du panier
function deleteProduct() {
    const deleteButtons = document.querySelectorAll(".deleteItem");

    deleteButtons.forEach((button) =>
        button.addEventListener("click", function () {
            const deleteConfirm = confirm("Supprimer l'élément ?");
            if (deleteConfirm) {
                const productId = this.closest("article").dataset.id;
                const productColor = this.closest("article").dataset.color;

                function productFoundIndex() {
                    const result = cart.find(
                        (product) =>
                            product.id === productId &&
                            product.color === productColor
                    );
                    return cart.indexOf(result);
                }

                cart.splice(productFoundIndex(), 1);
                localStorage.setItem("Cart", JSON.stringify(cart));
                document.location.reload();
            }
        })
    );
}

// Cette fonction calcul le prix total des articles dans le panier
function calculateTotalPrice() {
    const articlesPrices = document.querySelectorAll(".cart__item__price");

    let totalPriceAddition = 0;
    let productQuantityAddition = 0;

    for (let i = 0; i < articlesPrices.length; i++) {
        const productQuantity = cart[i].quantity;

        totalPriceAddition +=
            productQuantity * parseInt(articlesPrices[i].dataset.price);
        productQuantityAddition += parseInt(productQuantity);
    }

    totalPrice.innerText = totalPriceAddition + ",00";
    totalQuantity.innerText = productQuantityAddition;
}

/* Cette fonction permet de vérifier que les informations entrée par l'utilisateur ont un format correct,
d'afficher des messages d'erreur si ce n'est pas le cas,
et d'envoyer les données à l'API puis d'être redirigé vers la page confirmation.
*/
function validateFormInfos() {
    orderButton.addEventListener("click", function (e) {
        e.preventDefault();

        const contact = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            address: addressInput.value,
            city: cityInput.value,
            email: emailInput.value,
        };

        console.log(" contact  : ");
        console.log(contact);

        // Tests grâce aux regex
        const testFirstName = regexFirstName.test(firstNameInput.value);
        const testLastName = regexLastName.test(lastNameInput.value);
        const testAddress = regexAddress.test(addressInput.value);
        const testCity = regexCity.test(cityInput.value);
        const testEmail = regexEmail.test(emailInput.value);

        if (testFirstName) {
            firstNameInput.value =
                firstNameInput.value.charAt(0).toUpperCase() +
                firstNameInput.value.slice(1);
            firstNameErrorMsg.style.display = "none";
        } else {
            firstNameErrorMsg.style.display = "inline";
        }

        if (testLastName) {
            lastNameErrorMsg.style.display = "none";
            lastNameInput.value =
                lastNameInput.value.charAt(0).toUpperCase() +
                lastNameInput.value.slice(1);
        } else {
            lastNameErrorMsg.style.display = "inline";
        }

        if (testAddress) {
            addressErrorMsg.style.display = "none";
        } else {
            addressErrorMsg.style.display = "inline";
        }

        if (testCity) {
            cityInput.value =
                cityInput.value.charAt(0).toUpperCase() +
                cityInput.value.slice(1);
            cityErrorMsg.style.display = "none";
        } else {
            cityErrorMsg.style.display = "inline";
        }

        if (testEmail) {
            emailInput.value = emailInput.value.toLowerCase();
            emailErrorMsg.style.display = "none";
        } else {
            emailErrorMsg.style.display = "inline";
        }

        if (
            testFirstName &&
            testLastName &&
            testAddress &&
            testCity &&
            testEmail
        ) {
            localStorage.setItem("Contact", JSON.stringify(contact));

            // Il faut que products soit un array
            const postData = {
                contact,
                products,
            };

            console.log("postData : ---> ");
            console.log(postData);

            // On envoie les données sous le format requis dans une requête POST à l'API
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Headers":
                        "Origin, Content, Accept, Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Methods",
                    "Access-Control-Allow-Methods":
                        "DELETE, POST, GET, OPTIONS, PATCH, PUT",
                    "Access-Control-Allow-Origin": "*",
                    // Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            })
                .then((res) => res.json())
                .then((data) => {
                    document.location.href =
                        "confirmation.html?id=" + data.orderId;
                });
        }
    });
}

/*
function validateFormInfosOld() {
    
    // FIRST NAME TEST
    const regexFirstName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçœčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{2,47}$/u

    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
    firstNameErrorMsg.innerText = "Veuillez saisir votre prénom"
    firstNameErrorMsg.style.display = "none"

    orderButton.addEventListener("click", function(e) {
        const testFirstName = regexFirstName.test(firstNameInput.value)

        if (testFirstName) {
            firstNameInput.value = firstNameInput.value.charAt(0).toUpperCase() + firstNameInput.value.slice(1)
            firstNameErrorMsg.style.display = "none"
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
            lastNameErrorMsg.style.display = "none"
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
            addressErrorMsg.style.display = "none"
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
            cityErrorMsg.style.display = "none"
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
            emailErrorMsg.style.display = "none"
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
*/

// Trouver un meilleur moyen d'afficher les messages d'erreur : si valide, afficher message i, etc (pour éviter les répétitions)

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
    setItem Contact dans localStorage (si fonction non séparée)
}
Tester validateFormInfosV2
Corriger les bugs éventuels
Déployer validateFormInfosV2
Commenter validateFormInfos
*/
