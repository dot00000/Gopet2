
type Article = {
  title: string;
  description: string;
  link: string;
  image_url: string;
  pubDate: string;
};

const NewsItem = ({ article }: { article: Article }) => {
  const { title, description, link, image_url, pubDate } = article;
  return (
    <div className="flex justify-center items-center mb-10">
      <div className="flex flex-col bg-white rounded-3xl w-[90%] md:w-[60%] overflow-hidden shadow-sm">
        {image_url && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <div className="relative w-full h-[200px]">
              <img
                src={image_url}
                alt="이미지 없음"
                className="w-full h-full object-cover"
                // onError={(e) =>
                //   (e.currentTarget.parentElement!.style.display = "none")
                // }
              />
            </div>
          </a>
        )}
        <div className="flex flex-col p-6 space-y-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold hover:underline"
          >
            {title}
          </a>
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
