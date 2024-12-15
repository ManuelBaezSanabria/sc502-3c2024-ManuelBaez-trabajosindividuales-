<?php
require 'comments.php';

// Crear un comentario para una tarea específica
$idComentario = crearComentario(1, 'Este es un comentario de prueba.');
if ($idComentario) {
    echo 'Comentario creado exitosamente: ' . $idComentario . PHP_EOL;
} else {
    echo 'No se pudo crear el comentario.' . PHP_EOL;
}

// Editar el comentario creado
$editado = editarComentario($idComentario, 'Este comentario fue editado.');
if ($editado) {
    echo "Comentario editado exitosamente." . PHP_EOL;
} else {
    echo "Error al editar el comentario." . PHP_EOL;
}

// Listar comentarios de una tarea específica
echo "Lista de comentarios para la tarea con ID 1:" . PHP_EOL;
$comentarios = listarComentarios(1);
if ($comentarios) {
    foreach ($comentarios as $comentario) {
        echo "ID Comentario: " . $comentario["id"] . " Contenido: " . $comentario["description"] . PHP_EOL;
    }
} else {
    echo "No se encontraron comentarios para la tarea especificada." . PHP_EOL;
}

// Eliminar el comentario creado
echo "Eliminando el comentario con ID: " . $idComentario . PHP_EOL;
$eliminado = eliminarComentario($idComentario);
if ($eliminado) {
    echo "El comentario se eliminó exitosamente." . PHP_EOL;
} else {
    echo "Error al eliminar el comentario." . PHP_EOL;
}
?>
