import React, {Component} from 'react'
import styles from './navigation.module.scss'
import {connect} from 'react-redux'
import {setTheme} from '../../../actions/connectionActions'
import {Link} from 'react-router-dom'

class Navigation extends Component {
    switchTheme = () => {
        this.props.theme === 'light' ? this.props.setTheme('dark') : this.props.setTheme('light')
    }

    render() {
        const linkColor = this.props.theme === 'light' ? styles.black : styles.white
        const linkStyle = [styles.link, linkColor].join(' ')

        return (
            <div className={styles.nav}>
                <nav className="Nav is-open" id="menu">
                    <div className="Container">
                        <ul className="Nav-list">
                            {
                                this.props.authenticated ?
                                    <>
                                        <li className="Nav-item">
                                            <Link className={linkStyle} to="/application">Aplicacion</Link>
                                        </li>
                                        <li className="Nav-item">
                                            <Link className={linkStyle} to="/version">Version</Link>
                                        </li>
                                        <li className="Nav-item">
                                            <Link className={linkStyle} to="/profile">Perfil</Link>
                                        </li>
                                        <li className="Nav-item">
                                            <a href="#sec" aria-haspopup="true" aria-expanded="false" id="item-2">Otros</a>
                                            <div className="Nav-subnav" aria-hidden="true" aria-labelledby="item-2"
                                                 aria-expanded="false">
                                                <ul>
                                                    {
                                                        this.props.user && this.props.user.role ==='superAdmin' && (
                                                            <>
                                                                <li className="Nav-item">
                                                                    <Link className={linkStyle} to="/registration">Registrar Usuario</Link>
                                                                </li>
                                                                <li className="Nav-item">
                                                                    <Link className={linkStyle} to="/permissions">Permisos app-usuario</Link>
                                                                </li>
                                                            </>
                                                        )

                                                    }

                                                    <li className="Nav-item">
                                                        <Link className={linkStyle} to="/type">Tipo</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="Nav-item">
                                            <Link className={linkStyle} to="/logout">Logout</Link>
                                        </li>
                                    </>
                                    :
                                    <>
                                        <li className="Nav-item">
                                            <Link className={linkStyle} to="/login">Acceder</Link>
                                        </li>
                                        <li className="Nav-item">
                                            <Link className={linkStyle} to="/recovery">Recuperar Contraseña</Link>
                                        </li>
                                    </>
                            }
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.authenticated,
        theme: state.theme,
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setTheme: theme => {
            dispatch(setTheme(theme))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
