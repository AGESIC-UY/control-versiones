
# Documentacion
Requerimientos: 
- node 
- Android Studio instalado Link de descarga 
- Java jdk instalado si aun no lo tiene y usa mac brew cask install adoptopenjdk/openjdk/adoptopenjdk8 es necesario tener Java jdk 8 y guardar lo siguiente en su perfil del shell JAVA_HOME="/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home" 
- React native: si aun no lo tiene ejecute: sudo npm install -g react-native-cli 
- Xcode para la app ios

### Nota importante
Ejecutar ```npm i```


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
}
```

#### Que recibe
Existen dos variantes principales en la respuesta del servidor:
1. Una respuesta exitosa con los datos correspondientes
2. Una respuesta con error

Un ejemplo del primer caso:
```
{
  "code":200,
  "description":"Version encontrada",
  "app":{"_id":"5fca9a4ee33e390020edd415","identifier":"7ff1226196359c7c1be8d83e20d21735","description":"kldkeldklekdlekdlke","type":{"_id":"5fce7584cfb3820020f1370b","name":"Desktop","createdAt":"2020-12-07T18:33:40.523Z","updatedAt":"2020-12-07T18:33:40.523Z","__v":0},"name":"Building blocks","createdAt":"2020-12-04T20:21:34.849Z","updatedAt":"2020-12-04T20:21:34.849Z","__v":0,
  "version":{"servicesUrls":["www.google.com"],"_id":"5fca9d2e370dff00eced8d55","owner":"5fca9a4ee33e390020edd415","version":"2.2.2","minVersion":"2.2.2","createdAt":"2020-12-04T20:33:50.728Z","updatedAt":"2020-12-04T20:33:50.728Z","__v":0}}
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


#### Recomendacion
Hay un caso en el que la version proporcionada se encuentra desactualizada respecto a la registrada en la base de datos, por lo tanto, se le avisa al usuario que debe actualizar.

Si esto ocurre la app alertara con un mensaje:
```Tu version esta desactualizada -  Actualizar```

Donde actualizar es un boton que redirige a la store para actualizar.


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

Ejecutar los siguientes comandos
```
 pod install
```

y

```
 react-native link
```

Despues
```
  react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
```

En xcode cambia la build configuration a ``` release```