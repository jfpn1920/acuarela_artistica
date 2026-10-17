//--------------------------------------//
//--|funcionalidad_acuarela_artistica|--//
//--------------------------------------//
const CLAVE = "acuarelaArtistica";
let estado = {
    favoritas: [],
    notas: {},
    filtro: "todas"
};
const pinturas = document.querySelectorAll(".pintura");
const galeria = document.getElementById("galeria");
const filtros = document.querySelectorAll(".filtro");
const zonaFiltros = document.getElementById("filtros");
const favoritas = document.getElementById("favoritas");
const promedio = document.getElementById("promedio");
const vacio = document.getElementById("vacio");
//-----------------------------------//
//--|guardar_datos_en_el_navegador|--//
//-----------------------------------//
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
function cargar() {
    const datos = localStorage.getItem(CLAVE);
    if (datos) {
        estado = {
            ...estado,
            ...JSON.parse(datos)
        };
    }
}
//---------------------------//
//--|actualizar_la_galeria|--//
//---------------------------//
function actualizar() {
    let visibles = 0;
    pinturas.forEach(function(pintura) {
        const id = pintura.dataset.id;
        const esFavorita = estado.favoritas.includes(id);
        const nota = estado.notas[id] || 0;
        //--------------------------------------//
        //--|mostrar_pinturas_segun_el_filtro|--//
        //--------------------------------------//
        const mostrar = estado.filtro === "todas" || esFavorita;
        pintura.classList.toggle("oculta", !mostrar);
        if (mostrar) {
            visibles++;
        }
        //-------------------------------------//
        //--|actualizar_corazon_de_favoritos|--//
        //-------------------------------------//
        pintura.querySelector(".corazon").textContent =
            esFavorita ? "❤️" : "🤍";
        pintura.querySelectorAll(".estrellas button").forEach(
            function(estrella) {
                estrella.classList.toggle(
                    "activa",
                    Number(estrella.dataset.n) <= nota
                );
            }
        );
    });
    //-----------------------------------------//
    //--|calcular_promedio_de_calificaciones|--//
    //-----------------------------------------//
    const notas = Object.values(estado.notas).filter(
        function(n) {
            return n > 0;
        }
    );
    const suma = notas.reduce(
        function(total, n) {
            return total + n;
        },
        0
    );
    if (notas.length) {
        promedio.textContent = (suma / notas.length).toFixed(1) + " ★";
    } else {
        promedio.textContent = "–";
    }
    //--------------------------------------//
    //--|actualizar_contador_de_favoritas|--//
    //--------------------------------------//
    favoritas.textContent = estado.favoritas.length;
    filtros.forEach(function(boton) {
        boton.classList.toggle(
            "activo",
            boton.dataset.filtro === estado.filtro
        );
    });
    vacio.style.display = visibles === 0 ? "block" : "none";
}
//--------------------------------------//
//--|eventos_de_estrellas_y_favoritos|--//
//--------------------------------------//
galeria.addEventListener("click", function(evento) {
    const pintura = evento.target.closest(".pintura");
    if (!pintura) {
        return;
    }
    const id = pintura.dataset.id;
    const estrella = evento.target.closest(".estrellas button");
    //----------------------------//
    //--|registrar_calificacion|--//
    //----------------------------//
    if (estrella) {
        const n = Number(estrella.dataset.n);
        if (estado.notas[id] === n) {
            estado.notas[id] = 0;
        } else {
            estado.notas[id] = n;
        }
    } else if (evento.target.closest(".corazon")) {
        //--------------------------------//
        //--|agregar_o_quitar_favoritos|--//
        //--------------------------------//
        if (estado.favoritas.includes(id)) {
            estado.favoritas = estado.favoritas.filter(
                function(f) {
                    return f !== id;
                }
            );
        } else {
            estado.favoritas = [...estado.favoritas, id];
        }
    } else {
        return;
    }
    guardar();
    actualizar();
});
//----------------------------//
//--|eventos_de_los_filtros|--//
//----------------------------//
zonaFiltros.addEventListener("click", function(evento) {
    const boton = evento.target.closest(".filtro");
    if (!boton) {
        return;
    }
    estado.filtro = boton.dataset.filtro;
    guardar();
    actualizar();
});
//--------------------------//
//--|reiniciar_la_galeria|--//
//--------------------------//
document.getElementById("btn-reiniciar").addEventListener(
    "click",
    function() {
        estado = {
            favoritas: [],
            notas: {},
            filtro: "todas"
        };
        localStorage.removeItem(CLAVE);
        actualizar();
    }
);
//---------------------------//
//--|iniciar_la_aplicacion|--//
//---------------------------//
cargar();
actualizar();