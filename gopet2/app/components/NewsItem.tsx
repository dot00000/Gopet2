
type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
};

const NewsItem = ({ article }: { article: Article }) => {
  const { title, description, url, urlToImage, publishedAt } = article;
  return (
    <div className="flex justify-center items-center mb-10">
      <div className="flex flex-col bg-white rounded-3xl w-[90%] md:w-[60%] overflow-hidden shadow-sm">
        {urlToImage && (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img
              src={urlToImage}
              alt="thumbnail"
              className="w-full h-[200px] object-cover"
            />
          </a>
        )}
        <div className="flex flex-col p-6 space-y-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold hover:underline"
          >
            {title}
          </a>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
