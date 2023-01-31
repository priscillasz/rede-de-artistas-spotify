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


# Função que ordena os gêneros por presença em cada nó
def buscaGeneros(G):
    dictGeneros = {}

    for x in list(G):  # Itere cada nó do grafo...
        noCorrente = G.nodes[x]['genres']

        for i in noCorrente:
            if i in dictGeneros:
                dictGeneros[i] = dictGeneros[i] + 1
            else:
                dictGeneros[i] = 1

    # print(dictGeneros)
    return dictGeneros

# Função que ordena os nós por arestas


def buscaMenoresQtdArestas(G):
    dictLinks = {}
    # print(list(G)[0])
    for x in list(G):  # Itere cada nó do grafo...
        # print(x)
        arestasNoCorrente = G.edges(x)

        dictLinks[x] = len(arestasNoCorrente)

    # print(dictLinks)
    return dictLinks

# Nova rota com nova estrutura


def criaNos(artista_escolhido):
    # Inicializando um grafo vazio
    G = nx.Graph()

    # Definindo um limite de popularidade para o artista ser adicionado ao grafo
    popularity_threshold = 65

    # Adicionar o artista escolhido no grafo
    G.add_node(artista_escolhido['name'], **{'id': artista_escolhido['id'],
                                             'genres': artista_escolhido['genres']}, related_found=False)

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
                            G.add_node(rname, **{'id': rdict['id'], 'genres': rdict['genres']},
                                       related_found=False)  # Adicionando o novo nó e marcando o seu relacionado como falso
                            clear_output(wait=True)

                            # LIGANDO NÓS - RELAÇÃO API
                            G.add_edge(x, rname, genero=[], weigth=0)
                            print('O grafo agora possui', len(G), 'nós.')

        # Se a qtd de nós não mudou ou o grafo está no limite definido de nós (ao menos 1001), quebre o loop
        if len(G) == l or len(G) > 1000:
            vrf = 1
            print('Finalizando.')

    return G


def criaArestas(grafo):
    for node in grafo.nodes():
        no = grafo.nodes[node]['genres']
        # Validando se algum dos generos do artista principal se incluem nos generos do artista buscado
        artCorrGeneros = np.array(no)

        for node2 in grafo.nodes():
            # Se for o mesmo nó, pule
            if node == node2:
                continue

            # Buscando os gêneros do 2º nó
            no2 = grafo.nodes[node2]['genres']
            artBuscGeneros = np.array(no2)

            # Buscando os generos em comum dos 2 nós
            generosComum = np.intersect1d(
                artCorrGeneros, artBuscGeneros)

            # Se houver mais de um genero no primeiro nó e a quantidade de generos em comum
            if len(no) > 1 and len(generosComum) < 2:
                continue

            if (len(generosComum) < 1):
                continue

            # Se já há aresta entre os nós, pule pro próximo
            if grafo.has_edge(node, node2) == True:
                print(node + " já se liga com " + node2)
                grafo[node][node2]['genero'] = generosComum.tolist()
                grafo[node][node2]['weigth'] = len(generosComum.tolist())
            else:
                print(node + " vai se ligar com " + node2)
                # Adicionando uma aresta entre o no X e o nó adicionado
                grafo.add_edge(node, node2, genero=generosComum.tolist(
                ), peso=len(generosComum.tolist()))

    print("adicionei arestas")
    return grafo

# Função que visualiza grafo no Python...


def drawTheGraph(graph):
    fig = plt.figure(figsize=(10, 10))

    degree_sequence = sorted((d for n, d in graph.degree()), reverse=True)

    axgrid = fig.add_gridspec(5, 4)

    ax0 = fig.add_subplot(axgrid[0:3, :])
    # Gcc = graph.subgraph(sorted(nx.connected_components(G), key=len, reverse=True)[0])
    pos = nx.spring_layout(graph, seed=10396953)
    nx.draw_networkx_nodes(
        graph, pos, ax=ax0, node_size=20, node_color="#5e0a1e")
    nx.draw_networkx_edges(graph, pos, ax=ax0, alpha=0.4,
                           arrowstyle='->', arrowsize=5)
    ax0.set_title("Componentes conectados do grafo")
    ax0.set_axis_off()

    ax1 = fig.add_subplot(axgrid[3:, :2])
    ax1.plot(degree_sequence, "b-", marker="o")
    ax1.set_title("Plot - Rank de graus")
    ax1.set_ylabel("Grau")
    ax1.set_xlabel("Rank")

    ax2 = fig.add_subplot(axgrid[3:, 2:])
    ax2.bar(*np.unique(degree_sequence, return_counts=True))
    ax2.set_title("Histograma - Grau")
    ax2.set_xlabel("Grau")
    ax2.set_ylabel("Nº de nos")

    fig.tight_layout()

    # plt.show()
    plt.savefig('grafo.png')
    return

# Função que cria a imagem do grafo e salva-a (vrf implementação)


def criaImgGrafo(grafo):
    nx.draw(grafo, with_labels=True)
    plt.savefig("grafo.png")
    return

# Retorna maiores e menores (Tops)


def retornaTops(lista):
    # Declarando variáveis
    topMenos = {}
    topMais = {}
    vrf = False
    i = 0
    ultimoValor = 0

    # Ordenando a lista em ordem decrescente
    listaOrdenada = sorted(lista.items(), key=itemgetter(1), reverse=True)

    # TOP MAIS
    for elemento in listaOrdenada:
        if i < 5:
            topMais[elemento[0]] = elemento[1]
            i += 1

        # Se eu chegar na qtd mínima definida (5 elementos), pego o valor e ponho na variavel ultimoValor
        if i >= 5 and vrf != True:
            if i == 5:
                ultimoValor = elemento[1]
                i += 1

            elif i > 5 and vrf != True:
                if (elemento[1] == ultimoValor):
                    topMais[elemento[0]] = elemento[1]
                else:
                    vrf = True

    # Limpando variáveis para o top Menos
    i = 0
    ultimoValor = 0
    vrf = False

    # Ordenando a lista em ordem crescente
    listaOrdenada = sorted(lista.items(), key=itemgetter(1), reverse=False)

    # TOP MENOS
    for elemento in listaOrdenada:
        if i < 5:
            topMenos[elemento[0]] = elemento[1]
            i += 1

        # Se eu chegar na qtd máxima definida (5 elementos), pego o valor e ponho na variavel ultimoValor
        if i >= 5 and vrf != True:
            if i == 5:
                ultimoValor = elemento[1]
                i += 1

            elif i > 5 and vrf != True:
                if (elemento[1] == ultimoValor):
                    topMenos[elemento[0]] = elemento[1]
                else:
                    vrf = True

    return {'topMais': topMais, 'topMenos': topMenos}


@app.route('/spotigraph/grafo3', methods=['POST'])
def criarGrafo3():
    # Pegando item do body do request
    req_data = request.get_json()
    nos = criaNos(req_data)
    grafo = criaArestas(nos)

    # drawTheGraph(grafo)
    # criaImgGrafo(grafo)
    # print("Imprimindo diametro")
    # print(nx.eccentricity(G, G.nodes["Alessia Cara"]))
    # print(nx.all_pairs_shortest_path(G))
    # print(nx.diameter(G, nx.eccentricity(G, G.nodes["Taylor Swift"])))
    generosTop = buscaGeneros(grafo)
    centralidade_grau = nx.degree_centrality(grafo)
    topCentralidadeGrau = retornaTops(centralidade_grau)
    topGeneros = retornaTops(generosTop)
    excentricidade = nx.eccentricity(grafo)
    grafo_json = nx.node_link_data(grafo)

    return jsonify({
        # Retornando o grafo
        'grafo': {'links': grafo_json['links'], 'nodes': grafo_json['nodes'], },
        'qtdNos': grafo.number_of_nodes(),
        'qtdArestas': grafo.number_of_edges(),

        'conjuntosDominantes': list(nx.dominating_set(grafo)),
        # * Diametro: a maior excentricidade dentro de um grafo;
        'diametro': nx.diameter(grafo, excentricidade),

        # * Periferia: conjunto de todos os nós cujo a excentricidade é igual ao diâmetro
        'periferia': list(nx.periphery(grafo, excentricidade)),

        # * Raio: a menor excentricidade dentro de um grafo;
        'raio': nx.radius(grafo, excentricidade),

        # * Centro: conjunto de nós que sua excentricidade é igual ao raio
        'centro': list(nx.center(grafo, excentricidade)),

        # * Assortatividade - métrica utilizada para quantificar a tendência de nós individuais se conectarem a outros nós semelhantes um grafo.
        'assortatividade': nx.degree_assortativity_coefficient(grafo),
        # taxa que um artista se conecte com outro artista com muitas relações e generos em comum

        # Retornando o top 5 de mais generos no Grafo
        'top5MaisGen': topGeneros['topMais'],

        # Retornando o top 5 de menos generos no Grafo
        'top5MenosGen': topGeneros['topMenos'],

        'topMaisCentrGrau': topCentralidadeGrau['topMais'],
        'topMenosCentrGrau': topCentralidadeGrau['topMenos'],
    })


@app.route('/spotigraph/<string:nome>', methods=['GET'])
# Ao receber um nome, busque e retorne os artistas cujo nome contenha...
def returnOne(nome):
    spoti_busca = sp.search(nome, limit=10, type='artist')
    return jsonify(spoti_busca['artists']['items'])


if __name__ == '__main__':
    app.run()
