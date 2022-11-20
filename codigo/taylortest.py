import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from IPython.display import clear_output

# CÓDIGO TAYLOR

# conectar com a API
client_id = "d3d57c82072447ea80c43989365dc7d1"
client_secret = "a4572a3186504dcf9bee6c8817a7c1e3"

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

# inserção de dados
# artistaInput = input("Insira o nome do artista:")

taylor_search = sp.search('Taylor Swift', type='artist')['artists']['items'][0]
print(taylor_search)

taylor_features = artist_features(taylor_search)
print(taylor_features)
taylors_related_artists = sp.artist_related_artists(taylor_features['artist_id'])['artists']

print('Taylor has', len(taylors_related_artists), 'related artists. The first one is given below. \n\n')

print(artist_features(taylors_related_artists[0]))

## grafo
G = nx.Graph() # create an empty graph

popularity_threshold = 70 # if an artist have a lower popularity, it won't be in our graph.

# adicionando uns nomes
artists_name_list = ['Taylor Swift', 'Adele', 'Beyonce', 'Michael Jackson', 'Michael Buble', 'Ed Sheeran', 'Norah Jones',
                     'Beatles', 'Ella Fitzgerald', 'Elton John', 'Shakira', 'Lady Gaga', 'Ariana Grande', 'Stevie Wonder',
                     'Billie Eilish', 'Dua Lipa', 'Mariah Carey', 'Jennifer Lopez']

print('There are', len(artists_name_list), 'artists in the initial list.')

for name in artists_name_list:
    search = sp.search(name, type='artist')['artists']['items'][0]
    this_artist = artist_features(search)

    if this_artist['artist_popularity'] >= popularity_threshold:
        G.add_node(this_artist['artist_name'], **this_artist, related_found=False)
    else:
        print(name, 'is not a popular artist, we do not add it to our graph.')

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

    if len(G) == l or len(G) > 1000:  # number of nodes didn't change or graph grew too large
        dummy = 1  # break the while loop
        print('Done.')

## visualizar
# connected components
n_connected = nx.number_connected_components(G)
print('The graph has', n_connected, 'connected components.')

# gerar visualização do grafo
np.random.seed(0)
plt.figure(figsize=(20,20))
nx.draw_networkx(G, with_labels=True, node_color=(.7,.8,.8), font_size=8)
plt.show()
