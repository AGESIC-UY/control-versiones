import React, { Component } from 'react'
import styles from './activationHash.module.scss'
import { connect } from 'react-redux'
import {CircularProgress, Grid} from '@material-ui/core'
import axios from 'axios'

class Activation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hash: this.props.match.params.hash,
      loading: true
    }
  }

  activate = async () => {
    const { hash } = this.state
    const userdata = {
      hash
    }
    this.setState({
      loading: true
    })
    const response = await axios.post(`${this.props.url}/api/auth/activation`, userdata)
    this.setState({
      loading: false
    })
    if (response && response.data.success) {
      this.props.notification({
        type: 'success',
        title: 'Cuenta Activada!',
        message: 'Ya puedes ingresar!'
      })
      this.props.history.push('/login')
    } else {
      this.props.notification({
        type: 'danger',
        title: 'Activacion fallida!',
        message: 'Vuelve a intentar!'
      })
      this.props.history.push('/')
    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.activate()
    }, 1)
  }

  render = () => {
    const { loading } = this.state

    return (
      <div className={ styles.activationHash }>
      {
        loading ?
        <div>
          <Grid container
                spacing={10}
                direction="column"
                alignItems="center"
                justify="center">
            <Grid item xs={12} sm={6} md={4}>
              <h2>Activando cuenta...</h2>
              <CircularProgress className={ styles.loader } />
            </Grid>
          </Grid>
        </div> :
        null
      }
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

export default connect(mapStateToProps)(Activation)
