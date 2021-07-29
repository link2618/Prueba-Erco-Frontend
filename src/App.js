import React, { useState } from 'react';
import Select from 'react-select-virtualized';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

import fetchP from './helpers/fetch';

export const App = () => {

  const [selectedOption, setSelectedOption] = useState(null)
  const [view, setView] = useState(false)
  const [type, setType] = useState(null)
  const [dataTable, setDataTable] = useState([])
  const [filtro, setFiltro] = useState([{value: '', label: ''}])

  const options = [
    { value: 'cities', label: 'Ciudad' },
    { value: 'states', label: 'Estado' },
    { value: 'countries', label: 'País' },
  ]

  const peticion = async (tipo) => {
    
    const data = await fetchP.fetchSinToken(tipo)
    const body = await data.json()
    let id

    // console.log(body)
    if (body.ok) {
      switch (tipo) {
        case 'cities':
          id = 'id_city'
          setType('id')
          break;
        case 'states':
          id = 'id_state'
          setType('state')
          break;
        case 'countries':
          id = 'id_country'
          setType('countrie')
          break;
      
        default:
          break;
      }
      const resp = await body.data.map((item) => ({ 
        value: item[id],
        label: item.name
      }))
      // console.log('-->',resp)
      if (tipo === 'cities') {
        const newResp = resp.slice(0,20000)
        // console.log(newResp)
        setFiltro(newResp)
      } else
        setFiltro(resp)
      
      !view && setView(true)
    }
  }

  const handleChange = (target) => {
    setSelectedOption(target.label)
    setDataTable([])

    peticion(target.value)
  }

  const handleChangeFiltro = async (target) => {
    // console.log(target)
    const endPoint = `cities/${type}/${target.value}`
    const data = await fetchP.fetchSinToken(endPoint)
    const body = await data.json()

    // console.log(body)
    if(body.ok) {
      const resp = body.data.map((item) => ({
        state: item.state?.name,
        city: item.name,
        population: item.population,
      }))
      // console.log('tabla',resp)
      setDataTable(resp)
    }
  }
  

  return (
    <div className='margen'>
      <p>Filtro:</p>
      <Select
        placeholder={'Seleccione'}
        options={options}
        onChange={handleChange}
      />
      {view &&
        <>
        <p>{selectedOption}</p>
        <Select
          placeholder={'Seleccione'}
          options={filtro}
          onChange={handleChangeFiltro}
        />
        </>
      }

      <TableContainer className='table'>
        <Table>
          <TableHead>
            <TableRow>
              {type === 'countrie' && 
              <TableCell>Estado</TableCell>
              }
              <TableCell>Ciudad</TableCell>
              <TableCell>Población</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dataTable.map((item, index) => (
              <TableRow key={index}>
                {type === 'countrie' && 
                <TableCell>{item.state}</TableCell>
                }
                <TableCell>{item.city}</TableCell>
                <TableCell>{item.population}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

