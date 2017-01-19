from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from random import SystemRandom


print("Start")
# Signing authority (SA) key
priv = RSA.generate(3072)
pub = priv.publickey()



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

print ("Original")
print(msgDigest)


# Convert to hex
msg_blinded = ''.join(x.encode('hex') for x in msg_blinded)
# This one gets outputted ^

print ("Blinded")
print(msg_blinded)

# Server will read it in
# Convert from hex to byte string
msg_blinded = ''.join(str(bytearray.fromhex(msg_blinded)))

#SA computes
msg_blinded_signature = priv.sign(msg_blinded, 0)
print type(msg_blinded_signature[0])


# user computes
msg_signature = pub.unblind(msg_blinded_signature[0], r)

print type(msg_blinded_signature[0]) # long
print type(r)
# Someone verifies
hash = SHA256.new()
hash.update(msg)
msgDigest = hash.hexdigest()
print type(msgDigest)
print type(msg_signature)
print("Message is authentic: " + str(pub.verify(msgDigest, (msg_signature,))))




