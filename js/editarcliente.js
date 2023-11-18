( function () {

    let DB;
    let idCliente;
    const nombreInput = document.querySelector( '#nombre' );
    const emailInput = document.querySelector( '#email' );
    const telefonoInput = document.querySelector( '#telefono' );
    const empresaInput = document.querySelector( '#empresa' );
    const formulario = document.querySelector( '#formulario' );

    document.addEventListener( 'DOMContentLoaded', () => {
        conectarDB();

        // Actualiza el registro
        formulario.addEventListener( 'submit', actualizarCliente );

        // Verifcar el ID de la URL
        const parametrosURL = new URLSearchParams( window.location.search );
        idCliente = parametrosURL.get( 'id' );

        if ( idCliente ) {
            setTimeout( () => {
                obtenerCliente( idCliente );
            }, 100 );
        }
    } );

    function actualizarCliente( e ) {
        e.preventDefault();

        if ( nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '' ) {
            imprimirAlerta( 'Todos los campos son obligatorios', 'error' );
            return;
        }

        // Actualizar cliente si se pasa la validación
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number( idCliente )
        }
        const transaction = DB.transaction( [ 'crm' ], 'readwrite' );
        const objectStore = transaction.objectStore( 'crm' );
        objectStore.put( clienteActualizado );

        transaction.oncomplete = function () {
            imprimirAlerta( 'Registro editado correctamente' );
            // Redirigirnos a la página de Cientes después de 3 segundos
            setTimeout( () => {
                window.location.href = 'index.html';
            }, 1500 );
        }
        transaction.onerror = function () {
            imprimirAlerta( 'Hubo un error', 'error' );
        }
    }

    function obtenerCliente( id ) {
        const transaction = DB.transaction( [ 'crm' ], 'readwrite' );
        const objectStore = transaction.objectStore( 'crm' );
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function ( e ) {
            const cursor = e.target.result;

            if ( cursor ) {
                if ( cursor.value.id === Number( id ) ) {
                    llenarFormulario( cursor.value );
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario( datosCliente ) {
        const { nombre, email, telefono, empresa } = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open( 'crm', 1 );
        abrirConexion.onerror = function () {
            console.log( 'Hubo un error' );
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

    function imprimirAlerta( mensaje, tipo ) {
        const alerta = document.querySelector( '.alerta' );
        if ( !alerta ) {
            // Crear la alerta
            const divMensaje = document.createElement( 'DIV' );
            divMensaje.classList.add( 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta' );

            if ( tipo === 'error' ) {
                divMensaje.classList.add( 'bg-red-100', 'border-red-400', 'text-red-700' );
            } else {
                divMensaje.classList.add( 'bg-green-100', 'border-green-400', 'text-green-700' );
            }

            divMensaje.textContent = mensaje;

            // Agregar al HTML
            formulario.appendChild( divMensaje );

            // Quitar la alerta despues de 2 segundos
            setTimeout( () => {
                divMensaje.remove();
            }, 2000 );
        }
    }
} )();
