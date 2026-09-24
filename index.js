class Producto {

    constructor(id, nombre, precio, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
    }
}

class GestorProductos {

    constructor() {
        this.productos = this.obtenerProductos();
    }

    agregarProducto(producto) {

        this.productos.push(producto);

        this.guardarProductos();

        this.mostrarProductos();
    }

    obtenerProductos() {

        const datos = window.localStorage.getItem("productos");

        if (datos) {
            return JSON.parse(datos);
        }

        return [];
    }

    guardarProductos() {

        window.localStorage.setItem(
            "productos",
            JSON.stringify(this.productos)
        );
    }

    actualizarProducto(id, nombre, precio, categoria) {

        const producto = this.productos.find(
            producto => producto.id === id
        );

        if (producto) {

            producto.nombre = nombre;
            producto.precio = precio;
            producto.categoria = categoria;

            this.guardarProductos();

            this.mostrarProductos();
        }
    }

    eliminarProducto(id) {

        this.productos = this.productos.filter(
            producto => producto.id !== id
        );

        this.guardarProductos();

        this.mostrarProductos();
    }

    mostrarProductos() {

        tablaProductos.innerHTML = "";

        if (this.productos.length === 0) {

            mensajeVacio.style.display = "block";

            return;
        }

        mensajeVacio.style.display = "none";


        this.productos.forEach(producto => {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${producto.id}</td>

                <td>${producto.nombre}</td>

                <td>$${Number(producto.precio).toFixed(2)}</td>

                <td>${producto.categoria}</td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarProducto(${producto.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-eliminar"
                        onclick="eliminarProducto(${producto.id})"
                    >
                        Eliminar
                    </button>

                </td>
            `;

            tablaProductos.appendChild(fila);
        });
    }
}

const formulario = document.getElementById("formProducto");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const categoriaInput = document.getElementById("categoria");
const tablaProductos = document.getElementById("tablaProductos");
const mensajeVacio = document.getElementById("mensajeVacio");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");


const gestor = new GestorProductos();


let idEditando = null;


formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = nombreInput.value.trim();

    const precio = precioInput.value;

    const categoria = categoriaInput.value;

    if (
        nombre === "" ||
        precio === "" ||
        categoria === ""
    ) {

        alert("Por favor, completa todos los campos.");

        return;
    }

    if (idEditando !== null) {

        gestor.actualizarProducto(
            idEditando,
            nombre,
            precio,
            categoria
        );

        alert("Producto actualizado correctamente.");

        cancelarEdicion();

        return;
    }

    const nuevoId = generarId();


    const nuevoProducto = new Producto(
        nuevoId,
        nombre,
        precio,
        categoria
    );


    gestor.agregarProducto(nuevoProducto);


    alert("Producto guardado correctamente.");


    formulario.reset();
});


function generarId() {

    if (gestor.productos.length === 0) {
        return 1;
    }

    const ids = gestor.productos.map(
        producto => producto.id
    );

    return Math.max(...ids) + 1;
}


function editarProducto(id) {

    const producto = gestor.productos.find(
        producto => producto.id === id
    );


    if (!producto) {
        return;
    }


    nombreInput.value = producto.nombre;
    precioInput.value = producto.precio;
    categoriaInput.value = producto.categoria;


    idEditando = id;


    btnGuardar.textContent = "Actualizar producto";

    btnCancelar.classList.remove("oculto");

    formulario.scrollIntoView({
        behavior: "smooth"
    });
}

function eliminarProducto(id) {

    const producto = gestor.productos.find(
        producto => producto.id === id
    );


    if (!producto) {
        return;
    }


    const confirmar = confirm(
        `¿Deseas eliminar el producto "${producto.nombre}"?`
    );


    if (confirmar) {

        gestor.eliminarProducto(id);

        alert("Producto eliminado correctamente.");
    }
}

btnCancelar.addEventListener(
    "click",
    cancelarEdicion
);


function cancelarEdicion() {

    idEditando = null;

    formulario.reset();

    btnGuardar.textContent = "Guardar producto";

    btnCancelar.classList.add("oculto");
}

gestor.mostrarProductos();