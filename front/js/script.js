// script.js correspond à la page d'accueil, index.html

const apiUrl = "http://localhost:3000/api/products";

// Cette fonction ajoute les éléments de contenu d'un produit sur la page d'accueil.
function appendContent(item) {
    const items = document.getElementById("items");
    const createLink = document.createElement("a");
    const createArticle = document.createElement("article");
    const createImg = document.createElement("img");
    const createH3 = document.createElement("h3");
    const createDescription = document.createElement("p");
    const createPrix = document.createElement("p");

    // On crée un lien dans la section qui a pour id "items"
    items.appendChild(createLink);
    createLink.setAttribute("href", "./product.html?id=" + item._id);

    // On crée un article dans le lien
    createLink.appendChild(createArticle);

    // On crée les balises "img, "h3" et "p" dans l'article
    createArticle.appendChild(createImg);
    createImg.setAttribute("src", item.imageUrl);
    createImg.setAttribute("alt", item.altTxt);

    createArticle.appendChild(createH3);
    createH3.innerText = item.name;

    createArticle.appendChild(createDescription);
    createDescription.className = "description";
    createDescription.innerText = item.description;

    createArticle.appendChild(createPrix);
    createPrix.className = "prix";
    createPrix.innerText = "Prix : " + item.price + " €";
}

// Afficher les données de l'API sur la page d'accueil
fetch(apiUrl)
    .then((res) => res.json())
    .then((products) => {
        // Le tableau products contient toutes les produits et leurs données issues de l'API.

        /* On crée une boucle d'une longueur du tableau products qui créera tous les éléments du DOM
        en récupérant dans products les valeurs à ajouter à chaque élément. */
        for (const product of products) {
            appendContent(product);
        }
    })
    .catch((err) => console.log("Erreur", err));
