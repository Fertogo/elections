import sys
from Crypto.PublicKey import RSA



message = sys.argv[1]
message= ''.join(str(bytearray.fromhex(message)))



def readFromFile(filename):
    file = open(filename, 'r')
    data = file.readlines()
    file.close()
    return data

pub = RSA.importKey(readFromFile('pk.pub'))
priv = RSA.importKey(readFromFile('pk'))

msg_blinded_signature = priv.sign(message, 0)[0]


print msg_blinded_signature
