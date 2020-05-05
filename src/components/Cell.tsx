import React, { ReactNode, HTMLAttributes } from 'react';

const Cell = (props: { area: string, children?: ReactNode } & HTMLAttributes<HTMLDivElement>) => {
    const { children, className, area, style, ...other } = props;
    return (
        <div className={`${className ?? ''} ${area}`} style={{ gridArea: area, position: 'relative', ...style }} {...other}>
            {children}
        </div>
    );
}

export default Cell;