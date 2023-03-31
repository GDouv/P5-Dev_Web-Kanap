// product.js correspond à la page produit qui affiche les détails d'un seul produit.

const apiUrl = "http://localhost:3000/api/products";

// Récupération de la liste des produits depuis le localStorage
let products = window.localStorage.getItem("products");

// Si les produits ne sont pas dans localStorage, cette fonction les y enregistre depuis l'API.
async function saveProductsInLocalStorage() {
	if (products === null) {
		try {
			const response = await fetch(apiUrl);
			// Le tableau jsonProducts contient tous les produits et leurs données issus de l'API.
			const jsonProducts = await response.json();
			window.localStorage.setItem(
				"products",
				JSON.stringify(jsonProducts)
			);
			products = jsonProducts;
			/* On recharge la page pour bien afficher le produit
			s'il n'était pas dans localStorage à la base */
			location.reload();
		} catch (error) {
			console.error(
				"Erreur lors de l'enregistrement des produits dans localStorage",
				error
			);
		}
	} else {
		products = JSON.parse(products);
	}
}

// On récupère dans des constantes tous les éléments nécessaires pour l'affichage du produit.
const productImg = document.querySelector(".item__img img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productColors = document.getElementById("colors");
const productQuantity = document.getElementById("quantity");

// On récupère dans l'URL l'id du produit actuellement affiché sur la page.
const pageHref = new URL(document.location.href);
const search_params = new URLSearchParams(pageHref.search);
const productIdFromUrl = search_params.get("id");

// Cette fonction vérifie si l'id affiché dans l'URL correspond à celui d'un produit existant.
function productExistVerification() {
	const correctUrl = products.find(
		(product) => product._id === productIdFromUrl
	);
	// Si le produit n'existe pas, on affiche une erreur 404.
	if (correctUrl === undefined) {
		document.querySelector("article").innerHTML =
			"<center><font size='14pt'>Erreur 404.</font size></center> <br><br/> L'article que vous cherchez n'existe pas !";
	}
}

// Cette fonction ajoute toutes les informations du produit à afficher sur la page.
function appendContent(item) {
	// On vérifie d'abord si l'id entrée dans l'URL est correcte,
	productExistVerification();

	// puis on ajoute le contenu.
	productImg.setAttribute("src", item.imageUrl);
	productTitle.innerText = item.name;
	productPrice.innerText = item.price;
	productDescription.innerText = item.description;
}

// Cette fonction ajoute les couleurs dans le menu déroulant.
function addColorsInColorsSelect(product) {
	// On récupère déjà le message "--SVP, choisissez un couleur --" de la première balise option.
	const chooseColorText = document.querySelector("#colors option").innerText;

	/* On boucle sur les couleurs du produit avec une boucle
	de la longueur du tableau "product.colors". */
	for (let i = 1; i <= product.colors.length; i++) {
		// On récupère l'emplacement de la couleur dans le menu déroulant.
		const productColorOption = document.querySelector(
			"#colors :nth-child(" + [i + 1] + ")"
		);
		// On récupère la couleur à afficher dans le tableau "product.colors".
		const color = product.colors[i - 1];

		/* On ajoute enfin les couleurs dans le menu déroulant en écrasant
		les 2 couleurs de l'exemple du template. */
		if (i <= 2) {
			productColorOption.innerText = color;
			productColorOption.setAttribute("value", color.toLowerCase());
		} else {
			const createOption = document.createElement("option");
			const newOption = productColors.appendChild(createOption);
			newOption.innerText = color;
			newOption.setAttribute("value", color.toLowerCase());
		}
	}

	// On remet le message "--SVP, choisissez une couleur --" dans la première balise option.
	document.querySelector("#colors option").innerText = chooseColorText;
}

async function callFunctionsOnCurrentProduct() {
	try {
		const response = await fetch(apiUrl + "/" + productIdFromUrl);
		// currentProduct contient les information du produit dont l'id est dans l'URL.
		const currentProduct = await response.json();

		// On enrigistre les produits dans localStorage s'ils n'y sont pas.
		saveProductsInLocalStorage();
		// On entre les informations du produit dans la page.
		appendContent(currentProduct);
		// On ajoute le choix des couleurs dans le menu déroulant.
		addColorsInColorsSelect(currentProduct);
	} catch (error) {
		console.error("Erreur lors de l'exécution du script", error);
	}
}
callFunctionsOnCurrentProduct();

/* On crée un tableau pour le panier et on récupère le contenu du panier dans localStorage
si il existe déjà. */
let cart = [];
if (localStorage.getItem("Cart") != null) {
	cart = JSON.parse(localStorage.getItem("Cart"));
}

// Sauvegarde les infos du produit affiché dans l'objet jsonProduct.
function currentProduct() {
	const jsonProduct = {
		id: productIdFromUrl,
		quantity: parseInt(productQuantity.value),
		color: productColors.value,
	};

	return jsonProduct;
}

/* Cette fonction retrouve dans le panier le produit affiché
et retourne ses informations ou "undefined" s'il n'est pas présent. */
function findProductInCart() {
	const result = cart.find(
		(product) =>
			product.id === productIdFromUrl &&
			product.color === productColors.value
	);
	return result;
}

/* Cette fonction retourne l'index dans le panier du produit
trouvé par la fonction "findProductInCart". */
function productIndexInCart() {
	return cart.indexOf(findProductInCart());
}

/* Cette fonction vérifie si ce produit est déjà dans le panier ou pas,
retourne true ou false. */
function productIsInCart() {
	let inCart = false;
	if (findProductInCart() !== undefined) {
		inCart = true;
	}
	return inCart;
}

/* On ajoute le produit sélectionné au panier (ou on met à jour la quantité si 
l'article est déjà présent), dans la limite de 100 produits identiques. */
document.getElementById("addToCart").addEventListener("click", function () {
	// On vérifie si l'utilisateur a choisi une couleur.
	if (productColors.value.length < 1) {
		alert("Veuillez sélectionner une couleur");

		// On vérifie si l'utilisateur a choisi une quantité.
	} else if (productQuantity.value < 1) {
		alert(
			"Veuillez saisir un nombre valide d'article(s) à ajouter au panier"
		);

		// Si le produit choisi est déjà dans la panier, on ajoute la quantité sélectionnée.
	} else if (productIsInCart()) {
		cart[productIndexInCart()].quantity =
			parseInt(cart[productIndexInCart()].quantity) +
			parseInt(productQuantity.value);

		if (cart[productIndexInCart()].quantity <= 100) {
			localStorage.setItem("Cart", JSON.stringify(cart));
			alert("La quantité de cet article a bien été mise à jour !");
		}

		// On annule l'ajout si la quantité obtenue devient supérieure à 100 articles identiques.
		if (cart[productIndexInCart()].quantity > 100) {
			cart[productIndexInCart()].quantity =
				parseInt(cart[productIndexInCart()].quantity) -
				parseInt(productQuantity.value);
			// On remet le contenu du panier dans localStorage s'il avait été supprimé
			localStorage.setItem("Cart", JSON.stringify(cart));
			alert("Le panier est limité à 100 produits identiques !");
		}

		/* On ajoute le produit au panier s'il n'y était pas déjà, tout en vérifiant si
		la quantité ne dépasse pas la limite de 100 articles identiques. */
	} else {
		if (productQuantity.value <= 100) {
			cart.push(currentProduct());
			// On sauvegarde le panier dans localStorage.
			localStorage.setItem("Cart", JSON.stringify(cart));
			alert("Votre sélection a bien été ajoutée au panier !");
		} else {
			alert("Le panier est limité à 100 produits identiques !");
		}
	}
});
