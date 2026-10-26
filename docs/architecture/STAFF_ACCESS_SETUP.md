# Acceso institucional por usuario

El inicio de sesión acepta un correo de Supabase Auth o un usuario de
`school_staff.username`, almacenado en minúsculas. El campo `login_email`
resuelve la identidad de Auth; `school_staff.role` y `school_id` determinan
los permisos. Las contraseñas no se almacenan en el repositorio.

La migración `supabase/migrations/20261026231219_school_access_bootstrap.sql`
crea las tablas mínimas de acceso (`schools`, `school_staff`, `audit_log`).
No despliega los módulos de alumnos ni de seguimiento académico.

Se habilitó `UserDirector` con rol `DIRECTOR` en el colegio vacío
`Colegio de prueba Chaski`. Su identificador técnico de Auth usa el dominio
reservado `staff.chaski.invalid`: no es un buzón de correo para recuperación.
El acceso por usuario se resuelve desde la base de datos y no requiere
`STAFF_LOGIN_ALIASES` para esta cuenta.

## Configuración del servidor

Además de las variables de Supabase y PostgreSQL, cada despliegue necesita
`STAFF_AUTH_SECRET`, con al menos 32 caracteres aleatorios. Configurar la
variable en Vercel para el entorno correspondiente y volver a desplegar.
La configuración local de `.env` no se sincroniza con Vercel.

## Verificación realizada

- Supabase Auth aceptó la cuenta solicitada.
- Login local y consulta de sesión respondieron HTTP 200, con rol DIRECTOR.
- El navegador abrió `/colegio/dashboard` mostrando el colegio de prueba.
- TypeScript y 14 pruebas de autenticación pasaron.

Las tres tablas de acceso tienen RLS habilitado y permisos revocados para
`anon` y `authenticated`: solo las rutas del servidor las consultan. El aviso
[RLS sin políticas](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)
corresponde a esa denegación de acceso directo. Supabase también reporta que
la [protección contra contraseñas filtradas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
está desactivada en el proyecto; no se modificó esa configuración.
