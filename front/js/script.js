let url = 'http://localhost:3000/api/products';

// Afficher les données de l'API dans la console
fetch(url)
.then(res => res.json())
.then((data) => {
    
    console.log(data);

    // On sélectionne la section qui a pour id "items"
    let items = document.getElementById("items");

    // On crée une boucle d'une longueur du tableau data qui créera tous les éléments.
    for (let i = 0; i < data.length; i++) {

        // On crée un lien dans la section qui a pour id "items"
        let createLink = document.createElement('a');
        items.appendChild(createLink);

        // On crée un article dans le lien
        let createArticle = document.createElement('article');
        createLink.appendChild(createArticle);

        // On crée les balises "img, "h3" et "p" dans l'article
        let createImg = document.createElement('img');
        createArticle.appendChild(createImg);

        let createH3 = document.createElement('h3');
        createArticle.appendChild(createH3);

        let createDescription = document.createElement('p');
        let createPrix = document.createElement('p');
        createArticle.appendChild(createDescription);
        createArticle.appendChild(createPrix);
        createDescription.className = "description";
        createPrix.className = "prix";
    }

    

    /* On crée une boucle qui itère selon la longueur du tableau data afin d'insérer les 
    id, titres, images, alts, descriptions et prix des produits. */
    for (let i = 0; i < data.length; i++) {
        document.querySelectorAll("a article img")[i].setAttribute("src", data[i].imageUrl);
        document.querySelectorAll("a article img")[i].setAttribute("alt", data[i].altTxt);
        document.querySelectorAll("a article h3")[i].innerText = data[i].name;
        document.getElementsByClassName("description")[i].innerText = data[i].description;
        document.getElementsByClassName("prix")[i].innerText = "Prix : " + data[i].price + " €";        
        document.querySelectorAll("section a")[i].setAttribute("href", "./product.html?id=" + data[i]._id);
    }

    // let url = window.location.href;
    // url += "?" + 
})
.catch(err => console.log("Erreur", err));

