from wsocket import WSocketApp, WebSocketError, logger, run
from time import sleep
from struct import unpack
from collections import namedtuple
from json import dumps, loads

logger.setLevel(10)  # for debugging

set_bit_length = 8

def custom_protocol(barr: bytearray, bitLength: int | str = 8):
	bit_length_structs = {
		8: ">BB",
		16: "<HH",
		32: "<II",
		"f32": "<ff",
		"f64": "<dd"
	}

	protocol_keys = [
		"first",
		"second",
	]
	unpacked = unpack(bit_length_structs[bitLength], barr)
	data_fields = namedtuple("Data", field_names=protocol_keys)
	data = data_fields._make(unpacked)._asdict()

	return data

def on_close(self, message, client):
	print(repr(client) + " : " + message) 

def on_connect(client):
	print(repr(client) + " connected")

def on_message(message, client):
	response = dict()
	global set_bit_length
	try:
		if isinstance(message, bytearray):
			response["protocol_response"] = custom_protocol(message, bitLength=set_bit_length)
			response["message"] = message.hex()
			response["byteLength"] = len(message)
			

		if isinstance(message, str):
			parsed = loads(message)
			setByteLength = parsed.get("setByteType")

			if setByteLength:
				set_bit_length = setByteLength

			logger.info(f"Bit length set to: {set_bit_length}")
	
	except Exception as e:
		client.send(str(e))
	
	try:
		if len(response.keys()) > 0:
			client.send(dumps(response))
	
	except WebSocketError as we:
		client.send(we.strerror)

app = WSocketApp()
app.onconnect += on_connect
app.onmessage += on_message
app.onclose += on_close

run(app)