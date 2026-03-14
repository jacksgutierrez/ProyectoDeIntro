
const usuariosPermitidos = [
    { usuario: "ClienteUCV", clave: "Central_123", rol: "cliente" },
    { usuario: "caja_01", clave: "Cajero#123", rol: "cajero" },
    { usuario: "adminRoot", clave: "cafetinAdmin", rol: "admin" }
];

function iniciarSesion() {
    let userIngresado = document.getElementById("usuario").value;
    let claveIngresada = document.getElementById("clave").value;
    let mensajeError = document.getElementById("mensaje-error");

    mensajeError.innerHTML = "";
    let usuarioEncontrado = null;

    for (let i = 0; i < usuariosPermitidos.length; i++) {
        if (usuariosPermitidos[i].usuario === userIngresado && usuariosPermitidos[i].clave === claveIngresada) {
            usuarioEncontrado = usuariosPermitidos[i];
            break; 
        }
    }

    if (usuarioEncontrado !== null) {
        document.getElementById("modulo-login").style.display = "none";

        if (usuarioEncontrado.rol === "cliente") {
            document.getElementById("pantalla-cliente").style.display = "block";
            renderizarCliente(); 
        } else if (usuarioEncontrado.rol === "cajero") {
            document.getElementById("pantalla-caja").style.display = "block";
            renderizarCajero();
        } else if (usuarioEncontrado.rol === "admin") {
            document.getElementById("pantalla-admin").style.display = "block";
            renderizarAdmin(); 
        }
        
        document.getElementById("usuario").value = "";
        document.getElementById("clave").value = "";
        
    } else {
        mensajeError.innerHTML = "Usuario o contraseña incorrectos. Intente de nuevo.";
    }
}

function cerrarSesion() {
    document.getElementById("pantalla-cliente").style.display = "none";
    document.getElementById("pantalla-caja").style.display = "none";
    document.getElementById("pantalla-admin").style.display = "none";
    document.getElementById("modulo-login").style.display = "block";
}

let inventario = [
    { id: 1, nombre: "Café Grande", precio: 25.50, imagen: "imagenes/cafe.jpg" },
    { id: 2, nombre: "Empanada de Queso", precio: 30.00, imagen: "imagenes/empanada.jpg" },
    { id: 3, nombre: "Jugo Natural", precio: 20.00, imagen: "imagenes/jugo.jpg" }
];

let pedidoActualCajero = [];

let resenas = [
    { id: 1, texto: "¡Las empanadas de queso son las mejores de la UCV!", autor: "Juan P." },
    { id: 2, texto: "El café estaba un poco frío hoy.", autor: "María G." },
    { id: 3, texto: "Excelente atención de los cajeros.", autor: "Carlos M." }
];

function renderizarAdmin() {
    let contenedorAdmin = document.getElementById("lista-productos-admin");
    contenedorAdmin.innerHTML = ""; 

    for (let i = 0; i < inventario.length; i++) {
        let prod = inventario[i];
        contenedorAdmin.innerHTML += `
            <li>
                ${prod.nombre} - Bs. ${prod.precio.toFixed(2)} 
                <button onclick="eliminarProducto(${prod.id})" style="color: red; margin-left: 10px;">Eliminar</button>
            </li>
        `;
    }

    let contenedorResenas = document.getElementById("lista-resenas-admin");
    contenedorResenas.innerHTML = ""; 
    
    for (let i = 0; i < resenas.length; i++) {
        let r = resenas[i];
        contenedorResenas.innerHTML += `
            <li>
                "${r.texto}" - <em>${r.autor}</em>
                <button onclick="eliminarResena(${r.id})" style="color: red; margin-left: 10px;">Eliminar</button>
            </li>
        `;
    }
}

function eliminarResena(id) {
    let nuevasResenas = [];
    for(let i = 0; i < resenas.length; i++){
        if(resenas[i].id !== id){
            nuevasResenas.push(resenas[i]);
        }
    }
    resenas = nuevasResenas;
    renderizarAdmin(); 
}


function agregarProducto() {
    let nombre = document.getElementById("nuevo-nombre").value;
    let precio = parseFloat(document.getElementById("nuevo-precio").value);
    let img = document.getElementById("nueva-img").value;

    if (nombre === "" || isNaN(precio) || img === "") {
        alert("Por favor llena todos los campos.");
        return;
    }

    let nuevoId = inventario.length > 0 ? inventario[inventario.length - 1].id + 1 : 1;

    inventario.push({ id: nuevoId, nombre: nombre, precio: precio, imagen: img });

    document.getElementById("nuevo-nombre").value = "";
    document.getElementById("nuevo-precio").value = "";
    document.getElementById("nueva-img").value = "";

    renderizarAdmin(); 
}

function eliminarProducto(id) {
    let nuevoInventario = [];
    for(let i = 0; i < inventario.length; i++){
        if(inventario[i].id !== id){
            nuevoInventario.push(inventario[i]);
        }
    }
    inventario = nuevoInventario;
    renderizarAdmin(); 
}

function renderizarCajero() {
    let contenedorCajero = document.getElementById("lista-productos-cajero");
    contenedorCajero.innerHTML = "";

    for (let i = 0; i < inventario.length; i++) {
        let prod = inventario[i];
        contenedorCajero.innerHTML += `
            <div style="margin-bottom: 5px;">
                <span>${prod.nombre} - Bs. ${prod.precio.toFixed(2)}</span>
                <button onclick="agregarAlPedido(${i})">Añadir</button>
            </div>
        `;
    }
}

function agregarAlPedido(indice) {
    let productoSeleccionado = inventario[indice];
    pedidoActualCajero.push(productoSeleccionado);
    actualizarResumenCajero();
}

function actualizarResumenCajero() {
    let resumen = document.getElementById("resumen-pedido-cajero");
    resumen.innerHTML = "";
    let total = 0;

    for (let i = 0; i < pedidoActualCajero.length; i++) {
        let item = pedidoActualCajero[i];
        resumen.innerHTML += `<li>${item.nombre} - Bs. ${item.precio.toFixed(2)}</li>`;
        total += item.precio;
    }

    document.getElementById("total-cajero").innerText = total.toFixed(2);
    document.getElementById("mensaje-recibo").innerText = ""; 
}

function emitirRecibo() {
    if (pedidoActualCajero.length === 0) {
        alert("El pedido está vacío.");
        return;
    }
    
    document.getElementById("mensaje-recibo").innerText = "Recibo Emitido ¡Gracias por su compra!";
    pedidoActualCajero = [];
    actualizarResumenCajero();
}

let carritoCliente = [];
let historialCompras = [];

function renderizarCliente() {
    document.getElementById("puntos-cliente").innerText = "Tienes 150 puntos acumulados.";

    let contenedorCatalogo = document.getElementById("catalogo-cliente");
    contenedorCatalogo.innerHTML = ""; 

    for (let i = 0; i < inventario.length; i++) {
        let prod = inventario[i];
        contenedorCatalogo.innerHTML += `
            <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <strong>${prod.nombre}</strong> <br>
                Precio: Bs. ${prod.precio.toFixed(2)} <br>
                <button onclick="agregarAlCarrito(${i})">Añadir a Carrito</button>
            </div>
        `;
    }
}

function agregarAlCarrito(indice) {
    let producto = inventario[indice];
    carritoCliente.push(producto);
    actualizarCarrito();
}

function actualizarCarrito() {
    let lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";
    let subtotal = 0;

    for (let i = 0; i < carritoCliente.length; i++) {
        let item = carritoCliente[i];
        lista.innerHTML += `<li>${item.nombre} - Bs. ${item.precio.toFixed(2)}</li>`;
        subtotal += item.precio;
    }

    document.getElementById("contador-carrito").innerText = carritoCliente.length;
    document.getElementById("subtotal-carrito").innerText = subtotal.toFixed(2);
}

function finalizarCompraCliente() {
    if (carritoCliente.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let subtotalFinal = document.getElementById("subtotal-carrito").innerText;
    
    let fecha = new Date().toLocaleDateString();
    let registro = `Compra el ${fecha}: ${carritoCliente.length} productos por un total de Bs. ${subtotalFinal}`;
    
    historialCompras.push(registro);

    let listaHistorial = document.getElementById("historial-cliente");
    listaHistorial.innerHTML = "";
    for (let i = 0; i < historialCompras.length; i++) {
        listaHistorial.innerHTML += `<li>${historialCompras[i]}</li>`;
    }

    carritoCliente = [];
    actualizarCarrito();
    
    alert("¡Compra realizada con éxito! Se ha añadido a tu historial.");
}
function enviarMensajeChat() {
    let input = document.getElementById("input-chat");
    let mensajeUsuario = input.value.trim().toLowerCase(); 
    let cajaChat = document.getElementById("caja-chat");

    if (mensajeUsuario === "") return; 

    cajaChat.innerHTML += `<p style="color: blue; text-align: right; margin-bottom: 5px;"><strong>Tú:</strong> ${input.value}</p>`;

    let respuestaBot = "Lo siento, no entiendo tu pregunta. Intenta preguntar por el menú, los precios o el horario.";

    if (mensajeUsuario.includes("precio") || mensajeUsuario.includes("costo") || mensajeUsuario.includes("cuanto")) {
        respuestaBot = "Los precios varían. Puedes ver el costo exacto de cada producto en el catálogo de arriba.";
    } else if (mensajeUsuario.includes("horario") || mensajeUsuario.includes("hora") || mensajeUsuario.includes("abren")) {
        respuestaBot = "Nuestro horario de atención es de Lunes a Viernes de 7:00 AM a 6:00 PM.";
    } else if (mensajeUsuario.includes("menu") || mensajeUsuario.includes("venden") || mensajeUsuario.includes("comida")) {
        respuestaBot = "Vendemos deliciosas empanadas, cafés, jugos y más. ¡Añádelos a tu carrito!";
    } else if (mensajeUsuario.includes("hola") || mensajeUsuario.includes("buen") || mensajeUsuario.includes("saludos")) {
        respuestaBot = "¡Hola, cliente de la UCV! Bienvenido al Cafetín Central. ¿Qué te gustaría pedir hoy?";
    }

    setTimeout(() => {
        cajaChat.innerHTML += `<p style="color: green; margin-bottom: 5px;"><strong>Bot:</strong> ${respuestaBot}</p>`;
        cajaChat.scrollTop = cajaChat.scrollHeight;
    }, 600); 

    input.value = "";
    
}
function enviarResena() {
    let inputResena = document.getElementById("nueva-resena-cliente");
    let texto = inputResena.value.trim();

    if (texto === "") {
        alert("Por favor escribe tu reseña antes de enviar.");
        return;
    }

    let nuevoId = resenas.length > 0 ? resenas[resenas.length - 1].id + 1 : 1;

    resenas.push({
        id: nuevoId,
        texto: texto,
        autor: "Cliente UCV" 
    });

    inputResena.value = "";
    alert("¡Gracias por tu reseña! Ha sido enviada al sistema.");
}