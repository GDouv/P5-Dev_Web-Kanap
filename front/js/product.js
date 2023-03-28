// product.js correspond à la page produit qui affiche les détails d'un seul produit.

const apiUrl = "http://localhost:3000/api/products";

// Récupération de la liste des produits depuis le localStorage
let products = window.localStorage.getItem("products");

function saveProductsInLocalStorage() {
	// si les produits ne sont pas dans localStorage, on les y enregistre depuis l'api
	if (products === null) {
		fetch(apiUrl)
			.then((res) => res.json())
			.then((products) => {
				const jsonProducts = JSON.stringify(products);
				window.localStorage.setItem("products", jsonProducts);
				products = JSON.parse(products);

				//productExistVerification();
			});
	} else {
		products = JSON.parse(products);
	}
}

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
const productIdFromUrl = search_params.get("id");

function productExistVerification() {
	const correctUrl = products.find(
		(product) => product._id === productIdFromUrl
	);
	// si le produit n'existe pas, on affiche une erreur 404.
	if (correctUrl === undefined) {
		document.querySelector("article").innerHTML =
			"<center><font size='14pt'>Erreur 404.</font size></center> <br><br/> L'article que vous cherchez n'existe pas !";
	}
}

// Cette fonction ajoute toutes les informations du produit affiché sur la page.
function appendContent(item) {
	productExistVerification();
	// On vérifie si l'id dans l'URL de la page correspond à l'id d'un produit existant.
	productImg.setAttribute("src", item.imageUrl);
	productTitle.innerText = item.name;
	productPrice.innerText = item.price;
	productDescription.innerText = item.description;
}

// Cette fonction ajoute les couleurs dans le menu déroulant.
function addColorsInColorsSelect(color) {
	const chooseColorText = document.querySelector("#colors option").innerText;

	for (let i = 0; i <= 2; i++) {
		const getProductColors = document.querySelector(
			"#colors :nth-child(" + [i + 1] + ")"
		);
		const currentProductColor = color.colors[i - 1];
		getProductColors.innerText = currentProductColor;
		if (i > 0) {
			getProductColors.setAttribute(
				"value",
				currentProductColor.toLowerCase()
			);
		}
	}

	document.querySelector("#colors option").innerText = chooseColorText;

	if (color.colors.length > 2) {
		const createOption = document.createElement("option");
		const newOption = productColors.appendChild(createOption);
		newOption.innerText = color.colors[2];
		newOption.setAttribute("value", color.colors[2].toLowerCase());
	}

	if (color.colors.length > 3) {
		const createOption = document.createElement("option");
		const newOption = productColors.appendChild(createOption);
		newOption.innerText = color.colors[3];
		newOption.setAttribute("value", color.colors[3].toLowerCase());
	}
} // Améliorer la façon d'ajouter les couleurs ?

fetch(apiUrl + "/" + productIdFromUrl)
	.then((res) => res.json())
	// Current product contient les information en JSON du produit dont l'id est dans l'URL.
	.then((currentProduct) => {
		saveProductsInLocalStorage();
		// On entre les informations du produit dans la page.
		appendContent(currentProduct);

		// On ajoute le choix des couleurs dans le menu déroulant.
		addColorsInColorsSelect(currentProduct);
	})
	.catch((err) => console.log("Erreur", err));

// On crée un tableau pour le panier et on récupère le contenu du panier dans localStorage si il existe déjà.
// Sert à éviter que tout le contenu de localStorage ne soit remplacé lors de l'ajout de plusieurs produits différents.
let cart = [];
if (localStorage.getItem("Cart") != null) {
	cart = JSON.parse(localStorage.getItem("Cart"));
}

// Sauvegarde les infos du produit sélectionné dans l'objet JSON jsonProduct
function currentProduct() {
	const jsonProduct = {
		id: productIdFromUrl,
		quantity: productQuantity.value,
		color: productColors.value,
	};

	return jsonProduct;
}

// Cette fonction retrouve dans le panier le produit affiché.
function findProductInCart() {
	const result = cart.find(
		(product) =>
			product.id === productIdFromUrl &&
			product.color === productColors.value
	);
	return result;
}

// Cette fonction retourne l'index dans le panier du produit sélectionné "findProductInCart".
function productIndexInCart() {
	return cart.indexOf(findProductInCart());
}

// Cette fonction vérifie si ce produit est déjà dans le panier ou pas, renvoie true ou false.
function productIsInCart() {
	console.log(
		"Ce produit est déjà dans le panier (JSON) : " +
			JSON.stringify(findProductInCart())
	);
	let inCart = false;
	if (findProductInCart() !== undefined) {
		inCart = true;
	}
	return inCart;
}

// On ajoute le produit sélectionné au panier (ou on met à jour la quantité si l'article est déjà présent), dans la limite de 100 produits identiques.
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
		console.log("Index du produit : " + productIndexInCart());
		cart[productIndexInCart()].quantity =
			parseInt(cart[productIndexInCart()].quantity) +
			parseInt(productQuantity.value);

		// On annule l'ajout si la quantité obtenue devient supérieure à 100 articles identiques.
		if (cart[productIndexInCart()].quantity > 100) {
			cart[productIndexInCart()].quantity =
				parseInt(cart[productIndexInCart()].quantity) -
				parseInt(productQuantity.value);
			alert("Le panier est limité à 100 produits identiques");
		}

		// On ajoute le produit au panier s'il n'y était pas déjà, tout en vérifiant si la quantité ne dépasse pas la limite de 100 articles identiques.
	} else {
		if (productQuantity.value <= 100) {
			cart.push(currentProduct());
		} else {
			alert("Le panier est limité à 100 produits identiques");
		}
	}

	if (
		productQuantity.value > 0 &&
		productQuantity.value <= 100 &&
		cart[productIndexInCart()].quantity > 100
	) {
		// On sauvegarde le panier dans localStorage.
		localStorage.setItem("Cart", JSON.stringify(cart));
		alert("Votre sélection a bien été ajoutée au panier !");
	}
});
