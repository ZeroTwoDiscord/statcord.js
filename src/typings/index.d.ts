declare module "@zerotwobot/statcord.js" {
    // Import modules
    import * as Discord from "discord.js";
    import * as Cluster from "discord-hybrid-sharding";
    import { EventEmitter } from "events";

    // Create options
    interface BaseClientOptions {
        key: string;
        postCpuStatistics?: boolean;
        postMemStatistics?: boolean;
        postNetworkStatistics?: boolean;
        debug?: {
            enabled: boolean;
            outfile?: string;
        }
    }

    // Cluster client options
    interface ClusterClientOptions extends BaseClientOptions {
        manager: Cluster.Manager;
        autopost?: boolean;
    }

    interface ClientOptions extends BaseClientOptions {
        client: Discord.Client;
    }

    // Create client typings
    class BaseClient extends EventEmitter {
        private autoposting: boolean;

        private baseApiUrl: string;
        private key: string;
        private manager: Cluster.Manager;

        private v11: boolean;
        private v12: boolean;
        private activeUsers: string[];
        private commandsRun: number;
        private used_bytes: number;
        private popularCommands: [
            {
            name: string;
            count: number;
            }
        ];

        private postCpuStatistics: boolean;
        private postMemStatistics: boolean;
        private postNetworkStatistics: boolean;

        public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
        public once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
        public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;

        private debug(info: string, type: string): void;
    }

    export class ClusterClient extends BaseClient {
        constructor(options: ClusterClientOptions);

        private customFields: Map<1 | 2, (manager: Cluster.Manager) => Promise<string>>;

        public static post(client: Discord.Client): void;
        public static postCommand(command_name: string, author_id: string, client: Discord.Client): void; 

        public post(): Promise<void>;
        private postCommand(command_name: string, author: string): Promise<void>;
        public registerCustomFieldHandler(customFieldNumber: 1 | 2, handler: (manager: Cluster.Manager) => Promise<string>): Promise<null>;
    }

    export class Client extends BaseClient {
        constructor(options: ClientOptions);

        private customFields: Map<1 | 2, (manager: Discord.Client) => Promise<string>>;

        public autopost(): Promise<boolean | Error>;
        public post(): Promise<boolean | Error>;
        public postCommand(command_name: string, author: string): Promise<void>;
        public registerCustomFieldHandler(customFieldNumber: 1 | 2, handler: (client: Discord.Client) => Promise<string>): Promise<null>;
    }

    interface ClientEvents {
        "post": [boolean | Error | string],
        "autopost-start": []
    }
}
