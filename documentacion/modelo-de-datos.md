# Modelo de datos

### Usuario

```
  id: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1000
  },
  googleId: {
    type: String,
    minlength: 5,
    maxlength: 1000
  },
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 100
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1000
  },
  salt: {
    type: String,
    minlength: 5,
    maxlength: 20
  },
  active: {
    type: Boolean,
    default: false
  },
  activation: {
    type: String,
    default: ''
  },
  recovery: {
    type: String,
    default: ''
  },
  age: {
    type: String,
    minlength: 3,
    maxlength: 5
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['superAdmin', 'admin']
  },
  location: {
    type: String,
    minlength: 3,
    maxlength: 100
  },
  apps: [{
    type: mongoose.Schema.ObjectId, ref: 'Application'
  }],
  website: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
```

### Tipo

```
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
    required: false
  },
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
```

### Aplicacion

```
  identifier: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  description: {
    type: String,
    required: false,
    minlength: 5
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
    required: false
  },
  versions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Version',
    required: false
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
```

### Version

```
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  version: {
    type: String,
    required: true
  },
  servicesUrls: {
    type: Array,
    required: true
  },
  minVersion: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
```
