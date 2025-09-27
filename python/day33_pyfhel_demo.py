from Pyfhel import Pyfhel
import numpy as np

# 1.  context & keys
HE = Pyfhel()
HE.contextGen(scheme='bfv', n=2**14, t_bits=20)
HE.keyGen()

# 2.  data
x = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=np.int64)
y = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=np.int64)

# 3.  encode → encrypt
x_ptxt = HE.encodeInt(x)
y_ptxt = HE.encodeInt(y)
x_enc  = HE.encryptPtxt(x_ptxt)
y_enc  = HE.encryptPtxt(y_ptxt)

# 4.  homomorphic compute
add_enc = HE.add(x_enc, y_enc)
mul_enc = HE.multiply(x_enc, y_enc)

# 5.  decrypt (already numpy int64 array)
add_final = HE.decrypt(add_enc)
mul_final = HE.decrypt(mul_enc)

# 6.  show
print("Original X :", x)
print("Original Y :", y)
print("X + Y      :", add_final)
print("X * Y      :", mul_final)
