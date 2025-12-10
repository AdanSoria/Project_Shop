# Configuración de Firebase Authentication

## Problema Solucionado

Los usuarios se estaban registrando solo en la colección `users` de Firestore pero **NO** en Firebase Authentication, lo que impedía iniciar sesión correctamente.

## Cambios Realizados

### 1. Backend - `src/models/user.model.js`

**Cambios:**
- Importa `admin` además de `db` desde firebase.config
- Crea usuario en Firebase Authentication usando `admin.auth().createUser()`
- Guarda el UID de Firebase Auth en el documento de Firestore
- Usa el UID como ID del documento en Firestore (en lugar de auto-generado)

**Flujo de registro:**
```
1. Validar datos (username, correo, password)
2. Verificar que no exista el username o correo
3. Crear usuario en Firebase Auth con correo y contraseña
4. Hash de la contraseña para almacenar en Firestore
5. Guardar usuario en Firestore con el UID de Firebase Auth
```

### 2. Backend - `src/config/firebase.config.js`

**Cambios:**
- Exporta objeto `{ db, admin }` en lugar de solo `db`
- Permite acceso al Firebase Admin SDK desde otros módulos

### 3. Backend - Otros modelos actualizados

Archivos modificados para extraer solo `db`:
- `src/models/product.model.js`
- `src/models/order.model.js`
- `src/models/cart.model.js`

### 4. Frontend - `src/frontend/src/services/authService.js`

**Cambios:**
- Importa Firebase Authentication del cliente
- Mantiene el flujo de login con el backend (JWT)
- Agrega `signOut` de Firebase en logout

## Cómo Funciona Ahora

### Registro

1. Usuario llena el formulario de registro
2. Frontend envía datos al backend `/api/auth/register`
3. Backend crea usuario en **Firebase Authentication** con correo y contraseña
4. Backend guarda datos completos en Firestore (colección `users`)
5. Documento en Firestore usa el UID de Firebase Auth como ID

### Login

1. Usuario ingresa username y password
2. Frontend envía credenciales al backend `/api/auth/login`
3. Backend busca usuario por username en Firestore
4. Backend compara contraseña hasheada
5. Backend genera JWT token
6. Frontend guarda token en localStorage

## Verificar Firebase Authentication

1. Ve a Firebase Console: https://console.firebase.google.com/project/projectfinal-d7257/authentication/users

2. Asegúrate de tener habilitado el método de autenticación **Email/Password**:
   - Authentication > Sign-in method
   - Email/Password debe estar **Enabled**

3. Después de registrar un usuario, deberías verlo en:
   - Authentication > Users (con su correo)
   - Firestore > users (con todos sus datos)

## Comandos para Probar

### Eliminar usuarios antiguos (opcional)

Si tienes usuarios creados antes de esta corrección, puedes eliminarlos:

1. En Firestore Database:
   - Ve a la colección `users`
   - Elimina documentos antiguos (los que no tienen `uid` de Firebase Auth)

2. En Authentication:
   - Ve a Users
   - Elimina usuarios existentes si los hay

### Probar el registro

1. Recarga el frontend: http://localhost:5174
2. Ve a Register
3. Llena el formulario con datos nuevos
4. Verifica en Firebase Console que se creó en ambos lugares

## Estructura del Usuario en Firestore

```json
{
  "uid": "firebase-auth-uid-aqui",
  "username": "usuario123",
  "password": "hash-bcrypt-aqui",
  "correo": "correo@ejemplo.com",
  "nombre": "Nombre Completo",
  "domicio": "Dirección",
  "postal": "12345",
  "rfc": "RFC123456",
  "razon_social": "Razón Social",
  "id_factura": null,
  "rol": "cliente"
}
```

## Notas Importantes

- El UID de Firebase Auth ahora es el ID del documento en Firestore
- El password sigue hasheado con bcrypt en Firestore (por seguridad adicional)
- Firebase Auth maneja la autenticación, pero el backend valida con JWT
- El rol de usuario se maneja desde Firestore, no desde Firebase Auth

## Si Encuentras Errores

### Error: "Email already exists"
- El correo ya está registrado en Firebase Authentication
- Elimina el usuario de Authentication o usa otro correo

### Error: "auth/invalid-email"
- El formato del correo no es válido
- Usa un correo válido (ejemplo@dominio.com)

### Error: "auth/weak-password"
- La contraseña debe tener al menos 6 caracteres
- Firebase Auth requiere mínimo 6 caracteres
