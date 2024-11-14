<?php

$transacciones = [];


function registrarTransaccion(&$transacciones, $id, $descripcion, $monto) {
    $transaccion = [
        "id" => $id,
        "descripcion" => $descripcion,
        "monto" => $monto
    ];
    array_push($transacciones, $transaccion);
}

function generarEstadoDeCuenta($transacciones) {
    $montoContado = 0;
    foreach ($transacciones as $transaccion) {
        $montoContado += $transaccion["monto"];
    }
    
    $montoInteres = $montoContado * 0.026;

    
    $cashback = $montoContado * 0.001;

    
    $montoFinal = $montoInteres - $cashback;

    
    $estadoCuenta = "Estado de Cuenta:\n\n";
    $estadoCuenta .= "Transacciones:\n";
    foreach ($transacciones as $transaccion) {
        $estadoCuenta .= "ID: {$transaccion['id']}, Descripción: {$transaccion['descripcion']}, Monto: $ {$transaccion['monto']}\n";
    }
    $estadoCuenta .= "\nMonto Total de Contado: $ " . number_format($montoContado, 2) . "\n";
    $estadoCuenta .= "Monto Total con Interés (2.6%): $ " . number_format($montoInteres, 2) . "\n";
    $estadoCuenta .= "Cash Back (0.1%): $ " . number_format($cashback, 2) . "\n";
    $estadoCuenta .= "Monto Final a Pagar: $ " . number_format($montoFinal, 2) . "\n";

    
    echo nl2br($estadoCuenta);

    
    file_put_contents("estado_cuenta.txt", $estadoCuenta);
}

//ejemplitos
registrarTransaccion($transacciones, 1, "Compra en supermercado", 150.00);
registrarTransaccion($transacciones, 2, "Tarjetas Pookemon", 75.00);
registrarTransaccion($transacciones, 3, "Compra en línea", 200.00);
registrarTransaccion($transacciones, 4, "Chilis", 120.00);

generarEstadoDeCuenta($transacciones);
?>
