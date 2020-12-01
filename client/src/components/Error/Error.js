import React, { Component } from 'react'
import styles from './error.module.scss'
import {Grid} from "@material-ui/core";

class Error extends Component {
  render() {
    return (
      <div className={ styles.error }>
          <Grid container
                spacing={10}
                direction="column"
                alignItems="center"
                justify="center">
              <Grid item xs={12} sm={6} md={4}>
                  <h1>404 - Not found!</h1>
                  <div
                      onClick={() => { window.location.href = "/" }}
                      className={ styles.link }
                  >
                      Home page
                  </div>
              </Grid>
          </Grid>
      </div>
    )
  }
}

export default Error