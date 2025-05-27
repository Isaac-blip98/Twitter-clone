"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const userSelect = document.getElementById("userSelect");
const profileName = document.getElementById("profile-name");
const userName = document.getElementById("username");
const web = document.getElementById("web");
const catchPhrase = document.getElementById("catch-phrase");
const address = document.getElementById("address");
const postContainer = document.getElementById("postContainer");
const commentsContainer = document.getElementById("commentsContainer");
const commentsHeader = document.getElementById("commentsHeader");
function fetchUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return yield response.json();
    });
}
function loadUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://jsonplaceholder.typicode.com/users");
        const users = yield response.json();
        userSelect.innerHTML = users
            .map((U) => `<option value = "${U.id}">${U.name}</option>`)
            .join("");
    });
}
function loadUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield fetchUser(userId);
        showProfile(user);
    });
}
function showProfile(user) {
    profileName.textContent = user.name;
    userName.textContent = `@${user.username}`;
    web.textContent = `${user.website}`;
    catchPhrase.textContent = `${user.company.catchPhrase}`;
    address.textContent = `${user.address.city}`;
}
function loadPosts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const posts = yield response.json();
        yield displayPosts(posts, userId);
    });
}
function loadComments(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = yield response.json();
        showComments(comments, postId);
    });
}
function displayPosts(posts, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield fetchUser(userId);
        postContainer.innerHTML = "";
        posts.forEach((post) => {
            const div = document.createElement("div");
            div.classList.add("post");
            div.innerHTML = `
  <div class="image">
    <img src="../images/profile.png" alt="profile-image" />
  </div>
  <div>
    <div class="details">
      <div class="details-info">
        <span class="username">${user.name}</span>
        <img class="icon" src="../images/verify.png" alt="verified" />
        <img class="icon" src="../images/twitter-icon.png" alt="twitter" />
      </div>
    
      <p class="post-body">
        ${post.body}
      </p>
    </div>
    <div class="pics">
      <span><img class="icon-small" src="../images/message.png" />200</span>
      <span><img class="icon-small" src="../images/retweet.png" />200</span>
      <span><img class="icon-small" src="../images/heart.png" />200</span>
    </div>
  </div>        `;
            div.onclick = () => loadComments(post.id);
            postContainer.appendChild(div);
        });
    });
}
function showComments(comments, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        commentsContainer.innerHTML = "";
        commentsHeader.textContent = `post ${postId} comments`;
        comments.forEach((comment) => {
            const div = document.createElement("div");
            div.classList.add("comment");
            div.innerHTML = `
 <div class="image">
    <img src="../images/profile.png" alt="profile-image" />
  </div>
  <div>
    <div class="details">
      <div class="details-info">
        <span class="username">${comment.name}</span>
      </div>
      <p class="comment-body">
        ${comment.body}
      </p>
    </div>
    <div class="pics">
      <span><img class="icon-small" src="../images/message.png" />200</span>
      <span><img class="icon-small" src="../images/retweet.png" />200</span>
      <span><img class="icon-small" src="../images/heart.png" />200</span>
    </div>
  </div> 
    `;
            commentsContainer.appendChild(div);
        });
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadUsers();
        yield loadUser(1);
        yield loadPosts(1);
        yield loadComments(1);
    });
}
userSelect.addEventListener("change", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(userSelect.value);
    if (userId) {
        yield loadUser(userId);
        yield loadPosts(userId);
        commentsContainer.innerHTML = "";
        yield loadComments(userId);
    }
}));
init().catch((error) => console.error(`initializing failed`, error));
