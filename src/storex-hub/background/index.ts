import io from 'socket.io-client'
import StorageManager from '@worldbrain/storex'
import { createStorexHubSocketClient } from '@worldbrain/storex-hub/lib/client'
import { StorexHubApi_v0 } from '@worldbrain/storex-hub/lib/public-api'

export class StorexHubBackground {
    private socket?: SocketIOClient.Socket
    private client?: StorexHubApi_v0

    constructor(
        private dependencies: {
            storageManager: StorageManager
        },
    ) {}

    async connect() {
        this.socket = io('http://localhost:3000')
        this.client = await createStorexHubSocketClient(this.socket, {
            callbacks: {
                handleRemoteOperation: async options => {
                    return {
                        result: await this.dependencies.storageManager.operation(
                            options.operation[0],
                            ...options.operation.slice(1),
                        ),
                    }
                },
            },
        })
        await this.client.registerApp({
            name: 'memex',
            remote: true,
            identify: true,
        })
    }
}
