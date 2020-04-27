import React, { useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export interface DialogProps {
    text: string;
    buttons: {
        text: string;
        className?: string;
        click?: () => unknown
    }[];
}

export function GenericDialog({ dialog }: { dialog: DialogProps }) {
    const { close } = useDialog();

    return (
        <>
            <p>{dialog.text}</p>
            <ul>
                {dialog.buttons.map(({ text, className, click }, i) =>
                    <button key={i} onClick={() => {
                        if (click) click();
                        close();
                    }} {...{ className }}>
                        {text}
                    </button>
                )}
            </ul>
        </>
    )
}

function Dialog({ children }: { children: JSX.Element | null }) {
    const { close } = useDialog();

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if(e.keyCode === 27) close();
        }
        window.addEventListener('keydown', listener);
        return () => window.removeEventListener('keydown', listener);
    })

    return (
        <>
            {children && <div onClick={close} className='curtain' />}
            <TransitionGroup>
                {children &&
                    <CSSTransition key='dialog' timeout={200}>
                        <div className='dialog'>
                            {children}
                        </div>
                    </CSSTransition>
                }
            </TransitionGroup>
        </>
    )
}

const DialogContext = React.createContext<[
    JSX.Element | null,
    (d: JSX.Element | null) => void
]>([null, () => { }]);

export function useDialog() {
    const [, open] = useContext(DialogContext);
    const close = () => open(null);
    return { open, close };
}

export const Provider = DialogContext.Provider;

export default Dialog;