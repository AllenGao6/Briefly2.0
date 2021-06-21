import os

from os import path
from wordcloud import WordCloud

d = path.dirname(__file__) if "__file__" in locals() else os.getcwd()

text = open(path.join(d, 'summarization.txt')).read()

wordcloud = WordCloud().generate(text)

import matplotlib.pyplot as plt

plt.figure()
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
plt.show()
plt.savefig("summarization_example1.jpg")