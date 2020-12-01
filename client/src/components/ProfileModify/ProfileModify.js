import React, {Component} from 'react'
import styles from './profileModify.module.scss'
import {connect} from 'react-redux'
import {setUser} from '../../actions/connectionActions'
import {
    Paper,
    Typography,
    Button,
    Grid,
    MenuItem,
    CircularProgress
} from '@material-ui/core'
import {ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator'
import axios from 'axios'

class Profile extends Component {
    constructor(props) {
        super(props)

        let {
            id,
            username,
            name,
            email,
            age,
            location
        } = this.props.user
        if (!age) age = ''
        if (!location) location = ''
        this.state = {
            id,
            username,
            name,
            email,
            age,
            location,
            loading: false
        }
    }

    saveProfile = async () => {
        const {id, username, name, email, age, location} = this.state
        const userdata = {
            id,
            username,
            name,
            email,
            age,
            location
        }
        this.setState({
            loading: true
        })
        const response = await axios.post(`${this.props.url}/api/user/profileupdate`, userdata)
        this.setState({
            loading: false
        })
        if (response.data.success) {
            this.props.setUser(response.data.user)
            this.props.notification({
                type: 'success',
                title: 'Success!',
                message: 'Se cambiaron los datos del perfil!'
            })
            this.props.history.push('/profile')
        } else {
            this.props.notification({
                type: 'danger',
                title: 'No se guardaron los cambios!',
                message: 'Intentalo otra ves!'
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

    render() {
        const {loading} = this.state
        return (
            <div className={styles.profileModify}>
                <Grid container
                      spacing={10}
                      direction="column"
                      alignItems="center"
                      justify="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper>
                            <Typography className={styles.title} component="h1" variant="h5">
                                Modificar Perfil
                            </Typography>
                            <ValidatorForm
                                ref="form"
                                onSubmit={this.saveProfile}
                                // onError={ errors => console.log(errors) }
                                className={styles.content}
                            >
                                <TextValidator
                                    label="Usuario"
                                    onChange={this.handleChange}
                                    name="username"
                                    value={this.state.username || ''}
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
                                />
                                <TextValidator
                                    label="Nombre"
                                    onChange={this.handleChange}
                                    name="name"
                                    value={this.state.name || ''}
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
                                />
                                <SelectValidator
                                    label="Edad"
                                    onChange={this.handleChange}
                                    name="age"
                                    value={this.state.age || ''}
                                    validators={[
                                        'required',
                                        'minStringLength:3',
                                        'maxStringLength:5'
                                    ]}
                                    errorMessages={[
                                        'Este campo es requerido',
                                        'el minimo es de 3 caracteres',
                                        'el max es de 5 caracteres'
                                    ]}
                                    margin="normal"
                                    fullWidth
                                >
                                    <MenuItem key="1" value="21-30">
                                        21-30
                                    </MenuItem>
                                    <MenuItem key="2" value="31-40">
                                        31-40
                                    </MenuItem>
                                    <MenuItem key="3" value="41-50">
                                        41-50
                                    </MenuItem>
                                    <MenuItem key="4" value="51-60">
                                        51-60
                                    </MenuItem>
                                    <MenuItem key="5" value="60+">
                                        60+
                                    </MenuItem>
                                </SelectValidator>
                                <TextValidator
                                    label="Localizacion"
                                    onChange={this.handleChange}
                                    name="location"
                                    value={this.state.location || ''}
                                    validators={[
                                        'required',
                                        'minStringLength:3',
                                        'maxStringLength:100'
                                    ]}
                                    errorMessages={[
                                        'Este campo es requerido',
                                        'el minimo es de 3 caracteres',
                                        'el max es de 100 caracteres'
                                    ]}
                                    margin="normal"
                                    fullWidth
                                />
                                {
                                    loading ?
                                        <Button
                                            className={this.button}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled
                                        >
                                            <CircularProgress color="primary" size={24}/>
                                        </Button> :
                                        <Button
                                            type="submit"
                                            className={this.button}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            Guardar
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
        user: state.user,
        notification: state.notification
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => {
            dispatch(setUser(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
