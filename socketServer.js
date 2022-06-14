let users = []

const SocketServer = (socket) => {
    socket.on('joinUser', id => {
        console.log(id)
        users.push({id:id.id, socketId: socket.id/* , followers: user.followers, request: user.request */})
        console.log({users})
    })


    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)

        console.log({users})
    })

    // Likes
    socket.on('likePost', newPost => {

        console.log(newPost)
/*         const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        } */
    })


}

module.exports = SocketServer