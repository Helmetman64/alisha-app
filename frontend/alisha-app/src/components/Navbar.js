import logo from '../assets/asglogo2.png';
import { Link, useResolvedPath, useMatch } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="nav">
            <Link to ="/">
                <img src={logo} alt="ASGL" className="logo" />
            </Link>
            <ul>
                <CustomLink to="/stock">Stock</CustomLink>
                <CustomLink to="/history">History</CustomLink>
            </ul>
        </nav>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  
    return (
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    )
  }