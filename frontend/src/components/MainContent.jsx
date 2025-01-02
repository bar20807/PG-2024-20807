import { useInView } from 'react-intersection-observer';
import Button from './Button';
import Footer from './Footer';
import { useState, useEffect } from 'react';

const characters = [
  {
    name: 'Gaus',
    title: 'Main Character',
    gender: 'Male',
    age: 'Young Adult',
    species: 'Platypus',
    profession: 'Chef and Weapon Inventor',
    personality: 'Creative and inventive',
    image: '/static/images/18_01.png',
    backstory:
      'A talented chef and inventor, Gaus is the heart of the platypus rebellion. Using his creativity, he designs innovative tools to fight back against the invaders.',
  },
  {
    name: 'Jager',
    title: 'Boss Dingo',
    gender: 'Male',
    age: '30',
    species: 'Dingo',
    profession: 'Pirate Leader and Right Hand of the King',
    personality: 'Corrupt',
    image: '/static/images/Jaeger2.png',
    backstory:
      'Once a loyal servant to the king, Jager’s ambition drove him to become a corrupt pirate leader, enforcing tyranny over the lands.',
  },
];

const CharacterCard = ({ character }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-stretch p-4 md:p-6 max-w-screen-lg mx-auto rounded-lg shadow-lg transition-opacity duration-500 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Imagen del personaje con fondo */}
      <div
        className="w-full md:w-1/2 relative flex items-center justify-center rounded-lg"
        style={{
          backgroundImage: "url('/static/images/04_00.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={character.image}
          alt={`${character.name} Artwork`}
          className="object-contain w-4/5 h-auto z-10"
        />
      </div>

      {/* Información del personaje */}
      <div className="w-full md:w-1/2 p-4 md:p-6 bg-principalCardColor bg-opacity-90 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-whiteTextPlatyfa mb-4 bg-brownCardInformation text-center rounded-lg p-4 opacity-70">
          {character.name}
        </h2>
        <p className="text-sm md:text-lg lg:text-xl text-whiteTextPlatyfa bg-brownCardInformation rounded-lg opacity-70 p-4 md:p-6 font-light leading-relaxed">
          <strong>Title:</strong> {character.title}
          <br />
          <strong>Gender:</strong> {character.gender}
          <br />
          <strong>Age:</strong> {character.age}
          <br />
          <strong>Species:</strong> {character.species}
          <br />
          <strong>Profession:</strong> {character.profession}
          <br />
          <strong>Personality:</strong> {character.personality}
          <br />
          <strong>Backstory:</strong> {character.backstory}
        </p>
      </div>
    </div>
  );
};



const MainContent = () => {
  const { ref: sectionRef1, inView: inView1 } = useInView({ triggerOnce: true });
  const { ref: sectionRef3, inView: inView3 } = useInView({ triggerOnce: true });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // Simular carga
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
        <div className="flex flex-col items-center">
          <img
            src="/static/images/logo_V1.png"
            alt="Loading Logo"
            className="w-32 h-32 animate-spin"
          />
          <p className="text-whiteTextPlatyfa text-xl mt-4">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brownCardInformation min-h-screen flex flex-col">
      {/* Imagen de fondo */}
      <div className="relative text-center border-b-4 border-principalCardColor">
        <img
          src="/static/images/MainBackGroundV1.jpg"
          alt="Main Image"
          className="w-full h-screen object-cover"
        />
        <div className="absolute bottom-5 md:bottom-10 lg:bottom-15 w-full flex flex-col items-center z-10">
          <h2 className="text-xl md:text-2xl font-bold text-whiteTextPlatyfa">Play now on Steam</h2>
          <Button
            label="Steam"
            className="mt-2 md:mt-4 flex items-center justify-center px-4 py-2 md:px-6 md:py-2 rounded-md bg-orangePlatyfa w-11/12 max-w-[270px] h-[45px] md:h-[50px]"
            onClick={() => window.open('https://store.steampowered.com/', '_blank')}
          >
            <img
              src="/static/images/steam-icon.png"
              alt="Steam Icon"
              className="h-6 w-auto md:h-8 md:w-8 lg:h-10 lg:w-10"
            />
          </Button>
        </div>
      </div>

      {/* Sinopsis */}
      <div
        ref={sectionRef1}
        className={`flex flex-col items-center py-12 px-6 transition-opacity duration-700 ${
          inView1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-whiteTextPlatyfa mb-6">Game Synopsis</h2>
        <div
          className="relative w-full max-w-4xl bg-center bg-cover rounded-lg shadow-lg p-8 overflow-hidden"
          style={{ backgroundImage: "url('/static/images/04_06.png')" }}
        >
          <p className="text-lg md:text-xl text-whiteTextPlatyfa leading-relaxed z-10 relative text-center">
            In a world where platypuses lived in peace and had mastered the art of cooking, their predators decide to invade them and force them to cook for them. 
            One of these platypuses, Gauss, loves both cooking and his ingenious inventions. One day, one of these inventions doesn't go as planned, 
            and he ends up involved in a plan to carry out the platypus revolution.
          </p>
        </div>
      </div>

      {/* Sección de personajes en dos columnas */}
      <div
        ref={sectionRef3}
        className={`py-12 px-6 transition-opacity duration-700 ${
          inView3 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-whiteTextPlatyfa mb-6 text-center">Characters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {characters.map((character) => (
            <CharacterCard key={character.name} character={character} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainContent;


