import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import Error from './Error';
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import axios from 'axios';

const Boton = styled.button`
    margin-top: 20 px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326AC0;
        cursor: pointer;
    }
`;

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {

    //state del listado de criptmonedas
    const [ listaCripto, guardarCriptomonedas ] = useState([]);
    const [ error, guardarError ] = useState(false);

    const MONEDAS = [
        { codigo: 'USD', nombre: 'Dolar de los Estados Unidos' },
        { codigo: 'MXN', nombre: 'Peso Mexicano' },
        { codigo: 'EUR', nombre: 'Euro' },
        { codigo: 'GBP', nombre: 'Libra Esterlina' }
    ];

    //Utilizar useMoneda
    const[ moneda, SelectMonedas ] = useMoneda('Elige tu Moneda', '', MONEDAS);

    //Use criptomoneda
    const [ criptomoneda, SelectCripto ] = useCriptomoneda('Elige tu Criptomoneda', '', listaCripto);

    //Ejecutar llamado a la API
    useEffect(() => {
        const consultarApi = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await axios.get(url);

            guardarCriptomonedas(resultado.data.Data);
        }

        consultarApi();
    }, []);

    const cotizarMoneda = e => {
        e.preventDefault();

        //validar si ambos campos están llenos
        if(moneda === '' || criptomoneda === '') {
            guardarError(true);
            return;
        }

        //pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }



    return ( 
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje='Hay un error ' /> : null}
            <SelectMonedas />

            <SelectCripto />
            <Boton
                type="submit"
                value="Calcular"
            />

        </form>
    );
}
 
export default Formulario;