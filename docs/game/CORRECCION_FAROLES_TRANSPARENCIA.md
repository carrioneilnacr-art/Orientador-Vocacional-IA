# Corrección de faroles y transparencia

## Causa comprobada

El renderizador levantaba objetos desde el fondo mediante un filtro de color que confundía el pavimento con los tonos claros del vidrio, los reflejos y partes del poste. Al pasar Chaski por detrás aparecían fragmentos del personaje dentro del objeto. Además, el recorte de 70×215 del farol inferior dejaba fuera su remate y partes de la base.

## Prueba y aplicación

`node scripts/inspect-plaza-lamp.cjs` genera `prueba-farol-contorno.png`: fuente original, método anterior y máscara corregida sobre un testigo cian. Permite comprobar visualmente las perforaciones del filtro anterior y la opacidad de lámparas y mástil con la corrección.

Después de comprobar el farol inferior se aplicó el sistema a los siete faroles: contornos de lámparas, brazos, banderines, poste y base; rectángulos de atlas ajustados individualmente; conservación de todos los colores originales dentro del contorno. Los bolardos mantienen su propia silueta.

Para los demás recortes se reparan únicamente agujeros transparentes internos de hasta 64 píxeles del atlas. Los huecos grandes entre patas o ramas, y el exterior conectado con el borde, permanecen abiertos. Esto no sustituye una revisión individual del contorno completo de cada árbol o banca.

El Metropolitano pasa de 650×148 a 650×190: altura +28,4 %, base de ruedas fija en Y=926 y mismo collider de apoyo. Su techo sube a Y=736. Las rutas y zonas de interacción se conservan.

No se modificaron las imágenes fuente ni se generó arte adicional para esta corrección.
