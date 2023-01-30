import './App.css';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Axios from 'axios';
import Draggable from 'react-draggable'
//Imports da MUI
import {
  Button, CircularProgress, Box,
  Typography, ThemeProvider,
  TextField, Select, MenuItem, InputAdornment, Backdrop, Chip,
  Snackbar, Alert, AlertTitle
} from '@mui/material';
import EstilosMui from './components/EstilosMui';
import { BsSpotify, BsFillShareFill } from "react-icons/bs";
import { FaSearch } from 'react-icons/fa'

//import d3 
import Graph from "react-graph-network";

function App2() {
  //! Variaveis q vao controlar os alerts:
  const [abreRemove, setAbreRemove] = React.useState(false);
  const [msgAlerts, setMsgAlerts] = React.useState("");

  const fechaAlertRemove = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAbreRemove(false);
  };

  // ! Auxiliando a definir o tamanho do grafo
  const ref = useRef(null);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setHeight(ref.current.clientHeight);
    setWidth(ref.current.clientWidth);
  }, []);

  // ! Variável que receberá o grafo do back-end
  const [grafo, setGrafo] = useState({
    nodes: [
      { id: 'Descubra' }, { id: 'a rede de artistas' }
    ],
    links: [{
      source: 'Descubra',
      target: 'a rede de artistas'
    }]
  });

  // ! Variáveis que vão receber os tops do back-end
  const [topMaisGeneros, setTopMaisGeneros] = useState([{}])
  const [topMenosGeneros, setTopMenosGeneros] = useState([{}])
  const [topMaisArestas, setTopMaisArestas] = useState([{}])
  const [topMenosArestas, setTopMenosArestas] = useState([{}])

  // ! Variável que receberá se o botão foi apertado ou não
  const [botaoAcionado, setBotaoAcionado] = useState(false);

  // ! Variável que receberá os artistas a partir da inserção no TextField
  const [artistasBuscados, setArtistasBuscados] = useState([{}])

  // ! Função que buscará os artistas a partir do nome
  const buscarArtista = () => {
    //Enquanto o campo não tiver ao menos 2 caracteres, não faça nada, senão, busque os artistas
    if ((document.getElementById("txt_busca").value).length > 1) {
      Axios.get("http://localhost:5000/spotigraph/" + document.getElementById("txt_busca").value)
        .then(response => {
          console.log(response.data);// TESTE - 
          setArtistasBuscados(response.data);
        });
    }
    else {
      setArtistasBuscados([{}])
    }
  }

  // ! Variável que receberá o artista escolhido no select
  const [artistaSelecionado, setArtistaSelecionado] = useState({});

  // ! Função que trocará o artista escolhido no select
  const trocaArtista = (artista) => {
    console.log(artista)
    setArtistaSelecionado(artista);
  }

  // ! Função que buscará o grafo...
  const criaGrafo = () => {
    if ('id' in artistaSelecionado) { // Se for selecionado algum artista, busque...
      setBotaoAcionado(true);
      //Axios.post("https://server-spotigraph.onrender.com/spotigraph/grafo2", artistaSelecionado)
      Axios.post("http://localhost:5000/spotigraph/grafo3", artistaSelecionado)
        .then(response => {
          console.log(response.data)
          let nvGrafo = response.data.grafo;

          nvGrafo.nodes[0].color = "#8d6d00";

          let maisGen = Object.keys(response.data.top5MaisGen)
          //let maisGenValores = response.data.top5MaisGen;
          let nvTopMaisGen = [];

          for (let i in maisGen) {
            nvTopMaisGen.push({ "genero": maisGen[i], "qtd": response.data.top5MaisGen[maisGen[i]] })
          }


          setGrafo(nvGrafo);
          setTopMaisGeneros(nvTopMaisGen)
          //setLabelsTopMaisGeneros(Object.keys(response.data[1]))

          setTopMenosGeneros(response.data[2])
          //setLabelsTopMenosGeneros(Object.keys(response.data[2]))



          let maisArest = Object.keys(response.data.top5MaisArestas)
          //let maisArestValores = response.data.top5MaisArestas;
          let nvTopMaisArest = [];

          for (let i in maisGen) {
            nvTopMaisArest.push({ "artista": maisArest[i], "qtd": response.data.top5MaisArestas[maisArest[i]] })
          }

          //setTopMaisArestas(response.data[3])
          setTopMaisArestas(nvTopMaisArest)
          //setLabelsTopMaisArestas(Object.keys(response.data[3]))

          setTopMenosArestas(response.data.top5MenosArestas)
          //setLabelsTopMenosArestas(Object.keys(response.data[4]))

          setBotaoAcionado(false)
        })
        .catch((e) => {
          console.log(e)
          setMsgAlerts("Ocorreu algum erro, tente novamente mais tarde!")
          setAbreRemove(true)
          setBotaoAcionado(false)
        });
    }
  }

  // ! Nó customizado
  const fontSize = 14;
  const radius = 10;

  const Node = ({ node }) => {
    // colors
    // const familyMatch = node.family.match(/Tolst|Trubetsk|Volkonsk|Gorchakov/);
    //const stroke = 50//colorSwitch(familyMatch);

    // sizes
    const sizes = {
      radius: radius,
      textSize: fontSize,
      textX: radius * 1.5,
      textY: radius / 2,
    };

    console.log(node)
    return (
      <>
        {
          <circle
            fill={node.hasOwnProperty('color') ? node.color : '#d3d3d3'}
            r={sizes.radius}
          />
        }
        <g style={{ fontSize: sizes.textSize + 'px' }}>
          <text
            x={sizes.radius + 7}
            y={sizes.radius / 2}
          >
            {node.id}
          </text>
        </g>

      </>
    );
  };

  return (
    <div className="row">
      <div className="column1">
        <ThemeProvider theme={EstilosMui}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#c1f1bc', borderRadius: '0.5em' }}>
            <BsSpotify size={70} color="green" style={{ margin: '0.3em 0.5em' }} />
            <Typography variant="h4" sx={{ fontWeight: '800', margin: '0.2em 0.5em' }}>
              Spotigraph
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ margin: '0 0.5em 0 0.2em' }}>
                Buscar artista:
              </Typography>
              <Box>

                <TextField
                  id="txt_busca"
                  onChange={(e) => buscarArtista(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ margin: '2em 0 0 0' }}>
              <Typography>
                Selecione o artista:
              </Typography>

              <Select
                id="slct_artistas"
                sx={{ minWidth: '100%' }}
              >
                {artistasBuscados.map(
                  (artista) => (
                    <MenuItem
                      value={artista.id}
                      key={"ART_" + artista.id}
                      onClick={() => trocaArtista(artista)}
                      selected={artistaSelecionado === artista}
                    >
                      {artista.name}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="success"
            sx={{ fontWeight: 700 }}
            onClick={criaGrafo}
            startIcon={<BsFillShareFill />}
          >
            Criar Grafo
          </Button>


          <Box sx={{ margin: '2em 0 0 0' }}>
            <Typography>
              Top 5 Generos que mais aparecem no grafo:
            </Typography>

            {topMaisGeneros.map(
              (genero) => {
                console.log(genero)
                if (genero.hasOwnProperty('genero')) {
                  return <Chip
                    label={genero.genero + " - " + genero.qtd}
                    variant="outlined"
                    sx={{
                      display: 'flex',
                      margin: '0.2em',
                      backgroundColor: '#c5c5c5',
                      justifyContent: 'flex-start',
                      flexGrow: 0
                    }}
                  />;
                }
              })}
          </Box>

          <Box sx={{ margin: '2em 0 0 0' }}>
            <Typography>
              Top 5 Artistas com mais conexões no grafo:
            </Typography>

            {topMaisArestas.map(
              (genero) => {
                console.log(genero)
                if (genero.hasOwnProperty('artista')) {
                  return <Chip
                    label={genero.artista + " - " + genero.qtd}
                    variant="outlined"
                    sx={{
                      display: 'flex',
                      margin: '0.2em',
                      backgroundColor: '#c5c5c5',
                      justifyContent: 'flex-start',
                      flexGrow: 0
                    }}
                  />;
                }
              })}
          </Box>
        </ThemeProvider>
      </div>

      <div
        ref={ref}
        className='column2'//{botaoAcionado ? 'ocultar' : } // Se ainda não tiver carregado, não mostre o gráfico
      >

        <Graph
          data={grafo}
          id="graph"
          NodeComponent={Node}
          enableDrag={true}
          hoverOpacity={0.1}
        />

      </div>

      <Backdrop
        sx={{ color: '#fff' }}
        open={botaoAcionado}
      >
        <ThemeProvider theme={EstilosMui}>
          <CircularProgress sx={{ margin: '10px', color: '#81c784' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            <Typography>
              Gerando o grafo...
            </Typography>

            <Typography>
              Isto pode levar algum tempo...
            </Typography>
          </Box>
        </ThemeProvider>
      </Backdrop>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={abreRemove}
        autoHideDuration={2500}
        onClose={fechaAlertRemove}>
        <Alert onClose={fechaAlertRemove} severity="warning" sx={{ width: '100%' }}>
          <AlertTitle>Informativo</AlertTitle>
          {msgAlerts}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App2;
