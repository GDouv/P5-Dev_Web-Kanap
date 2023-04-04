// cart.js correspond à la page panier.

// On récupère les données du panier depuis localStorage.
const cartLocalStorage = localStorage.getItem("Cart");
let cart = [];
if (cartLocalStorage !== null) {
	cart = JSON.parse(cartLocalStorage);
}

// Cette focntion permet de traduire les couleurs utilisées sur le site pour les afficher en français dans le panier.
function translateColors() {
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

const apiUrl = "http://localhost:3000/api/products";

// Constantes pour accéder aux différents éléments de la page
const productsInCart = document.getElementById("cart__items");
const productInCart = document.querySelector(".cart__item");

const totalPrice = document.getElementById("totalPrice");
const totalQuantity = document.getElementById("totalQuantity");

const orderButton = document.getElementById("order");
const firstNameInput = document.getElementById("firstName");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameInput = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressInput = document.getElementById("address");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityInput = document.getElementById("city");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailInput = document.getElementById("email");
const emailErrorMsg = document.getElementById("emailErrorMsg");

// Regex pour les champs du formulaire
const regexFirstName = /^[\p{L} '-]{2,30}$/u;
const regexLastName = /^[\p{L} '-]{1,30}$/u;
const regexAddress = /^[\p{L}0-9 ,'-]{3,}$/u;
const regexCity = /^[\p{L} ,'-]{1,}$/u;
const regexEmail = /^[a-zA-Z0-9_\.-]+@{1}([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]{2,4}$/u;

// Messages d'erreur pour les champs du formulaire
firstNameErrorMsg.innerText = "Veuillez saisir votre prénom";
firstNameErrorMsg.style.display = "none";
lastNameErrorMsg.innerText = "Veuillez saisir votre nom";
lastNameErrorMsg.style.display = "none";
addressErrorMsg.innerText = "Veuillez saisir une adresse valide";
addressErrorMsg.style.display = "none";
cityErrorMsg.innerText = "Veuillez saisir votre ville";
cityErrorMsg.style.display = "none";
emailErrorMsg.innerText = "Veuillez saisir une adresse email valide";
emailErrorMsg.style.display = "none";

/* On crée un tableau products et on y insère les id des produits uniquement,
car la validation de commande ne gère pas encore les couleurs et les quantités. */
let products = [];
for (element of cart) {
	products.push(element.id);
}

// Cette fonction supprime l'élément exemple. (fonctionne aussi quand le panier est vide)
function deleteExample() {
	productsInCart.removeChild(document.getElementsByTagName("article")[0]);
}

// Cette fonction trouve le produit du panier dans l'API et en retourne l'index.
function productIndexInApi(apiProducts, articleId) {
	const result = apiProducts.find((product) => product._id === articleId);
	return apiProducts.indexOf(result);
}

// Cette fonction affiche tous les produits du panier sur la page.
function displayProductsFromCart(apiProducts) {
	// On crée une boucle qui itère sur chaque produit dans le panier ("cart").
	for (let i in cart) {
		// Duplication du noeud dans le DOM pour afficher le nombre de produits requis.
		productsInCart.appendChild(productInCart.cloneNode(true));

		// Création des constantes à utiliser dans cette boucle.
		const article = productsInCart.children[i];
		const articleId = cart[i].id;
		const articlePrice = article.querySelector(
			".cart__item__content__description p:nth-of-type(2)"
		);
		const articleInfos =
			apiProducts[productIndexInApi(apiProducts, articleId)];

		// Affichage des informations pour chaque produit dans le panier.
		article
			.querySelector(".cart__item__img img")
			.setAttribute("src", articleInfos.imageUrl);
		article.querySelector(
			".cart__item__content__description h2"
		).innerText = articleInfos.name;
		article.querySelector(".cart__item__content__description p").innerText =
			translateColors()[i].color;
		articlePrice.innerText = articleInfos.price + ",00 €";
		articlePrice.classList.add("cart__item__price");
		article.querySelector(".itemQuantity").value = cart[i].quantity;

		// Affichage du nombre total d'articles dans le panier.
		totalQuantity.innerText = cart.length;

		// Ajout avec "dataset" des datas utiles plus tard pour les produits affichés.
		articlePrice.dataset.price = articleInfos.price;
		article.dataset.id = articleId;
		article.dataset.color = cart[i].color;
	}
}

// Cette fonction calcule le prix total et la quantité totale des articles dans le panier.
function calculateTotalPriceAndQuantity() {
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

// Cette fonction retourne l'index du produit dans le panier.
function productIndexInCart(productId, productColor) {
	const result = cart.find(
		(product) => product.id === productId && product.color === productColor
	);
	return cart.indexOf(result);
}

// Cette fonction sert à mettre à jour la quantité d'un produit en utilisant l'input "Qté".
function changeProductQuantity() {
	const productQuantity = document.querySelectorAll(".itemQuantity");

	productQuantity.forEach((product) =>
		product.addEventListener("change", function () {
			const productId = this.closest("article").dataset.id;
			const productColor = this.closest("article").dataset.color;

			if (this.value <= 100 && this.value >= 1) {
				cart[productIndexInCart(productId, productColor)].quantity =
					this.value;
			} else if (this.value > 100) {
				alert("Le panier est limité à 100 produits identiques");
			} else {
				alert("Veuillez entrer un nombre valide d'article(s)");
			}

			localStorage.setItem("Cart", JSON.stringify(cart));

			calculateTotalPriceAndQuantity();
		})
	);
}

// Cette fonction permet de supprimer un produit du panier
function deleteProduct() {
	const deleteButtons = document.querySelectorAll(".deleteItem");

	deleteButtons.forEach((button) =>
		button.addEventListener("click", function () {
			const deleteConfirm = confirm("Supprimer l'élément ?");
			if (deleteConfirm) {
				const productId = this.closest("article").dataset.id;
				const productColor = this.closest("article").dataset.color;

				cart.splice(productIndexInCart(productId, productColor), 1);
				localStorage.setItem("Cart", JSON.stringify(cart));
				document.location.reload();
			}
		})
	);
}

/* Cette fonction permet de vérifier que les informations entrée par l'utilisateur ont un format correct,
d'afficher des messages d'erreur si ce n'est pas le cas,
et d'envoyer les données à l'API puis d'être redirigé vers la page confirmation. */
function validateFormInfos() {
	orderButton.addEventListener("click", function (e) {
		e.preventDefault();

		if (cartLocalStorage === null || cartLocalStorage === "[]") {
			alert("Votre panier est vide !");
		} else {
			const contact = {
				firstName: firstNameInput.value,
				lastName: lastNameInput.value,
				address: addressInput.value,
				city: cityInput.value,
				email: emailInput.value,
			};

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
				testEmail &&
				cartLocalStorage !== null &&
				cartLocalStorage !== "[]"
			) {
				const postData = {
					contact,
					products,
				};

				sendOrderInfos(postData, contact);
			}
		}
	});
}

/* Cette fonction permet d'envoyer une requête POST à l'API pour valider la commande et d'être
redirigé vers la page confirmation si les informations entrées sont correcte et confirmées par
l'utilisateur. */
async function sendOrderInfos(postData, contact) {
	try {
		const response = await fetch(
			"http://localhost:3000/api/products/order",
			{
				method: "POST",
				headers: {
					"Access-Control-Allow-Headers":
						"Origin, Content, Accept, Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Methods",
					"Access-Control-Allow-Methods":
						"DELETE, POST, GET, OPTIONS, PATCH, PUT",
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(postData),
			}
		);
		const data = await response.json();
		const formValidationConfirm = confirm(
			`\nValider la commande de ${totalQuantity.innerText} articles pour un total de ${totalPrice.innerText} € ?\n\nPrénom: ${contact.firstName}\nNom: ${contact.lastName}\nAdresse: ${contact.address}\nVille: ${contact.city}\nEmail: ${contact.email}`
		);
		console.log(products);
		if (formValidationConfirm) {
			document.location.href = "confirmation.html?id=" + data.orderId;
		}
	} catch (error) {
		console.error(
			"Erreur lors de l'envoi des données au serveur pour valider la commande",
			error
		);
	}
}

async function main() {
	try {
		const response = await fetch(apiUrl);
		const apiProducts = await response.json();
		deleteExample();

		displayProductsFromCart(apiProducts);

		calculateTotalPriceAndQuantity();

		changeProductQuantity();

		deleteProduct();

		validateFormInfos();
	} catch (error) {
		console.error("Erreur lors de l'exécution du script", error);
	}
}
main();
