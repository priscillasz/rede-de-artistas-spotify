# Rede de artistas do Spotify
[Estrutura de Dados II - 2022.2 - BSI - UNIRIO](https://github.com/priscillasz/rede-de-artistas-spotify)
> Projeto para a disciplina de Estruturas de Dados II com o intuito de gerar a visualização do grafo da rede de artistas relacionados a um artista do Spotify.

## Equipe
* **[Clara Maciel](https://github.com/Clarathms):** _Documentação_
* **[Daniel Pareschi](https://github.com/DanielPFM01):** _Documentação_
* **[Eduardo Santos](https://github.com/edusantosgoncalves):** _Front-end_
* **[Luca Darly](https://github.com/lucadarly):** _Back-end_
* **[Priscilla Souza](https://github.com/priscillasz):** _Back-end_

## Sobre o Projeto
> _Informações completas sobre o projeto encontram-se na [wiki](https://github.com/priscillasz/rede-de-artistas-spotify/wiki)._

### Objetivo
> Demonstrar através do uso de grafos, uma rede que recebe o input de um usuário sobre um artista específico e retorna a visualização de uma rede de artistas similares ao artista em questão.

### Como utilizar
> Para o uso da versão atual do projeto, você precisará de Python 3.10 ou versão mais recente e das bibliotecas abaixo:

#### Bibliotecas
> As bibliotecas do Python que serão utilizadas são:
* **numpy:** _oferece funções matemáticas abrangentes, geradores de números aleatórios, rotinas de álgebra linear, etc.;_
* **matplotlib (pyplot):** _criação de gráficos e visualizações de dados em geral;_
* **networkx:** _biblioteca para estudo (construção e visualização) de grafos e redes;_
* **spotipy:** _biblioteca para a API do Spotify Web;_
* **IPython:** _interpretador interativo para várias linguagens de programação, mas especialmente focado em Python._

#### Execução
> Executando o arquivo [projeto.py](https://github.com/priscillasz/rede-de-artistas-spotify/blob/master/codigo/projeto.py), basta inserir o nome do artista desejado e as operações necessárias serão realizadas para geração do grafo. 
* A implementação de escolha de popularidade não foi posta em prática por enquanto. Portanto, essa manipulação deve ser feita diretamente no código, no momento;
* É importante ressaltar que na versão atual, não foi realizado o tratamento de exceções;
* Obs: Pode ser que algumas visualizações de grafos maiores não consigam ser geradas no momento.

#### Exemplo de funcionamento
> Abaixo, pode-se visualizar a rede de artistas relacionados a Taylor Swift, em que todos os artistas, representados por nós, possuem popularidade igual ou acima de 60, somando um total de 1007 artistas relacionados.
<img src="https://github.com/priscillasz/rede-de-artistas-spotify/blob/master/visualizacoes/Taylor%20Swift%20pop%2060%20-%201007%20nodes.png?raw=true"  width="1024" height="768" style="display: block; margin: 0 auto" alt="Grafo da rede de artistas relacionados da Taylor Swift">

