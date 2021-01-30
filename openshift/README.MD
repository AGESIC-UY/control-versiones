

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
  * Estrategia utilizada


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


####Variables para indicar en Staging



####Variables para indicar en Producción



####Variables para indicar en CI-CD

### CI/CD como funciona

####Piplelines definidos

        control-versiones
                ├── openshift
                └── pipeline
                        └──Jenkinsfile

####Estrategia utilizada


