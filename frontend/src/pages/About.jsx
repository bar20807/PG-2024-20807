import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

// Datos del equipo
const developers = [
  { name: 'Jessica Ortiz', role: '3D Modeler', image: '/static/images/Animator.jfif', linkedin: 'https://www.linkedin.com/in/jessica-pamela-ortiz-ixcot-197ab3245/' },
  { name: 'Cristian Laynez', role: 'Product Manager / Director', image: '/static/images/Product Manager.jfif', linkedin: 'http://www.linkedin.com/in/cr-lay' },
  { name: 'Isabel Solano (Michy)', role: 'UX/UI Designer and Artist', image: '/static/images/UXUI Designer.jfif', linkedin: 'https://www.linkedin.com/in/isabel-solano/' },
  { name: 'Jorge Pérez', role: 'NPC Programmer and IA Developer', image: '/static/images/josejorge.jfif', linkedin: 'https://www.linkedin.com/in/jorge-pérez-0bb4b4147/' },
  { name: 'Mariana David', role: 'Animator 3D', image: '/static/images/animator3d.jfif', linkedin: 'https://www.linkedin.com/in/mariana-david-a61013282/' },
  { name: 'Kenneth Galvez', role: 'Storyteller', image: '/static/images/storyteller.jfif', linkedin: 'https://www.linkedin.com/in/kenneth-galvez-49259b1a0/' },
  { name: 'Rodrigo Barrera', role: 'Web Developer', image: '/static/images/Web Developer.jfif', linkedin: 'https://www.linkedin.com/in/josé-rodrigo-barrera-garcía-8b17461a1/' }
];

// Datos de los productores musicales
const musicalProducers = [
  { name: 'Joshua Peren', role: 'Musical Producer', image: '/static/images/Joshua.jpeg', linkedin: '' },
  { name: 'Erick Porras', role: 'Musical Producer', image: '/static/images/Erick.jpeg', linkedin: '' },
  { name: 'Ricardo Cobar', role: 'Musical Producer', image: '/static/images/Ricardo.jpeg', linkedin: '' }
];

const TeamSection = ({ title, members, addMarginTop }) => {
  // Lógica condicional para determinar las columnas máximas
  const responsiveGridCols = members.length === 1
    ? 'grid-cols-1'
    : members.length === 2
    ? 'sm:grid-cols-2 lg:grid-cols-2'
    : members.length === 3
    ? 'sm:grid-cols-2 lg:grid-cols-3'
    : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <footer className={`${addMarginTop ? 'mt-12' : ''}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl md:text-2xl font-bold text-whiteTextPlatyfa mb-8">
          {title}
        </h2>
        <div
          className={`grid grid-cols-1 gap-8 justify-center ${responsiveGridCols}`}
        >
          {members.map((member, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-principalCardColor p-4 rounded-lg shadow-lg"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <h3 className="text-lg md:text-xl font-bold text-whiteTextPlatyfa">
                {member.name}
              </h3>
              <p className="text-sm md:text-lg text-whiteTextPlatyfa mb-2">
                {member.role}
              </p>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/static/images/linkedin_logo.png"
                    alt="LinkedIn Logo"
                    className="w-6 h-6"
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};



const About = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // Simula el tiempo de carga
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
          <p className="text-whiteTextPlatyfa text-xl mt-4">Loading team information...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-brownCardInformation min-h-screen">
      <div className="py-8 px-4 sm:px-6 md:px-8 lg:px-20">
        <div
          ref={ref}
          className={`flex flex-col md:flex-row items-stretch p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6 max-w-screen-xl mx-auto transition-opacity duration-500 ${inView ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <img
              src="/static/images/about_logo.png"
              alt="Company Team"
              className="object-cover w-full h-full rounded-lg min-h-[300px] lazyload"
              loading="lazy"
            />
          </div>

          <div className="w-full md:w-1/2 p-4 md:p-6 bg-principalCardColor bg-opacity-90 rounded-lg md:rounded-l-lg order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-whiteTextPlatyfa mb-4 bg-brownCardInformation text-center rounded-lg p-4 max-w-xs mx-auto opacity-70">
              Goldenfy Games
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-whiteTextPlatyfa text-center bg-brownCardInformation rounded-lg opacity-70 p-4 md:p-6 font-light">
              Goldenfy Games is a trailblazing video game development company that was established in November 2023. 
              We pride ourselves on our innovative approach to game development, constantly pushing the boundaries of 
              creativity and technology. Our games are more than just products; they are experiences that provide hours 
              of entertainment and joy. At Goldenfy Games, we believe in the power of play and strive to create immersive 
              worlds that captivate and inspire. Join us on this exciting journey as we continue to redefine the gaming landscape.
            </p>
          </div>
        </div>

        {/* Sección de desarrolladores */}
        <TeamSection title="Developers" members={developers} />

        {/* Sección de productores musicales con margen superior y centrada */}
        <TeamSection title="Musical Producers" members={musicalProducers} addMarginTop={true} />
      </div>
    </div>
  );
};

export default About;
