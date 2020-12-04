import React, { Component } from 'react';
import {connect} from 'react-redux'
import {setAuth, setUser} from '../../actions/connectionActions'
import {withRouter} from 'react-router'
import styles from './version.module.scss'
import {
    Grid,
} from '@material-ui/core'
import axios from 'axios'
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MaterialTable, { MTableToolbar } from 'material-table';
import Chip from "@material-ui/core/Chip";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const api = axios.create({
    baseURL: `http://localhost:3001/api/`,
    withCredentials: true
})

class Version extends Component {
  constructor(props) {
      super(props)

      this.state = {
          loading: false,
          data: [],
          relevantApps: {},
          look: {}
      }

      api.get(props.user.role === 'superAdmin' ? 'version/all/versions' : 'version/all/relevant',
        props.user.role !== 'superAdmin' ?  { params: { id: props.user._id }} : '' )
      .then(res => {
          let { code, description, message,  versions } = res.data
          this.sendNotification(code, description, message)
          if (versions) {
            versions.map(version => version.createdAt = new Date(version.createdAt).toLocaleString());
            this.setState({ data: versions });
          }
       })
       .catch(error=>{
           console.log("Error",error)
       })


      api.get(props.user.role === 'superAdmin' ? 'application/all/applications' : "application/all/relevant",
    props.user.role !== 'superAdmin' ?  { params: { id: props.user._id }} : '')
    .then(res => {     
        let { code, description, message,  applications } = res.data
        this.sendNotification(code, description, message)

        if (applications) {
          applications.map(app => app.createdAt = new Date(app.createdAt).toLocaleString())
          let apps = applications.reduce((a, key) => {
            a[key._id] = key.name;
            return a;
          }, {});
          this.setState({ relevantApps: apps })
        }
     })
     .catch(error=>{
         console.log("Error", error)
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

  handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    const dataUpdate = [...this.state.data];
    const index = oldData.tableData.id;

    if(JSON.stringify(newData.servicesUrls) !== JSON.stringify(dataUpdate[index].servicesUrls)){
       newData.servicesUrls = newData.servicesUrls.split(',')
    }

      api.post("/version/update", newData)
      .then(res => {
        const { code, description, message,  version } = res.data
        this.sendNotification(code, description, message)
        if (version) {
          const dataUpdate = [...this.state.data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          this.setState({data: [...dataUpdate]})
        }
        resolve()
      })
      .catch(error => {
        console.log('error create', error)
        resolve()
      })
  }

  handleRowAdd = (newData, resolve) => {
    api.post("/version/create", newData)
    .then(res => {
      const { code, description, message,  version, createdAt } = res.data
      newData['createdAt'] = new Date(createdAt).toLocaleString()
      this.sendNotification(code, description, message)
      if (version) {
        newData['_id'] = version
        this.setState({data: [...this.state.data, newData]})
      }
      resolve()
    })
    .catch(error => {
      console.log('error', error)
      resolve()
    })
  }

  handleRowDelete = (oldData, resolve) => {

    api.delete("/version/remove", { data: { id: oldData, appId: oldData.owner } })
      .then(res => {
        const { code, description, message } = res.data
        const dataDelete = [...this.state.data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        this.setState({data: dataDelete })
        this.sendNotification(code, description, message)
        resolve()
      })
      .catch(error => {
        console.log('error', error)
        resolve()
      })
  }


  render = () => {
    return (
        <div className={styles.App}>
        <Grid container spacing={1}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
            <div>
            </div>
              <MaterialTable
                title="Versiones"
                isFreeAction={false}
                data={this.state.data}
                icons={tableIcons}
                editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                      // newData.servicesUrls = newData.servicesUrls.split(',')
                        this.handleRowUpdate(newData, oldData, resolve);
                        
                    }),
                  onRowAdd: (newData) =>
                    new Promise((resolve) => {
                      newData = {...newData, servicesUrls: newData.servicesUrls.split(', ')}
                      this.handleRowAdd(newData, resolve)
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      this.handleRowDelete(oldData, resolve)
                    }),
                }}
                columns={[
                  {title: "id", field: "id", hidden: true},
                  {title: "Version", field: "version", type: 'string', width: 100},
                  {title: "Version minima", field: "minVersion", type: 'string', width: 100},
                  {title: "Urls", field: "servicesUrls", 
                        render: rowData => 
                              <List className={styles.listUrl} subheader={<li />}>
                              <li key={rowData._id} >
                                <ul className={styles.ulList}>
                                  {rowData.servicesUrls && rowData.servicesUrls.map((item) => (
                                    <ListItem key={Math.random().toString(36).substring(2, 15)}>
                                      <ListItemText primary={item} />
                                    </ListItem>
                                  ))}
                                </ul>
                              </li>
                        </List>                
                  },
                  {title: "Aplicacion", field: "owner", lookup: this.state.relevantApps, initialEditValue: '', width: 250},
                  {title: "Fecha de creacion", field: "createdAt", dateSetting: { locale: 'es-ES'} , editable: 'never',width: 150}
                ]}
                actions={[]}
                components={{
                  Toolbar: props => (
                    <div>
                      <MTableToolbar {...props} />
                      <div style={{padding: '0px 10px'}}>
                        <Chip label="Debe serparar las urls con una coma y espacio al ingresar multiples" color="secondary" style={{marginRight: 5}}/>
                        

                      </div>
                    </div>
                  ),
                }}
                localization={{
                    header: {
                        actions: 'Acciones'
                    },
                    body: {
                        emptyDataSourceMessage: 'Ningun registro para mostrar',
                        addTooltip: 'Agregar',
                        editTooltip: 'Editar',
                        deleteTooltip: 'Borrar',
                        editRow: {
                            deleteText: 'Estas seguro de borrar?',
                            cancelTooltip: 'Cancelar',
                            saveTooltip: 'Guardar'
                        }
                    },
                    toolbar: {
                        searchTooltip: 'Buscar',
                        searchPlaceholder: 'Buscar'
                    },
                    pagination: {
                        labelRowsSelect: 'Paginas',
                        labelDisplayedRows: '{count} de {from}-{to}',
                        firstTooltip: 'Primera página',
                        previousTooltip: 'Página anterior',
                        nextTooltip: 'Próxima página',
                        lastTooltip: 'Última página'
                    }
                }}
    
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
      </div>
    );
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Version))
