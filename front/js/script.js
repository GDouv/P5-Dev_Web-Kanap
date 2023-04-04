// script.js correspond à la page d'accueil. (index.html)

const apiUrl = "http://localhost:3000/api/products";

const items = document.getElementById("items");

// Cette fonction ajoute un produit avec ses éléments de contenu sur la page d'accueil.
function appendContent(product) {
	// On crée tous les éléments HTML nécessaires pour afficher la fiche d'un produit.
	const createLink = document.createElement("a");
	const createArticle = document.createElement("article");
	const createImg = document.createElement("img");
	const createH3 = document.createElement("h3");
	const createDescription = document.createElement("p");
	const createPrice = document.createElement("p");

	// On crée un lien dans la section qui a pour id "items"
	items.appendChild(createLink);
	createLink.setAttribute("href", "./product.html?id=" + product._id);

	// On crée un article dans le lien
	createLink.appendChild(createArticle);

	// On crée les balises "img, "h3" et "p" dans l'article
	createArticle.appendChild(createImg);
	createImg.setAttribute("src", product.imageUrl);
	createImg.setAttribute("alt", product.altTxt);

	createArticle.appendChild(createH3);
	createH3.innerText = product.name;

	createArticle.appendChild(createDescription);
	createDescription.innerText = product.description;

	createArticle.appendChild(createPrice);
	createPrice.innerText = "Prix : " + product.price + " €";
}

// Affichage sur la page d'accueil des données de tous les produits issus de l'API.
async function displayProducts() {
	try {
		const response = await fetch(apiUrl);
		// Le tableau jsonProducts contient tous les produits et leurs données issus de l'API.
		const jsonProducts = await response.json();
		/* On crée une boucle d'une longueur du tableau products qui créera tous les éléments du DOM
        pour tous les produits en récupérant dans products les valeurs à ajouter à chaque élément. */
		for (const product of jsonProducts) {
			appendContent(product);
		}
	} catch (error) {
		console.error("Erreur lors de l'affichage des produits", error);
	}
}
displayProducts();
