import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export interface DialogProps {
    text: string;
    buttons: {
        text: string;
        className?: string;
        click?: () => unknown
    }[];
}

function Dialog({ dialog }: { dialog: DialogProps | null }) {
    const { close } = useDialog();

    return (
        <TransitionGroup>
            {dialog &&
                <CSSTransition key='dialog' timeout={200}>
                    <div className='dialog'>
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
                    </div>
                </CSSTransition>
            }
        </TransitionGroup>
    )
}

const DialogContext = React.createContext<[
    DialogProps | null,
    (d: DialogProps | null) => unknown
]>([null, () => { }]);

export function useDialog() {
    const [, open] = useContext(DialogContext);
    const close = () => open(null);
    return { open, close };
}

export const Provider = DialogContext.Provider;

export default Dialog;