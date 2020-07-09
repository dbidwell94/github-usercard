import Axios from "axios";

// Interfaces
interface iGithubProfile {
  avatar_url: string | null;
  bio: string | null;
  blog: string | null;
  company: string | null;
  created_at: string | null;
  email: string | null;
  events_url: string | null;
  followers: number | null;
  followers_url: string | null;
  following: number | null;
  following_url: string | null;
  gists_url: string | null;
  gravatar_id: string | null | number;
  hireable: boolean;
  html_url: string | null;
  id: number | null;
  location: string | null;
  login: string | null;
  name: string | null;
  node_id: string | null;
  organizations_url: string | null;
  public_gists: number | null;
  public_repos: number | null;
  received_events_url: string | null;
  repos_url: string | null;
  site_admin: boolean;
  starred_url: string | null;
  subscriptions_url: string | null;
  twitter_username: string | null;
  type: string | null;
  updated_at: string | null;
  url: string | null;
}
interface iGithubFollower {
  avatar_url: string | null;
  events_url: string | null;
  followers_url: string | null;
  following_url: string | null;
  gists_url: string | null;
  gravatar_id: string | null;
  html_url: string | null;
  id: number | null;
  login: string | null;
  node_id: string | null;
  organizations_url: string | null;
  received_events_url: string | null;
  repos_url: string | null;
  site_admin: boolean;
  starred_url: string | null;
  subscriptions_url: string | null;
  type: string | null;
  url: string | null;
}

// Classes
class GithubFollower {
  username: string;
  url: string;
  profilePicture: string;
  constructor(content: iGithubFollower) {
    this.username = content.login;
    this.url = content.url;
    this.profilePicture = content.avatar_url;
  }
}

// Events
const followersFoundEvent = new CustomEvent("followersLoaded");

const cardsContainer: HTMLDivElement = document.querySelector(".cards");

const followersArray: Array<GithubFollower> = [];

/*
  List of LS Instructors Github username's:
    tetondan
    dustinmyers
    justsml
    luishrd
    bigknell
*/

function githubCardCreator(content: iGithubProfile): HTMLDivElement {
  // Create the main card
  const cardContainer: HTMLDivElement = document.createElement("div");
  cardContainer.classList.add("card");

  // Create the profile image container and add to the card
  const profileImage: HTMLImageElement = document.createElement("img");
  profileImage.setAttribute("src", content.avatar_url);
  cardContainer.appendChild(profileImage);

  // Create the card content and add to the card
  const cardInfo: HTMLDivElement = document.createElement("div");
  cardInfo.classList.add("card-info");
  cardContainer.appendChild(cardInfo);

  // Create the realName field and add to cardInfo
  const realName: HTMLHeadingElement = document.createElement("h3");
  realName.classList.add("name");
  realName.innerText = content.name;
  cardInfo.appendChild(realName);

  // Create the username field and add to cardInfo
  const userName: HTMLParagraphElement = document.createElement("p");
  userName.classList.add("username");
  userName.innerText = content.login;
  cardInfo.appendChild(userName);

  // Create the location field and add to cardInfo
  const location: HTMLParagraphElement = document.createElement("p");
  location.innerText = content.location;

  // Create the profile link and add it to cardInfo
  const profileLinkWrapper: HTMLParagraphElement = document.createElement("p");
  const profileLink: HTMLAnchorElement = document.createElement("a");
  profileLink.setAttribute("href", content.html_url);
  profileLink.innerText = content.html_url;
  profileLinkWrapper.appendChild(profileLink);
  cardInfo.appendChild(profileLinkWrapper);

  // Create the followers container and add to cardInfo
  const followers: HTMLParagraphElement = document.createElement("p");
  followers.innerText = `Followers: ${content.followers}`;
  cardInfo.appendChild(followers);

  // Create the following container and add to cardInfo
  const following: HTMLParagraphElement = document.createElement("p");
  following.innerText = `Following: ${content.following}`;

  // Create the bio container and add to cardInfo
  const bio: HTMLParagraphElement = document.createElement("p");
  bio.innerText = `Bio: ${content.bio}`;
  cardInfo.appendChild(bio);

  return cardContainer;
}

function buildCardContent(userId: string): void {
  Axios.get(`https://api.github.com/users/${userId}`)
    .then((result) => {
      const githubContent: iGithubProfile = result.data;
      cardsContainer.appendChild(githubCardCreator(githubContent));
    })
    .catch((err) => {
      console.log(err.message);
    });

  Axios.get(`https://api.github.com/users/${userId}/followers`)
    .then((result) => {
      const followers: Array<iGithubFollower> = result.data;
      followers.forEach((follower) => {
        followersArray.push(new GithubFollower(follower));
      });
      followersArray.forEach((follower) => {
        Axios.get(follower.url)
          .then((result) => {
            const user: iGithubProfile = result.data;
            cardsContainer.appendChild(githubCardCreator(user));
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

const submitButton: HTMLButtonElement = document.querySelector("button");
const usernameField: HTMLTextAreaElement = document.querySelector(
  "#usernameField"
);
submitButton.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault();
  const oldCards: HTMLCollection = cardsContainer.children;
  for (let i = 0; i < oldCards.length; i++) {
    oldCards[i].remove();
  }
  buildCardContent(usernameField.value);
});
