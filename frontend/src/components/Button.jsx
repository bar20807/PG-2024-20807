const Button = ({ label, onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={`${className} `}
    >
      <span className="text-whiteTextPlatyfa font-bold text-2xl px-6">{label}</span>
      {children}
    </button>
  );
};

export default Button;
