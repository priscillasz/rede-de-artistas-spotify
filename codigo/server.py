# Imports para abrir o servidor REST
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

# Imports para a execução do código
import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from IPython.display import clear_output

# importando json
import json

# importando arquivo .env com as credenciais do spotify
from decouple import config

# Definindo o server e instalando o CORS nele
app = Flask(__name__)
CORS(app)
# app.run(debug=True)

# Instanciando e conectando com a API do Spotify
client_id = config('CLIENT_ID')
client_secret = config('CLIENT_SECRET')

credmanager = SpotifyClientCredentials(
    client_id=client_id, client_secret=client_secret)

sp = spotipy.Spotify(client_credentials_manager=credmanager)


@app.route('/spotigraph/grafo', methods=['POST'])
def criarGrafo():
    # Pegando item do body do request
    req_data = request.get_json()
    artista_escolhido = req_data['id']  # Pegando id do artista escolhido...

    # Buscando artistas relacionados do artista escolhido
    artist_features = sp.artist_related_artists(artista_escolhido)

    # Inicializando um grafo vazio
    G = nx.Graph()

    # Definindo um limite de popularidade para o artista ser adicionado ao grafo
    popularity_threshold = 70

    # Para cada artista na lista de artistas, buscar
    for artista in artist_features['artists']:
        if artista['popularity'] >= popularity_threshold:
            G.add_node(artista['name'], **
                       artista, related_found=False)
        else:
            print(artista['name'],
                  'is not a popular artist, we do not add it to our graph.')

    # Variável verificadora do loop, enquanto estiver 0, continue o loop
    vrf = 0

    while vrf == 0:
        l = len(G)  # Número de nós atual do Grafo

        for x in list(G):  # Itere cada nó do grafo...
            # Precisaremos encontrar se procurou-se artistas relacionados ao artista do nó corrente
            # Caso não tenha sido procurado, busque-os e insira-os no nó a partir dos parâmetros definidos
            if G.nodes[x]['related_found'] == False:
                relateds = sp.artist_related_artists(
                    G.nodes[x]['id'])['artists']

                # //* O que ocorre aqui, PRI?
                relateds_names = [r['name'] for r in relateds]

                # Como agora buscamos os artistas relacionados do nó que não os tinha, muda para verdadeiro a propriedade
                G.nodes[x]['related_found'] = True

                for rname, rdict in zip(relateds_names, relateds):
                    # Se a popularidade estiver no limite...
                    if rdict['popularity'] >= popularity_threshold:

                        # Verifique se o nó já está inserido no grafo
                        if rname in G:
                            pass  # Se estiver, não faça nada

                        # Se não estiver, insira-o
                        else:
                            G.add_node(rname, **rdict,
                                       related_found=False)  # Adicionando o novo nó e marcando o seu relacionado como falso
                            clear_output(wait=True)
                            print('O grafo agora possui', len(G), 'nós.')

                        # Adicionando uma aresta entre o no X e o nó adicionado
                        G.add_edge(x, rname)

        # Se a qtd de nós não mudou ou o grafo está no limite definido de nós (ao menos 1001), quebre o loop
        if len(G) == l or len(G) > 50:  # 100:
            vrf = 1
            print('Finalizando.')

    print(artista_escolhido)
    return jsonify(nx.node_link_data(G))


@app.route('/spotigraph/<string:nome>', methods=['GET'])
# Ao receber um nome, busque e retorne os artistas cujo nome contenha...
def returnOne(nome):
    spoti_busca = sp.search(nome, limit=10, type='artist')
    return jsonify(spoti_busca['artists']['items'])


if __name__ == '__main__':
    app.run()
