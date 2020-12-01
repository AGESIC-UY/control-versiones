import React, {Component} from 'react'
import styles from './footer.module.scss'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

class Footer extends Component {
    render() {
        return (
            <div className={styles.footer}>
                <footer className="Footer">
                    <div className="Footer-info">
                        <div className="Footer-addresses">
                            <div className="Container">
                                <div className="Grid">
                                    <div className="Grid-item u-md-size1of2">
                                        <address className="Footer-addresses-item">
                                            <span className="Footer-addressName">Oficina Central</span>
                                            Dirección: Torre Ejecutiva Sur, Liniers 1324 piso 4. Montevideo, Uruguay<br />
                                            Teléfono: (+598) 2901 2929<br />
                                            Mail: <a href="mailto:contacto@agesic.gub.uy">contacto@agesic.gub.uy</a>
                                        </address>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}
export default withRouter(connect(mapStateToProps)(Footer))