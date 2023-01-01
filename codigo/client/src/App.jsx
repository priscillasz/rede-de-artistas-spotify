import './App.css';
import amostra from './amostra.json';
import React, { useState, useEffect } from 'react';
import { ResponsiveNetwork } from '@nivo/network'
import Axios from 'axios';

//Imports da MUI
import {
  Button, CircularProgress, Box,
  Typography, ThemeProvider,
  TextField, Select, MenuItem, InputAdornment
} from '@mui/material';
import EstilosMui from './components/EstilosMui';
import { BsSpotify, BsFillShareFill } from "react-icons/bs";
import { FaSearch } from 'react-icons/fa'

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

  //Teste autocomplete:

  // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    {
      label: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      label: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { label: 'Forrest Gump', year: 1994 },
    { label: 'Inception', year: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: 'Goodfellas', year: 1990 },
    { label: 'The Matrix', year: 1999 },
    { label: 'Seven Samurai', year: 1954 },
    {
      label: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { label: 'City of God', year: 2002 },
    { label: 'Se7en', year: 1995 },
    { label: 'The Silence of the Lambs', year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: 'Life Is Beautiful', year: 1997 },
    { label: 'The Usual Suspects', year: 1995 },
    { label: 'Léon: The Professional', year: 1994 },
    { label: 'Spirited Away', year: 2001 },
    { label: 'Saving Private Ryan', year: 1998 },
    { label: 'Once Upon a Time in the West', year: 1968 },
    { label: 'American History X', year: 1998 },
    { label: 'Interstellar', year: 2014 },
    { label: 'Casablanca', year: 1942 },
    { label: 'City Lights', year: 1931 },
    { label: 'Psycho', year: 1960 },
    { label: 'The Green Mile', year: 1999 },
    { label: 'The Intouchables', year: 2011 },
    { label: 'Modern Times', year: 1936 },
    { label: 'Raiders of the Lost Ark', year: 1981 },
    { label: 'Rear Window', year: 1954 },
    { label: 'The Pianist', year: 2002 },
    { label: 'The Departed', year: 2006 },
    { label: 'Terminator 2: Judgment Day', year: 1991 },
    { label: 'Back to the Future', year: 1985 },
    { label: 'Whiplash', year: 2014 },
    { label: 'Gladiator', year: 2000 },
    { label: 'Memento', year: 2000 },
    { label: 'The Prestige', year: 2006 },
    { label: 'The Lion King', year: 1994 },
    { label: 'Apocalypse Now', year: 1979 },
    { label: 'Alien', year: 1979 },
    { label: 'Sunset Boulevard', year: 1950 },
    {
      label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
    { label: 'The Great Dictator', year: 1940 },
    { label: 'Cinema Paradiso', year: 1988 },
    { label: 'The Lives of Others', year: 2006 },
    { label: 'Grave of the Fireflies', year: 1988 },
    { label: 'Paths of Glory', year: 1957 },
    { label: 'Django Unchained', year: 2012 },
    { label: 'The Shining', year: 1980 },
    { label: 'WALL·E', year: 2008 },
    { label: 'American Beauty', year: 1999 },
    { label: 'The Dark Knight Rises', year: 2012 },
    { label: 'Princess Mononoke', year: 1997 },
    { label: 'Aliens', year: 1986 },
    { label: 'Oldboy', year: 2003 },
    { label: 'Once Upon a Time in America', year: 1984 },
    { label: 'Witness for the Prosecution', year: 1957 },
    { label: 'Das Boot', year: 1981 },
    { label: 'Citizen Kane', year: 1941 },
    { label: 'North by Northwest', year: 1959 },
    { label: 'Vertigo', year: 1958 },
    {
      label: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983,
    },
    { label: 'Reservoir Dogs', year: 1992 },
    { label: 'Braveheart', year: 1995 },
    { label: 'M', year: 1931 },
    { label: 'Requiem for a Dream', year: 2000 },
    { label: 'Amélie', year: 2001 },
    { label: 'A Clockwork Orange', year: 1971 },
    { label: 'Like Stars on Earth', year: 2007 },
    { label: 'Taxi Driver', year: 1976 },
    { label: 'Lawrence of Arabia', year: 1962 },
    { label: 'Double Indemnity', year: 1944 },
    {
      label: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
    },
    { label: 'Amadeus', year: 1984 },
    { label: 'To Kill a Mockingbird', year: 1962 },
    { label: 'Toy Story 3', year: 2010 },
    { label: 'Logan', year: 2017 },
    { label: 'Full Metal Jacket', year: 1987 },
    { label: 'Dangal', year: 2016 },
    { label: 'The Sting', year: 1973 },
    { label: '2001: A Space Odyssey', year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: 'Toy Story', year: 1995 },
    { label: 'Bicycle Thieves', year: 1948 },
    { label: 'The Kid', year: 1921 },
    { label: 'Inglourious Basterds', year: 2009 },
    { label: 'Snatch', year: 2000 },
    { label: '3 Idiots', year: 2009 },
    { label: 'Monty Python and the Holy Grail', year: 1975 },
  ];

  // ! Variável que receberá os artistas a partir da inserção no TextField
  const [artistasBuscados, setArtistasBuscados] = useState([{}])

  // ! Função que buscará os artistas a partir do nome
  const buscarArtista = () => {
    //console.log(document.getElementById("txt_busca").value)
    //console.log(e)
    if ((document.getElementById("txt_busca").value).length > 4) {
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
    setBotaoAcionado(true);

    Axios.post("http://localhost:5000/spotigraph/grafo", artistaSelecionado)
      .then(response => {
        console.log(response.data);
        setGrafo(response.data);
        setBotaoAcionado(false)
      });
  }

  return (
    <div className="row">
      <div className="column1">
        <ThemeProvider theme={EstilosMui}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <BsSpotify size={70} color="green" style={{ margin: '0 0.5em' }} />
            <Typography variant="h4" sx={{ fontWeight: '800' }}>
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
        </ThemeProvider>
      </div>

      <div
        className={botaoAcionado ? 'ocultar' : 'column2'} // Se ainda não tiver carregado, não mostre o gráfico
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
        className={botaoAcionado ? 'column2' : 'ocultar'} // Se ainda não tiver carregado, não mostre o gráfico
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
