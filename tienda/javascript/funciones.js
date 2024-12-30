// Inicializa un array vacío para almacenar los productos en el carrito
let cart = [];

// Función para añadir un producto al carrito
function addToCart(productName, productPrice) {
    // Busca si el producto ya existe en el carrito
    const existingProduct = cart.find(product => product.name === productName);

    if (existingProduct) {
        // Si el producto ya existe, incrementa su cantidad
        existingProduct.quantity++;
        // Actualiza el subtotal del producto
        existingProduct.subtotal = existingProduct.quantity * productPrice;
    } else {
        // Si el producto no existe, crea un nuevo objeto de producto
        const newProduct = {
            name: productName,
            price: productPrice,
            quantity: 1, // Inicializa la cantidad a 1
            subtotal: productPrice // El subtotal es igual al precio del producto
        };
        // Añade el nuevo producto al carrito
        cart.push(newProduct);
    }

    // Actualiza la visualización del carrito
    updateCart();

}

// Función para actualizar la visualización del carrito
function updateCart() {
    // Obtiene el cuerpo de la tabla del carrito
    const cartBody = document.getElementById('cartBody');
    // Limpia el contenido actual del cuerpo de la tabla
    cartBody.innerHTML = '';

    // Inicializa el total en 0
    let total = 0;

    // Recorre cada producto en el carrito
    cart.forEach(product => {
        // Suma el subtotal del producto al total
        total += product.subtotal;

        // Crea una nueva fila para el producto en la tabla
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>
                <button onclick="updateQuantity('${product.name}', 'decrease')">-</button>
                ${product.quantity}
                <button onclick="updateQuantity('${product.name}', 'increase')">+</button>
            </td>
            <td>$${product.subtotal}</td>
            <td><button onclick="removeFromCart('${product.name}')">Eliminar</button></td>
        `;
        // Añade la fila a la tabla del carrito
        cartBody.appendChild(row);
    });

    // Actualiza el texto del total en la interfaz
    document.getElementById('totalPrice').innerText = `Total: $${total}`;
}

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(productName, action) {
    // Busca el producto en el carrito
    const product = cart.find(p => p.name === productName);
    if (action === 'increase') {
        // Si la acción es aumentar, incrementa la cantidad
        product.quantity++;
    } else if (action === 'decrease' && product.quantity > 1) {
        // Si la acción es disminuir, decrementa la cantidad solo si es mayor a 1
        product.quantity--;
    }

    // Actualiza el subtotal del producto
    product.subtotal = product.quantity * product.price;
    // Actualiza la visualización del carrito
    updateCart();
}

// Función para eliminar un producto del carrito
function removeFromCart(productName) {
    // Filtra el carrito para eliminar el producto especificado
    cart = cart.filter(p => p.name !== productName);
    // Actualiza la visualización del carrito
    updateCart();
}

// Función para realizar el checkout
function checkout() {
    // Verifica si el carrito está vacío
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
    } else {
         // Guardar el carrito en localStorage
        localStorage.setItem('cartv', JSON.stringify(cart));
        //si el carrito no esta vacio,envie al usuario a la pagina ventas
        window.location.href = 'ventas.html';
    }
}
//funciones de ventas

// Función para cargar el carrito desde localStorage y mostrarlo en la tabla
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cartv')) || [];
    const cartBody = document.getElementById('cartBodyv');
    cartBody.innerHTML = ''; // Limpiar el contenido anterior
    let totalv = 0;
    cart.forEach(product => {
         // Suma el subtotal del producto al total
        totalv += product.subtotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>$${product.subtotal.toFixed(2)}</td>
            <td><button onclick="removeFromCartV('${product.name}')">Eliminar</button></td>
        `;
        //agrega la fila a la tabla
        cartBody.appendChild(row);
    });
    //total de la tabla en la pagina ventas
    document.getElementById('totalPricev').innerText = `Total: $${totalv}`;
    //valor total de ventas como valor de default para el input
    document.getElementById('clienteTotal').value=totalv;
    
}

// Función para eliminar un producto del carrito
function removeFromCartV(productName) {
    let cart = JSON.parse(localStorage.getItem('cartv')) || [];
    cart = cart.filter(product => product.name !== productName);
    localStorage.setItem('cartv', JSON.stringify(cart));
    loadCart(); // Recargar la tabla
}

// Cargar el carrito al cargar la página
window.onload = loadCart;

//validacion de los datos de la tarjeta de credito

// Ejecutar el script solo después de que el DOM haya sido completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Captura de elementos del DOM
    const cardNumberInput = document.getElementById('cardNumber'); // Campo de número de tarjeta
    const expiryDateInput = document.getElementById('expiryDate'); // Campo de fecha de expiración
    const cvvInput = document.getElementById('cvv'); // Campo de CVV
    const form = document.getElementById('paymentForm'); // Formulario principal
    const messageDiv = document.getElementById('message'); // Contenedor para mostrar mensajes o factura

    // Configuración de eventos de validación en tiempo real
    cardNumberInput.addEventListener('input', validateCardNumber); // Validar número de tarjeta
    expiryDateInput.addEventListener('input', validateExpiryDate); // Validar fecha de expiración
    cvvInput.addEventListener('input', validateCVV); // Validar CVV

    // Evento al enviar el formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Detiene el envío del formulario por defecto
        if (validateAll()) { // Si todos los campos son válidos
            generateInvoice(); // Genera y muestra la factura
        }
    });

    // Validación del número de tarjeta
    function validateCardNumber() {
        const value = cardNumberInput.value; // Valor del campo
        const regex = /^[0-9]{16}$/; // Expresión regular para validar 16 dígitos
        const errorSpan = document.getElementById('cardNumberError'); // Contenedor de error para este campo

        // Validar formato
        if (!regex.test(value)) {
            errorSpan.textContent = 'Número de tarjeta inválido. Deben ser 16 dígitos.';
            cardNumberInput.style.borderColor = 'red'; // Marcar el campo como incorrecto
            return false; // Retorna inválido
        }

        // Si es válido
        errorSpan.textContent = ''; // Limpia el mensaje de error
        cardNumberInput.style.borderColor = 'green'; // Marcar el campo como correcto
        return true; // Retorna válido
    }

    // Validación de la fecha de expiración
    function validateExpiryDate() {
        const value = expiryDateInput.value; // Valor del campo
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Expresión regular para el formato MM/AA
        const errorSpan = document.getElementById('expiryDateError'); // Contenedor de error para este campo

        // Validar formato
        if (!regex.test(value)) {
            errorSpan.textContent = 'Fecha de expiración inválida. Use el formato MM/AA.';
            expiryDateInput.style.borderColor = 'red'; // Marcar el campo como incorrecto
            return false; // Retorna inválido
        }

        // Verificar si la fecha está en el futuro
        const [month, year] = value.split('/').map(Number); // Separar y convertir mes y año
        const now = new Date(); // Fecha actual
        const currentYear = parseInt(now.getFullYear().toString().slice(2)); // Últimos dos dígitos del año actual
        const currentMonth = now.getMonth() + 1; // Mes actual (0 indexado)

        // Comprobar si la tarjeta ya venció
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            errorSpan.textContent = 'La tarjeta está vencida.';
            expiryDateInput.style.borderColor = 'red'; // Marcar el campo como incorrecto
            return false; // Retorna inválido
        }

        // Si es válido
        errorSpan.textContent = ''; // Limpia el mensaje de error
        expiryDateInput.style.borderColor = 'green'; // Marcar el campo como correcto
        return true; // Retorna válido
    }

    // Validación del CVV
    function validateCVV() {
        const value = cvvInput.value; // Valor del campo
        const regex = /^[0-9]{3,4}$/; // Expresión regular para 3 o 4 dígitos
        const errorSpan = document.getElementById('cvvError'); // Contenedor de error para este campo

        // Validar formato
        if (!regex.test(value)) {
            errorSpan.textContent = 'CVV inválido. Deben ser 3 o 4 dígitos.';
            cvvInput.style.borderColor = 'red'; // Marcar el campo como incorrecto
            return false; // Retorna inválido
        }

        // Si es válido
        errorSpan.textContent = ''; // Limpia el mensaje de error
        cvvInput.style.borderColor = 'green'; // Marcar el campo como correcto
        return true; // Retorna válido
    }

    // Validación completa (todos los campos)
    function validateAll() {
        const isCardValid = validateCardNumber(); // Validar número de tarjeta
        const isExpiryValid = validateExpiryDate(); // Validar fecha de expiración
        const isCVVValid = validateCVV(); // Validar CVV

        // Retorna verdadero si todos los campos son válidos
        return isCardValid && isExpiryValid && isCVVValid;
    }

    // Generación de factura
    function generateInvoice() {
        // Captura de valores de los campos relacionados con el cliente y el pago
        const name = document.getElementById('clienteName').value; // Nombre del cliente
        const lastName = document.getElementById('clienteApellidos').value; // Apellidos del cliente
        const total = document.getElementById('clienteTotal').value; // Total de la compra
        const cardName = document.getElementById('cardName').value; // Nombre en la tarjeta
        const paymentMethod = document.getElementById('paymentMethod').value; // Método de pago

        // Construcción del contenido de la factura
        const invoice = `
            <h2>Factura</h2>
            <p><strong>Cliente:</strong> ${name} ${lastName}</p>
            <p><strong>Total:</strong> $${total}</p>
            <p><strong>Nombre en la Tarjeta:</strong> ${cardName}</p>
            <p><strong>Método de Pago:</strong> ${paymentMethod}</p>
            <p>Gracias por su compra.</p>
        `;

        // Inserción y estilización de la factura en el contenedor de mensajes
        messageDiv.innerHTML = invoice;
        messageDiv.style.border = '1px solid #ccc';
        messageDiv.style.padding = '15px';
        messageDiv.style.marginTop = '20px';
    }
});