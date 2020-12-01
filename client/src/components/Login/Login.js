import React, {Component} from 'react'
import styles from './login.module.scss'
import {connect} from 'react-redux'
import {setAuth, setUser} from '../../actions/connectionActions'
import {withRouter} from 'react-router'
import {
    Paper,
    FormControlLabel,
    Checkbox,
    Button,
    Grid,
    CircularProgress
} from '@material-ui/core'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: null,
            password: null,
            loading: false
        }
    }

    login = async () => {
        const {email, password} = this.state
        const userdata = {
            email: email,
            password: password
        }
        this.setState({
            loading: true
        })
        const response = await axios.post(`${this.props.url}/api/auth/login/local`, userdata)
        if (response && response.data.success) {
            this.props.setAuth(true)
            this.props.setUser(response.data.user)
            this.props.history.push('/')
        } else {
            this.props.notification({
                type: 'danger',
                title: 'Login fallido!',
                message: 'Revise su email y contraseña y luego vuelva a intentar.'
            })
        }
        this.setState({
            loading: false
        })
    }

    handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        this.setState({
            [name]: value
        })
    }

    render = () => {
        const {loading} = this.state
        return (
            <div className={styles.login}>
                <Grid container
                      spacing={10}
                      direction="column"
                      alignItems="center"
                      justify="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper>
                            <ValidatorForm
                                ref="form"
                                onSubmit={this.login}
                                className={styles.content}
                            >
                                <TextValidator
                                    label="Email"
                                    onChange={this.handleChange}
                                    name="email"
                                    value={this.state.email || ''}
                                    validators={['required', 'isEmail', 'minStringLength:5', 'maxStringLength:100']}
                                    errorMessages={[
                                        'Este campo es requerido',
                                        'El email no es valido',
                                        'el minimo es de 5 caracteres',
                                        'el max es de 100 caracteres'
                                    ]}
                                    margin="normal"
                                    fullWidth
                                    autoComplete="new-password"
                                />
                                <TextValidator
                                    label="Contraseña"
                                    onChange={this.handleChange}
                                    name="password"
                                    type="password"
                                    value={this.state.password || ''}
                                    validators={[
                                        'required',
                                        'minStringLength:5',
                                        'maxStringLength:100'
                                    ]}
                                    errorMessages={[
                                        'Este campo es requerido',
                                        'el minimo es de 5 caracteres',
                                        'el max es de 100 caracteres'
                                    ]}
                                    margin="normal"
                                    fullWidth
                                    autoComplete="new-password"
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="secondary"/>}
                                    label="Recordarme"
                                />
                                {
                                    loading ?
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            disabled
                                        >
                                            <CircularProgress color="primary" size={24}/>
                                        </Button> :
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            Acceder
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
        authenticated: state.authenticated,
        notification: state.notification
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuth: (authenticated) => {
            dispatch(setAuth(authenticated))
        },
        setUser: (user) => {
            dispatch(setUser(user))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
