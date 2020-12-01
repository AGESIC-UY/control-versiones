import React, { Component } from 'react'
import styles from './home.module.scss'
import RegistrationFinish  from '../RegistrationFinish/RegistrationFinish'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

class Home extends Component {
  render() {
    const { user, authenticated } = this.props
    return (
      <div className={ styles.home }>
        {
          user && !user.active ?
          <RegistrationFinish></RegistrationFinish> :
          null
        }
        <div className="Hero Hero--center">
          <div className="Hero-cover">
            <div className="Crop">
            </div>
          </div>

          <div className="Hero-body">
            <div className="Container">
              <div className="Hero-title">
                Control de versiones
              </div>
              {
                !authenticated ?
                    <>
                        <div className="Hero-description">
                        </div>
                        <a href="/login" className="Button Button--secondary Hero-button">
                          Acceder
                        </a>
                    </>
                    :
                    null
              }
            </div>
          </div>
        </div>
        <main className="u-main" id="contenido">
          <div className="Container">

            {
              authenticated ?

                  <>
                    <div className="Container">
                      <div className="Grid">
                      </div>
                    </div>
                  </>
                  :
                  null
            }

          </div>
        </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    url: state.url,
    authenticated: state.authenticated,
    notification: state.notification,
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps)(Home))
