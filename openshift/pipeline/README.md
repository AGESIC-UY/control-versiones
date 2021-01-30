En este directorio se encuentra el archivo Jenkinsfile que van a ser utilizado por el template ci-cd.json dentro de templates/

En dicho archivo se manejan los Piplelines definidos en ci-cd.

En el caso que se ejecute el pipleline de desarrollo


To do this, run:

```bash
# create the nodejs example as usual
oc new-app https://github.com/sclorg/nodejs-ex

# now create the pipeline build controller from the openshift/pipeline
# subdirectory
oc new-app https://github.com/sclorg/nodejs-ex \
  --context-dir=openshift/pipeline --name nodejs-ex-pipeline
```
