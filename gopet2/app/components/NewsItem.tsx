
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
    <div className="flex flex-col justify-center items-center">
      <div
        className="flex justify-center items-center bg-gray-300 mb-1 rounded-3xl mb-10"
        style={{ width: "70%", height: "250px", backgroundColor: "#f3f4f6"}}
      >
        {urlToImage && (
          <div className="flex justify-center items-center ml-5">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img style={{ minWidth: "200px", height: "180px", marginLeft: "10px"}} src={urlToImage} alt="thumbnail" />
            </a>
          </div>
        )}
        <div className="mr-10">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl ml-10 mb-10"
          >
            {title}
          </a>
          <p className="ml-10">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
