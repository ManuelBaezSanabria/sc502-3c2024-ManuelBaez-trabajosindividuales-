
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
    }
}
function obtenerTareasConComentarios() {
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

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

session_start();
if (isset($_SESSION['user_id'])) {
    switch ($method) {
        case 'GET':
            if (isset($_GET['task_id'])) {
                $comentarios = obtenerComentariosPorTarea($_GET['task_id']);
                echo json_encode($comentarios);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'POST':
            $input = getJsonInput();
            if (isset($input['task_id'], $input['comment'])) {
                $id = crearComentario($input['task_id'], $input['comment']);
                if ($id > 0) {
                    http_response_code(201);
                    echo json_encode(["message" => "Comentario creado: ID:" . $id]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error general creando el comentario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'PUT':
            $input = getJsonInput();
            if (isset($input['comment']) && isset($_GET['id'])) {
                $editResult = editarComentario($_GET['id'], $input['comment']);
                if ($editResult) {
                    http_response_code(200);
                    echo json_encode(["message" => "Comentario actualizado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error actualizando el comentario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'DELETE':
            if (isset($_GET['id'])) {
                $fueEliminado = eliminarComentario($_GET['id']);
                if ($fueEliminado) {
                    http_response_code(200);
                    echo json_encode(["message" => "Comentario eliminado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error eliminando el comentario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Método no permitido"]);
            break;
    }
} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
}


?>
