<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Issues][27]
-   [Statcord][1]
    -   [post][2]
    -   [autopost][3]
    -   [postCommand][4]
        -   [Parameters][5]
    -   [registerCustomFieldHandler][6]
        -   [Parameters][7]
-   [ShardingClient][8]
    -   [registerCustomFieldHandler][9]
        -   [Parameters][10]
    -   [postCommand][11]
        -   [Parameters][12]
    -   [post][13]
        -   [Parameters][14]
-   [Examples][19]
    -   [Normal Usage][20]
    -   [Sharding Usage][21]

### In order to report temperatures correctly please ensure you do the following:

## Statcord

### post

Manual posting

Returns **[Promise][15]&lt;([boolean][16] \| [Error][17])>** returns false if there was no error, returns an error if there was.

### autopost

Auto posting

Returns **[Promise][15]&lt;([boolean][16] \| [Error][17])>** returns false if there was no error, returns an error if there was. Only on the first run, otherwise the rest will be ignored

### postCommand

Post stats about a command

#### Parameters

-   `command_name` **[string][18]** The name of the command that was run
-   `author_id` **[string][18]** The id of the user that ran the command

### registerCustomFieldHandler

Register the function to get the values for posting

#### Parameters

-   `customFieldNumber` **(`1` \| `2`)** Whether the handler is for customField1 or customField2
-   `handler`  **[Normal Handler][23]**

Returns **([Error][17] | null)** 

## ShardingClient

### registerCustomFieldHandler

Register the function to get the values for posting

#### Parameters

-   `customFieldNumber` **(`1` \| `2`)** Whether the handler is for customField1 or customField2
-   `handler`  **[Sharding Handler][24]**

Returns **([Error][17] | null)** 

### postCommand

Post stats about a command

#### Parameters

-   `command_name` **[string][18]** The name of the command that was run
-   `author_id` **[string][18]** The id of the user that ran the command
-   `client` **any** The discord client this command is being posted for

### post

Post all current stats to statcord

#### Parameters

-   `client` **any** The discord client this command is being posted for

## Handlers

### Normal Handler

Asynchronous function

#### Parameters

- `client` **[Discord.js Client][25]** The client is passed to your function when getting the data

Returns **(Promise<[string][18]>)**

### Sharding Handler

Asynchronous function

#### Parameters

- `manager` **[Discord.js ShardingManager][26]** The manager is passed to your function when getting the data

Returns **(Promise<[string][18]>)**

# Examples

## Normal Usage

```javascript
const Statcord = require("statcord.js");
const Discord = require("discord.js");

const client = new Discord.Client();
// Create statcord client
const statcord = new Statcord.Client({
    key: "statcord.com-APIKEY",
    client,
    postCpuStatistics: false, /* Whether to post CPU statistics or not, defaults to true */
    postMemStatistics: false, /* Whether to post memory statistics or not, defaults to true */
    postNetworkStatistics: false /* Whether to post network statistics or not, defaults to true */
});

/* Register custom fields handlers (these are optional, you are not required to use this function)
 * These functions are automatically run when posting
*/

// Handler for custom value 1
statcord.registerCustomFieldHandler(1, async (client) => {
    // Get and return your data as a string
});

// Handler for custom value 2
statcord.registerCustomFieldHandler(2, async (client) => {
    // Get and return your data as a string
});

// Client prefix
const prefix = "cs!";

client.on("ready", async () => {
    console.log("ready");

    // Start auto posting
    let initalPostError = await statcord.autopost();

    // If there is an error, console.error and exit
    if (initalPostError) console.error(initalPost);
});


client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type !== "text") return;

    if (!message.content.startsWith(prefix)) return;

    let command = message.content.split(" ")[0].toLowerCase().substr(prefix.length);

    // Post command
    statcord.postCommand(command, message.author.id);

    if (command == "say") {
        message.channel.send("say");
    } else if (command == "help") {
        message.channel.send("help");
    } else if (command == "post") {
        // Only owner runs this command
        if (message.author.id !== "bot_owner_id") return;

        // Example of manual posting
        let postError = await statcord.post();

        // If there is a post error notify command runner
        if (postError) {
            message.channel.send(postError.message);
        }
    }
})

client.login("TOKEN");
```

## Sharding Usage

#### **`sharder.js`**
```javascript
    const Discord = require("discord.js");
    const Statcord = require("statcord.js");

    const manager = new Discord.ShardingManager('./bot.js', { token: "TOKEN"});
    // Create statcord sharding client
    const statcord = new Statcord.ShardingClient({
        key: "statcord.com-APIKEY",
        client,
        postCpuStatistics: false, /* Whether to post CPU statistics or not, defaults to true */
        postMemStatistics: false, /* Whether to post memory statistics or not, defaults to true */
        postNetworkStatistics: false, /* Whether to post network statistics or not, defaults to true */
        autopost: false /* Whether to auto post or not, defaults to true */
    });

    /* Register custom fields handlers (these are optional, you are not required to use this function)
    * These functions are automatically run when posting
    */

    // Handler for custom value 1
    statcord.registerCustomFieldHandler(1, async (manager) => {
        // Get and return your data as a string
    });

    // Handler for custom value 2
    statcord.registerCustomFieldHandler(2, async (manager) => {
        // Get and return your data as a string
    });

    // Spawn shards, statcord works with both auto and a set amount of shards
    manager.spawn();

    // Normal shardCreate event
    manager.on("shardCreate", (shard) => {
        console.log(`Spawned shard ${shard.id}`);
    });
```

#### **`bot.js`**
```javascript
const Discord = require("discord.js");
const Statcord = require("statcord.js");

const client = new Discord.Client();
/* There is no need to create a statcord client in the bot script,
because it has already been made in the sharding script
*/

// Client prefix
const prefix = "cs!";

client.on("ready", async () => {
    console.log("ready");
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type !== "text") return;

    if (!message.content.startsWith(prefix)) return;

    let command = message.content.split(" ")[0].toLowerCase().substr(prefix.length);

    // Post command
    Statcord.ShardingClient.postCommand(command, message.author.id, client);

    if (command == "say") {
        message.channel.send("say");
    } else if (command == "help") {
        message.channel.send("help");
    } else if (command == "post") {
        // Only owner runs this command
        if (message.author.id !== "bot_owner_id") return;

        // Example of manual posting
        Statcord.ShardingClient.post(client);

        // Errors on the sharding client will be sent to the console straight away
    }
});

client.login("TOKEN");
```

[1]: #statcord

[2]: #post

[3]: #autopost

[4]: #postcommand

[5]: #parameters

[6]: #registercustomfieldhandler

[7]: #parameters-1

[8]: #shardingclient

[9]: #registercustomfieldhandler-1

[10]: #parameters-2

[11]: #postcommand-1

[12]: #parameters-3

[13]: #post-1

[14]: #parameters-4

[15]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[16]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[17]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error

[18]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[19]: #examples

[20]: #normal-usage

[21]: #sharding-usage

[22]: #handlers

[23]: #normal-handler

[24]: #sharding-handler

[25]: https://discord.js.org/#/docs/main/stable/class/Client

[26]: https://discord.js.org/#/docs/main/stable/class/ShardingManager

[27]: #issues