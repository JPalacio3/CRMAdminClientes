( function () {
    let DB;
    const formulario = document.querySelector( '#formulario' );

    document.addEventListener( 'DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener( 'submit', validarCliente );
    } );

    function conectarDB() {
        const abrirConexion = window.indexedDB.open( 'crm', 1 );
        abrirConexion.onerror = function () {
            console.log( 'Hubo un error' );
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

    function validarCliente( e ) {
        e.preventDefault();

        // leer todos los inputs
        const nombre = document.querySelector( '#nombre' ).value;
        const email = document.querySelector( '#email' ).value;
        const telefono = document.querySelector( '#telefono' ).value;
        const empresa = document.querySelector( '#empresa' ).value;

        if ( nombre === '' || email === '' || telefono === '' || empresa === '' ) {
            imprimirAlerta( 'Todos los campos son obligatorios', 'error' );
            return;
        }

        // Crear un objeto con la información
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
        }
        cliente.id = Date.now();
        crearNuevoCliente( cliente );
    }

    function crearNuevoCliente( cliente ) {
        const transaction = DB.transaction( [ 'crm' ], 'readwrite' );
        const objectStore = transaction.objectStore( 'crm' );
        objectStore.add( cliente );

        transaction.onerror = function () {
            imprimirAlerta( 'Este email ya se encuentra registrado, por favor, indique otro', 'error' );
        };

        transaction.oncomplete = function () {
            console.log( 'cliente agregado' );
            imprimirAlerta( 'Cliente agregado exitosamente', 'exito' );

            // Redirigirnos a la página de Cientes después de 3 segundos
            setTimeout( () => {
                window.location.href = 'index.html';
            }, 3000 );
        };
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
