import React, { ReactNode, HTMLAttributes } from 'react';

function Cell(props: { area: string, children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    const { children, className, area, ...other } = props;
    return (
        <div className={`${className ?? ''} ${area}`} style={{ gridArea: area, position: 'relative' }} {...other}>
            {children}
        </div>
    );
}

export default Cell;