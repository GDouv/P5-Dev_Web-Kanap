const id = new URL(window.location.href).searchParams.get("id");

const orderId = document.getElementById("orderId");

orderId.innerHTML = id;

let thanks = document.createElement("p");

thanks.textContent = "Kanap vous remercie pour votre commande !";

document.querySelector(".confirmation p").appendChild(thanks);

localStorage.clear();
