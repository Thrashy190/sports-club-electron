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

document.getElementById("login").addEventListener("click", () => {
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;

  const data = {
    user: user,
    password: password,
  };

  window.electron.loginIpc(data);
});

// function calcularEdad(fechaNacimiento) {
//   const hoy = new Date();
//   const cumpleanos = new Date(fechaNacimiento);
//   let edad = hoy.getFullYear() - cumpleanos.getFullYear();
//   const mes = hoy.getMonth() - cumpleanos.getMonth();

//   if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
//     edad--;
//   }

//   return edad;
// }

// function obtenerFechaNacimiento(curp) {
//   const anio = curp.substr(4, 2);
//   const mes = curp.substr(6, 2);
//   const dia = curp.substr(8, 2);
//   return `19${anio}-${mes}-${dia}`;
// }
