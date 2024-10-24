function calcularDeducciones() {
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value);

    // Cargas sociales (seguro social)
    const porcentajeCargas = 0.1067; // 10.67% en CR de acuerdo a https://www.venegasnexia.com/es/aumento-cargas-sociales-patrono-y-trabajador-2023/
    const cargasSociales = salarioBruto * porcentajeCargas;

    
    let impuestoRenta = 0;
    if (salarioBruto < 941000) {
        impuestoRenta = 0
    }
    else if (salarioBruto > 941000 && salarioBruto <= 1381000){
        impuestoRenta = (salarioBruto - 941000) * 0.10; // Rentas de acuerdo a hacienda https://www.hacienda.go.cr/docs/CP150HACI.pdf
    }
    else if (salarioBruto <= 2423000 && salarioBruto > 1381000){
        impuestoRenta = (salarioBruto - 1381000) * 0.15; // Rentas de acuerdo a hacienda https://www.hacienda.go.cr/docs/CP150HACI.pdf
    }
    else if (salarioBruto > 2423000 && salarioBruto <= 4850000){
        impuestoRenta = (salarioBruto - 2423000) * 0.20; // Rentas de acuerdo a hacienda https://www.hacienda.go.cr/docs/CP150HACI.pdf
    }
    else if ( salarioBruto >= 4850000){
        impuestoRenta = (salarioBruto - 4850000) * 0.25; // Rentas de acuerdo a hacienda https://www.hacienda.go.cr/docs/CP150HACI.pdf
    }

    // Salario neto
    const salarioNeto = salarioBruto - cargasSociales - impuestoRenta;

    // Actualizar la página con los resultados
    document.getElementById('cargasSociales').innerText = cargasSociales.toFixed(2);
    document.getElementById('impuestoRenta').innerText = impuestoRenta.toFixed(2);
    document.getElementById('salarioNeto').innerText = salarioNeto.toFixed(2);
}
