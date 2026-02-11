import React, { type PropsWithChildren } from 'react';
import type { documentCardInterface } from '@/interface';

/**
 * Document card used in the home/dashboard page to display documents and 
 * their count
 * @param className Tailwind classes in the string format.
 * @param children Children to pass into the component, any svgs or text.
 * @param title Title to display. (Ex: Total, Active and Processing Documents)
 * @param value Integer value to display the total count.
 * @returns 
 */
export const DocumentCard: React.FC<PropsWithChildren & documentCardInterface> = ({ className, children, title, value }) => {
    return <div className={`border rounded-xl w-full h-20 flex justify-between items-center p-4 bg-white hover:scale-99 transform transition-transform duration-200 ${className}`}>
        <span className="flex flex-col">
            <span className="capitalize">{title}</span>
            <span className='font-bold text-xl'>{value}</span>
        </span>
        <span>
            {children}
        </span>
    </div>
}