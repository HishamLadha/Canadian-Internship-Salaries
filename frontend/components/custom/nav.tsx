'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Search from './search';
import { Button } from '../ui/button';
import { Plus, Menu, X } from "lucide-react";
import { Separator } from '../ui/separator';

const Nav: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
        <nav className='mt-2 mb-2 mx-4 sm:mx-6'>
            <ul className='flex flex-row justify-between items-center'>
                <li>
                    <ul className='flex flex-row items-center'>
                        <li className='hover:opacity-40'>
                            <a className='flex flex-row sm:gap-2 gap-1' href="/">
                                <Image src="/Logo1.svg" alt="Logo" width={32} height={32} />
                            
                                <h1 className='font-semibold sm:text-[20px] hidden sm:block'>Scoper</h1>
                            </a>
                        </li>
                        <li className='w-full sm:ml-8 ml-2'>
                            <Search />
                        </li>
                    </ul>
                </li>
                <li className='relative'>
                    {/* Hamburger Menu Button (Visible on Small Screens) */}
                    <button onClick={toggleMenu} className="sm:hidden p-2">
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Add Salary Button (Visible on Larger Screens) */}
                    <div className="hidden sm:block">
                        <a href="/submit">
                            <Button>
                                <span className="inline-flex items-center">
                                    <Plus size={16} className="mr-2" /> Add Salary
                                </span>
                            </Button>
                        </a>
                    </div>

                    {/* Hamburger Menu Card (Visible on Small Screens) */}
                    {menuOpen && (
                        <div className="sm:hidden absolute top-12 right-0 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-50">
                            <a href="/submit">
                                <Button className="w-full">
                                    <span className="inline-flex items-center">
                                        <Plus size={16} className="mr-2" /> Add Salary
                                    </span>
                                </Button>
                            </a>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
        <Separator />
        </>
    );
};

export default Nav;