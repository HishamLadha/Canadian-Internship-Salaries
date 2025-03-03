import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="flex gap-6 flex-wrap items-center justify-center mt-auto mb-5">
      <a
        className="flex items-center gap-2 underline hover:underline-offset-4 hover:opacity-50"
        href="https://github.com/HishamLadha/Canadian-Internship-Salaries"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="./github-logo.svg"
          alt="Github Logo"
          width={16}
          height={16}
        />
        Source Code 
      </a>
      <a
        className="flex items-center gap-2 underline hover:underline-offset-4 hover:opacity-50"
        href="/about"
      >
        
        About
      </a>
      </footer>
  )
}

export default Footer