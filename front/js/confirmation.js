/* confirmation.js correspond à la page de confirmation sur laquelle on est 
redirigé après avoir validé le formulaire de commande. */

/* On vide le localStorage pour avoir de nouveau un panier vide
et ne pas stocker en local les informations de l'utilisateur. */
localStorage.clear();

document.getElementById("orderId").innerHTML = new URL(
	window.location.href
).searchParams.get("id");

const thanks = document.createElement("p");

thanks.innerText = "Kanap vous remercie pour votre commande !";

document.querySelector(".confirmation p").appendChild(thanks);
