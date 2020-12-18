
# Documentacion
Requerimientos: 
- node 
- Android Studio instalado
- Java jdk instalado si aun no lo tiene y usa mac brew cask install adoptopenjdk/openjdk/adoptopenjdk8 es necesario tener Java jdk 8 y guardar lo siguiente en su perfil del shell JAVA_HOME="/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home" 
- React native: si aun no lo tiene ejecute: sudo npm install -g react-native-cli 
- Xcode para la app ios


### Nota importante
- Despues de haber instalado Java JDK asegurarse de agregar lo siguiente al shell eg: bash, zshrc, etc.
```
export ANDROID_HOME=/Users/{TuUsuario}/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
```
- Editar archivo `/android/local.properties` y colocar el path del ANDROID_SDK_ROOT. El que figura sirve de ejemplo.
- Configurar el ambiente de desarrollo de Android con React Native, para ello:
1. Abre Android studio
2. Selecciona el engrane de configuracion
3. Dirigete a Android SDK dentro del menu Appearance & Behavior --> System Settings
4. En ``` SDK Platforms ``` da click en el checkbox de ```Show Package Details ``` selecciona las opciones de : ```Android SDK Platforms 29```, ```Sources for Android 29``` y ```Intel x86 Atom_64 System Image```
5. En la parte inferior derecha da click en el checkbox de ```Show Package Details``` y asegurate que la version ``` 29.0.2 ``` este seleccionada dentro de ``` Android SDK Tools ```
6. Finalmente Selecciona ```apply``` y acepta los acuerdos de licencia.
7. Ejecutar npm i en la carpeta raiz

```
Si se ejecuta con emulador:

Debe modificar el la variable serviceURL dentro del archivo index.js con su ip local:

- src/services/index.js

eg: 
const serviceURL = 'http://192.168.1.44:3001/api/';

```



#### Siguientes pasos

  - ejecuta ```react-native run-android```



# Integracion con Building blocks

Endpoint
```
'BASE_URL/api/application/mobile/app'
```
#### Flujo de la applicacion
Al ejecutarse el componente principal : App.js se ejecuta el siguiente flujo:

```App.js``` --> ```VersionDisplay``` ---> ```getAPIVersion(Index.js)``` ---> ```VersionDisplay```

#### Definicion

Consulta sobre los datos de una version de la aplicacion

#### Que enviar - parametros que recibe
Para que el backend entienda la peticion, es necesario enviar los siguientes datos en formato JSON: 

- Name: corresponde al nombre de la app
- Version: corresponde a la version actual de la app
- clientKey: corresponde a el hash generado para la aplicacion

###### Nota importante
El client key es necesario ya que actua como forma de autenticacion para cada aplicacion, es decir, se busca la aplicacion por nombre y esta puede ser encontrada, mas sin embargo si el clientKey adjuntado no corresponde a la aplicacion registrada en la base de datos, esta devolvera el mensaje correspondiente y no permitira la obtencion de los datos de la aplicacion ya que esto no vendran en la respuesta.

para obtener la version o build number correspondiente de la applicacion se utiliza:

``` 

DeviceInfo.getVersion():
DeviceInfo.getBuildNumber()

```


Un ejemplo:
```
{
    "name": "Building Blocks",
    "version": "1.0.0"
    "clientKey": "MTFkYzUwMTQ5NTU1NWZlYjQ5MGY0YjgzMTAyZmEyMTY="
}
```

#### Que recibe
Existen dos variantes principales en la respuesta del servidor:
1. Una respuesta exitosa con los datos correspondientes
2. Una respuesta con error

Un ejemplo del primer caso con un variante donde se avisa que debe actualizar:

```
{
code: 200
description: "Tu version esta desactualizada"
message: "Actualizar"
"app": {
  _id: "5fdbbc3593f377002185ddb7", identifier: "05f8e5e78b37170e7d409b4dbfb9df4e", 
  clientKey: "MDVmOGU1ZTc4YjM3MTcwZTdkNDA5YjRkYmZiOWRmNGU="
  createdAt: "2020-12-17T20:14:45.070Z"
  description: "Test app"
  identifier: "05f8e5e78b37170e7d409b4dbfb9df4e"
  name: "Building blocks"
  type: {
      _id: "5fd39730562eec002b4dd221", name: "Mobile", createdAt: "2020-12-11T15:58:40.116Z", 
      updatedAt: "2020-12-11T15:58:40.116Z", __v: 0
  }
  updatedAt: "2020-12-17T20:14:45.070Z"
  versions: {
      createdAt: "2020-12-11T17:06:57.393Z"
      minVersion: "1.3.3"
      owner: "5fdbbc3593f377002185ddb7"
      servicesUrls: (6) ["google.com", "aaa.net", "eeee.com", "eeeeeeekkk.com", "lojkji.net", "aasdewddw.com"]
      updatedAt: "2020-12-11T17:06:57.393Z"
      version: "1.2.3"
      _id: "5fd3a731c14849001f9cdc18"
 }
}
```

Un  ejemplo del segundo caso:

```
{
    "code": 404,
    "message": "Ocurrio un error",
    "description": "Aplicacion no encontrada"
}
```

En caso de proporcionar un clientKey equivocado:
```
  code: 404
  description: "Client key invalido"
  message: "Ocurrio un error"
```

##### Para la proxima version
El client key se podria actualizar desde la aplicacion web con un input  el cual el valor lo determina el usuario con el fin de solventar la situacion en la que esta key se filtre. El string proporcionado se reducira con el siguiente proceso el cual ya se encuentra implementado en este momento:

String --> md5 --> base64


#### Recomendacion
Hay un caso en el que la version proporcionada se encuentra desactualizada respecto a la registrada en la base de datos, por lo tanto, se le avisa al usuario que debe actualizar.

Si esto ocurre la app alertara con un mensaje:
```Tu version esta desactualizada -  Actualizar```

Donde actualizar es un boton que redirige a la store para actualizar.


### Tolerancia a fallos
Para solventar los casos en los que las llamadas a la api no sean exitosas por problemas de network o cualquiera que imposibilite esa llamada, se implemento un local storage que permite persistir llamadas anteriores exitosas, el flujo es el siguiente:

El mejor escenario

Api call --> respuesta exitosa(devuelve app y versiones) --> se persisten estos datos --> se muestran los datos

El pero escenario
api call --> respuesta fallida(network error) ---> consulta el storage y trae los datos persistidos de anteriores llamadas exitosas --> se muestran los datos


#### Crear builds

##### Android

Crear keystore
```
  keytool -genkeypair -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```


Configurar las variables de Gradle
```
  MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
  MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
  MYAPP_UPLOAD_STORE_PASSWORD=*****
  MYAPP_UPLOAD_KEY_PASSWORD=*****

```

Agregar la configuracion de la firma al archivo de Gradle config
```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```


Ejecutar el siguiente comando para generar el APK
```
$ cd android
$ ./gradlew bundleRelease
```

##### IOS

Ejecuta el siguiente comando desde la terminal
```
xed ./ios
```
Despues
```
  react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
```

En xcode cambia la build configuration a ``` release```