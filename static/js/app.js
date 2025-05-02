let username = localStorage.getItem("username");
if (!username) {
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    const el = event.target;

    if (el.tagName === "HTML" || el.tagName === "BODY") return;

    // Turn into Shrek image
    el.classList.add("clicked");

    // Randomly choose a sound and its effect
    const choices = ["areyousure", "whereishe", "seasalt"];
    const choice = choices[Math.floor(Math.random() * choices.length)];

    let audio, imgSrc, imgClass;

    switch (choice) {
      case "areyousure":
        audio = new Audio("/static/audio/areyousure.mp3");
        imgSrc = "https://us-tuna-sounds-images.voicemod.net/13e358e4-8406-4d0a-a724-b89c38e64a0a-1701486070717.jpg";
        imgClass = "areyousure-fly";
        break;
      case "whereishe":
        audio = new Audio("/static/audio/whereishe.mp3");
        imgSrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8LEOGl8zt-AIyoRAvM_E-b1fEiugqWkUxi54UAF5aSQ5NOrjWp52M_JXS5FanhD4mI9w&usqp=CAU";
        imgClass = "whereishe-swoop";
        break;
      case "seasalt":
        audio = new Audio("/static/audio/seasalt.mp3");
        imgSrc = "https://preview.redd.it/sea-salt-i-need-you-sea-salt-v0-aa3v3b6oufre1.png?auto=webp&s=eb1a33f78fe13f665dfb5028649a0e2f59de258b";
        imgClass = "seasalt-spin";
        break;
    }

    audio.play();

    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = imgClass;
    document.body.appendChild(img);

    // Remove image after animation ends (~2s)
    setTimeout(() => img.remove(), 2000);
  });
});

function renderPost(post, isNew = false) {
  const template = document
    .getElementById("post-template")
    .content.cloneNode(true);
  template.querySelector(".username").innerText = post.username;
  template.querySelector(".message").innerText = post.message;

  if (isNew) {
    document.getElementById("feed").prepend(template);
  } else {
    document.getElementById("feed").appendChild(template);
  }
}

async function submitPost() {
  const message = document.getElementById("postInput").value;
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, message }),
    });
    if (response.ok) {
      renderPost({ username, message }, true);
      document.getElementById("postInput").value = "";
    }
  } catch (error) {
    console.error("Error submitting post:", error);
  }
}

window.onload = async () => {
  try {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    posts.forEach((post) => renderPost(post));
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

setInterval(  async () => {
    try {
      const response = await fetch("/api/posts");
      const posts = await response.json();
      document.getElementById("feed").innerHTML = "";
      posts.forEach((post) => renderPost(post));
    } catch (error) {
      console.error("Polling failed twin", error);
    }
  }, 5000);
