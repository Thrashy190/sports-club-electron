const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");
setButton.addEventListener("click", () => {
  const title = titleInput.value;
  window.electronAPI.setTitle(title);
});

// const func = async () => {
//   const response = await window.versions.ping();
//   console.log(response); // prints out 'pong'
// };

// func();

// const productsList = document.querySelector("#products");

// function renderProducts(tasks) {
//   productsList.innerHTML = "";
//   tasks.forEach((t) => {
//     productsList.innerHTML += `
//         <div class="card card-body my-2 animated fadeInLeft">
//             <h4>${t.user_name}</h4>
//             <p>${t.user_id}</p>
//         </div>
//       `;
//   });
// }

// const getProducts = async () => {
//   products = await window.versions.getUsers();
//   renderProducts(products);
// };

// async function init() {
//   getProducts();
// }

// init();
