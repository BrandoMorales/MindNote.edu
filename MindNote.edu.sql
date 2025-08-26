-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-08-2025 a las 18:13:53
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mindnote_edu`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizar_estado_tarea` (IN `p_idTarea` INT, IN `p_nuevoEstado` VARCHAR(20))   BEGIN
  UPDATE tarea SET estado = p_nuevoEstado WHERE ID_tarea = p_idTarea;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_consultar_tareas_usuario` (IN `idUsuario` INT)   BEGIN
  SELECT t.ID_tarea, t.titulo, t.descripcion, t.fechaLimite, t.estado, c.nombre AS categoria
  FROM tarea t
  JOIN categoria c ON t.categoria_id = c.ID_categoria
  WHERE t.Usuario_id = idUsuario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminar_tarea` (IN `p_idTarea` INT)   BEGIN
  DELETE FROM notificacion WHERE tarea_id = p_idTarea;
  DELETE FROM historialtareas WHERE tarea_id = p_idTarea;
  DELETE FROM tarea WHERE ID_tarea = p_idTarea;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insertar_tarea` (IN `p_titulo` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_fecha` DATE, IN `p_hora` TIME, IN `p_estado` VARCHAR(20), IN `p_tipo` VARCHAR(20), IN `p_prioridad` VARCHAR(20), IN `p_usuario` INT, IN `p_categoria` INT)   BEGIN
  INSERT INTO tarea (titulo, descripcion, fechaLimite, hora, estado, tipo, prioridad, Usuario_id, categoria_id)
  VALUES (p_titulo, p_descripcion, p_fecha, p_hora, p_estado, p_tipo, p_prioridad, p_usuario, p_categoria);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insertar_usuario` (IN `p_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50), IN `p_email` VARCHAR(100), IN `p_password` VARCHAR(255), IN `p_rol` VARCHAR(20), IN `p_accesibilidad` TINYINT)   BEGIN
  INSERT INTO usuario (Nombre, Apellido, Email, Password, Rol, Accesibilidad)
  VALUES (p_nombre, p_apellido, LOWER(p_email), p_password, p_rol, p_accesibilidad);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `ID_categoria` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `tipo` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`ID_categoria`, `nombre`, `tipo`) VALUES
(1, 'Exámenes', 'academico'),
(2, 'Lecturas', 'academico'),
(3, 'Reuniones', 'laboral'),
(4, 'Pagos', 'personal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contraste`
--

CREATE TABLE `contraste` (
  `id_contraste` int(11) NOT NULL,
  `tipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contraste`
--

INSERT INTO `contraste` (`id_contraste`, `tipo`) VALUES
(3, 3),
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mouse`
--

CREATE TABLE `mouse` (
  `id_mouse` int(11) NOT NULL,
  `tipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mouse`
--

INSERT INTO `mouse` (`id_mouse`, `tipo`) VALUES
(1, 1),
(2, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

CREATE TABLE `tarea` (
  `ID_tarea` int(11) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fechaLimite` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `prioridad` varchar(20) DEFAULT NULL,
  `Usuario_id` int(11) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `fecha_registro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarea`
--

INSERT INTO `tarea` (`ID_tarea`, `titulo`, `descripcion`, `fechaLimite`, `hora`, `estado`, `prioridad`, `Usuario_id`, `categoria_id`, `fecha_registro`) VALUES
(13, 'Entregar informe final', 'Redactar y enviar el informe final del proyecto de investigación', '2025-08-20', '23:59:00', 'Pendiente', 'Alta', 1, 2, 0),
(14, 'Reunión de equipo', 'Reunión semanal con el equipo de desarrollo para revisar avances', '2025-08-18', '10:00:00', 'Pendiente', 'Media', 2, 3, 0),
(15, 'Examen de matemáticas', 'Presentar el examen final de matemáticas en el aula 301', '2025-08-22', '08:00:00', 'Pendiente', 'Alta', 3, 1, 0),
(16, 'Pagar matrícula', 'Realizar el pago de matrícula universitaria antes de la fecha límite', '2025-08-19', '16:00:00', 'Pendiente', 'Alta', 1, 4, 0),
(17, 'Leer capítulo 5', 'Leer y resumir el capítulo 5 del libro de economía', '2025-08-21', '21:00:00', 'Pendiente', 'Baja', 2, 2, 0),
(18, 'Actualizar software', 'Instalar la última versión del sistema de gestión académica', '2025-08-23', '14:00:00', 'Pendiente', 'Media', 4, 3, 0);

--
-- Disparadores `tarea`
--
DELIMITER $$
CREATE TRIGGER `tr_tarea_after_insert` AFTER INSERT ON `tarea` FOR EACH ROW BEGIN
  INSERT INTO historialtareas (fechaRegistro, tarea_id, usuario_id, estado)
  VALUES (NOW(), NEW.ID_tarea, NEW.Usuario_id, NEW.estado);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_tarea_after_update` AFTER UPDATE ON `tarea` FOR EACH ROW BEGIN
  IF OLD.estado <> NEW.estado THEN
    INSERT INTO historialtareas (fechaRegistro, tarea_id, usuario_id, estado)
    VALUES (NOW(), NEW.ID_tarea, NEW.Usuario_id, NEW.estado);
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_tarea_before_delete` BEFORE DELETE ON `tarea` FOR EACH ROW BEGIN
  DELETE FROM notificacion WHERE tarea_id = OLD.ID_tarea;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `texto`
--

CREATE TABLE `texto` (
  `id_texto` int(11) NOT NULL,
  `tipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `texto`
--

INSERT INTO `texto` (`id_texto`, `tipo`) VALUES
(1, 1),
(2, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_usuario` int(11) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Apellido` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Rol` varchar(20) DEFAULT NULL,
  `Accesibilidad` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_usuario`, `Nombre`, `Apellido`, `Email`, `Password`, `Rol`, `Accesibilidad`) VALUES
(1, 'Brandon morales', NULL, 'brandon@example.com', '12345', NULL, NULL),
(2, 'Andres salas', NULL, 'andres@example.com', '12345', NULL, NULL),
(3, 'Yair peña', NULL, 'yair@example.com', '12345', NULL, NULL),
(4, 'Yosman espinoza', NULL, 'yosman@example.com', '12345', NULL, NULL),
(5, 'Ana', 'García', 'ana@gmail.com', '12345', 'Estudiante', 1),
(6, 'Luis', 'Martínez', 'luis@gmail.com', 'abc123', 'Docente', 0),
(7, 'María', 'Lopez', 'maria@gmail.com', 'pass2024', 'Estudiante', 1),
(8, 'Carlos', 'Ramirez', 'carlos@gmail.com', 'clave', 'Administrador', 0),
(9, 'Laura', 'Hernández', 'laura@gmail.com', 'qwerty', 'Estudiante', 1),
(10, 'Pedro', 'Torres', 'pedro@gmail.com', 'test123', 'Estudiante', 0),
(11, 'Diana', 'Vega', 'diana@gmail.com', 'xyz123', 'Docente', 0),
(12, 'Felipe', 'Morales', 'felipe@gmail.com', '45678', 'Estudiante', 1),
(13, 'Sofia', 'Castro', 'sofia@gmail.com', 'sofia2025', 'Estudiante', 1),
(14, 'Andrés', 'Cruz', 'andres@gmail.com', 'cruzpass', 'Estudiante', 0);

--
-- Disparadores `usuario`
--
DELIMITER $$
CREATE TRIGGER `tr_usuario_before_delete` BEFORE DELETE ON `usuario` FOR EACH ROW BEGIN
  DELETE FROM preferenciaaccesibilidad WHERE usuario_id = OLD.ID_usuario;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_usuario_before_insert` BEFORE INSERT ON `usuario` FOR EACH ROW BEGIN
  SET NEW.Email = LOWER(NEW.Email);
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`ID_categoria`);

--
-- Indices de la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`ID_tarea`),
  ADD KEY `Usuario_id` (`Usuario_id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_usuario`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `ID_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tarea`
--
ALTER TABLE `tarea`
  MODIFY `ID_tarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD CONSTRAINT `tarea_ibfk_1` FOREIGN KEY (`Usuario_id`) REFERENCES `usuario` (`ID_usuario`),
  ADD CONSTRAINT `tarea_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`ID_categoria`);

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `actualizar_tareas_vencidas` ON SCHEDULE EVERY 1 DAY STARTS '2025-08-16 17:16:38' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE tarea
  SET estado = 'Vencida'
  WHERE fechaLimite < CURDATE() AND estado = 'Pendiente'$$

CREATE DEFINER=`root`@`localhost` EVENT `generar_recordatorio` ON SCHEDULE EVERY 1 DAY STARTS '2025-08-16 17:16:38' ON COMPLETION NOT PRESERVE ENABLE DO INSERT INTO notificacion (Mensaje, fechaEnvio, entregado, tarea_id)
  SELECT CONCAT('Recordatorio de tarea: ', titulo), NOW(), 0, ID_tarea
  FROM tarea
  WHERE fechaLimite = CURDATE()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
