import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from IPython.display import clear_output

# conectar com a API
client_id = "d3d57c82072447ea80c43989365dc7d1"
client_secret = "480ae68a4d12405496c750b3ffb73498"

credmanager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=credmanager)

# função que retorna features do artista
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

# inserção de dados
artistaInput = input("Insira o nome do artista:")

# procurando o artista
artista_search = sp.search(artistaInput, type='artist')['artists']['items'][0] #
print("artist search")
print(artista_search)

## features do artista
artista_features = artist_features(artista_search) #
print("artist features: ")
print(artista_features)

# artistas relacionados
artista_related_artists = sp.artist_related_artists(artista_features['artist_id'])['artists'] #

print('O artista possui', len(artista_related_artists), 'artistas relacionados. The first one is given below. \n\n')

# retorna o primeiro artista relacionado com features
print(artist_features(artista_related_artists[0]))

# retorna apenas o nome do primeiro artista relacionado
print(nome_artista(artista_related_artists[0]))
# primeiro = nome_artista(artista_related_artists[0])

# criar lista com nome dos 20 primeiros artistas
i = 0
listaNomes = []
while i < len(artista_related_artists):
    # listaNomes = listaNomes + list(nome_artista(artista_related_artists[i]))
    listaNomes.append(list(nome_artista(artista_related_artists[i]).values()))
    i+=1

print("nomes:")
print(listaNomes)

# for i in listaNomes:
#     print(i)
# print("nome dos artistas relacionados")
# for artista in artista_related_artists:
#     print(nome_artista(artista_related_artists[artista]))

# print("nome do artista: "+nome_artista(artista_related_artists[0]))

# criar o grafo
G = nx.Graph() # create an empty graph
popularity_threshold = 70 # if an artist have a lower popularity, it won't be in our graph.

# adiciona o nó do artista procurado
G.add_node(artista_features['artist_name'], **artista_features, related_found=False)

# inserir nome dos 20 primeiros artistas no grafo
for nome in listaNomes:
    search = sp.search(nome, type='artist')['artists']['items'][0]
    this_artist = artist_features(search)

    if this_artist['artist_popularity'] >= popularity_threshold:
        G.add_node(this_artist['artist_name'], **this_artist, related_found=False)
    else:
        print(nome, 'is not a popular artist, we do not add it to our graph.')

# adicionando mais nós
dummy = 0

while dummy == 0:
    l = len(G)  # number of nodes in the graph currently

    for x in list(G):  # iterate each node
        if G.nodes[x]['related_found'] == False:  # then we need to find its related artists
            relateds = sp.artist_related_artists(G.nodes[x]['artist_id'])['artists']
            relateds = [artist_features(r) for r in relateds]
            relateds_names = [r['artist_name'] for r in relateds]
            G.nodes[x]['related_found'] = True  # it was False, but now we found its related artists

            for rname, rdict in zip(relateds_names, relateds):
                if rdict['artist_popularity'] >= popularity_threshold:

                    if rname in G:  # node already in G
                        pass  # do nothing

                    else:
                        G.add_node(rname, **rdict,
                                   related_found=False)  # we added a new node, we don't know its relateds yet
                        clear_output(wait=True)
                        print('The graph has', len(G), 'nodes now.')

                    G.add_edge(x, rname)  # we add an edge between x and its related rname

    #if len(G) == l or len(G) > 100:  # number of nodes didn't change or graph grew too large
    if len(G) > 200:
        dummy = 1  # break the while loop
        print('Done.')


# visualização
# connected components
n_connected = nx.number_connected_components(G)
print('The graph has', n_connected, 'connected components.')

np.random.seed(0)
plt.figure(figsize=(20,20))
nx.draw_networkx(G, with_labels=True, node_color=('pink'), font_size=8)
plt.savefig('Teste 100 3.png')
plt.show()