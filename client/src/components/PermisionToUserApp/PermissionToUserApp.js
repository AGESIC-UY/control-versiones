import React, { Component } from 'react';
import {connect} from 'react-redux'
import {setAuth, setUser} from '../../actions/connectionActions'
import {withRouter} from 'react-router'
import styles from './permisionToUserApp.module.scss'
import {
    Grid,
} from '@material-ui/core'
import axios from 'axios'
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import InputLabel from '@material-ui/core/InputLabel';
import {
  DataGrid
} from '@material-ui/data-grid';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from "@material-ui/core/Button";


const api = axios.create({
    baseURL: `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/`,
    withCredentials: true
})

class PermissionToUserApp extends Component {
  constructor(props) {
      super(props)

      this.state = {
          loading: false,
          data: [],
          users: {},
          usersData: [],
          apps: {},
          errorMessages: [],
          selectedApps: [],
          dialogOpen: false,
          dialogData: {},
      }
      api.get("application/all/applications")
          .then(res => {
              let { code, description, message,  applications } = res.data
              this.sendNotification(code, description, message)
              if (applications) {
                  applications.map(app => app.createdAt = new Date(app.createdAt).toLocaleString())
                  this.setState({ data: applications })
              }
          })
          .catch(error=>{
              console.log("Error", error)
          })
      api.get("user/all/users")
      .then(res => {            
          const { code, description, message,  users } = res.data
          this.sendNotification(code, description, message)
          let permission = []
          if (users) {
            let id = 0

            let list = users.map(user => {
              id++
              permission.push(user.apps)
              return Object.assign({}, { 
                id: id, identi: user._id, 
                role: user.role, user: user.email, 
                apps: user.apps.map(app => app.name).join(', '), 
                appsId: user.apps.map(app => app._id)
              })
            })

            this.setState({ usersData: list } )
          }
       })
       .catch(error=>{
           console.log("Error")
       })

      
  }

  sendNotification = (typeCode, description, message) => {
    let type = ''
    if (typeCode === 404) {
      type = 'danger'
    } else if (typeCode === 422) {
      type = 'warning'
    } else {
      type = 'success'
    }
    this.props.notification({
      type: type,
      title: message,
      message: description
    })
  }

  handleRowAdd = () => {
    this.setState({ dialogOpen: false })

      let newData = {
        id: this.state.dialogData.identi,
        apps: this.state.selectedApps
      }
      //validation
      api.post("/userApp/create", newData)
      .then(res => {
        const { code, description, message, userApp } = res.data
        this.sendNotification(code, description, message)

        if (userApp) {
          const elementIndex = this.state.usersData.findIndex(user => user.identi === newData.id )
          let newUserTest = [...this.state.usersData]
          newUserTest[elementIndex].apps = this.state.selectedApps.map(app => app.name).join(', ') 
          newUserTest[elementIndex].appsId = newData.apps.map(apps => apps._id)
          this.setState({ usersData: newUserTest })
        }
      })
      .catch(error => {
        console.log('error', error)
        this.setState({errorMessages: [...this.state.errorMessages, error]})
        this.sendNotification()
      })
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false })
  }

  handleSelectedAppChange = (event) => {
    this.setState({ selectedApps: event.target.value })
  }

  MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };

  columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'identi', headerName: 'Identificador', width: 200 ,  hide: true },
    { field: 'role', headerName: 'Rol', width: 120 },
    { field: 'user', headerName: 'Usuario', width: 200 },
    { field: 'apps', headerName: 'Permisos', width: 500 },
    { field: 'appsId', hide: true},
    {
      field: "",
      headerName: "Editar permisos",
      // sortable: false,
      width: 200,
      disableClickEventBubbling: true,
      renderCell: (CellParams) => {
        const onClick = () => {
          const api = CellParams.api;
          const fields = api
            .getAllColumns()
            .map((c) => c.field)
            .filter((c) => c !== "__check__" && !!c);
          const thisRow = {};

          fields.forEach((f) => {
            thisRow[f] = CellParams.getValue(f);
          });
          // eslint-disable-next-line
          let selectedApps = this.state.data.filter(app => { if(CellParams.data.appsId.includes(app._id)) return app })

          this.setState({ selectedApps: selectedApps, dialogData: thisRow, dialogOpen: true})
        };
        

        if (CellParams.data.role !== 'superAdmin') {
          return <Button onClick={onClick}>Editar</Button>;
        }
      }
    },
  ];

  handleSample = () => {
    return this.state.data.map((app) => (
      <MenuItem key={app._id} value={app}>
        <Checkbox checked={this.state.selectedApps.indexOf(app) > -1} />
        <ListItemText primary={app.name} />
      </MenuItem>
    ))
  }
  
  render = () => {
    return (
      <div className={styles.App}>
        <Grid container spacing={1}>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <div style={{ height: 400, width: '100%', marginTop: 10}}>
                <DataGrid rows={this.state.usersData} columns={this.columns} pageSize={5} 
                />
                <Dialog open={this.state.dialogOpen} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Aplicaciones permitidas</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Selecciona las aplicaciones que quieres que el usuario vea
                    </DialogContentText>
                    <FormControl className={styles.formControl}>
                      <InputLabel id="demo-mutiple-checkbox-label">Aplicaciones</InputLabel>
                      <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={this.state.selectedApps}
                        onChange={this.handleSelectedAppChange}
                        input={<Input />}
                        renderValue={(selected) => selected.map(a => a.name).join(', ')}
                        MenuProps={this.MenuProps}
                      >
                        
                        {this.state.data.map((app) => (
                          <MenuItem key={app._id} value={app}>
                            <Checkbox checked={this.state.selectedApps.indexOf(app) > -1} />
                            <ListItemText primary={app.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleDialogClose} color="secondary">
                      Cancel
                    </Button>
                    <Button onClick={this.handleRowAdd} color="primary">
                      Guardar
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
      </div>
    );
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PermissionToUserApp))
