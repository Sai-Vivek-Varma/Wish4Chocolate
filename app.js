function hideMe() {
  const slogan = document.getElementById("hide-me");
  if (slogan.style.display === "none") {
    slogan.style.display = "inline-block";
  } else {
    slogan.style.display = "none";
  }
}

function addToCart(name, price, img) {
    const url = new URL('cart.html', window.location.href);
    url.searchParams.set('name', name);
    url.searchParams.set('price', price);
    url.searchParams.set('img', img);
    window.location.href = url.toString();
}
