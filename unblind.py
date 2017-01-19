from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from random import SystemRandom

import sys


print("Start")



def readFromFile(filename):
    file = open(filename, 'r')
    data = file.readlines()
    file.close()
    return data

pub = RSA.importKey(readFromFile('pk.pub'))


r = (long) (readFromFile('r')[0])

msg_blinded_signature = long(sys.argv[1])


print pub.exportKey()
print "r:" , r
print "blinded signature: " , msg_blinded_signature

#SA computes
# msg_blinded_signature = ''.join(str(bytearray.fromhex(msg_blinded_signature)))
print type(msg_blinded_signature)

# user computes
msg_signature = pub.unblind(msg_blinded_signature, r)

print "Signature for message:"
print msg_signature

msg = raw_input("What was the original message? ")
print "got: " + msg


print type(msg_blinded_signature) # str but should be long
print type(r)

# Someone verifies
hash = SHA256.new()
hash.update(msg)
msgDigest = hash.hexdigest()
print type(msgDigest)
print type(msg_signature)
print("Message is authentic: " + str(pub.verify(msgDigest, (msg_signature,))))

