

<!-- toc -->

- [## Despliegue en OpenShift!](#-despliegue-en-openshift)
  - [Estructura de carpetas](#estructura-de-carpetas)
  - [Instalación de Ambientes](#instalación-de-ambientes)
  - [CI/CD como funciona](#cicd-como-funciona)

<!-- tocstop -->

## Despliegue en OpenShift!
-----------------

Se va a estar definiendo a continuación como se realiza el despliegue en openshift, para eso se van a explicar los siguientes puntos
- Estructura de Carpetas
- Instalación  ambientes
  * Variables a indicar en staging
  * Variables a indicar en producción
  * Variables a indicar en ci-cd
- CI/CD como funciona
  * Piplelines definidos
  


### Estructura de carpetas

Los archivos que están relacionados a la configuración son:

####Ambiente de CICD

El mismo se encuentra definido en

```bash
templates/ci-cd.json
```

Este archivo contiene la definición del servicio de Jenkins que se utiliza, para ejecutar los diferentes pipelines.
Además se definen dos pipelines,
1) Para staging
2) Para producción

para conocer como funciona haz click [aqui](#ci/cd-como-funciona)

####Ambiente de Staging

El mismo se encuentra definido en

```bash
templates/building-blocks_dev.json
```

Este archivo se utiliza como template para la creación del ambiente de staging:
1) Crea un aplicativo llamado buildingblocks que está formado por tres partes:
   1) Backend, se crea un buildconfig que se encarga de compilar el código de Git del backend (_server_), usando una imágen de nodejs y como resultado registra una imágen con el tag **dev**. 
   2) Frontend, se crea un buildconfig que se encarga de compilar el código de Git del frontend (_client_), usando una imágen de nodejs y como resultado registra una imágen con el tag **dev**. 
   3) Mongodb, se crea un pod que mantiene la base de datos mongodb, en ese caso se configura un storage volume, que se encarga de hacer persistente frente a cualquier reinicio del pod.
2) Crea unos secrets:
   1) buildingblocks - almacena el acceso a la base de datos mongodb
   2) buildingblocks-git - almacena el acceso al git.
3) Cabe destacar que además el template configura un DeployConfig para el Backend y Frontend.

para conocer como funciona ci/cd haz click [aqui](#ci/cd-como-funciona)
</br>

####Ambiente de Producción

El mismo se encuentra definido en

```bash
templates/building-blocks_prod.json
```

Este archivo se utiliza como template para la creación del ambiente de producción:
1) Crea un aplicativo llamado buildingblocks que está formado por tres partes, de igual forma que el developer, con la diferencia que no posee los buildconfig y las imágenes las obtiene del proyecto staging. Para más detalles haz click [aqui](#ci/cd-como-funciona)
2) Crea unos secrets:
   1) buildingblocks - almacena el acceso a la base de datos mongodb
   2) buildingblocks-git - almacena el acceso al git.

### Instalación de Ambientes

Una vez creado cada proyecto lo que se hace es importar cada template, procesarlo, luego de eso aparece una serie de variables a completar que se listarán a continuación para explicar el significado de cada una en el sistema.

Los valores que están indicados en el template, están configurados para que funcione con la configuración del servidores establecida. Pero a modo de descripción se indican una descripción de cada variable que hay que completar al momento de precesar el template.

####Variables para indicar en Staging
</br>

**Name:** Es el nombre del aplicativo
**Namespace:** Es el Openshift Namespace donde residen las imagenes.
**Version of NodeJS Image:** Se indica la versión de NodeJS a utilizar.
**Version of MongoDB Image:** Se indicar la versión de MongoDB a utilizar.
**Memory Limit:** Se indica la memoria que va a contener el contenedores en general.
**Memory Limit (MongoDB):** Se indica la memoria que va a contener el contenedor de MongoDB.
**Volume Capacity:** Se indica la capacidad del volumen que va a almacenar la información de la base de datos.
**Git Repository URL:** Indicar la url del git donde se encuentra el código del proyecto.
**Git Reference:** En caso que el código se encuentra en una branch distinta a la principal, indicar el nombre aquí.
**Context Directory:** Indica en que carpeta del aplicativo backend, dentro del proyecto git.
**Context Directory Frontend:** Indica en que carpeta del aplicativo frontend, dentro del proyecto git.
**Application Hostname:** Se indica el nombre del dominio custom a utilizar. Por defecto vacío para que tome el valor por defecto.
**GitHub Webhook Secret:** En caso de querer configurar los webhook de gitlab o github completar alguna de estas dos variables.
**Generic Webhook Secret:**
**Database Service Name:** Es el nombre que va a tener el servicio de base de datos mongodb.
**MongoDB Username:** Es el usuario de la base de datos mongodb, que va a utilizar para conectarse el backend.
**MongoDB Password:** Es el password de la base de datos mongodb, que va a utilizar para conectarse el backend.
**Database Name:** Es el nombre del host de mongodb.
**DB_HOST:** Es el nombre del host de mongodb. En la mayoría de los casos tiene el mismo valor que la variable Database Service Name.
**Database Administrator Password:** Es el password del administrador de la base de datos, por defecto se genera una password automáticamente, en caso de querer editarlo manualmente hay que indicar un valor en el campo.
**Custom NPM Mirror URL:** Este campo permite indicar una url alternativa para descargar la imagen de nodejs. Por defecto queda vacío el campo, se cambiaría en caso de versiones especiales de OC.
**Frontend HOST URL:** Se indica la url donde estará hosteado el app del frontend. Como se construye esta url. ``` <nombre del app frontend>.<nombre del proyecto>.<dominio del servidor>```
**Email to send:** Se ingresa el email que se usa para enviar avisos.
**Password to send:** Se ingresa el password del email que se usa para enviar avisos.
**Api url:** Se indica la url donde estará hosteado el app del backend. Como se construye esta url. ``` <nombre del app backend>.<nombre del proyecto>.<dominio del servidor>```
**Super admin username:** En el sistema, se inicializa un usuario (super usuario) la primera vez para iniciar en el sistema. Y en los siguientes campos se completan campos para inicializarlo. En este caso se ingresa un username para el mismo.
**Super admin name:** Se indica el nombre del super usuario a crear.
**Super admin email:** Se indica el email del super usuario a crear.
**Super admin password:** Se indica el password del super usuario a crear.
**Super admin role:**  Se indica el rol del usuario inicial a crear.
</br>

####Variables para indicar en Producción
</br>
Son las mismas variables que en Staging, solo que ajustadas al nuevo proyecto en el que están hosteadas.

####Variables para indicar en CI-CD
</br>

**Name:** Es el nombre del aplicativo
**Stage Staging:** Esta variable se utiliza dentro del Jenkinsfile sirve para indicar que se trata del pipeline de staging
**Stage Production:** Esta variable se utiliza dentro del Jenkinsfile sirve para indicar que se trata del pipeline de producción
**Nombre del Proyecto:** Se indica el nombre del proyecto en staging
**Nombre del Proyecto Production:** Se indica el nombre del proyecto en producción
**Memorylimit:** Se indica la cantidad de memoria que va a utilizar el contenedor
**Git Repository URL:** Se indica la URL donde se encuentra hosteado el archivo Jenkinsfile
**Git Reference:** Indica si el código que se precisa descargar se encuentra en algún branch determinado.
**Context Directory Jenkins:** Se indica dentro de que carpetas se encuentra el archivo Jenkinsfile, indicando el path relativo en esta variable.
**GitHub Webhook Secret:** En caso de querer configurar los webhook de gitlab o github completar alguna de estas variables.
**Generic Webhook Secret:**

### CI/CD como funciona

####Piplelines definidos

Los Piplelines en CI/CD se encuentran definidos en el template ci-cd.json y dentro del  archivo Jenkinsfile, se indican los stages por lo que pasa cada uno.

        control-versiones
                └──openshift
                        └── templates
                        ├      └──ci-cd.json
                        └──Jenkinsfile
                                

Se definen dos pipelines independientes.  El orden normal de funcionamiento sería ejecutar el pipeline de staging, si todo sale ok y las pruebas funcionales resultan ok, luego es posible ejecutar el pipeline de producción que permite subir los cambios hechos en staging a producción (obteniendo la imagen taggeada en staging).

A continuación se describen las etapas que se realizan en cada pipeline

1. buildingblocksstaging
   1. Initialize: Hace chequeos de ruta, que estén definido.
   2. Build & Deploy Backend (y Frontend Tambien): Se hace inicial el build del backend y frontend respetivamente (que una vez finalizado, hará el deploy automático)                 

2. buildingblocksproduction
   1. Initialize : En esta etapa se hace un tag en staging, sobre la imagen creada en staging.
   2. Pull Backend Build Image & Deploy (y Frontend tambien): En ambas etapas, lo que se hace es importar la imagen de staging para usarla en production, utilizando tags.
   3. Deploy Backend ( y Frontend tambien): En esta etapa, se hace el deploy de la imágen en producción.
   
   