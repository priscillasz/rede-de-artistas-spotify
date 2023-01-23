import './App.css';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Axios from 'axios';

//Imports da MUI
import {
  Button, CircularProgress, Box,
  Typography, ThemeProvider,
  TextField, Select, MenuItem, InputAdornment, Backdrop, Chip
} from '@mui/material';
import EstilosMui from './components/EstilosMui';
import { BsSpotify, BsFillShareFill } from "react-icons/bs";
import { FaSearch } from 'react-icons/fa'

//import d3 
import { Graph } from "react-d3-graph";

function App() {
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
      Axios.post("http://localhost:5000/spotigraph/grafo2", artistaSelecionado)
        .then(response => {
          let nvGrafo = response.data[0];

          nvGrafo.nodes[0].color = "#8d6d00";
          //console.log("QTD GENEROS : " + nvGrafo.nodes[0].genres.length);

          // Alterando cor da aresta a partir do weight definido (aparentemente o máximo é 5...) e a qtd de generos do artista buscado
          for (let i in nvGrafo.links) {
            // nvGrafo.links[i].color = "rgba(255, 99, 71, " + parseFloat(parseFloat(nvGrafo.links[i].weight) / parseFloat(qtdGenerosArtBusc)) + ")";
          }
          //console.log(nvGrafo)

          let maisGen = Object.keys(response.data[1])
          let maisGenValores = response.data[1];
          let nvTopMaisGen = [];

          for (let i in maisGen) {
            nvTopMaisGen.push({ "genero": maisGen[i], "qtd": response.data[1][maisGen[i]] })
          }


          setGrafo(nvGrafo);
          setTopMaisGeneros(nvTopMaisGen)
          //setLabelsTopMaisGeneros(Object.keys(response.data[1]))

          setTopMenosGeneros(response.data[2])
          //setLabelsTopMenosGeneros(Object.keys(response.data[2]))



          let maisArest = Object.keys(response.data[3])
          let maisArestValores = response.data[3];
          let nvTopMaisArest = [];

          for (let i in maisGen) {
            nvTopMaisArest.push({ "artista": maisArest[i], "qtd": response.data[3][maisArest[i]] })
          }

          //setTopMaisArestas(response.data[3])
          setTopMaisArestas(nvTopMaisArest)
          //setLabelsTopMaisArestas(Object.keys(response.data[3]))

          setTopMenosArestas(response.data[4])
          //setLabelsTopMenosArestas(Object.keys(response.data[4]))

          setBotaoAcionado(false)
        });
    }
  }

  const vrfCor = (e) => {
    console.log("abc", e)
    return "#ffffff"
  }

  // ! Variável com as constantes de configuração do grafo.
  const configd3 = {
    "automaticRearrangeAfterDropNode": false,
    "collapsible": false,
    "directed": false,
    "focusAnimationDuration": 0.75,
    "focusZoom": 1,
    "freezeAllDragEvents": false,
    "height": height,
    "highlightDegree": 1,
    "highlightOpacity": 0.2,
    "linkHighlightBehavior": true,
    "maxZoom": 8,
    "minZoom": 0.1,
    "nodeHighlightBehavior": true,
    "panAndZoom": false,
    "staticGraph": false,
    "staticGraphWithDragAndDrop": false,
    "width": width,
    "d3": {
      "alphaTarget": 0.05,
      "gravity": -200,
      "linkLength": 300,
      "linkStrength": 1,
      "disableLinkForce": false
    },
    "node": {
      //"color": "#d3d3d3",
      "fontColor": "black",
      "fontSize": 12,
      "fontWeight": "normal",
      "highlightColor": "red",
      "highlightFontSize": 12,
      "highlightFontWeight": "bold",
      "highlightStrokeColor": "SAME",
      "highlightStrokeWidth": 1.5,
      "labelProperty": "name",
      "mouseCursor": "pointer",
      "opacity": 1,
      "renderLabel": true,
      "size": 450,
      "strokeColor": "none",
      "strokeWidth": 1.5,
      "svg": "",
      "symbolType": "circle"
    },
    "link": {
      //"color": "#000000",
      "fontColor": "red",
      "fontSize": 10,
      "fontWeight": "normal",
      "highlightColor": "blue",
      "highlightFontSize": 8,
      "highlightFontWeight": "bold",
      "mouseCursor": "pointer",
      "opacity": 1,
      "renderLabel": false,
      "semanticStrokeWidth": false,
      "strokeWidth": 4,
      "markerHeight": 6,
      "markerWidth": 6,
      "strokeDasharray": 0,
      "strokeDashoffset": 0,
      "strokeLinecap": "butt",
    }

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
          id="graph-id" // id is mandatory
          data={grafo}
          config={configd3} // D3
        //onClickNode={onClickNode}
        //onClickLink={onClickLink}
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

    </div>
  );
}

export default App;
