import React, { Component } from 'react'
import styles from './registration.module.scss'
import { connect } from 'react-redux'
import {
  Paper,
  Button,
  Grid,
  CircularProgress
} from '@material-ui/core'
import { ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: null,
      email: null,
      password: null,
      passwordAgain: null,
      role: null,
      loading: false
    }
  }

  register = async () => {
    const { username, name, email, password, role } = this.state
    const userdata = {
      username,
      name,
      email,
      password,
      role
    }
    this.setState({
      loading: true
    })
    const response = await axios.put(`${this.props.url}/api/auth/registration`, userdata, { withCredentials: true })
    this.setState({
      loading: false
    })
    if (response && response.data.success) {
      this.props.notification({
        type: 'success',
        title: 'Usuario Registrado!',
        message: 'Revise su email!'
      })
    } else {
      this.props.notification({
        type: 'danger',
        title: 'Registro Fallido!',
        message: 'Error al registar, vuelva a intentar!'
      })
    }
  }

  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value
    })
  }

  componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
        return false
      }
      return true
    })
  }

  getRoles = () => {
    return [
        { key: "superAdmin", name: "superAdmin" },
        { key: "admin", name: "admin" }
    ].map(role => (
        <option key={role.key} value={role.key}>
          {role.name}
        </option>
    ))
  }

  render = () => {
    const { loading } = this.state
    return (
      <div className={ styles.registration }>
        <Grid container
              spacing={10}
              direction="column"
              alignItems="center"
              justify="center">
        <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
          <Paper>
            <ValidatorForm
              ref="form"
              onSubmit={ this.register }
              className={ styles.content }
            >
              <TextValidator
                label="Usuario"
                onChange={ this.handleChange }
                name="username"
                value={ this.state.username || '' }
                validators={[
                  'required',
                  'minStringLength:5',
                  'maxStringLength:100'
                ]}
                errorMessages={[
                  'Este campo es requerido',
                  'El minimo es de 5 caracteres',
                  'El max es de 100 caracteres'
                ]}
                margin="normal"
                fullWidth
                autoComplete="new-password"
              />
              <TextValidator
                label="Nombre"
                onChange={ this.handleChange }
                name="name"
                value={ this.state.name || '' }
                validators={[
                  'required',
                  'minStringLength:5',
                  'maxStringLength:100'
                ]}
                errorMessages={[
                  'Este campo es requerido',
                  'El minimo es de 5 caracteres',
                  'El max es de 100 caracteres'
                ]}
                margin="normal"
                fullWidth
                autoComplete="new-password"
              />
              <TextValidator
                label="Email"
                onChange={ this.handleChange }
                name="email"
                value={ this.state.email || '' }
                validators={[
                  'required',
                  'isEmail',
                  'minStringLength:5',
                  'maxStringLength:100'
                ]}
                errorMessages={[
                  'Este campo es requerido',
                  'El email no es valido',
                  'El minimo es de 5 caracteres',
                  'El max es de 100 caracteres'
                ]}
                margin="normal"
                fullWidth
                autoComplete="new-password"
              />
              <TextValidator
                label="Contraseña"
                onChange={ this.handleChange }
                name="password"
                type="password"
                value={ this.state.password || '' }
                validators={[
                  'required',
                  'minStringLength:5',
                  'maxStringLength:100'
                ]}
                errorMessages={[
                  'Este campo es requerido',
                  'El minimo es de 5 caracteres',
                  'El max es de 100 caracteres'
                ]}
                margin="normal"
                fullWidth
                autoComplete="new-password"
              />
              <TextValidator
                label="Repita Contraseña"
                onChange={ this.handleChange }
                name="passwordAgain"
                type="password"
                value={ this.state.passwordAgain || '' }
                validators={[
                  'required',
                  'isPasswordMatch',
                  'minStringLength:5',
                  'maxStringLength:100'
                ]}
                errorMessages={[
                  'Este campo es requerido',
                  'Las contraseñas no concuerdan',
                  'El minimo es de 5 caracteres',
                  'El max es de 100 caracteres'
                ]}
                margin="normal"
                fullWidth
                autoComplete="new-password"
              />
              <SelectValidator
                  label="Rol"
                  onChange={ this.handleChange }
                  name="role"
                  value={ this.state.role || '' }
                  validators={[
                    'required'
                  ]}
                  errorMessages={[
                    'this field is required'
                  ]}
                  margin="normal"
                  fullWidth
                  autoComplete="role"
              >
                {this.getRoles()}
              </SelectValidator>


              {
                loading ?
                <Button
                  className={ this.button }
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled
                >
                  <CircularProgress color="primary" size={ 24 } />
                </Button> :
                <Button
                  type="submit"
                  className={ this.button }
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Registrar
                </Button>
              }
            </ValidatorForm>
          </Paper>
        </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    url: state.url,
    notification: state.notification
  }
}

export default connect(mapStateToProps)(App)
