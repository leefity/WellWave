"use client"; // Add this line to make the component client-side

import React from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname

const menuOption = [
    {
        id: 1,
        name: 'Home',
        path: '/dashboard'
    },
    {
        id: 2,
        name: 'History',
        path: '/dashboard/history'
    },
    {
        id: 3,
        name: 'Agents',
        path: '/dashboard/agents'
    }
];

function AppHeader() {
    const pathname = usePathname();

    const logoHref = pathname === '/dashboard' ? '/' : '/dashboard';

    return (
        <div className='flex items-center justify-between p-4 shadow px-5 md:px-10 lg:px-20'>
            <Link href={logoHref}>
                <Image src={'/logo.png'} alt="App Logo" width={100} height={180} />
            </Link>

            <div className='hidden md:flex gap-x-16 items-center'>
                {menuOption.map((option, index) => (
                    <div key={index}>
                        <Link href={option.path}>
                            <h2 className='hover:font-bold cursor-pointer transition-all'>{option.name}</h2>
                        </Link>
                    </div>
                ))}
            </div>
            <UserButton />
        </div>
    );
}

export default AppHeader;