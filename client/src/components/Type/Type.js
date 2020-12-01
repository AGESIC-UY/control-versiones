import React, { Component } from 'react';
import {connect} from 'react-redux'
import {setAuth, setUser} from '../../actions/connectionActions'
import styles from './type.module.scss'
import {withRouter} from 'react-router'
import {
    Grid,
} from '@material-ui/core'
import axios from 'axios'
import { forwardRef } from 'react';
import MaterialTable  from "material-table";
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

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}  />),
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

class Type extends Component {
  constructor(props) {
      super(props)

      this.state = {
          email: null,
          password: null,
          loading: false,
          data: [],
          errorMessages: []
      }

      api.get("type/all/types")
      .then(res => {            
          const { code, description, message,  types } = res.data
          this.sendNotification(code, description, message)
          if (types) {
            types.map(type => type.createdAt = new Date(type.createdAt).toLocaleString())
            this.setState({ data: types})
          }
       })
       .catch(error=>{
           console.log("Error")
       })

  }
  
  columns = [
    {title: "id", field: "id", hidden: true},
    {title: "Nombre", field: "name"},
    {title: "Fecha de creacion", field: "createdAt", dateSetting: { locale: 'es-ES'}, editable: 'never'},
    
  ]

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
    let errorList = []
    if(errorList.length < 1){
      api.post("/type/update", newData)
      .then(res => {
        const dataUpdate = [...this.state.data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        this.setState({data: [...dataUpdate]})
          resolve()
      })
      .catch(error => {
        this.setState({errorMessages: [...this.state.errorMessages, error]})
        resolve()
      })
    }else{
      resolve()
    }
  }

  handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = []

    if(errorList.length < 1){ //no error
      api.post("/type/create", newData)
      .then(res => {
        const { code, description, message, type, createdAt } = res.data
        this.sendNotification(code, description, message)
        if (type) {
          newData['createdAt'] = new Date(createdAt).toLocaleString()
          this.setState({data: [...this.state.data, newData]})

        }
        resolve()
      })
      .catch(error => {
        this.setState({errorMessages: [...this.state.errorMessages, error]})
        this.sendNotification()
        resolve()
      })
    }else{
      resolve()
    }

    
  }

  handleRowDelete = (oldData, resolve) => {
    api.delete("/type/remove", { data: { id: oldData} })
      .then(res => {
        const dataDelete = [...this.state.data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        this.setState({data: dataDelete })
        resolve()
      })
      .catch(error => {
        console.log('error')
        resolve()
      })
  }

  render = () => {
    return (
      <div className={styles.App}>
        <Grid container spacing={1}>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <MaterialTable
                title="Tipos"
                columns={this.columns}
                data={this.state.data}
                icons={tableIcons}
                editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        this.handleRowUpdate(newData, oldData, resolve);
                        
                    }),
                  onRowAdd: (newData) =>
                    new Promise((resolve) => {
                      this.handleRowAdd(newData, resolve)
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      this.handleRowDelete(oldData, resolve)
                    }),
                }}
                actions={[]}
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
                        labelRowsSelect: 'Registros',
                        labelDisplayedRows: '{count} de {from}-{to}',
                        firstTooltip: 'Primera página',
                        previousTooltip: 'Página anterior',
                        nextTooltip: 'Próxima página',
                        lastTooltip: 'Última página'
                    }
                }}
              />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Type))
