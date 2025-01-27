import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <div>hello</div>
        <div>hello</div>
        <div>hello</div>
        <div>hello</div>
        <div>hello</div>
        <div>hello</div>
        <div>hello</div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
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
          Source Code →
        </a>
      </footer>
    </div>
  );
}
