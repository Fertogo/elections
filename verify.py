import sys
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256


electionID = sys.argv[1]
message = sys.argv[2]
signature = sys.argv[3]

signature= long(signature)


def readFromFile(filename):
    file = open(filename, 'r')
    data = file.readlines()
    file.close()
    return data

pub = RSA.importKey(readFromFile('keystore/' + electionID))

hash = SHA256.new()
hash.update(message)
msgDigest = hash.hexdigest()

print str(pub.verify(msgDigest, (signature,)))
