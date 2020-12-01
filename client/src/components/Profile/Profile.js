import React, {Component} from 'react'
import styles from './profile.module.scss'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Card,
    CardContent,
    Typography, Grid
} from '@material-ui/core'
import axios from 'axios'

class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false
        }
    }

    removeUser = async () => {
        const {id, email} = this.props.user
        const userdata = {
            data: {
                id,
                email
            }
        }
        this.setState({
            loading: true
        })
        const response = await axios.delete(`${this.props.url}/api/user/profileremove`, userdata)
        this.setState({
            loading: false
        })
        if (response.data.success) {
            this.props.notification({
                type: 'success',
                title: 'Exito!',
                message: 'Perfil borrado!'
            })
            this.props.history.push('/logout')
        } else {
            this.props.notification({
                type: 'danger',
                title: 'Borrado fallido!',
                message: 'Vuelva a intentar!'
            })
        }
    }

    removeDialogClick = () => {
        this.setState({
            open: this.state.open ? false : true
        })
    }

    render() {
        return (
            <div className={styles.profile}>
                <Grid container
                      spacing={10}
                      direction="column"
                      alignItems="center"
                      justify="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography color="textSecondary">
                                    Usuario
                                </Typography>
                                <Typography component="p" gutterBottom>
                                    {this.props.user.username}
                                </Typography>
                                <Typography color="textSecondary">
                                    Nombre
                                </Typography>
                                <Typography component="p" gutterBottom>
                                    {this.props.user.name}
                                </Typography>
                                <Typography color="textSecondary">
                                    Email
                                </Typography>
                                <Typography component="p" gutterBottom>
                                    {this.props.user.email}
                                </Typography>
                                <Typography color="textSecondary">
                                    Edad
                                </Typography>
                                <Typography component="p" gutterBottom>
                                    {this.props.user.age}
                                </Typography>
                                <Typography color="textSecondary">
                                    Localizacion
                                </Typography>
                                <Typography component="p" gutterBottom>
                                    {this.props.user.location}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Button
                            onClick={this.removeDialogClick}
                            className={styles.button}
                            variant="contained"
                            color="secondary"
                        >
                            Borrar
                        </Button>
                        <Button
                            className={styles.button}
                            variant="contained"
                        >
                            <Link className={styles.link} to="/profile/modify">Modificar</Link>
                        </Button>
                        <Dialog
                            open={this.state.open}
                            onClose={this.removeDialogClick}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Borrar el perfil?"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Estas seguro?<br/>Esta accion es irreversible y podes perder tus datos!
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.removeDialogClick} color="primary">
                                    No
                                </Button>
                                <Button onClick={this.removeUser} color="secondary" autoFocus>
                                    Borrar
                                </Button>
                            </DialogActions>
                        </Dialog>
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

export default connect(mapStateToProps)(Profile)
