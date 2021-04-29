import './styles/style.css'

const Header = ({
  match: {
    params: { route },
  },
}) => {
  return (
      <div className="header">
        <h1 className="header-title">Active Games</h1>
          <div className="header-underline">

          </div>
      </div>
  );
};

export default Header;
