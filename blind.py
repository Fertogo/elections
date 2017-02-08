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
    return ''.join(data).replace(">","").replace("<","")


print("Blinding ballot...")


# key = RSA.generate(2048)
# pub = key.publickey()
# saveToFile("pk.pub", pub.exportKey())

pub= RSA.importKey(readFromFile('key.pub'))


# print pub.exportKey()


## Protocol: Blind signature ##

# must be guaranteed to be chosen uniformly at random
r = SystemRandom().randrange(pub.n >> 10, pub.n)
saveToFile('r', str(r));

msg = sys.argv[1]

# hash message so that messages of arbitrary length can be signed
hash = SHA256.new()
hash.update(msg)
msgDigest = hash.hexdigest()

print "Original Ballot"
print msg

msg_blinded = pub.blind(msgDigest, r)

# print ("Message Hash")
# print(msgDigest)


# Convert to hex
msg_blinded = ''.join(x.encode('hex') for x in msg_blinded)
# This one gets outputted ^

print ("Blinded Ballot:")
print(msg_blinded)

# print "r: " + str(r)






