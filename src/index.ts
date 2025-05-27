interface User {
  id: number;
  username: string;
  name: string;
  website: string;
  company: {
    catchPhrase: string;
  };
  address: {
    city: string;
  };
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  body: string;
  name: string;
}

const userSelect = document.getElementById("userSelect") as HTMLSelectElement;
const profileName = document.getElementById("profile-name")!;
const userName = document.getElementById("username")!;
const web = document.getElementById("web")!;
const catchPhrase = document.getElementById("catch-phrase")!;
const address = document.getElementById("address")!;
const postContainer = document.getElementById("postContainer")!;
const commentsContainer = document.getElementById("commentsContainer")!;
const commentsHeader = document.getElementById("commentsHeader")!;

async function fetchUser(userId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  // console.log(`users fetched`, response);
  return await response.json();
}

async function loadUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users: User[] = await response.json();
  userSelect.innerHTML = users
    .map((U) => `<option value = "${U.id}">${U.name}</option>`)
    .join("");
}

async function loadUser(userId: number) {
  const user: User = await fetchUser(userId);
  showProfile(user);
}

function showProfile(user: User) {
  profileName.textContent = user.name;
  userName.textContent = `@${user.username}`;
  web.textContent = `${user.website}`;
  catchPhrase.textContent = `${user.company.catchPhrase}`;
  address.textContent = `${user.address.city}`;
}

async function loadPosts(userId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  const posts: Post[] = await response.json();
  await displayPosts(posts, userId);
}

async function loadComments(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  const comments: Comment[] = await response.json();
  showComments(comments, postId);
}

async function displayPosts(posts: Post[], userId: number) {
  const user = await fetchUser(userId);
  postContainer.innerHTML = "";
  posts.forEach((post) => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
        <div class="image">
            <img src="../images/profile.png" alt="profile-image">
        </div>
        <div>
            <div class="details">
                <p>${user.name}</p>
                ${post.body}
            </div>
        </div>
        `;
    div.onclick = () => loadComments(post.id);
    postContainer.appendChild(div);
  });
}

async function showComments(comments: Comment[], postId: number) {
  commentsContainer.innerHTML = "";
  commentsHeader.textContent = `post ${postId} comments`;
  comments.forEach((comment) => {
    const div = document.createElement("div");
    div.classList.add("comment");
    div.innerHTML = `
    <div>
        <div class="coment-content">
            <div class="image">
                <img src="../images/profile.png" alt="profile-image">
            </div>
            ${comment.name}
             ${comment.body}
        </div>
    </div>
    `;
    commentsContainer.appendChild(div);
  });
}

async function init() {
  await loadUsers();
  await loadUser(1);
  await loadPosts(1);
  await loadComments(1);
}

userSelect.addEventListener("change", async (e) => {
  const userId: number = Number(userSelect.value);
  if (userId) {
    await loadUser(userId);
    await loadPosts(userId);
    commentsContainer.innerHTML = "";
    await loadComments(userId);
  }
});

init().catch((error) => console.error(`initializing failed`, error));
