import React from 'react';
import Image from 'next/image';
import Search from './search';

const Nav: React.FC = () => {
    return (
        <nav>
            <ul className='flex flex-row gap-6 items-center'>
                <li className='hover:opacity-20 underline'><a href="/">
                    <Image src="/github-logo.svg" alt="Logo" width={32} height={32} />
                </a></li>
                <li>
                    <Search />
                </li>
                <li className='hover:opacity-20 underline'><a href="/submit">Submit</a></li>
            </ul>
        </nav>
    );
};

export default Nav;