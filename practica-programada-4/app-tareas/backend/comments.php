
<?php

require 'db.php';

// Crear un comentario asociado a un task_id
function crearComentario($task_id, $comment)
{
    global $pdo;
    try {
        $sql = "INSERT INTO comments (task_id, comment) values (:task_id, :comment)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'task_id' => $task_id,
            'comment' => $comment
        ]);
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        logError("Error creando comentario: " . $e->getMessage());
        return 0;
    }
}

// Editar un comentario existente
function editarComentario($id, $comment)
{
    global $pdo;
    try {
        $sql = "UPDATE comments SET comment = :comment WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'comment' => $comment,
            'id' => $id
        ]);
        return $stmt->rowCount();
    } catch (Exception $e) {
        logError("Error editando comentario: " . $e->getMessage());
        return 0;
    }
}

// Eliminar un comentario por ID
function eliminarComentario($id)
{
    global $pdo;
    try {
        $sql = "DELETE FROM comments WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount();
    } catch (Exception $e) {
        logError("Error eliminando comentario: " . $e->getMessage());
+-cddfunction obtenerTareasConComentarios() {
    global $pdo;
    try {
        $sqlTareas = "SELECT id, title, description, due_date FROM tasks ORDER BY id DESC";
        $stmtTareas = $pdo->query($sqlTareas);
        $tareas = $stmtTareas->fetchAll(PDO::FETCH_ASSOC);

        $sqlComentarios = "SELECT task_id, id as comment_id, comment FROM comments ORDER BY id ASC";
        $stmtComentarios = $pdo->query($sqlComentarios);
        $comentarios = $stmtComentarios->fetchAll(PDO::FETCH_ASSOC);

        $resultado = [];
        foreach ($tareas as $tarea) {
            $resultado[$tarea['id']] = $tarea;
            $resultado[$tarea['id']]['comments'] = [];
        }

        foreach ($comentarios as $comentario) {
            if (isset($resultado[$comentario['task_id']])) {
                $resultado[$comentario['task_id']]['comments'][] = [
                    'id' => $comentario['comment_id'],
                    'description' => $comentario['comment']
                ];
            }
        }

        return array_values($resultado);
    } catch (Exception $e) {
        logError("Error al obtener tareas y comentarios: " . $e->getMessage());
        return [];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json');
    echo json_encode(obtenerTareasConComentarios());
}


?>
