from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from random import SystemRandom

import requests
def getSignature(message):
    # print message
    r = requests.post('http://localhost:3000/counter/tempSign', data={'message':message, "eid":"58826ab1b754ca9dee780e93"})
    return r.text


print("===== Start Test ===== ")
# Signing authority (SA) key
def readFromFile(filename):
    file = open(filename, 'r')
    data = file.readlines()
    file.close()
    return data

pub = RSA.importKey(readFromFile('test.pub'))




## Protocol: Blind signature ##

# must be guaranteed to be chosen uniformly at random
r = SystemRandom().randrange(pub.n >> 10, pub.n)
msg = "my message" * 50 # large message (larger than the modulus)

print "Original Message: " + msg

# hash message so that messages of arbitrary length can be signed
hash = SHA256.new()
hash.update(msg)
msgDigest = hash.hexdigest()

print "Hashed Message: " + msgDigest


# user computes
msg_blinded = pub.blind(msgDigest, r)




# Convert to hex
msg_blinded = ''.join(x.encode('hex') for x in msg_blinded)


print "Blinded Message: " + msg_blinded
# This one gets outputted ^


msg_blinded_signature = long(getSignature(msg_blinded))

print "Blinded Signature: " , msg_blinded_signature



# user computes
msg_signature = pub.unblind(msg_blinded_signature, r)

print "Final Signature: ", msg_signature

# Someone verifies
hash = SHA256.new()
hash.update(msg)
msgDigest = hash.hexdigest()

print("Message is authentic: " + str(pub.verify(msgDigest, (msg_signature,))))




