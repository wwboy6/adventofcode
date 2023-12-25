# ref: https://www.reddit.com/r/adventofcode/comments/18qbsxs/comment/keudqq3/
import re
import numpy as np
import networkx as nx

node_tuples = [(nodes[0], node) for line in open('./input.txt').read().splitlines() for nodes in [re.findall('[a-z]+', line)] for node in nodes[1:]]
g = nx.Graph() 
g.add_edges_from(list(node_tuples)) 
g.remove_edges_from(nx.minimum_edge_cut(g)) 
print(np.product([len(gi) for gi in nx.connected_components(g)]))