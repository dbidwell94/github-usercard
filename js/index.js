"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
// Classes
var GithubFollower = /** @class */ (function () {
    function GithubFollower(content) {
        this.username = content.login;
        this.url = content.url;
        this.profilePicture = content.avatar_url;
    }
    return GithubFollower;
}());
// Events
var followersFoundEvent = new CustomEvent("followersLoaded");
var cardsContainer = document.querySelector(".cards");
var followersArray = [];
/*
  List of LS Instructors Github username's:
    tetondan
    dustinmyers
    justsml
    luishrd
    bigknell
*/
function githubCardCreator(content) {
    // Create the main card
    var cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    // Create the profile image container and add to the card
    var profileImage = document.createElement("img");
    profileImage.setAttribute("src", content.avatar_url);
    cardContainer.appendChild(profileImage);
    // Create the card content and add to the card
    var cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");
    cardContainer.appendChild(cardInfo);
    // Create the realName field and add to cardInfo
    var realName = document.createElement("h3");
    realName.classList.add("name");
    realName.innerText = content.name;
    cardInfo.appendChild(realName);
    // Create the username field and add to cardInfo
    var userName = document.createElement("p");
    userName.classList.add("username");
    userName.innerText = content.login;
    cardInfo.appendChild(userName);
    // Create the location field and add to cardInfo
    var location = document.createElement("p");
    location.innerText = content.location;
    // Create the profile link and add it to cardInfo
    var profileLinkWrapper = document.createElement("p");
    var profileLink = document.createElement("a");
    profileLink.setAttribute("href", content.html_url);
    profileLink.innerText = content.html_url;
    profileLinkWrapper.appendChild(profileLink);
    cardInfo.appendChild(profileLinkWrapper);
    // Create the followers container and add to cardInfo
    var followers = document.createElement("p");
    followers.innerText = "Followers: " + content.followers;
    cardInfo.appendChild(followers);
    // Create the following container and add to cardInfo
    var following = document.createElement("p");
    following.innerText = "Following: " + content.following;
    // Create the bio container and add to cardInfo
    var bio = document.createElement("p");
    bio.innerText = "Bio: " + content.bio;
    cardInfo.appendChild(bio);
    return cardContainer;
}
function buildCardContent(userId) {
    axios_1.default.get("https://api.github.com/users/" + userId)
        .then(function (result) {
        var githubContent = result.data;
        cardsContainer.appendChild(githubCardCreator(githubContent));
    })
        .catch(function (err) {
        debugger;
        console.log(err.message);
    });
    axios_1.default.get("https://api.github.com/users/" + userId + "/followers")
        .then(function (result) {
        var followers = result.data;
        followers.forEach(function (follower) {
            followersArray.push(new GithubFollower(follower));
        });
        followersArray.forEach(function (follower) {
            axios_1.default.get(follower.url)
                .then(function (result) {
                var user = result.data;
                cardsContainer.appendChild(githubCardCreator(user));
            })
                .catch(function (err) {
                debugger;
                console.log(err.message);
            });
        });
    })
        .catch(function (err) {
        debugger;
        console.log(err.message);
    });
}
var submitButton = document.querySelector("button");
var usernameField = document.querySelector("#usernameField");
submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    buildCardContent(usernameField.value);
});
