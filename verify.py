import sys
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256



message = sys.argv[1]
signature = sys.argv[2]

# message= ''.join(str(bytearray.fromhex(message)))
signature= long(signature)


def readFromFile(filename):
    file = open(filename, 'r')
    data = file.readlines()
    file.close()
    return data

pub = RSA.importKey(readFromFile('pk.pub'))
priv = RSA.importKey(readFromFile('pk'))

hash = SHA256.new()
hash.update(message)
msgDigest = hash.hexdigest()

print str(pub.verify(msgDigest, (signature,)))
