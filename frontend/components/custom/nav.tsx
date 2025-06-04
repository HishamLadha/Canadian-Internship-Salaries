'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Search from './search';
import { Button } from '../ui/button';
import { Plus, Menu, X, BarChart3 } from "lucide-react";

const Nav: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 mx-4 sm:mx-6 mt-2 mb-4 rounded-xl shadow-sm'>
            <div className='px-4 sm:px-6 py-3'>
                <ul className='flex flex-row justify-between items-center'>
                    <li>
                        <ul className='flex flex-row items-center gap-6'>
                            <li className='hover:opacity-70 transition-opacity'>
                                <a className='flex flex-row items-center gap-2' href="/">
                                    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                    <h1 className='font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block'>
                                        Scoper
                                    </h1>
                                </a>
                            </li>
                            <li className='flex-1 max-w-md'>
                                <Search />
                            </li>
                        </ul>
                    </li>
                    <li className='relative'>
                        {/* Hamburger Menu Button (Visible on Small Screens) */}
                        <button 
                            onClick={toggleMenu} 
                            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Add Salary Button (Visible on Larger Screens) */}
                        <div className="hidden sm:block">
                            <a href="/submit">
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                                    <span className="inline-flex items-center">
                                        <Plus size={16} className="mr-2" /> 
                                        Add Salary
                                    </span>
                                </Button>
                            </a>
                        </div>

                        {/* Hamburger Menu Card (Visible on Small Screens) */}
                        {menuOpen && (
                            <div className="sm:hidden absolute top-12 right-0 bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50 min-w-[200px]">
                                <a href="/submit">
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                        <span className="inline-flex items-center">
                                            <Plus size={16} className="mr-2" /> 
                                            Add Salary
                                        </span>
                                    </Button>
                                </a>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Nav;