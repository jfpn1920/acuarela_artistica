// ===== Acuarela Artística =====
// Clave con la que se guardan los datos en localStorage
const CLAVE = 'acuarelaArtistica';
// Estado: pinturas favoritas, calificaciones por pintura y filtro elegido
let estado = { favoritas: [], notas: {}, filtro: 'todas' };
// ===== Referencias a elementos del HTML =====
const pinturas = document.querySelectorAll('.pintura');    // las 4 pinturas
const galeria = document.getElementById('galeria');        // contenedor de pinturas
const filtros = document.querySelectorAll('.filtro');      // botones de filtro
const zonaFiltros = document.getElementById('filtros');    // contenedor de filtros
const favoritas = document.getElementById('favoritas');    // contador de favoritas
const promedio = document.getElementById('promedio');      // promedio de estrellas
const vacio = document.getElementById('vacio');            // mensaje de filtro vacío
// ===== Funciones de localStorage =====
// Guarda el estado actual en el navegador (como texto JSON)
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// Carga el estado guardado (si existe) al abrir la página
function cargar() {
    const datos = localStorage.getItem(CLAVE); // lee el texto guardado
    if (datos) estado = { ...estado, ...JSON.parse(datos) };
}
// ===== Funciones de la interfaz =====
// Dibuja en pantalla todo lo que está guardado en el estado
function actualizar() {
    let visibles = 0; // cuenta cuántas pinturas se están mostrando
    pinturas.forEach(pintura => {
        const id = pintura.dataset.id;
        const esFavorita = estado.favoritas.includes(id);
        const nota = estado.notas[id] || 0; // 0 si aún no tiene calificación
        // Muestra u oculta la pintura según el filtro
        const mostrar = estado.filtro === 'todas' || esFavorita;
        pintura.classList.toggle('oculta', !mostrar);
        if (mostrar) visibles++;
        // Cambia el corazón: rojo si es favorita, blanco si no
        pintura.querySelector('.corazon').textContent = esFavorita ? '❤️' : '🤍';
        // Pinta de dorado las estrellas hasta la calificación guardada
        pintura.querySelectorAll('.estrellas button').forEach(estrella => {
            estrella.classList.toggle('activa', Number(estrella.dataset.n) <= nota);
        });
    });
    // Calcula el promedio solo con las pinturas que ya tienen calificación
    const notas = Object.values(estado.notas).filter(n => n > 0);
    const suma = notas.reduce((total, n) => total + n, 0);
    promedio.textContent = notas.length ? (suma / notas.length).toFixed(1) + ' ★' : '–';
    favoritas.textContent = estado.favoritas.length;
    // Resalta el filtro activo y muestra el mensaje si no hay nada que ver
    filtros.forEach(b => b.classList.toggle('activo', b.dataset.filtro === estado.filtro));
    vacio.style.display = visibles === 0 ? 'block' : 'none';
}
// ===== Eventos =====
// Un solo "oyente" en la galería: estrellas y corazones de todas las pinturas
galeria.addEventListener('click', (evento) => {
    const pintura = evento.target.closest('.pintura');
    if (!pintura) return;
    const id = pintura.dataset.id;
    const estrella = evento.target.closest('.estrellas button');
    if (estrella) {
        const n = Number(estrella.dataset.n);
        // Si se pulsa la misma estrella otra vez, se quita la calificación
        estado.notas[id] = estado.notas[id] === n ? 0 : n;
    } else if (evento.target.closest('.corazon')) {
        // Agrega o quita la pintura de las favoritas
        estado.favoritas = estado.favoritas.includes(id)
            ? estado.favoritas.filter(f => f !== id)
            : [...estado.favoritas, id];
    } else return; // clic en otra parte de la pintura: no hace nada
    guardar();
    actualizar();
});
// Un solo "oyente" en los filtros
zonaFiltros.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.filtro');
    if (!boton) return;
    estado.filtro = boton.dataset.filtro;
    guardar();
    actualizar();
});
// Botón "Reiniciar galería": borra favoritas y calificaciones
document.getElementById('btn-reiniciar').addEventListener('click', () => {
    estado = { favoritas: [], notas: {}, filtro: 'todas' };
    localStorage.removeItem(CLAVE);
    actualizar();
});
// ===== Inicio =====
// Al cargar la página: lee lo guardado y dibuja
cargar();
actualizar();