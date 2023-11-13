( function () {

    let DB;
    document.addEventListener( 'DOMContentLoaded', () => {
        crearDB();
    } );

    // Crea la base de datos de IndexDB
    function crearDB() {
        // Abrir la conexión a la base de datos
        const crearDB = window.indexedDB.open( 'crm', 1 );

        // En caso de haber un error al abrir la conexión
        crearDB.onerror = function () {
            console.log( 'Hubo un error al crear la base de datos' );
        };

        // En caso de la conexión sea exitosa
        crearDB.onsuccess = function () {
            DB = crearDB.result;
        };

        // Crear la base de datos en IndexedDB : Solamente se ejecuta una vez
        crearDB.onupgradeneeded = function ( e ) {
            const db = e.target.result;
            const objectStore = db.createObjectStore( 'crm', {
                keyPath: 'id',
                autoIncrement: true,
            } );

            // Configurar los campos de la base de datos
            objectStore.createIndex( 'nombre', 'nombre', { unique: false } );
            objectStore.createIndex( 'email', 'email', { unique: true } );
            objectStore.createIndex( 'telefono', 'telefono', { unique: false } );
            objectStore.createIndex( 'empresa', 'empresa', { unique: false } );
            objectStore.createIndex( 'id', 'id', { unique: true } );
        }
    }
} )();
