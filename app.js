// Listen to the form being submitted
document
    .querySelector("#destination_details_form")
    .addEventListener("submit", handleFormSubmit, loadImage)


for(let i = 0; i < localStorage.length; i++){
    let tempInfo = localStorage.getItem(localStorage.key(i))
    let info = JSON.parse(tempInfo)
    let tempCard = createDestinationCard(info[0], info[1], info[2], info[3])
    document
        .querySelector("#destinations_container")
        .appendChild(tempCard)
}

function handleFormSubmit(event) {
    // Function to handle the #destination_details_form being submitted

    event.preventDefault(); // stop the form from refreshing the page

    // Extract the values of the different elements of the form and store them in variables
    let destinationName = event.target.elements["name"].value;
    let destinationLocation = event.target.elements["location"].value;
    let destinationPhoto = event.target.elements["photo"].value;
    let destinationDesc = event.target.elements["description"].value;

    localStorage.setItem(destinationName, JSON.stringify([destinationName, destinationLocation, destinationPhoto, destinationDesc]))

    // Reset the form elements values for a new entry
    resetFormValues(event.target);

    // Use the form elements values to create a destination card
    const destinationCard = createDestinationCard(
        destinationName,
        destinationLocation,
        destinationPhoto,
        destinationDesc
    );

    const wishListContainer = document.querySelector("#destinations_container");

    // Change wishlist title if the wishlist was empty
    if (wishListContainer.children.length === 0) {
        document.querySelector("#title").innerHTML = "My WishList";
    }

    // Appended the destinationCard in the #destinations_container div
    document
        .querySelector("#destinations_container")
        .appendChild(destinationCard);
}

function resetFormValues(form) {
    // Go through all the form values and reset their values

    for (let i = 0; i < form.length; i++) {
        form.elements[i].value = "";
    }
}

function createDestinationCard(name, location, photoUrl, description) {
    // Use the passed arguments to create a bootstrap card with destination details
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    card.style.width = "15rem";
    card.style.height = "fit-content";
    card.style.margin = "20px;";

    // Create the destination photo element and append it to the card
    const img = document.createElement("img");
    img.setAttribute("class", "card-img-top");
    img.setAttribute("alt", name);

    // Check to make sure that the photo url was entered since it's optional
    // if the user didn't enter a photo url, show a constant photo
    const constantPhotoUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/300px-Blue_Marble_2002.png";
    if (photoUrl.length === 0) {
        img.setAttribute("src", constantPhotoUrl);
    } else {
        img.setAttribute("src", photoUrl);
    }

    card.appendChild(img);

    // Create the card body with the destination name, location, and description and append it to the card
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerText = name;
    cardBody.appendChild(cardTitle);

    const cardSubtitle = document.createElement("h6");
    cardSubtitle.setAttribute("class", "card-subtitle mb-2 text-muted");
    cardSubtitle.innerText = location;
    cardBody.appendChild(cardSubtitle);

    // Only add description text if the user entered some
    if (description.length !== 0) {
        let cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        cardText.innerText = description;
        cardBody.appendChild(cardText);
    }

    let buttonsContainer = document.createElement("div");
    buttonsContainer.setAttribute("class", "buttons_container");

    let cardEditBtn = document.createElement("button");
    cardEditBtn.setAttribute("class", "btn btn-edit");
    cardEditBtn.innerText = "Edit";
    cardEditBtn.addEventListener("click", editDestination);

    let cardDeleteBtn = document.createElement("button");
    cardDeleteBtn.setAttribute("class", "btn btn-remove");
    cardDeleteBtn.innerText = "Remove";
    cardDeleteBtn.addEventListener("click", removeDestination);

    buttonsContainer.appendChild(cardEditBtn);
    buttonsContainer.appendChild(cardDeleteBtn);

    cardBody.appendChild(buttonsContainer);

    card.appendChild(cardBody);

    return card;
}

function editDestination(event) {
    const cardBody = event.target.parentElement.parentElement;
    const title = cardBody.children[0];
    const subTitle = cardBody.children[1];

    const card = cardBody.parentElement;
    const photoUrl = card.children[0];

    const newTitle = window.prompt("Enter new name");
    const newSubtitle = window.prompt("Enter new location");
    const newPhotoUrl = window.prompt("Enter new photo url");


    let tempInfo = localStorage.getItem(title.innerText)
    let info = JSON.parse(tempInfo)
    let localTitle = info[0];
    let localSub = info[1];
    let localURL = info[2];
    const localDesc = info[3];



    if (newTitle.length > 0) {
        localStorage.removeItem(title.innerText)
        title.innerText = newTitle;
        localTitle = newTitle;
    }

    if (newSubtitle.length > 0) {
        subTitle.innerText = newSubtitle;
        localSub = newSubtitle;
    }

    if (newPhotoUrl.length > 0) {
        photoUrl.setAttribute("src", newPhotoUrl);
        localURL = photoUrl;
    }

    localStorage.setItem(localTitle, JSON.stringify([localTitle, localSub, localURL, localDesc]))

}

function removeDestination(event) {
    let cardBody = event.target.parentElement.parentElement;
    let card = cardBody.parentElement;

    let key = event.target.parentElement.parentElement.innerText
    let i = key.indexOf("\n")
    localStorage.removeItem(key.substring(0, i))

    card.remove();
}

function loadImage() {
    const url = "https://api.unsplash.com/search/photos?query=coffee&per_page=20&client_id=gK52De2Tm_dL5o1IXKa9FROBAJ-LIYqR41xBdlg3X2k";
    const imageDiv = document.querySelector('.image');
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {

            for (let i = 0; i < data.results.length; i++) {

                /* Fetch only image that you want by using id. Example : https://unsplash.com/photos/6VhPY27jdps, id = '6VhPY27jdps'   */
                if (data.results[i].id == "6VhPY27jdps") {
                    let imageElement = document.createElement('img');
                    imageElement.src = data.results[i].urls.thumb;
                    imageDiv.append(imageElement);
                }
            }
        });
}



