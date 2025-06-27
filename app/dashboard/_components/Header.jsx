"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, []);
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
                ${path === "/dashboard" ? "text-primary font-bold" : ""}
            `}
            >
              Dashboard
            </Link>
            <Link
              href={"/"}
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer
		  ${path === "/" ? "text-primary font-bold" : ""}
	  `}
            >
              Home
            </Link>
            <Link
              href={"/faq"}
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path === "/faq" ? "text-primary font-bold" : ""}
            `}
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
