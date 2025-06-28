"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <div className="flex p-4 items-center justify-around bg-secondary shadow-sm">
          <Link href={"/"}>
            <Image
              src={"/logo.svg"}
              alt="logo"
              width={160}
              height={100}
              className="cursor-pointer"
            />
          </Link>
          <ul className="hidden md:flex gap-6 text-xl">
            <Link
              href={"/dashboard"}
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            `}
            >
              Dashboard
            </Link>
            <Link
              href={"/"}
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer
		  
	  `}
            >
              Home
            </Link>
            <Link
              href={"/faq"}
              className="hover:text-primary hover:font-bold transition-all cursor-pointer"
            >
              FAQs
            </Link>
          </ul>
          <UserButton />
        </div>
      </div>
    </>
  );
}
