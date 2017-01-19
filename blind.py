from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from random import SystemRandom

import sys

def saveToFile(filename, data):
    file = open(filename, 'w')
    file.write(data)
    file.close()
    print "Created file: " + filename


def readFromFile(filename):
    file = open(filename, 'r')
    data = file.readlines()
    file.close()
    return ''.join(data)


print("Start")


pub = RSA.importKey(readFromFile('pk.pub'))

print pub.exportKey()


## Protocol: Blind signature ##

# must be guaranteed to be chosen uniformly at random
r = SystemRandom().randrange(pub.n >> 10, pub.n)
saveToFile('r', str(r));

# msg = "my message" * 50 # large message (larger than the modulus)
msg = sys.argv[1]

# hash message so that messages of arbitrary length can be signed
hash = SHA256.new()
hash.update(msg)
msgDigest = hash.hexdigest()

print "Original Message"
print msg

# user computes
msg_blinded = pub.blind(msgDigest, r)

print ("Message Hash")
print(msgDigest)


# Convert to hex
msg_blinded = ''.join(x.encode('hex') for x in msg_blinded)
# This one gets outputted ^

print ("Blinded")
print(msg_blinded)

print "r: " + str(r)






