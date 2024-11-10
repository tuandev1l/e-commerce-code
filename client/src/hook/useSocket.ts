import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket =
  (): // options?: Partial<ManagerOptions & SocketOptions> | undefined
  Socket => {
    const url = 'http://localhost:3000';
    // const { current: socket } = useRef(io(url, options));
    const { current: socket } = useRef(io(url));

    useEffect(() => {
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }, [socket]);

    return socket;
  };
