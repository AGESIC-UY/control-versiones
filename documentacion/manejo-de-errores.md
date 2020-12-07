# BB error

## Aplicacion

- la aplicacion no existe

    ```jsx
    {
    "code" : 404,
    "message" : "Ocurrió un error al traer la aplicacion",
    "description" : "La aplicacion no existe..."
    }
    ```

- La aplicacion no puede crearse - el nombre ya ha sido registrado

    ```json
    {
    				code: 422,
            message: 'Ocurrió un error',
            description: 'No se propociono el nombre el cual es requerido o este es mas corto que 5 caracteres o mayor a 100'
    }
    ```

- la aplicacion existe pero no la version

    ```json
    {
    "code" : 200,
    "message" : "version no encontrada",
    "description" : "Aplicacion encontrada con exito, no se ha encontrado la version esperada pero se trajo la ultima compatible"
    }
    ```

- La aplicacion existe pero no hay versiones

    ```jsx
    {
    "code" : 404,
    "message" : "No existen versiones para esta aplicacion",
    "description" : "La aplicacion existe pero no hay versiones registradas"
    }
    ```

- La aplicacion existe y sus datos correspondientes

    ```jsx
    {
    "code" : 200,
    "message" : "Exito",
    "description" : "La aplicacion, version y tipo han sido encontrados con exito"
    }
    ```

- Error al crear applicacion  - No proporciono datos requeridos

    ```json
    {
    "code" : 422,
    "message" : "Ocurrió un error al crear aplicacion",
    "description" : "El nombre es requerido"
    }
    ```

- Errores al crear Application - Type - Version

    ```jsx
    Si el nombre de la aplicacion ya existe
    {
            code: 422,
            message: 'Ocurrió un error',
            description: 'Aplicacion: el nombre ya ha sido registrado'
    }
    Si el nombre del tipo no ha sido proporcionado
    {
            code: 422,
            message: 'Ocurrió un error',
            description: 'Tipo: No se propociono el nombre el cual es requerido o este es mas corto que 5 caracteres o mayor a 100'
    }
    Si los datos requeridos de application no ha sido proporcionado
    {
            code: 422,
            message: 'Ocurrió un error',
            description: 'Aplicacion: El nombre ya ha sido registrado o no se propocionaron datos requeridos o estos son mas cortos que 5 caracteres o mayores a 100'
    }

    ```

- Error al traer aplicacion(desde movil) - no se encontro app o versiones

    ```jsx
    {
            code: 200,
            message: 'Ocurrio un error',
            description: 'Aplicacion no encontrada'
      }

    {
        "code": 200,
        "message": "Exito",
        "description": "No se encontro la version proporcionada, la version mas reciente encontrada con exito",
    }
    ```

## User - Auth

- Error al registrarse  - No proporciono datos requeridos

    ```json
    {
    "code" : 422,
    "message" : "Ocurrió un error al registrar usuario",
    "description" : "username, nombre, email, password deben ser incluidos"
    }
    ```

- Error al registrarse - Proporciono los datos requeridos pero no cumplen con la longitud minima

    ```json
    {
    "code" : 422,
    "message" : "Ocurrió un error al registrar usuario",
    "description" : "username, nombre, email, password deben tener una longitud mayor a 5 caracteres"
    }
    ```

- Error al hacer login - Usuario no encontrado

    ```json
    {
    "code" : 401,
    "message" : "Ocurrió un error en el login de usuario",
    "description" : "Usuario no encontrado"
    }
    ```

- Error al hacer login - credenciales incorrectas

    ```json
    {
    "code" : 401,
    "message" : "Ocurrió un error en el login de usuario",
    "description" : "Email y/o password incorrectos"
    }
    ```

## Version

- Error al crear version - No proporciono datos requeridos

    ```json
    {
    "code" : 422,
    "message" : "Ocurrió un error al crear version",
    "description" : "aplicacion, version, url de servicios y version minima son requeridos"
    }
    ```

- Error al actualizar version - No proporciono datos requeridos

    ```json
    {
    "code" : 422,
    "message" : "Ocurrió un error al actualizar version",
    "description" : "aplicacion, version, url de servicios y version minima son requeridos"
    }
    ```

- Error al eliminar version - No se encontro version

    ```json
    {
    "code" : 404,
    "message" : "Ocurrió un error al eliminar version",
    "description" : "Version no encontrada"
    }
    ```

## Tipo

- Error al crear tipo - No proporciono datos requeridos

    ```json
    {
    "code" : 422,
    "message" : "Ocurrió un error al crear tipo",
    "description" : "Nombre es requerido"
    }
    ```

- Error al actualizar tipo - No proporciono datos requeridos

    ```json
    {
    "code" : 422,
    "message" : "Ocurrió un error al actualizar tipo",
    "description" : "Nombre es requerido"
    }
    ```

- Error al eliminar tipo - No se encontro tipo

    ```json
    {
    "code" : 404,
    "message" : "Ocurrió un error al eliminar tipo",
    "description" : "Tipo no encontrado"
    }
    ```