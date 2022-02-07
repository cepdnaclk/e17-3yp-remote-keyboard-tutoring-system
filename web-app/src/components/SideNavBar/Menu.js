import React from 'react';
import { motion } from 'framer-motion';

const Menu = (props) => {
    const renderMenuItems = React.Children.map(props.children, (child) => {
        return React.cloneElement(child, {});
    });

    return (
        <motion.div layout className="nav-list">
            {renderMenuItems}
        </motion.div>
    )
}

export default Menu;