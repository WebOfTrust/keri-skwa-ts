// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'blake3'.
const blake3 = require('blake3');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Crymat'.
const { Crymat } = require('./cryMat');
const derivationCode = require('./derivationCodes');

/**
 * @description : Diger is subset of Crymat and is used to verify the digest of serialization
 * It uses  .raw : as digest
 * .code as digest algorithm
 *
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Diger'.
class Diger extends Crymat {
  verifyFunc: any;
  // This constructor will assign digest verification function to ._verify
  constructor(raw = null, ser = null, code = derivationCode.oneCharCode.Blake3_256, qb64 = null) {
    try {
      super(raw, qb64, null, code, 0);
    } catch (error:any) {
      if (!ser) {
        throw new Error(error);
      }
      if (code === derivationCode.oneCharCode.Blake3_256) {
        const hasher = blake3.createHash();
        // let dig = blake3.hash(ser);
        const dig = hasher.update(ser).digest('');
        super(dig , null , null, code,0);
      } else {
        throw new Error(`Unsupported code = ${code} for digester.`);
      }
    }

    if (code === derivationCode.oneCharCode.Blake3_256) {
      this.verifyFunc = this.blake3_256;
    } else {
      throw new Error(`Unsupported code = ${code} for digester.`); 
    }
  }



  /**
     * 
     * @param {bytes} ser  serialization bytes
     * @description  This method will return true if digest of bytes serialization ser matches .raw
     * using .raw as reference digest for ._verify digest algorithm determined
        by .code
     */
  verify(ser: any) {

    return this.verifyFunc(ser, this.raw());
  }


  blake3_256(ser: any, dig: any) {

    const hasher = blake3.createHash();
    // let dig = blake3.hash(ser);
    let digest = hasher.update(ser).digest('');
    return (digest.toString() === dig.toString());
  }
}
module.exports = { Diger };
