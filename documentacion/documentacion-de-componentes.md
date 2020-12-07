# Documentacion

#### Puntos importantes

1. En esta aplicacion se enfatiza el uso de los componentes basados en clase
2. Uso de redux para el control del estado entre componentes

El js raiz ```index.js``` se encuentra la definicion del redux-persist la cual se encarga de prevenir la renderizacion de la aplicacion sin haber cargado el estado en redux. El wraper envuelve la aplicacion por completo y los usos principales que se le da es:

- la autenticacion de los usuarios
- notificaciones

##### Componente App

- En el se controla el ruteo pricipal de los componentes
- Definicion de las rutas privadas y publicas
- Control de acceso de los usuarios hacia los componentes

##### Componente Application

- Encargado de mostrar las aplicaciones existentes y sus datos
- Se pueden realizar las siguientes acciones: Crear, editar y borrar, por estar condicionado por roles la creacion no esta disponible para roles de admin.

##### Componente Type

- Encargado de mostrar los tipos existentes y sus datos
- Se pueden realizar las siguientes acciones: Crear, editar y borrar.

##### Componente Version

- Encargado de mostrar las versiones existentes y sus datos
- Se pueden realizar las siguientes acciones: Crear, editar y borrar.

##### Componente Perfil

- Encargado de mostrar los datos del usuario
- Se pueden realizar las siguientes acciones: editar y borrar.

##### Componente Registration - solo superAdmin

- Encargado de crear usuarios nuevos
- Se puede asginar roles

##### Componente PermissionToUserApp - solo superAdmin

- Encargado de mostrar usuarios y aplicaciones
- Se pueden realizar las siguientes acciones: asignar y borrar permisos de aplicaciones a usuarios


#### Estructura general de componentes

Por cada una de las vistas principales de la aplicacion se crearon carpetas las cuales almacenan dos archivos:
1. El archivo javascript
2. El modulo scss

Siendo el achivo de javascript el encargado de almacenar el componente React y el modulo scss el que guarda los estilos utilizados.

Los componentes integran un estado el cual se encarga de controlar los datos con los que el mismo componente trabajara, dependiendo de cual sea este es posible que:

- Se realicen llamadas al backend para traer datos adicionales los cuales complementan la interactividad en la creacion de registros en la base de datos.
- Inicializacion de propiedades que modifiquen la logica o el estilo de los componentes (comportamiento por roles)

Se apoya en Axios para las consultas al servidor y debido al control de las rutas mismas por el servidor(proteccion de rutas), es necesario crear una configuracion propia en la que se incluye las propiedades de ```withCredentials: true``` y tambien la definicion de una ```BASE_URL``` de modo que las posteriores consultas se apoyan en esta configuracion para realizar las consultas.

Esta aplicacion utiliza la libreria ```Material-table``` para mostrar los registros correspondientes de cada colleccion en la base de datos de forma ordernada, debido a que el usuario puede modificar el estado de cada uno de estos se utilizan metodos especificos los cuales seran mencionados mas abajo 

###### Metodos Comunes

Existen metodos que se encuentran definidos en todos los componentes debido a la arquitectura con la que la aplicacion fue construida

**SendNotifications:**
```
Utilizado para renderizar los mensajes de error o exito enviados por el servidor, puede manejar cada caso con diferentes estilos condicionalmente.
```

**handleRow_**:
```
Se encarga de trabajar con las acciones disparadas por el usuario, capturan datos y actualizan el estado del componente de forma que dependiendo de cual sea este renderizara una nueva version con los datos modificados.
```



#### Utilizacion de redux

Principalmente los componentes integraran :

- mapStateToProps
- mapDispatchToProps

para la obtencion de la autenticacion, asi como la base url y el usuario de modo que puedan aplicar estas propiedades en el renderizado u comportamiento condicionalmente.


### Componente: PermissionToUserApp

Este componente no utiliza ```material-table``` si no que se apoya en la libreria ```material-ui``` especificamente en el componente de ```DataGrid``` debido a que es mas flexible para poder trabajar con el renderizado de elementos en la interfaz basado en roles y su integracion mas dinamica y sencilla con otros componentes de la misma libreria.

