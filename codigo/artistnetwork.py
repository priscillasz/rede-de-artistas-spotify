# versão estruturada

# importar bibliotecas
import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from IPython.display import clear_output

# conectar com a API
client_id = "d3d57c82072447ea80c43989365dc7d1"
client_secret = "a4572a3186504dcf9bee6c8817a7c1e3"

credmanager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=credmanager)

# função que retorna características do artista, sendo elas:
# nome, id, popularidade, gênero principal e número de seguidores
def artist_features(spotify_search_result):
    result = {
        'artist_name': spotify_search_result.get('name', 'artist_name_not_available'),
        'artist_id': spotify_search_result.get('id', 'artist_id_not_available'),
        'artist_popularity': spotify_search_result.get('popularity', 0),
        'artist_first_genre': (spotify_search_result.get('genres', ['genre_not_available']) + ['genre_not_available'])[0],
        'artist_n_followers': spotify_search_result.get('followers', {}).get('total', 0)
    }
    return result

# função para retornar apenas o nome do artista
def nome_artista(spotify_search_result):
    result = {
        'artist_name': spotify_search_result.get('name', 'artist_name_not_available')
    }
    return result

# função que gera dicionário com os dados da search do artista
def gerar_artista_features(artista_search):
    artista_features = artist_features(artista_search)  #
    print("artist features: ")
    print(artista_features)
    gerar_artistas_relacionados(artista_features)

#??
def gerar_artistas_relacionados_features():
    pass

# função para pegar o nome dos artistas relacionados ao artista inserido e colocá-los em uma lista
def gerar_lista_artistas_rec(artista_related_artists):
    i = 0
    lista_nomes = []
    while i < len(artista_related_artists):
        # lista_nomes = lista_nomes + list(nome_artista(artista_related_artists[i]))
        lista_nomes.append(list(nome_artista(artista_related_artists[i]).values()))
        i += 1

    criar_grafo(lista_nomes)

# função para buscar os artistas relacionados ao artista inserido por input
def gerar_artistas_relacionados(artista_features):
    artista_related_artists = sp.artist_related_artists(artista_features['artist_id'])['artists']
    print('O artista possui', len(artista_related_artists), 'artistas relacionados. The first one is given below. \n\n')
    # return artista_related_artists
    gerar_lista_artistas_rec(artista_related_artists)

# função para inserir o nome do artista a ser procurado
def buscar_artista():
    artista_input = input("Insira o nome do artista:")
    # print("Artista " + artista_input)
    procurar_artista(artista_input)

# Função para procurar artista: api faz a procura do artista
# e retorna para a função gerar_artista_features
def procurar_artista(artista_input):
    artista_search = sp.search(artista_input, type='artist')['artists']['items'][0]  #
    print("artist search")
    print(artista_search)
    gerar_artista_features(artista_search)

# função que cria grafo e adiciona os nós com artistas
def criar_grafo(lista_nomes):
    G = nx.Graph()  # cria um grafo vazio
    popularity_threshold = 50  # se um artista tiver uma popularidade menor, ele não entrará no grafo

    # inserir o artista principal (inserido no input) - independente da popularidade dele

    # inserir nome dos 20 artistas relacionados ao principal no grafo
    for nome in lista_nomes:
        search = sp.search(nome, type='artist')['artists']['items'][0]
        this_artist = artist_features(search)

        if this_artist['artist_popularity'] >= popularity_threshold:
            G.add_node(this_artist['artist_name'], **this_artist, related_found=False)
        else:
            print(nome, 'is not a popular artist, we do not add it to our graph.')

    # adicionando mais nós com todos os que serão relacionados com os demais até que o grafo tenha 1000 nós
    dummy = 0

    while dummy == 0:
        l = len(G)  # número atual de nós no grafo

        for x in list(G):  # itera por cada nó
            if G.nodes[x]['related_found'] == False:  # procura por seus artistas relacionados
                relateds = sp.artist_related_artists(G.nodes[x]['artist_id'])['artists']
                relateds = [artist_features(r) for r in relateds]
                relateds_names = [r['artist_name'] for r in relateds]
                G.nodes[x]['related_found'] = True  # foram encontrados artistas relacionados

                for rname, rdict in zip(relateds_names, relateds):
                    if rdict['artist_popularity'] >= popularity_threshold:

                        if rname in G:  # se o nó já estiver no grafo, então não faz nada
                            pass

                        else:
                            G.add_node(rname, **rdict,
                                       related_found=False)  # adicionou um novo nó, não sabe-se se é relacionado ainda
                            clear_output(wait=True)
                            print('The graph has', len(G), 'nodes now.')

                        G.add_edge(x, rname)  # adiciona uma aresta entre x e o seu artista relacionado

        if len(G) == l or len(G) > 1000:  # número de nós não mudou ou o grafo cresceu demais
            dummy = 1  # quebra e sai do while loop
            print('Done.')

    # verifica quantos componentes conectados o grafo possui
    n_connected = nx.number_connected_components(G)
    print('O grafo possui ', n_connected, ' componentes conectados')

    # chamada da função que realiza a visualização do grafo
    visualizar_grafo(G)

# função que realiza a visualização do grafo
def visualizar_grafo(grafo):
    np.random.seed(0)
    plt.figure(figsize=(20, 20))
    nx.draw_networkx(grafo, with_labels=True, node_color=(.7, .8, .8), font_size=8)
    plt.show()

# driver code
# inicia com a busca do artista através do input do usuário
buscar_artista()

