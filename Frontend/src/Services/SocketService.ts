import { Socket, io } from "socket.io-client";

class SocketService {
    private socket: Socket;

    public get socketId():string{
        return this.socket.id;
    }

    public connect(callback: (message: string) => void): void {

        // Connect:
        this.socket = io("http://localhost:4000");

        // Listen to my id:
        this.socket.on("my-id", (id: string) => {this.socket.id = id;});

        // Listen to messages;
        this.socket.on("message", (message: string) => {callback(message);});
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

}

export const socketService = new SocketService();