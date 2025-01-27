import Image from "next/image";
import Nav from "@/components/custom/nav";
import { DataTableDemo } from "@/components/custom/test-table";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Nav />
      <main className="border-0 border-black p-2 w-full">
        <DataTableDemo />
        {/* <div>
          TESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTING
        </div> */}
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
