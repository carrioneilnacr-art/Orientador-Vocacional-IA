# Chaski Adventure — escenarios de Lima

> La implementación actual de la Plaza y sus seis encuentros RIASEC está documentada en [PLAZA_RIASEC_IMPLEMENTACION.md](./PLAZA_RIASEC_IMPLEMENTACION.md). Ese documento reemplaza el estado preliminar de Rosa descrito abajo; las demás filas siguen siendo dirección futura.

Referencia visual: imagen «Pixel Peru: Chaski’s City Adventure» aportada por el usuario. El objetivo es una aventura urbana 2D para adolescentes: Chaski camina por lugares reconocibles, conversa y experimenta antes de anotar lo que le interesa. Las escenas representan Lima de forma imaginada; no afirman detalles de instituciones reales.

| Escenario | Lectura de la imagen | Interacciones del prototipo | Evolución artística |
| --- | --- | --- | --- |
| Plaza de Lima | Arquitectura histórica, palmeras, fuente, comercio y vecinos. | Puesto de inventos, artista, vecinos y memoria urbana. | Plaza por capas con peatones y oficios propios. |
| Colegio | Patio, gradas, aulas de dos pisos, árbol y estudiantes. | Laboratorio, arte, equipo y huerto. | Aulas visitables y personajes con horarios. |
| Centro comercial | Escaleras, tiendas de moda y tecnología, cafetería y tránsito. | Tecnología, moda, atención y negocios. | Escaleras y locales como espacios conectados. |
| Feria de talentos | Carpas de ciencia, arte, emprendimiento y tecnología. | Cuatro puestos temáticos. | Experimentos cortos y proyectos estudiantiles. |
| Barrio y comunidad | Casas, mural, calles en pendiente y vecindario. | Taller, mural, organización y retos barriales. | Vecinos con necesidades y cambios visibles al colaborar. |
| Restaurante | Barra, cocina abierta, mesas, luz cálida y equipo de trabajo. | Cocina, diseño, servicio y alimentos. | Cocina y comedor con acciones coordinadas. |
| Hospital y clínica | Consultorios, recepción, accesibilidad y personal sanitario. | Tecnología médica, comunicación, cuidado e investigación. | Escena respetuosa centrada en coordinación y empatía. |
| Ciudad digital | Laboratorio de robots, pantallas, especialistas y luz fría. | Robótica, diseño, equipo y datos. | Máquinas y prototipos con estados interactivos. |
| Universidad | Facultad, escalinata, estudiantes y espacios de estudio. | Laboratorio, artes, vida universitaria e investigación. | Campus con interiores y conversaciones sobre rutas de aprendizaje. |
| Mapa general | Ciudad, costa, relieve e iconos de destinos. | Minimapa y selección de destino al subir al Metropolitano. | Mapa propio con ruta y posición persistente de Chaski. |

## Estado del prototipo

El motor actual del proyecto es una escena React/SVG con bucle `requestAnimationFrame`, cámara y movimiento por teclado o puntero. La Plaza se integró en ese motor sin introducir una dependencia nueva. Usa piezas SVG propias organizadas en suelo, edificios, objetos y capa frontal. La fuente, jardines, bancas, puesto, edificios y troncos de palmeras tienen colisión. Chaski reutiliza la pose de reposo y la tira de ocho fotogramas de caminata aportada por el usuario; la marcha hacia la izquierda se obtiene invirtiendo esa tira y todavía faltan sprites específicos para caminar de frente y de espaldas. Rosa es un NPC independiente con diálogo y acceso a las actividades existentes. El resto de lugares de esta tabla son dirección de diseño; el barrio, colegio y malecón conservan sus prototipos anteriores mientras se prepara el mismo sistema de mapas para ellos. Los demás lugares aún no están implementados.

El Metropolitano funciona como transporte dentro del juego, no como simulación de recorridos reales. La bitácora registra preferencias exploratorias locales y no ofrece diagnóstico vocacional.
