import './App.css';
import React, { useState, useLayoutEffect, useRef } from 'react';
import Axios from 'axios';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel'

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
  const [mostrarDados, setMostrarDados] = useState([{}])
  const listaTiposDados = [
    "Centro",
    "Conjuntos Dominantes",
    "Periferia",
    "Top Gêneros - Maior",
    "Top Gêneros - Menor",
    "Nós com maior centralidade de grau",
    "Nós com menor centralidade de grau",
  ]

  const [tipoDados, setTipoDados] = useState("")
  const [metricas, setMetricas] = useState({ assortatividade: '', diametro: '', qtdArestas: '', qtdNos: '', raio: '' })
  const [topMaisGeneros, setTopMaisGeneros] = useState([{}])
  const [topMenosGeneros, setTopMenosGeneros] = useState([{}])
  const [topMaisCentrGrau, setTopMaisCentrGrau] = useState([{}])
  const [topMenosCentrGrau, setTopMenosCentrGrau] = useState([{}])
  const [listaPeriferia, setListaPeriferia] = useState([])
  const [listaCentro, setListaCentro] = useState([])
  const [listaConjDomin, setListaConjDomin] = useState([])

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

          //Definindo metricas:
          setMetricas({
            assortatividade: response.data.assortatividade, diametro: response.data.diametro,
            qtdArestas: response.data.qtdArestas, qtdNos: response.data.qtdNos, raio: response.data.raio
          })

          let nvGrafo = response.data.grafo;
          nvGrafo.nodes[0].color = "#8d6d00";
          setGrafo(nvGrafo);

          let maisGen = Object.keys(response.data.top5MaisGen)
          //let maisGenValores = response.data.top5MaisGen;
          let nvTopMaisGen = [];

          for (let i in maisGen) {
            nvTopMaisGen.push({ "genero": maisGen[i], "qtd": response.data.top5MaisGen[maisGen[i]] })
          }
          setTopMaisGeneros(nvTopMaisGen)

          let menosGen = Object.keys(response.data.top5MenosGen)
          let nvTopMenosGen = [];

          for (let i in menosGen) {
            nvTopMenosGen.push({ "genero": menosGen[i], "qtd": response.data.top5MenosGen[menosGen[i]] })
          }
          setTopMenosGeneros(nvTopMenosGen)

          let maisArest = Object.keys(response.data.topMaisCentrGrau)
          let nvTopMaisArest = [];

          for (let i in maisGen) {
            nvTopMaisArest.push({ "artista": maisArest[i], "qtd": response.data.topMaisCentrGrau[maisArest[i]] })
          }

          setTopMaisCentrGrau(nvTopMaisArest)

          let menosArest = Object.keys(response.data.topMenosCentrGrau)
          let nvTopMenosArest = [];

          for (let i in maisGen) {
            nvTopMenosArest.push({ "artista": menosArest[i], "qtd": response.data.topMenosCentrGrau[menosArest[i]] })
          }
          setTopMenosCentrGrau(nvTopMenosArest)


          let periferia = Object.keys(response.data.periferia)
          let nvPeriferia = [];

          for (let i in maisGen) {
            nvPeriferia.push({ "artista": periferia[i], "qtd": response.data.periferia[periferia[i]] })
          }
          setListaPeriferia(response.data.periferia)
          //setListaPeriferia(nvPeriferia)


          let centro = Object.keys(response.data.centro)
          let nvCentro = [];

          for (let i in maisGen) {
            nvCentro.push({ "artista": centro[i], "qtd": response.data.centro[centro[i]] })
          }
          //setListaCentro(nvCentro)
          setListaCentro(response.data.centro)
          let conjDom = Object.keys(response.data.conjuntosDominantes)
          let nvConjDom = [];

          for (let i in maisGen) {
            nvConjDom.push({ "artista": conjDom[i], "qtd": response.data.conjuntosDominantes[conjDom[i]] })
          }
          //setListaConjDomin(nvConjDom)
          setListaConjDomin(response.data.conjuntosDominantes)

          setTipoDados("SLC")
          setBotaoAcionado(false)
        })
        .catch((e) => {
          console.log(e)
          setMsgAlerts("Ocorreu algum erro, tente novamente mais tarde!")
          setAbreRemove(true)
          setTipoDados("Centro")
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

  const trocaVisualizacao = (tipo) => {
    console.log(tipo)
    setTipoDados(tipo)
  }

  return (
    <ThemeProvider theme={EstilosMui}>
      <div className="row">
        <div className="column1">
          <div className="column3">
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
          </div>



          <div className="column3">
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#c1f1bc', borderRadius: '1em' }}>
              <Chip
                sx={{
                  flex: '1 0 21%', /* explanation below */
                  margin: '5px'
                }}
                className={tipoDados !== "" ? "mostrar" : "ocultar"}
                label={"Assortatividade - " + metricas.assortatividade}
              />

              <Chip
                sx={{
                  flex: '1 0 21%', /* explanation below */
                  margin: '5px'
                }}
                className={tipoDados !== "" ? "mostrar" : "ocultar"}
                label={"Diâmetro - " + metricas.diametro}
              />

              <Chip
                sx={{
                  flex: '1 0 21%', /* explanation below */
                  margin: '5px'
                }}
                className={tipoDados !== "" ? "mostrar" : "ocultar"}
                label={"Raio - " + metricas.raio}
              />

              <Chip
                sx={{
                  flex: '1 0 21%', /* explanation below */
                  margin: '5px'
                }}
                className={tipoDados !== "" ? "mostrar" : "ocultar"}
                label={"Arestas (qtd) - " + metricas.qtdArestas}
              />


              <Chip
                sx={{
                  flex: '1 0 21%', /* explanation below */
                  margin: '5px'
                }}
                className={tipoDados !== "" ? "mostrar" : "ocultar"}
                label={"Nós (qtd) - " + metricas.qtdNos}
              />
            </div>

          </div>

        </div>

        <div
          ref={ref}
          className='column2'//{botaoAcionado ? 'ocultar' : } // Se ainda não tiver carregado, não mostre o gráfico
        >
          <div className="column3">
            <Carousel
              className={tipoDados !== "" ? "mostrar" : "ocultar"}
              showThumbs={false} >
              <Box sx={{ margin: '2em 0 0 0', padding: '1em', backgroundColor: '#c1f1bc', borderRadius: '1em' }}>
                <Typography>
                  Centro:
                </Typography>

                {listaCentro.map(
                  (artista) => {
                    //if (artista.hasOwnProperty('artista')) {
                    return <Chip
                      label={artista}
                      variant="outlined"
                      sx={{
                        display: 'flex',
                        margin: '0.2em',
                        backgroundColor: '#c5c5c5',
                        justifyContent: 'flex-start',
                        flexGrow: 0
                      }}
                    />;
                    //}
                  })}
              </Box>

              <Box sx={{ margin: '2em 0 0 0' }}>
                <Typography>
                  Conjuntos dominantes:
                </Typography>

                {listaConjDomin.map(
                  (artista) => {
                    //console.log(artista)
                    //if (artista.hasOwnProperty('artista')) {
                    return <Chip
                      label={artista}
                      //label={artista.artista + " - " + artista.qtd}
                      variant="outlined"
                      sx={{
                        display: 'flex',
                        margin: '0.2em',
                        backgroundColor: '#c5c5c5',
                        justifyContent: 'flex-start',
                        flexGrow: 0
                      }}
                    />;
                    // }
                  })}
              </Box>

              <Box sx={{ margin: '2em 0 0 0' }}>
                <Typography>
                  Periferia:
                </Typography>

                {listaPeriferia.map(
                  (artista) => {
                    //console.log(artista)
                    //if (artista.hasOwnProperty('artista')) {
                    return <Chip
                      label={artista}
                      //label={artista.artista + " - " + artista.qtd}
                      variant="outlined"
                      sx={{
                        display: 'flex',
                        margin: '0.2em',
                        backgroundColor: '#c5c5c5',
                        justifyContent: 'flex-start',
                        flexGrow: 0
                      }}
                    />;
                    //}
                  })}
              </Box>

              <Box sx={{ margin: '2em 0 0 0' }}>

                <Typography>
                  Top Generos que mais aparecem no grafo:
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
                  Top Generos que menos aparecem no grafo:
                </Typography>

                {topMenosGeneros.map(
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
                  Top Artistas com maior centralidade de grau:
                </Typography>

                {topMaisCentrGrau.map(
                  (genero) => {
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

              <Box sx={{ margin: '2em 0 0 0' }}>
                <Typography>
                  Top Artistas com menor centralidade de grau:
                </Typography>

                {topMenosCentrGrau.map(
                  (centrGrau) => {
                    console.log(centrGrau)
                    if (centrGrau.hasOwnProperty('artista')) {
                      return <Chip
                        label={centrGrau.artista + " - " + centrGrau.qtd}
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
            </Carousel>
          </div>
          {/*<Graph
          data={grafo}
          id="graph"
          NodeComponent={Node}
          enableDrag={true}
          hoverOpacity={0.1}
          style={{ minHeight: '100vh' }}
              />*/}

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
    </ThemeProvider>
  );
}

export default App2;
