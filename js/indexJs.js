const getType = (input) => {
  document.getElementById("dropdownMenuLink").innerHTML = input;
  document.getElementById("cifrado-title").innerHTML = input;
  if (input == "SHA-1") {
    document.getElementById(
      "cifrado-text"
    ).innerHTML = `El Secure Hash Algorithm (SHA1) es una función hash 
    criptográfica ampliamente utilizado, que genera un 160 bits (20 bytes) hash a partir de cualquier valor 
    de entrada. Esto se utiliza para calcular un valor de comprobación única para todos los datos digitales 
    (mensajes) de no más de 264 -1 bit (≈ 2 exbibyte) de longitud y es la base para la creación de una firma 
    digital. SHA1 fue desarrollado por el Instituto Nacional de Estándares y Tecnología (NIST), en colaboración
     con la Agencia Nacional de Seguridad (NSA) en 1993. SHA-1 (originalmente SHA-0) es de construcción similar
      al algoritmo de Ronald L. Rivest, que desarrolló Message-Digest Algorithm 5 (MD5) en 1991.`;
  }
  if (input == "SHA-256") {
    document.getElementById(
      "cifrado-text"
    ).innerHTML = `Tiene un tamaño de salida de 256 bits, un tamaño de estado interno de 256 bits, 
    un tamaño de bloque de 512 bits, el tamaño máximo del mensaje que puede manejar es de 264 – 1, 
    la longitud de la palabra es de 32 bits, y el número de rondas que se aplican son 64, así como las 
    operaciones que aplica al hash son +, and, or, xor, shr y rot. La longitud del hash siempre es igual, 
    no importa lo grande que sea el contenido que uses para generar el hash: ya sea de sola una letra o una 
    imagen ISO de 4GB de tamaño, el resultado siempre será una sucesión de 40 letras y números.`;
  }
  if (input == "SHA-512") {
    document.getElementById(
      "cifrado-text"
    ).innerHTML = `SHA-512 estructuralmente es idéntico al SHA-256, pero:

    el mensaje es partido en trozos de 1024 bits,
    los valores iniciales del hash y las constantes de las iteraciones son extendidas a 64 bits,
    hay 80 iteraciones en vez de 64,
    las constantes de cada iteración están basadas en los primeros 80 primos del intervalo [2,409],
    el tamaño de palabra usado para los cálculos tiene una longitud de 64 bits,
    la longitud adjunta del mensaje (antes del preprocesado), en bits, es de un entero big-endian de 128 bits, 
    y los desplazamientos y rotaciones usadas son distintas.`;
  }
  if (input == "MD5") {
    document.getElementById(
      "cifrado-text"
    ).innerHTML = `La función utiliza el algoritmo Message-Digest 5 (MD5). MD5 es una función hash criptográfica 
    unidireccional con un valor de hash de 128 bits. Este algoritmo que proporciona un código asociado 
    a un archivo o un texto concretos. De esta forma, a la hora de descargar un determinado archivo, como 
    puede ser un instalador, el código generado por el algoritmo, también llamado hash, viene "unido" al 
    archivo.`;
  }
};

let userActive = false;
const cifrar = async () => {
  let txtcifrar = document.getElementById("exampleFormControlTextarea1");
  let inputValue = document.getElementById("dropdownMenuLink").innerHTML;
  let txtcifrado = document.getElementById("exampleFormControlTextarea2");

  if (!txtcifrar.value) {
    alert("Escriba algo para el cifrado...");
  }
  if (inputValue == "Tipo de cifrado") {
    alert("Escoja un tipo de cifrado");
  } else {
    if (inputValue == "SHA-1") {
      let hash = CryptoJS.SHA1(txtcifrar.value);
      document.getElementById("exampleFormControlTextarea2").value = hash;
    }
    if (inputValue == "SHA-256") {
      let hash = CryptoJS.SHA256(txtcifrar.value);
      document.getElementById("exampleFormControlTextarea2").value = hash;
    }
    if (inputValue == "SHA-512") {
      let hash = CryptoJS.SHA512(txtcifrar.value);
      document.getElementById("exampleFormControlTextarea2").value = hash;
    }
    if (inputValue == "MD5") {
      let hash = CryptoJS.MD5(txtcifrar.value);
      document.getElementById("exampleFormControlTextarea2").value = hash;
    }
  }
  if(userActive == true){
    await fs.collection("history").doc().set({
      cifrado: txtcifrar.value,
      txtcifrado: txtcifrado.value,
    });
    await fs.collection("history")
      .get()
      .then((snapshot) => {
        setupHistory(snapshot.docs);
      });
  }
};

const borrar = () => {
  let txtarea1 = document.getElementById("exampleFormControlTextarea1");
  let txtarea2 = document.getElementById("exampleFormControlTextarea2");
  txtarea1.value = "";
  txtarea2.value = "";
};

// Visibility menu logs
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const loginCheck = (user) => {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
  } else {
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
  }
};

// SignUp
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  // Authenticate the User
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      signUpForm.reset();
      // close the modal
      $("#signupModal").modal("hide");
      $("#accountModal").modal("show");
    })
    .catch((err) => {
      $("#signupModal").modal("hide");
      $("#accountExistModal").modal("show");
    });
});

// History
const setupHistory = (data) => {
  const historyList = document.querySelector(".history");
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const rowhistory = doc.data();
      const li = `
      <li class="list-group-item list-group-item-action">
        <p class="text-break">${rowhistory.cifrado} ==> ${rowhistory.txtcifrado}</[]>
      </li>
    `;
      html += li;
    });
    historyList.innerHTML = html;
  } else {
    historyList.innerHTML = '<h4 class="text-white">Login to See Histpry</h4>';
  }
};
//Check User onload
$(window).on("load", function () {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userActive = true;
      fs.collection("history")
        .get()
        .then((snapshot) => {
          setupHistory(snapshot.docs);
          loginCheck(user);
        });
    } else {
      userActive = false;
      setupHistory([]);
      loginCheck(user);
    }
  });
});
// Logout
const logout = document.querySelector("#logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("log out");
  });
});

// SingIn
const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  // Authenticate the User
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      signInForm.reset();
      // close the modal
      $("#signinModal").modal("hide");
      $("#loginModal").modal("show");
    })
    .catch((err) => {
      console.log(err);
    });
});

// events

// Login with Google
const googleButton = document.querySelector("#googleLogin");

googleButton.addEventListener("click", (e) => {
  e.preventDefault();
  signInForm.reset();
  $("#signinModal").modal("hide");
  $("#loginModal").modal("show");

  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      console.log(result);
      console.log("google sign in");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Toggle password
const togglePassword = document.querySelector("#togglePassword");
const togglePassword2 = document.querySelector("#togglePassword2");
const password = document.querySelector("#login-password");
const passwordSignup = document.querySelector("#signup-password");

togglePassword.addEventListener("click", function () {
  // toggle the type attribute
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  // toggle the eye icon
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});

togglePassword2.addEventListener("click", function () {
  // toggle the type attribute
  const type =
    passwordSignup.getAttribute("type") === "password" ? "text" : "password";
  passwordSignup.setAttribute("type", type);
  // toggle the eye icon
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});
