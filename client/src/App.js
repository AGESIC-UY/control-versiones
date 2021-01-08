import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import styles from './app.module.scss'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Logout from './components/Logout/Logout'
import Registration from './components/Registration/Registration'
import PermissionToUserApp from "./components/PermisionToUserApp/PermissionToUserApp";
import ActivationHash from './components/ActivationHash/ActivationHash'
import Recovery from './components/Recovery/Recovery'
import RecoveryHash from './components/RecoveryHash/RecoveryHash'
import Error from './components/Error/Error'
import Navigation from './components/Common/Navigation/Navigation'
import Profile from './components/Profile/Profile'
import Header from "./components/Common/Header/Header";
import Footer from "./components/Common/Footer/Footer";
import { connect } from 'react-redux'
import { setUrl, setAuth, setUser, setNotifications } from './actions/connectionActions'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "animate.css"
import ProfileModify from './components/ProfileModify/ProfileModify'
import Application from './components/Application/Application'
import Version from './components/Version/Version'
import Type from "./components/Type/Type";
import axios from 'axios'
import { CssBaseline } from '@material-ui/core'

toast.configure({
  autoClose: 5000,
  draggable: false
})

const PrivateRoute = ({ component: Component, authenticated, user, roles, ...rest }) => (
  <Route { ...rest }
    render={(props) => (
      authenticated && roles.includes(user.role)
          ? <Component { ...props } />
          : <Redirect to='/login' />
    )}
  />
)

class App extends Component {
  constructor(props) {
    super(props)
    this.url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`
    console.log("backendUrl", this.url)
    this.props.setNotifications(this.notification)
    this.props.setUrl(this.url)
    axios.defaults.withCredentials = true
  }

  async componentDidMount() {
    axios.interceptors.response.use(undefined, (error) => {
      if(error.response && error.response.status === 401) {
        this.props.setAuth(false)
        this.notification({
          type: 'danger',
          title: 'Failed!',
          message: 'Usuario no loggeado!'
        })
        return Promise.reject(error)
      }
    })
    const authenticated = await axios.post(`${this.url}/api/auth/check`)
    if(authenticated) {
      this.props.setAuth(authenticated.data.success)
      this.props.setUser(authenticated.data.user)
    }
  }

  notification(options) {
    let { type, title, message } = options
    if (type === 'danger') {
      type = 'warning'
    }
    toast[type](<div><b>{title}</b><br/>{message}</div>)
  }

  render() {
    const allPermission = ['default','admin','superAdmin']
    const onlySuperAdmin = ['superAdmin']
    return (
        <BrowserRouter>
          <MuiThemeProvider theme={ createMuiTheme({palette: { type: this.props.theme }}) }>
          <CssBaseline />
          <div className={ styles.app }>
            <Header />
            <Navigation />
            <Switch>
              <Route path="/" component={ Home } exact />
              <Route path="/login" component={ Login } exact />
              <Route path="/logout" component={ Logout } exact />
              <Route path="/activation/:hash" component={ ActivationHash } exact />
              <Route path="/recovery" component={ Recovery } exact />
              <Route path="/recovery/:hash" component={ RecoveryHash }/>
              <PrivateRoute path="/registration" component={ Registration } authenticated={ this.props.authenticated } user={ this.props.user } roles={onlySuperAdmin} exact />
              <PrivateRoute path="/permissions" component={ PermissionToUserApp } authenticated={ this.props.authenticated } user={ this.props.user } roles={onlySuperAdmin} exact />
              <PrivateRoute path='/profile' component={ Profile } authenticated={ this.props.authenticated } user={ this.props.user } roles={allPermission} exact/>
              <PrivateRoute path='/profile/modify' component={ ProfileModify } authenticated={ this.props.authenticated } user={ this.props.user } roles={allPermission} exact/>
              <PrivateRoute path='/application' component={ Application } authenticated={ this.props.authenticated } user={ this.props.user } roles={allPermission} exact/>
              <PrivateRoute path='/version' component={ Version } authenticated={ this.props.authenticated } user={ this.props.user } roles={allPermission} exact/>
              <PrivateRoute path='/type' component={ Type } authenticated={ this.props.authenticated } user={ this.props.user } roles={allPermission} exact/>
              <Route component={ Error } />
            </Switch>
            <Footer />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.authenticated,
    theme: state.theme,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUrl: url => { dispatch(setUrl(url)) },
    setAuth: authenticated => { dispatch(setAuth(authenticated)) },
    setUser: (user) => { dispatch(setUser(user)) },
    setNotifications: notifications => { dispatch(setNotifications(notifications)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
