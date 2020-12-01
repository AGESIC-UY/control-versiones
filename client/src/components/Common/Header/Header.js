import React, {Component} from 'react'
import styles from './header.module.scss'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

class Header extends Component {
    render() {
        return (
            <div className={styles.header}>
                <header className="Header">
                    <div className="Container">
                        <div className="Header-top">
                            <div className="Grid">
                                <div className="Grid-item u-size1of2">
                                    <a href="https://www.agesic.gub.uy/" className="Header-top-parent">
                                        <div className="Flag">
                                            <span className="Flag-image">
                                                <img className="Header-parentIcon"
                                                     src="https://peu.agesic.gub.uy/portaltipo18beta/img/parent.svg"
                                                     data-fallback="https://peu.agesic.gub.uy/portaltipo18beta/img/parent.png"
                                                     alt=""/>
                                              </span>
                                            <span className="Flag-body">AGESIC</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="Header-body">
                            <div className="Bar">
                                <div className="Bar-cell u-md-size2of10">
                                    <h1 className="Header-logo">
                                        <a href="/">
                                          <span className="Flag">
                                              <span className="Flag-image">
                                                <img src="https://peu.agesic.gub.uy/portaltipo18beta/img/parent.svg"
                                                     data-fallback="https://peu.agesic.gub.uy/portaltipo18beta/img/parent.png" alt=""
                                                     width="40"/>
                                              </span>
                                              <span className="Flag-body">
                                                Control de Versiones
                                              </span>
                                            </span>
                                        </a>
                                    </h1>
                                </div>

                                <div className="Bar-cell u-md-size7of10">
                                    <div className="Header-tagline">
                                        <em></em>
                                    </div>
                                </div>

                                <div className="Bar-cell">
                                    <button className="Header-menuButton js-toggleMainNav">
                                        <span className="Header-menuIcon"><span></span></span>
                                        <span className="Header-menuButton-text">Menú</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}
export default withRouter(connect(mapStateToProps)(Header))