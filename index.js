let byteType = 8;
let ws = createSocket()
const arrs = {
    '8': Uint8Array,
    '16': Uint16Array,
    '32': Uint32Array,
    'f32': Float32Array,
    'f64': Float64Array,
}

getByteInput().addEventListener("input", (e) => {
    const val = e.target.value
    const sendButton = document.getElementById('send-bytes')

    sendButton.disabled = !(val.length > 0)
})

function getByteInput() {
    const input = document.getElementById("bytez")
    return input
}

function setByteType(type) {  
    const setByteMessage = JSON.stringify({setByteType: type})
    const buttons = Array.from(document.getElementsByClassName("type-button"))
    
    byteType = type;
    buttons.forEach(i => {
        i.disabled = i.innerText == type
    })
    ws.send(setByteMessage)
}

const fromHexString = (hexString) =>
    arrs[byteType].from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

function createSocket() {
    document.getElementById('reconnect').disabled = true
    socket = new WebSocket('ws://localhost:8080')
    socket.onopen = (e) => {
        document.getElementById("status").classList.remove("not-connected")
        document.getElementById("status").classList.add("connected")
        
    }
    
    
    socket.onerror = (e) => {
        console.log(e.message)
        alert("⚠️ " + e.message)
    }
    
    socket.onmessage = (e) => {
        const response = JSON.parse(e.data)

        document.getElementById('last-message-received').innerText = JSON.stringify(response, null, "\t")
        // launchConfetti()
            
    }
    
    socket.onclose = (e) => {
        const buttons = Array.from(document.getElementsByClassName("type-button"))
        
        document.getElementById("status").classList.remove("connected")
        document.getElementById("status").classList.add("not-connected")
        document.getElementById('reconnect').disabled = false
        buttons.forEach( i => {
            i.disabled = true
        })

    }

    return socket
}

function reconnect() {
    const buttons = Array.from(document.getElementsByClassName("type-button"))
    
    ws = createSocket()
    byteType = 8
    buttons.forEach(i => {
        i.disabled = i.innerText == byteType
    })
}

function send() {
    const splitUp = getByteInput().value.split(" ").map(i => parseInt(i, 16))
    const uarray = new arrs[byteType](splitUp)

    document.getElementById("status").classList.add("sending")
    ws.send(uarray)
    setTimeout(()=> document.getElementById("status").classList.remove("sending"), 300)
    
}

function launchConfetti() {
    confetti({
        particleCount: 300,
        spread: 70,
        origin: { y: 0.01, x: 0.7},
    });
    confetti({
        particleCount: 300,
        spread: 70,
        origin: { y: 0.00, x: 0.1 },
    });
    confetti({
        particleCount: 300,
        spread: 70,
        origin: { y: 0.01, x: 0.7},
        });
    confetti({
        particleCount: 300,
        spread: 70,
        origin: { y: 0.0, x: 0.1 },
        });     confetti({
        particleCount: 300,
        spread: 70,
        origin: { y: 0.01, x: 0.7},
        });
    confetti({
        particleCount: 300,
        spread: 70,
        origin: { y: 0.01, x: 0.1 },
    });
}