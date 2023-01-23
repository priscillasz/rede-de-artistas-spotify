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

# importando itemgetter
from operator import itemgetter

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


def buscaGeneros(G):
    dictGeneros = {}

    for x in list(G):  # Itere cada nó do grafo...
        noCorrente = G.nodes[x]['genres']

        for i in noCorrente:
            if i in dictGeneros:
                dictGeneros[i] = dictGeneros[i] + 1
            else:
                dictGeneros[i] = 1

    print(dictGeneros)
    return dictGeneros


def buscaMenoresQtdArestas(G):
    dictLinks = {}
    print(list(G)[0])
    for x in list(G):  # Itere cada nó do grafo...
        # print(x)
        arestasNoCorrente = G.edges(x)

        dictLinks[x] = len(arestasNoCorrente)

    print(dictLinks)
    return dictLinks
    # Pegando item do body do request
    req_data = request.get_json()
    artista_escolhido = req_data['id']  # Pegando id do artista escolhido...

    # Buscando artistas relacionados do artista escolhido
    artist_features = sp.artist_related_artists(artista_escolhido)

    # Inicializando um grafo vazio
    G = nx.Graph()

    # Definindo um limite de popularidade para o artista ser adicionado ao grafo
    popularity_threshold = 65

    # Adicionando o artista desejado no grafo:
    # print(req_data)
    # G.add_node(req_data['name'], **
    # req_data, related_found=True)

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
        if len(G) == l or len(G) > 50:
            vrf = 1
            print('Finalizando.')

    print(artista_escolhido)
    return jsonify(nx.node_link_data(G))

# Nova rota (utilizando arestas com peso)


@app.route('/spotigraph/grafo2', methods=['POST'])
def criarGrafo2():
    # Pegando item do body do request
    req_data = request.get_json()
    artista_escolhido = req_data  # Pegando id do artista escolhido...

    # Inicializando um grafo vazio
    G = nx.Graph()

    # Definindo um limite de popularidade para o artista ser adicionado ao grafo
    popularity_threshold = 65

    print(artista_escolhido['genres'])
    # Adicionando o artista desejado no grafo:
    # print(req_data)
    G.add_node(artista_escolhido['name'], **
               artista_escolhido, related_found=False)

# Variável verificadora do loop, enquanto estiver 0, continue o loop
    vrf = 0

    while vrf == 0:
        l = len(G)  # Número de nós atual do Grafo

        for x in list(G):  # Itere cada nó do grafo...
            # Criando o array de generos do artista corrente
            artCorrGeneros = np.array(G.nodes[x]['genres'])

            # Precisaremos encontrar se procurou-se artistas relacionados ao artista do nó corrente
            # Caso não tenha sido procurado, busque-os e insira-os no nó a partir dos parâmetros definidos
            if G.nodes[x]['related_found'] == False:
                relateds = sp.artist_related_artists(
                    G.nodes[x]['id'])['artists']

                # Pegando somente o nome de cada um dos artistas relacionados recebidos pela API
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
                            # Validando se algum dos generos do artista principal se incluem nos generos do artista buscado
                            artBuscGeneros = np.array(rdict['genres'])

                            generosComum = np.intersect1d(
                                artCorrGeneros, artBuscGeneros)
                            # print(generosComum)

                            # Adicionando uma aresta entre o no X e o nó adicionado
                            G.add_edge(x, rname, genero=generosComum.tolist())

                            print('O grafo agora possui', len(G), 'nós.')

        # Se a qtd de nós não mudou ou o grafo está no limite definido de nós (ao menos 1001), quebre o loop
        if len(G) == l or len(G) > 100:
            vrf = 1
            print('Finalizando.')

    # nx.draw_networkx(G, with_labels=True, node_color=(.7, .8, .8), font_size=8)
    # plt.show()
    print("Imprimindo diametro")
    # print(nx.eccentricity(G, G.nodes["Alessia Cara"]))
    print(nx.all_pairs_shortest_path(G))
    # print(nx.diameter(G, nx.eccentricity(G, G.nodes["Taylor Swift"])))
    generosTop = buscaGeneros(G)
    arestas = buscaMenoresQtdArestas(G)
    return jsonify({
        # 'menorescaminhos': dict(nx.all_pairs_shortest_path(G)),
        # Retornando o grafo
        'grafo': nx.node_link_data(G),

        # Retornando o top 5 de mais generos no Grafo
        'top5MaisGen': dict(sorted(generosTop.items(), key=itemgetter(1), reverse=True)[:5]),

        # Retornando o top 5 de menos generos no Grafo
        'top5MenosGen': dict(sorted(generosTop.items(), key=itemgetter(1), reverse=False)[:5]),

        # Retornando o top 5 de nós com mais arestas no Grafo
        'top5MaisArestas': dict(sorted(arestas.items(), key=itemgetter(1), reverse=True)[:5]),

        # Retornando o top 5 de nós com menos arestas no Grafo
        'top5MenosArestas': dict(sorted(arestas.items(), key=itemgetter(1), reverse=False)[:5]), }
    )


@app.route('/spotigraph/<string:nome>', methods=['GET'])
# Ao receber um nome, busque e retorne os artistas cujo nome contenha...
def returnOne(nome):
    spoti_busca = sp.search(nome, limit=10, type='artist')
    return jsonify(spoti_busca['artists']['items'])


@app.route('/spotigraph/caminho/<string:nome>', methods=['GET'])
def buscaCaminho2(nomeArtista, genero, grafo):
    noInicial = grafo.nodes(nomeArtista)
    print("no busca caminho")
    print(noInicial)
    return


def buscaCaminho(genero, grafo):
    # Definindo primeiro nó do grafo
    listaGrafos = list(grafo)
    noInicial = grafo.nodes(listaGrafos[0])

    print(noInicial)

    # Declarando variável que receberá o último nó do grafo
    noFim = None

    # Variável que vai receber o número de nós do grafo (p/ loop reverso)
    tamGrafo = (grafo.number_of_nodes() - 1)

    # Buscando o último nó da lista de nós que tem o gênero selecionado
    while (tamGrafo > 0):
        nomeNo = listaGrafos[tamGrafo]
        noCorrente = grafo.nodes(nomeNo)
        if genero in noCorrente['genres']:
            noFim = nomeNo
            break

    # Se eu não encontrar esse nó, retorno nulo...
    if noFim == None:
        return None

    # Rodar o grafo até encontrar o maior menor caminho cujos nós possuam o genero escolhido na lista de generos. (a fazer...)
    return null


if __name__ == '__main__':
    app.run()
