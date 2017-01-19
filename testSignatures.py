from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from random import SystemRandom

import requests
def getSignature(message):
    # print message
    r = requests.post('http://localhost:3000/counter/tempSign', data={'message':message})
    return r.text


print("===== Start Test ===== ")
# Signing authority (SA) key
def readFromFile(filename):
    file = open(filename, 'r')
    data = file.readlines()
    file.close()
    return data

pub = RSA.importKey(readFromFile('pk.pub'))

# print pub.exportKey()
# print priv.exportKey()



## Protocol: Blind signature ##

# must be guaranteed to be chosen uniformly at random
r = SystemRandom().randrange(pub.n >> 10, pub.n)
msg = "my message" * 50 # large message (larger than the modulus)

# hash message so that messages of arbitrary length can be signed
hash = SHA256.new()
hash.update(msg)
msgDigest = hash.hexdigest()

# user computes
msg_blinded = pub.blind(msgDigest, r)

# print ("Original")
# print(msgDigest)


# Convert to hex
msg_blinded = ''.join(x.encode('hex') for x in msg_blinded)
# This one gets outputted ^

# print ("Blinded")
# print(msg_blinded)

# msg_blinded_signature = long(getSignature(msg_blinded), 16)

msg_blinded_signature = long(getSignature(msg_blinded))


# user computes
msg_signature = pub.unblind(msg_blinded_signature, r)

print type(msg_blinded_signature) # long
print type(r)
# Someone verifies
hash = SHA256.new()
hash.update(msg)
msgDigest = hash.hexdigest()
print type(msgDigest)
print type(msg_signature)
print("Message is authentic: " + str(pub.verify(msgDigest, (msg_signature,))))




