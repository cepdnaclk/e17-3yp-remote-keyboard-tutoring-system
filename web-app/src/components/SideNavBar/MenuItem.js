import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({itemName, icon, selected, to}) => {
    return (
        <div className='nav-item' style={selected ? {borderRight: `6px solid var(--blue)`} : null}>
            <Link to={to} style={selected ? {color: `var(--blue)`, fontWeight: 600} : null}>
                <img alt='' src={icon} className="nav-icon" style={selected ? {filter: `invert(90%) sepia(24%) saturate(6168%) hue-rotate(188deg) brightness(93%) contrast(106%)`} : null} />
                <span className="nav-link">{itemName}</span>
            </Link>
            <span className="tooltip">{itemName}</span>
        </div>
    )
}

MenuItem.defaultProps = {
    selected: false,
}

export default MenuItem;