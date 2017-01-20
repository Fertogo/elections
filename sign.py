import sys
from Crypto.PublicKey import RSA


electionID = sys.argv[1]
message = sys.argv[2]

message= ''.join(str(bytearray.fromhex(message)))

def readFromFile(filename):
    file = open(filename, 'r')
    data = file.readlines()
    file.close()
    return data

priv = RSA.importKey(readFromFile("keystore/" + electionID))

msg_blinded_signature = priv.sign(message, 0)[0]


print msg_blinded_signature
