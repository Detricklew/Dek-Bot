

var log = {
            Load_Messages: async function (channel_id) {
                const channel = channel_id;
                let messages = [];
              
                // Create message pointer
                let message = await channel.messages
                  .fetch({ limit: 1 })
                  .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
              
                while (message) {
                  await channel.messages
                    .fetch({ limit: 100, before: message.id })
                    .then(messagePage => {
                      messagePage.forEach(msg => messages.push(msg));
              
                      // Update our message pointer to be last message in page of messages
                      message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                    })
                }
              
                messages.forEach(message =>{
                    console.log(message.content);
                });

                // Print all messages
              }
}
  module.exports = log;