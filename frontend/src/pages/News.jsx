import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Linkify from 'react-linkify';

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // Estado para manejar el orden

  useEffect(() => {
    fetchNews(sortOrder); // Cargar noticias según el orden inicial
  }, [sortOrder]);

  const fetchNews = async (order) => {
    try {
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/news?order=${order}`);
      if (!response.ok) {
        throw new Error('Error fetching news');
      }
      const data = await response.json();
      if (data.success) {
        setNewsData(data.news);
      } else {
        console.error('No news found:', data.message);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  if (!newsData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
        <div className="flex flex-col items-center">
          <img
            src="/static/images/logo_V1.png"
            alt="Loading Logo"
            className="w-32 h-32 animate-spin"
          />
          <p className="text-whiteTextPlatyfa text-xl mt-4">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brownCardInformation min-h-screen">
      <div className="py-8 px-4 sm:px-6 md:px-8 lg:px-20">
        {/* Controles de filtro */}
        <div className="flex justify-end mb-6">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 bg-principalCardColor text-whiteTextPlatyfa rounded-md"
          >
            <option value="desc">Most Recent</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {newsData.map((newsItem) => (
          <NewsCard key={newsItem.id} newsItem={newsItem} />
        ))}
      </div>
    </div>
  );
};

const NewsCard = ({ newsItem }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const formattedDate = new Date(newsItem.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-stretch p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6 max-w-screen-xl mx-auto mb-8 transition-opacity duration-500 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="w-full md:w-1/2 order-1 md:order-2">
        <img
          src={newsItem.image}
          alt={`News ${newsItem.title}`}
          className="object-cover w-full h-full rounded-lg min-h-[300px] lazyload"
          loading="lazy"
        />
      </div>

      <div className="w-full md:w-1/2 p-4 md:p-6 bg-principalCardColor bg-opacity-90 rounded-lg md:rounded-l-lg order-2 md:order-1">
        <div className="bg-brownCardInformation p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <img
              src={newsItem.profile_image || '/static/images/user_icon.png'}
              alt="Admin Avatar"
              className="w-12 h-12 rounded-full mr-4 ring-4 ring-principalCardColor"
            />
            <div>
              <p className="text-sm md:text-lg lg:text-xl text-whiteTextPlatyfa font-light">
                {newsItem.author}
              </p>
              <p className="text-sm md:text-lg lg:text-xl text-whiteTextPlatyfa">
                Posted: {formattedDate}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-base md:text-lg font-bold text-whiteTextPlatyfa mb-4 bg-brownCardInformation text-center rounded-lg p-4 max-w-xs mx-auto opacity-70">
          {newsItem.title}
        </h2>

        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a
              href={decoratedHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
              key={key}
            >
              {decoratedText}
            </a>
          )}
        >
          <p className="text-sm md:text-lg lg:text-xl text-whiteTextPlatyfa text-center bg-brownCardInformation rounded-lg opacity-70 p-4 md:p-6 font-light">
            {newsItem.content}
          </p>
        </Linkify>
      </div>
    </div>
  );
};

export default News;
