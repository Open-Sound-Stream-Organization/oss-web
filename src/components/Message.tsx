import { faBomb, faCheck, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { setInterval } from 'timers';

interface MessageProps {
    type: 'info' | 'success' | 'error' | 'warning';
    text: string;
}

export type IMessage = MessageProps & { date: Date };

/**
 * The message sidebar
 * Currently not working because of an React issue with transitions
 */
const Messages = () => {
    const [messages] = useContext(MessageContext);
    const { add, close } = useMessages();

    return (
        <TransitionGroup className='messages'>
            {messages.slice(0, 4).map((message, i) =>
                <CSSTransition key={+message.date} timeout={400}>
                    <Message close={() => close(i)} {...message} />
                </CSSTransition>
            )}
        </TransitionGroup>
    )
}

/**
 * 
 * @param param0.text The text to display
 * @param param0.type The message type, for example 'info' or 'error'
 * @param param0.close The function to clear the message
 */
const Message = ({ text, type, close }: MessageProps & { close: () => void }) => {

    const icon = (() => {
        switch (type) {
            case 'error': return faBomb;
            case 'info': return faInfoCircle;
            case 'success': return faCheck;
            case 'warning': return faExclamationTriangle;
        }
    })();

    return (
        <div className={`message ${type}`} onClick={close}>
            <span>{text}</span>
            <Icon {...{ icon }} />
        </div>
    )
}

const MessageContext = React.createContext<[
    IMessage[],
    Dispatch<SetStateAction<IMessage[]>>,
]>([[], () => { }]);

/**
 * React hook to manage messages
 * 
 * @returns { add, clear, close } Functions to add or close a specific message or clear all
 */
export const useMessages = () => {
    const [messages, setMessages] = useContext(MessageContext);

    useEffect(() => {
        const i = setInterval(() => {
            if (messages.length > 0) {
                const now = new Date().getTime();
                setMessages(m => m.filter(({ date }) => now - date.getTime() < 4000))
            }
        }, 1000);
        return () => clearTimeout(i);
    }, [])

    const add = (m: MessageProps) => setMessages(old => [...old.slice(-4), { ...m, date: new Date() }]);
    const clear = () => setMessages([]);
    const close = (index: number) => setMessages(old => {
        const n = [...old];
        n.splice(index, 1);
        return n;
    })

    return { add, clear, close };
}

export const Provider = MessageContext.Provider;

export default Messages;