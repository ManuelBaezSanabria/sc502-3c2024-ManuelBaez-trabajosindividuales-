let estudiantes = [
    {nombre: 'Rebeca', apellido: 'Sanabria', nota: 90},
    {nombre: 'Daniel', apellido: 'Rodriguez', nota: 65},
    {nombre: 'Rodrigo', apellido: 'Ramirez', nota: 88},
    {nombre: 'Emmanuel', apellido: 'Ayala', nota: 92}
];

function mostrarEstudiantes() {
    let lista = "";
    let sumaNotas = 0;

    estudiantes.forEach(estudiante => {
        lista += `<div>${estudiante.nombre} ${estudiante.apellido}</div>`;
        sumaNotas += estudiante.nota;
    });

    let promedio = (sumaNotas / estudiantes.length);
    document.getElementById('listaEstudiantes').innerHTML = lista;
    document.getElementById('promedioNotas').innerText = promedio;
}

mostrarEstudiantes();

