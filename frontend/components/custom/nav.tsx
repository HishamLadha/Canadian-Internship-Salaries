import React from 'react';

const Nav: React.FC = () => {
    return (
        <nav>
            <ul className='flex flex-row gap-6 underline'>
                <li className='hover:opacity-20'><a href="/">Home</a></li>
                <li className='hover:opacity-20'><a href="/submit">Submit</a></li>
            </ul>
        </nav>
    );
};

export default Nav;