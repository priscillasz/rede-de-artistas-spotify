import './App.css';
import amostra from './amostra.json';
import React, { useState, useEffect } from 'react';
import { ResponsiveNetwork } from '@nivo/network'

//Imports da MUI
import { Button, CircularProgress, Box, Typography, ThemeProvider } from '@mui/material';
import EstilosMui from './components/EstilosMui';


function App() {
  //OnLoad event -> Lendo antes da página carregar
  useEffect(() => {
    //ajusteNos(amostra)
  }, []);

  // ! TESTE circular
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  // ! Função que ajusta o JSON antes de definí-lo a variável "grafo"
  const ajusteNos = () => {
    setBotaoAcionado(true)

    //IMPRESSÃO - TESTE
    console.log(amostra)

    //Definindo o nó do artista buscado como maior
    amostra.nodes[0].size = 45;

    //Definindo a variável grafo como a variável recebida amostra
    setGrafo(amostra)

    setBotaoAcionado(false)

  }

  // ! Variável que receberá o grafo do back-end
  const [grafo, setGrafo] = useState({
    nodes: [
      { id: 'Descubra' }, { id: 'a rede de artistas' }
    ], links: [{
      source: 'Descubra',
      target: 'a rede de artistas'
    }]
  });

  // ! Variável que receberá se o botão foi apertado ou não
  const [botaoAcionado, setBotaoAcionado] = useState(false);

  return (
    <div className="row">
      <div className="column1">
        <ThemeProvider theme={EstilosMui}>
          <Button
            variant="contained"
            color="success"
            sx={{ fontWeight: 700 }}
            onClick={() => ajusteNos(amostra)}
          >
            Criar Grafo
          </Button>
        </ThemeProvider>
      </div>

      <div
        className={grafo.nodes[0].id === 'Descubra' ? 'ocultar' : 'column2'} // Se ainda não tiver carregado, não mostre o gráfico
      >
        {//<div style={{ height: 500 }}>
        }
        <ResponsiveNetwork
          data={grafo}
          style={{ fontWeight: 500 }}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          //linkDistance={function (e) { return e.distance }}
          centeringStrength={0.3}
          repulsivity={6}
          //nodeSize={function (n) { return n.size }}
          //activeNodeSize={function (n) { return 1.5 * n.size }}
          //nodeColor={function (e) { return e.color }}
          nodeColor='#015f0a'
          nodeBorderWidth={1}
          nodeBorderColor="#DAF7A6"
          linkColor='#000000'
          /*nodeBorderColor={{
            from: 'color',
            modifiers: [
              [
                'darker',
                0.8
              ]
            ]
          }}*/
          //linkThickness={function (n) { return 2 + 2 * n.target.data.height }}
          linkBlendMode="multiply"
          motionConfig="wobbly"
        /*nodeTooltip={e => {
          console.log(e)
          return <div>{e.node.data.artist_n_followers}</div>
        }}*/
        />
        {//</div>
        }
      </div>

      <div
        className={grafo.nodes[0].id === 'Descubra'/* && botaoAcionado === true */ ? 'column2' : 'ocultar'} // Se ainda não tiver carregado, não mostre o gráfico
      >
        <ThemeProvider theme={EstilosMui}>
          <CircularProgress sx={{ margin: '10px' }} color="success" />
          <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            <Typography>
              Gerando o grafo...
            </Typography>

            <Typography>
              Isto pode levar algum tempo...
            </Typography>
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default App;
