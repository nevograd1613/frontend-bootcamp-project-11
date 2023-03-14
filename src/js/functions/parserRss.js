const parserRss = (response) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(response.data.contents, 'application/xml');

  const errorNode = document.querySelector('parsererror');
  if (errorNode) {
    const error = new Error();
    error.name = 'ParsingError';
    throw error;
  }

  const feed = {
    title: document.querySelector('channel title').textContent,
    description: document.querySelector('channel description').textContent,
  };

  const topics = Array.from(document.querySelectorAll('item')).map((item) => {
    const top = {
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    };

    return top;
  });

  return { feed, topics };
};

export default parserRss;
